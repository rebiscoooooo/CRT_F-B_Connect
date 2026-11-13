<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Mail\ResourceAnnouncementMail;
use App\Models\ActivityLog;
use App\Models\Resource;
use App\Models\ResourceCategory;
use App\Models\ResourceFolder;
use App\Models\SystemNotification;
use App\Models\User;
use App\Services\SmartAssessmentService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

class ResourceController extends Controller
{
    public function index(Request $request): Response
    {
        $search = $request->input('search');
        $categorySlug = $request->input('category');
        $resourceType = $request->input('type');
        $visibility = $request->input('visibility');
        $sortBy = $request->input('sort', 'latest');

        $categories = ResourceCategory::withCount('resources')
            ->withCount('folders')
            ->get();

        $query = Resource::with(['category', 'folder', 'uploader']);

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%")
                    ->orWhereHas('category', fn ($cat) => $cat->where('name', 'like', "%{$search}%"));
            });
        }

        if ($categorySlug) {
            $query->whereHas('category', fn ($q) => $q->where('slug', $categorySlug));
        }

        if ($resourceType) {
            $query->where('resource_type', $resourceType);
        }

        if ($visibility) {
            $query->where('visibility', $visibility);
        }

        match ($sortBy) {
            'oldest' => $query->orderBy('created_at', 'asc'),
            'title' => $query->orderBy('title', 'asc'),
            'views' => $query->orderBy('views_count', 'desc'),
            'downloads' => $query->orderBy('downloads_count', 'desc'),
            default => $query->orderBy('created_at', 'desc'),
        };

        $resources = $query->paginate(12)->withQueryString();

        $allFolders = ResourceFolder::select('id', 'name', 'category_id')->orderBy('name')->get();

        return Inertia::render('Admin/Resources/Index', [
            'categories' => $categories,
            'resources' => $resources,
            'filters' => [
                'search' => $search,
                'category' => $categorySlug,
                'type' => $resourceType,
                'visibility' => $visibility,
                'sort' => $sortBy,
            ],
            'folders' => $allFolders,
        ]);
    }

    public function categoryView(string $slug, Request $request): Response
    {
        $category = ResourceCategory::where('slug', $slug)->firstOrFail();
        $search = $request->input('search');

        $folders = ResourceFolder::where('category_id', $category->id)
            ->whereNull('parent_id')
            ->withCount('resources')
            ->with('creator')
            ->get();

        $query = Resource::where('category_id', $category->id)
            ->with(['folder', 'uploader']);

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            });
        }

        $resources = $query->orderBy('created_at', 'desc')->paginate(12)->withQueryString();

        return Inertia::render('Admin/Resources/CategoryView', [
            'category' => $category,
            'folders' => $folders,
            'resources' => $resources,
            'filters' => ['search' => $search],
        ]);
    }

    public function folderView(ResourceFolder $folder, Request $request): Response
    {
        $folder->load(['category', 'creator', 'parent']);
        $search = $request->input('search');

        $subfolders = ResourceFolder::where('parent_id', $folder->id)
            ->withCount('resources')
            ->get();

        $query = Resource::where('folder_id', $folder->id)
            ->with(['category', 'uploader']);

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            });
        }

        $resources = $query->orderBy('created_at', 'desc')->paginate(12)->withQueryString();

        return Inertia::render('Admin/Resources/FolderView', [
            'folder' => $folder,
            'subfolders' => $subfolders,
            'resources' => $resources,
            'filters' => ['search' => $search],
        ]);
    }

    public function create(): Response
    {
        $categories = ResourceCategory::orderBy('name')->get();
        $folders = ResourceFolder::with('category')->orderBy('name')->get();
        $studentCount = User::where('role', 'student')->where('status', 'active')->count();

        return Inertia::render('Admin/Resources/Create', [
            'categories' => $categories,
            'folders' => $folders,
            'studentCount' => $studentCount,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $type = $request->input('resource_type', 'video');
        $fileRules = ['nullable', 'file', 'max:1048576'];

        if ($type === 'video') {
            $fileRules[] = 'mimes:mp4,mov,webm,mkv,avi,wmv,flv';
        } elseif ($type === 'illustration') {
            $fileRules[] = 'mimes:jpeg,png,jpg,webp,svg,gif';
        } elseif ($type === 'pdf') {
            $fileRules[] = 'mimes:pdf';
        }

        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'category_id' => ['required', 'exists:resource_categories,id'],
            'folder_id' => ['nullable', 'exists:resource_folders,id'],
            'resource_type' => ['required', 'in:video,illustration,pdf,text,other'],
            'visibility' => ['required', 'in:published,draft,archived'],
            'content' => ['nullable', 'string'],
            'external_url' => ['nullable', 'url', 'max:1000'],
            'file' => $fileRules,
            'thumbnail' => ['nullable', 'image', 'mimes:jpeg,png,jpg,webp,svg', 'max:10240'],
            'send_announcement' => ['nullable', 'boolean'],
            'announcement_message' => ['nullable', 'string', 'max:2000'],
            'generate_smart_assessment' => ['nullable', 'boolean'],
            'passing_percentage' => ['nullable', 'integer', 'min:1', 'max:100'],
            'time_limit_minutes' => ['nullable', 'integer', 'min:1', 'max:180'],
            'assessment_published' => ['nullable', 'boolean'],
        ], [
            'file.mimes' => match ($type) {
                'video' => 'The uploaded file must be a valid video (MP4, WebM, MOV, MKV).',
                'illustration' => 'The uploaded file must be a valid image illustration (PNG, JPG, WebP, SVG).',
                'pdf' => 'The uploaded file must be a PDF document (.pdf).',
                default => 'The uploaded file format is not permitted.',
            },
            'file.uploaded' => 'The file failed to upload. Please ensure the file size does not exceed 1GB.',
            'file.max' => 'The uploaded file exceeds the maximum allowed size of 1GB.',
        ]);

        $filePath = null;
        $fileSize = null;
        $mimeType = null;
        $thumbnailPath = null;

        if ($request->hasFile('file')) {
            $file = $request->file('file');
            $filePath = $file->store('resources/files', 'public');
            $fileSize = $file->getSize();
            $mimeType = $file->getMimeType();

            // Auto-use illustration image as thumbnail if no separate thumbnail was uploaded
            if ($validated['resource_type'] === 'illustration') {
                $thumbnailPath = $filePath;
            }
        }

        if ($request->hasFile('thumbnail')) {
            $thumbnail = $request->file('thumbnail');
            $thumbnailPath = $thumbnail->store('resources/thumbnails', 'public');
        }

        $slug = Str::slug($validated['title']);
        $originalSlug = $slug;
        $count = 1;
        while (Resource::where('slug', $slug)->exists()) {
            $slug = "{$originalSlug}-".$count++;
        }

        $resource = Resource::create([
            'category_id' => $validated['category_id'],
            'folder_id' => $validated['folder_id'] ?? null,
            'title' => $validated['title'],
            'slug' => $slug,
            'description' => $validated['description'] ?? null,
            'content' => $validated['content'] ?? null,
            'resource_type' => $validated['resource_type'],
            'file_path' => $filePath,
            'thumbnail_path' => $thumbnailPath,
            'external_url' => $validated['external_url'] ?? null,
            'visibility' => $validated['visibility'],
            'file_size' => $fileSize,
            'mime_type' => $mimeType,
            'uploaded_by' => Auth::id(),
        ]);

        ActivityLog::record(
            'created',
            "Uploaded resource \"{$resource->title}\" ({$resource->resource_type})",
            Auth::id(),
            Resource::class,
            $resource->id
        );

        // Smart Assessment Quiz Auto-Generation (10 Questions based on material)
        $assessmentGenerated = false;
        $shouldGenerateAssessment = $request->has('generate_smart_assessment')
            ? $request->boolean('generate_smart_assessment')
            : true;

        if ($shouldGenerateAssessment) {
            try {
                $smartService = app(SmartAssessmentService::class);
                $smartService->generateForResource(
                    $resource,
                    passingPercentage: (int) ($validated['passing_percentage'] ?? 75),
                    timeLimitMinutes: isset($validated['time_limit_minutes']) ? (int) $validated['time_limit_minutes'] : 15,
                    isPublished: $request->has('assessment_published') ? $request->boolean('assessment_published') : true,
                    createdBy: Auth::id()
                );
                $assessmentGenerated = true;
            } catch (\Throwable $e) {
                Log::warning("Failed to auto-generate smart assessment for resource {$resource->id}: {$e->getMessage()}");
            }
        }

        $studentsCount = 0;
        if ($request->boolean('send_announcement')) {
            $students = User::where('role', 'student')->where('status', 'active')->get();
            $studentsCount = $students->count();
            $instructor = Auth::user();
            $customMessage = $request->input('announcement_message');

            foreach ($students as $student) {
                try {
                    Mail::to($student->email)->send(new ResourceAnnouncementMail($resource, $student, $customMessage, $instructor));
                } catch (\Throwable $e) {
                    Log::warning("Failed to send announcement email to {$student->email}: {$e->getMessage()}");
                }

                SystemNotification::create([
                    'user_id' => $student->id,
                    'title' => 'New Learning Material: '.$resource->title,
                    'message' => $customMessage ?: "A new {$resource->resource_type} lesson \"{$resource->title}\" was published by {$instructor->name}.",
                    'type' => 'announcement',
                    'link' => "/student/resources/{$resource->id}",
                    'created_at' => now(),
                ]);
            }

            ActivityLog::record(
                'announcement_broadcast',
                "Broadcasted email announcement for \"{$resource->title}\" to {$studentsCount} registered students",
                Auth::id(),
                Resource::class,
                $resource->id
            );
        }

        $messages = ['Resource uploaded successfully!'];
        if ($assessmentGenerated) {
            $messages[] = '10-question Smart Assessment Quiz generated.';
        }
        if ($studentsCount > 0) {
            $messages[] = "Email announcement sent to {$studentsCount} students.";
        }

        return redirect()->route('admin.resources.show', $resource->id)->with('success', implode(' ', $messages));
    }

    public function show(Resource $resource): Response
    {
        $resource->load(['category', 'folder', 'uploader']);
        $resource->increment('views_count');

        $relatedResources = Resource::where('category_id', $resource->category_id)
            ->where('id', '!=', $resource->id)
            ->take(4)
            ->get();

        $allFolders = ResourceFolder::where('category_id', $resource->category_id)->get();

        $assessment = $resource->assessment()
            ->with([
                'questions' => fn ($q) => $q->orderBy('order', 'asc'),
                'submissions' => fn ($q) => $q->with('user')->orderBy('submitted_at', 'desc'),
            ])
            ->first();

        return Inertia::render('Admin/Resources/Show', [
            'resource' => $resource,
            'relatedResources' => $relatedResources,
            'folders' => $allFolders,
            'assessment' => $assessment,
            'studentCount' => User::where('role', 'student')->where('status', 'active')->count(),
        ]);
    }

    public function edit(Resource $resource): Response
    {
        $categories = ResourceCategory::orderBy('name')->get();
        $folders = ResourceFolder::where('category_id', $resource->category_id)->orderBy('name')->get();

        return Inertia::render('Admin/Resources/Edit', [
            'resource' => $resource,
            'categories' => $categories,
            'folders' => $folders,
        ]);
    }

    public function update(Request $request, Resource $resource): RedirectResponse
    {
        $type = $request->input('resource_type', $resource->resource_type);
        $fileRules = ['nullable', 'file', 'max:1048576'];

        if ($type === 'video') {
            $fileRules[] = 'mimes:mp4,mov,webm,mkv,avi,wmv,flv';
        } elseif ($type === 'illustration') {
            $fileRules[] = 'mimes:jpeg,png,jpg,webp,svg,gif';
        } elseif ($type === 'pdf') {
            $fileRules[] = 'mimes:pdf';
        }

        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'category_id' => ['required', 'exists:resource_categories,id'],
            'folder_id' => ['nullable', 'exists:resource_folders,id'],
            'resource_type' => ['required', 'in:video,illustration,pdf,text,other'],
            'visibility' => ['required', 'in:published,draft,archived'],
            'content' => ['nullable', 'string'],
            'external_url' => ['nullable', 'url', 'max:1000'],
            'file' => $fileRules,
            'thumbnail' => ['nullable', 'image', 'mimes:jpeg,png,jpg,webp,svg', 'max:10240'],
            'send_announcement' => ['nullable', 'boolean'],
            'announcement_message' => ['nullable', 'string', 'max:2000'],
            'generate_smart_assessment' => ['nullable', 'boolean'],
            'passing_percentage' => ['nullable', 'integer', 'min:1', 'max:100'],
            'time_limit_minutes' => ['nullable', 'integer', 'min:1', 'max:180'],
            'assessment_published' => ['nullable', 'boolean'],
        ], [
            'file.mimes' => match ($type) {
                'video' => 'The uploaded file must be a valid video (MP4, WebM, MOV, MKV).',
                'illustration' => 'The uploaded file must be a valid image illustration (PNG, JPG, WebP, SVG).',
                'pdf' => 'The uploaded file must be a PDF document (.pdf).',
                default => 'The uploaded file format is not permitted.',
            },
            'file.uploaded' => 'The file failed to upload. Please ensure the file size does not exceed 1GB.',
            'file.max' => 'The uploaded file exceeds the maximum allowed size of 1GB.',
        ]);

        if ($request->hasFile('file')) {
            if ($resource->file_path && Storage::disk('public')->exists($resource->file_path)) {
                Storage::disk('public')->delete($resource->file_path);
            }
            $file = $request->file('file');
            $resource->file_path = $file->store('resources/files', 'public');
            $resource->file_size = $file->getSize();
            $resource->mime_type = $file->getMimeType();
        }

        if ($request->hasFile('thumbnail')) {
            if ($resource->thumbnail_path && Storage::disk('public')->exists($resource->thumbnail_path)) {
                Storage::disk('public')->delete($resource->thumbnail_path);
            }
            $thumbnail = $request->file('thumbnail');
            $resource->thumbnail_path = $thumbnail->store('resources/thumbnails', 'public');
        }

        $resource->update([
            'category_id' => $validated['category_id'],
            'folder_id' => $validated['folder_id'] ?? null,
            'title' => $validated['title'],
            'description' => $validated['description'] ?? null,
            'content' => $validated['content'] ?? null,
            'resource_type' => $validated['resource_type'],
            'external_url' => $validated['external_url'] ?? null,
            'visibility' => $validated['visibility'],
        ]);

        ActivityLog::record(
            'updated',
            "Updated resource \"{$resource->title}\"",
            Auth::id(),
            Resource::class,
            $resource->id
        );

        return redirect()->route('admin.resources.show', $resource->id)->with('success', 'Resource updated successfully!');
    }

    public function destroy(Resource $resource): RedirectResponse
    {
        $title = $resource->title;

        if ($resource->file_path && Storage::disk('public')->exists($resource->file_path)) {
            Storage::disk('public')->delete($resource->file_path);
        }

        if ($resource->thumbnail_path && Storage::disk('public')->exists($resource->thumbnail_path)) {
            Storage::disk('public')->delete($resource->thumbnail_path);
        }

        $resource->delete();

        ActivityLog::record(
            'deleted',
            "Deleted resource \"{$title}\"",
            Auth::id()
        );

        return redirect()->route('admin.resources.index')->with('success', "Resource \"{$title}\" deleted successfully.");
    }

    public function move(Request $request, Resource $resource): RedirectResponse
    {
        $validated = $request->validate([
            'folder_id' => ['nullable', 'exists:resource_folders,id'],
        ]);

        $resource->update(['folder_id' => $validated['folder_id'] ?? null]);

        ActivityLog::record('updated', "Moved resource \"{$resource->title}\" to folder", Auth::id());

        return back()->with('success', 'Resource folder updated successfully.');
    }

    public function updateVisibility(Request $request, Resource $resource): RedirectResponse
    {
        $validated = $request->validate([
            'visibility' => ['required', 'in:published,draft,archived'],
        ]);

        $resource->update(['visibility' => $validated['visibility']]);

        ActivityLog::record('updated', "Changed visibility of \"{$resource->title}\" to {$validated['visibility']}", Auth::id());

        return back()->with('success', "Visibility updated to {$validated['visibility']}.");
    }

    public function download(Resource $resource): BinaryFileResponse|RedirectResponse
    {
        $resource->increment('downloads_count');

        if ($resource->file_path && Storage::disk('public')->exists($resource->file_path)) {
            ActivityLog::record('download', "Downloaded resource \"{$resource->title}\"", Auth::id(), Resource::class, $resource->id);

            return response()->download(Storage::disk('public')->path($resource->file_path), $resource->title.'.'.pathinfo($resource->file_path, PATHINFO_EXTENSION));
        }

        if ($resource->external_url) {
            return redirect()->away($resource->external_url);
        }

        return back()->with('error', 'File not found for download.');
    }

    /**
     * Broadcast an email announcement for an existing resource to all registered students.
     */
    public function broadcastAnnouncement(Request $request, Resource $resource): RedirectResponse
    {
        $validated = $request->validate([
            'announcement_message' => ['nullable', 'string', 'max:2000'],
        ]);

        $students = User::where('role', 'student')->where('status', 'active')->get();
        $instructor = Auth::user();
        $customMessage = $validated['announcement_message'] ?? null;

        foreach ($students as $student) {
            try {
                Mail::to($student->email)->send(new ResourceAnnouncementMail($resource, $student, $customMessage, $instructor));
            } catch (\Throwable $e) {
                Log::warning("Failed to send announcement email to {$student->email}: {$e->getMessage()}");
            }

            SystemNotification::create([
                'user_id' => $student->id,
                'title' => 'New Learning Material: '.$resource->title,
                'message' => $customMessage ?: "A new {$resource->resource_type} lesson \"{$resource->title}\" was announced by {$instructor->name}.",
                'type' => 'announcement',
                'link' => "/student/resources/{$resource->id}",
                'created_at' => now(),
            ]);
        }

        ActivityLog::record(
            'announcement_broadcast',
            "Broadcasted announcement email for \"{$resource->title}\" to {$students->count()} registered students",
            Auth::id(),
            Resource::class,
            $resource->id
        );

        return back()->with('success', "Announcement emailed to {$students->count()} registered students successfully!");
    }
}
