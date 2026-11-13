<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use App\Models\Resource;
use App\Models\ResourceCategory;
use App\Models\ResourceFolder;
use App\Models\User;
use Carbon\Carbon;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        $totalStudents = User::where('role', 'student')->count();
        $activeStudents = User::where('role', 'student')->where('status', 'active')->count();
        $totalResources = Resource::count();
        $totalVideos = Resource::where('resource_type', 'video')->count();
        $totalIllustrations = Resource::where('resource_type', 'illustration')->count();
        $totalPdfs = Resource::where('resource_type', 'pdf')->count();
        $totalTexts = Resource::where('resource_type', 'text')->count();
        $totalOthers = Resource::where('resource_type', 'other')->count();
        $totalCategories = ResourceCategory::count();
        $totalFolders = ResourceFolder::count();

        // Recent Resources
        $recentResources = Resource::with(['category', 'uploader', 'folder'])
            ->orderBy('created_at', 'desc')
            ->take(6)
            ->get();

        // Recent Students
        $recentStudents = User::where('role', 'student')
            ->orderBy('created_at', 'desc')
            ->take(5)
            ->get();

        // Recent Activity Logs
        $recentActivities = ActivityLog::with('user')
            ->orderBy('created_at', 'desc')
            ->take(8)
            ->get();

        // Analytics: Resource distribution by category for Recharts (Pie/Donut)
        $categoriesDistribution = ResourceCategory::withCount('resources')
            ->get()
            ->map(fn ($cat) => [
                'name' => $cat->name,
                'count' => $cat->resources_count,
            ]);

        // Analytics: Student registrations trend (past 6 months)
        $registrationTrends = [];
        for ($i = 5; $i >= 0; $i--) {
            $month = Carbon::now()->subMonths($i);
            $monthName = $month->format('M Y');
            $count = User::where('role', 'student')
                ->whereYear('created_at', $month->year)
                ->whereMonth('created_at', $month->month)
                ->count();

            $registrationTrends[] = [
                'month' => $monthName,
                'students' => $count,
            ];
        }

        // Analytics: Upload activity by type for Recharts (Bar chart)
        $resourceTypes = [
            ['type' => 'Video Lessons', 'count' => $totalVideos],
            ['type' => 'Illustrations', 'count' => $totalIllustrations],
            ['type' => 'PDF Modules', 'count' => $totalPdfs],
            ['type' => 'Text Lessons', 'count' => $totalTexts],
            ['type' => 'Other Materials', 'count' => $totalOthers],
        ];

        return Inertia::render('Admin/Dashboard', [
            'stats' => [
                'total_students' => $totalStudents,
                'active_students' => $activeStudents,
                'total_resources' => $totalResources,
                'total_videos' => $totalVideos,
                'total_illustrations' => $totalIllustrations,
                'total_pdfs' => $totalPdfs,
                'total_texts' => $totalTexts,
                'total_others' => $totalOthers,
                'total_categories' => $totalCategories,
                'total_folders' => $totalFolders,
            ],
            'recentResources' => $recentResources,
            'recentStudents' => $recentStudents,
            'recentActivities' => $recentActivities,
            'chartData' => [
                'categoryDistribution' => $categoriesDistribution,
                'registrationTrends' => $registrationTrends,
                'resourceTypes' => $resourceTypes,
            ],
        ]);
    }
}
