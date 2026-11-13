<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Resource;
use App\Models\ResourceCategory;
use App\Models\SystemSetting;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        $user = Auth::user();

        $totalResources = Resource::where('visibility', 'published')->count();
        $totalVideos = Resource::where('visibility', 'published')->where('resource_type', 'video')->count();
        $totalIllustrations = Resource::where('visibility', 'published')->where('resource_type', 'illustration')->count();
        $totalPdfs = Resource::where('visibility', 'published')->where('resource_type', 'pdf')->count();
        $totalTexts = Resource::where('visibility', 'published')->where('resource_type', 'text')->count();

        $categories = ResourceCategory::withCount([
            'resources' => fn ($q) => $q->where('visibility', 'published'),
        ])->get();

        $recentResources = Resource::with(['category', 'uploader'])
            ->where('visibility', 'published')
            ->orderBy('created_at', 'desc')
            ->take(6)
            ->get();

        $featuredVideos = Resource::with(['category', 'uploader'])
            ->where('visibility', 'published')
            ->where('resource_type', 'video')
            ->orderBy('views_count', 'desc')
            ->take(3)
            ->get();

        $recentPdfs = Resource::with(['category', 'uploader'])
            ->where('visibility', 'published')
            ->where('resource_type', 'pdf')
            ->orderBy('created_at', 'desc')
            ->take(3)
            ->get();

        $announcement = SystemSetting::get('system_announcement', '');

        return Inertia::render('Student/Dashboard', [
            'stats' => [
                'total_resources' => $totalResources,
                'total_videos' => $totalVideos,
                'total_illustrations' => $totalIllustrations,
                'total_pdfs' => $totalPdfs,
                'total_texts' => $totalTexts,
            ],
            'categories' => $categories,
            'recentResources' => $recentResources,
            'featuredVideos' => $featuredVideos,
            'recentPdfs' => $recentPdfs,
            'announcement' => $announcement,
        ]);
    }
}
