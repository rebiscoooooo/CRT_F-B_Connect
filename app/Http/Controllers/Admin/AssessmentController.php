<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use App\Models\Assessment;
use App\Models\AssessmentQuestion;
use App\Models\AssessmentSubmission;
use App\Models\Resource;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class AssessmentController extends Controller
{
    /**
     * Display a listing of all student assessment submissions with statistics and filters.
     */
    public function index(Request $request): Response
    {
        $search = $request->input('search');
        $status = $request->input('status');
        $resourceId = $request->input('resource_id');

        $totalSubmissions = AssessmentSubmission::count();
        $passedCount = AssessmentSubmission::where('status', 'passed')->count();
        $failedCount = AssessmentSubmission::where('status', 'failed')->count();
        $passRate = $totalSubmissions > 0 ? round(($passedCount / $totalSubmissions) * 100, 1) : 0;
        $avgScore = round((float) (AssessmentSubmission::avg('percentage') ?? 0), 1);
        $uniqueStudents = AssessmentSubmission::distinct('user_id')->count('user_id');
        $totalAssessments = Assessment::where('is_published', true)->count();

        $query = AssessmentSubmission::with([
            'user',
            'assessment.resource.category',
        ]);

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->whereHas('user', function ($uq) use ($search) {
                    $uq->where('name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%")
                        ->orWhere('student_number', 'like', "%{$search}%");
                })->orWhereHas('assessment.resource', function ($rq) use ($search) {
                    $rq->where('title', 'like', "%{$search}%");
                });
            });
        }

        if ($status && in_array($status, ['passed', 'failed'], true)) {
            $query->where('status', $status);
        }

        if ($resourceId) {
            $query->whereHas('assessment', fn ($aq) => $aq->where('resource_id', $resourceId));
        }

        $submissions = $query->orderBy('submitted_at', 'desc')->paginate(15)->withQueryString();

        $resourcesWithAssessments = Resource::whereHas('assessment')
            ->select('id', 'title')
            ->orderBy('title', 'asc')
            ->get();

        return Inertia::render('Admin/Assessments/Index', [
            'submissions' => $submissions,
            'statistics' => [
                'total_submissions' => $totalSubmissions,
                'passed_count' => $passedCount,
                'failed_count' => $failedCount,
                'pass_rate' => $passRate,
                'average_score' => $avgScore,
                'unique_students' => $uniqueStudents,
                'total_assessments' => $totalAssessments,
            ],
            'resources' => $resourcesWithAssessments,
            'filters' => [
                'search' => $search,
                'status' => $status,
                'resource_id' => $resourceId,
            ],
        ]);
    }

    /**
     * Display a specific student submission attempt with question-by-question breakdown.
     */
    public function show(AssessmentSubmission $submission): Response
    {
        $submission->load([
            'user',
            'assessment.resource.category',
            'assessment.questions' => fn ($q) => $q->orderBy('order', 'asc'),
        ]);

        return Inertia::render('Admin/Assessments/Show', [
            'submission' => $submission,
        ]);
    }

    /**
     * Delete/reset a student submission attempt.
     */
    public function destroySubmission(AssessmentSubmission $submission): RedirectResponse
    {
        $adminId = Auth::id();
        $studentName = $submission->user?->name ?? 'Student';
        $resourceTitle = $submission->assessment?->resource?->title ?? 'Lesson';

        ActivityLog::record(
            'assessment_submission_deleted',
            "Administrator removed assessment attempt of {$studentName} for \"{$resourceTitle}\"",
            $adminId,
            AssessmentSubmission::class,
            $submission->id
        );

        $submission->delete();

        return redirect()->route('admin.assessments.index')
            ->with('success', 'Student submission was removed successfully.');
    }

    /**
     * Save or update an assessment and its questions for a given resource.
     */
    public function saveAssessment(Request $request, Resource $resource): RedirectResponse
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'passing_percentage' => ['required', 'integer', 'min:1', 'max:100'],
            'time_limit_minutes' => ['nullable', 'integer', 'min:1', 'max:180'],
            'is_published' => ['required', 'boolean'],
            'questions' => ['required', 'array', 'min:1'],
            'questions.*.question_text' => ['required', 'string'],
            'questions.*.options' => ['required', 'array', 'min:2'],
            'questions.*.options.*.key' => ['required', 'string'],
            'questions.*.options.*.text' => ['required', 'string'],
            'questions.*.correct_answer' => ['required', 'string'],
            'questions.*.points' => ['required', 'integer', 'min:1'],
            'questions.*.explanation' => ['nullable', 'string'],
        ]);

        $assessment = Assessment::updateOrCreate(
            ['resource_id' => $resource->id],
            [
                'title' => $validated['title'],
                'description' => $validated['description'] ?? null,
                'passing_percentage' => $validated['passing_percentage'],
                'time_limit_minutes' => $validated['time_limit_minutes'] ?? null,
                'is_published' => $validated['is_published'],
                'created_by' => Auth::id(),
            ]
        );

        // Replace questions with updated set
        $assessment->questions()->delete();

        foreach ($validated['questions'] as $index => $q) {
            AssessmentQuestion::create([
                'assessment_id' => $assessment->id,
                'question_text' => $q['question_text'],
                'question_type' => 'multiple_choice',
                'options' => $q['options'],
                'correct_answer' => $q['correct_answer'],
                'points' => $q['points'] ?? 1,
                'order' => $index + 1,
                'explanation' => $q['explanation'] ?? null,
            ]);
        }

        ActivityLog::record(
            'assessment_saved',
            "Administrator updated lesson assessment for \"{$resource->title}\"",
            Auth::id(),
            Assessment::class,
            $assessment->id
        );

        return back()->with('success', 'Lesson assessment updated successfully.');
    }
}

