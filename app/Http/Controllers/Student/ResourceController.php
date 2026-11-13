<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use App\Models\AssessmentSubmission;
use App\Models\Resource;
use App\Models\ResourceCategory;
use App\Models\ResourceFolder;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
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
        $sortBy = $request->input('sort', 'latest');

        $categories = ResourceCategory::withCount([
            'resources' => fn ($q) => $q->where('visibility', 'published'),
        ])->get();

        $query = Resource::where('visibility', 'published')
            ->with(['category', 'folder', 'uploader']);

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%")
                    ->orWhereHas('category', fn ($c) => $c->where('name', 'like', "%{$search}%"));
            });
        }

        if ($categorySlug) {
            $query->whereHas('category', fn ($q) => $q->where('slug', $categorySlug));
        }

        if ($resourceType) {
            $query->where('resource_type', $resourceType);
        }

        match ($sortBy) {
            'oldest' => $query->orderBy('created_at', 'asc'),
            'title' => $query->orderBy('title', 'asc'),
            'popular' => $query->orderBy('views_count', 'desc'),
            default => $query->orderBy('created_at', 'desc'),
        };

        $resources = $query->paginate(12)->withQueryString();

        return Inertia::render('Student/Resources/Index', [
            'categories' => $categories,
            'resources' => $resources,
            'filters' => [
                'search' => $search,
                'category' => $categorySlug,
                'type' => $resourceType,
                'sort' => $sortBy,
            ],
        ]);
    }

    public function categoryView(string $slug, Request $request): Response
    {
        $category = ResourceCategory::where('slug', $slug)->firstOrFail();
        $search = $request->input('search');

        $folders = ResourceFolder::where('category_id', $category->id)
            ->whereNull('parent_id')
            ->withCount([
                'resources' => fn ($q) => $q->where('visibility', 'published'),
            ])
            ->get();

        $query = Resource::where('category_id', $category->id)
            ->where('visibility', 'published')
            ->with(['folder', 'uploader']);

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            });
        }

        $resources = $query->orderBy('created_at', 'desc')->paginate(12)->withQueryString();

        return Inertia::render('Student/Resources/CategoryView', [
            'category' => $category,
            'folders' => $folders,
            'resources' => $resources,
            'filters' => ['search' => $search],
        ]);
    }

    public function folderView(ResourceFolder $folder, Request $request): Response
    {
        $folder->load('category');
        $search = $request->input('search');

        $subfolders = ResourceFolder::where('parent_id', $folder->id)
            ->withCount([
                'resources' => fn ($q) => $q->where('visibility', 'published'),
            ])
            ->get();

        $query = Resource::where('folder_id', $folder->id)
            ->where('visibility', 'published')
            ->with(['category', 'uploader']);

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            });
        }

        $resources = $query->orderBy('created_at', 'desc')->paginate(12)->withQueryString();

        return Inertia::render('Student/Resources/FolderView', [
            'folder' => $folder,
            'subfolders' => $subfolders,
            'resources' => $resources,
            'filters' => ['search' => $search],
        ]);
    }

    public function show(Resource $resource): Response
    {
        if ($resource->visibility !== 'published') {
            abort(404, 'Resource not available.');
        }

        $resource->load(['category', 'folder', 'uploader']);
        $resource->increment('views_count');

        $user = Auth::user();

        $assessment = $resource->assessment()
            ->where('is_published', true)
            ->with(['questions' => fn ($q) => $q->orderBy('order', 'asc')])
            ->first();

        $latestSubmission = null;
        if ($assessment && $user) {
            $latestSubmission = AssessmentSubmission::where('assessment_id', $assessment->id)
                ->where('user_id', $user->id)
                ->latest('submitted_at')
                ->first();

            if (! $latestSubmission) {
                $assessment->questions->makeHidden(['correct_answer', 'explanation']);
            }
        }

        $relatedResources = Resource::where('category_id', $resource->category_id)
            ->where('visibility', 'published')
            ->where('id', '!=', $resource->id)
            ->take(4)
            ->get();

        return Inertia::render('Student/Resources/Show', [
            'resource' => $resource,
            'relatedResources' => $relatedResources,
            'assessment' => $assessment,
            'submission' => $latestSubmission,
        ]);
    }

    public function download(Resource $resource): BinaryFileResponse|RedirectResponse
    {
        if ($resource->visibility !== 'published') {
            abort(403, 'Unauthorized access.');
        }

        $resource->increment('downloads_count');

        ActivityLog::record(
            'download',
            "Student downloaded resource \"{$resource->title}\"",
            Auth::id(),
            Resource::class,
            $resource->id
        );

        if ($resource->file_path && Storage::disk('public')->exists($resource->file_path)) {
            return response()->download(
                Storage::disk('public')->path($resource->file_path),
                $resource->title.'.'.pathinfo($resource->file_path, PATHINFO_EXTENSION)
            );
        }

        if ($resource->external_url) {
            return redirect()->away($resource->external_url);
        }

        return back()->with('error', 'File not available for download.');
    }
}
