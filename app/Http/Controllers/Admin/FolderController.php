<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use App\Models\ResourceFolder;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class FolderController extends Controller
{
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'category_id' => ['required', 'exists:resource_categories,id'],
            'parent_id' => ['nullable', 'exists:resource_folders,id'],
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:1000'],
        ]);

        $folder = ResourceFolder::create([
            'category_id' => $validated['category_id'],
            'parent_id' => $validated['parent_id'] ?? null,
            'name' => $validated['name'],
            'description' => $validated['description'] ?? null,
            'created_by' => Auth::id(),
        ]);

        ActivityLog::record('created', "Created folder \"{$folder->name}\"", Auth::id(), ResourceFolder::class, $folder->id);

        return back()->with('success', "Folder \"{$folder->name}\" created successfully.");
    }

    public function update(Request $request, ResourceFolder $folder): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:1000'],
        ]);

        $folder->update($validated);

        ActivityLog::record('updated', "Updated folder \"{$folder->name}\"", Auth::id(), ResourceFolder::class, $folder->id);

        return back()->with('success', 'Folder updated successfully.');
    }

    public function destroy(ResourceFolder $folder): RedirectResponse
    {
        $name = $folder->name;
        $categoryId = $folder->category_id;
        $categorySlug = $folder->category->slug;

        // Prevent deleting non-empty folders without care: unassociate resources or cascade
        $folder->resources()->update(['folder_id' => null]);
        $folder->delete();

        ActivityLog::record('deleted', "Deleted folder \"{$name}\"", Auth::id());

        return redirect()->route('admin.resources.category', $categorySlug)->with('success', "Folder \"{$name}\" deleted successfully.");
    }
}
