<?php

namespace App\Http\Controllers;

use App\Models\Resource;
use App\Models\ResourceCategory;
use App\Models\User;
use Inertia\Inertia;
use Inertia\Response;

class LandingController extends Controller
{
    public function index(): Response
    {
        $categories = ResourceCategory::withCount([
            'resources' => fn ($query) => $query->where('visibility', 'published'),
        ])->get();

        $stats = [
            'total_students' => User::where('role', 'student')->where('status', 'active')->count(),
            'total_resources' => Resource::where('visibility', 'published')->count(),
            'total_videos' => Resource::where('visibility', 'published')->where('resource_type', 'video')->count(),
            'total_modules' => Resource::where('visibility', 'published')->where('resource_type', 'pdf')->count(),
        ];

        $previewResources = Resource::with(['category', 'uploader'])
            ->where('visibility', 'published')
            ->orderBy('created_at', 'desc')
            ->take(6)
            ->get();

        return Inertia::render('Landing/Index', [
            'categories' => $categories,
            'stats' => $stats,
            'previewResources' => $previewResources,
        ]);
    }
}
