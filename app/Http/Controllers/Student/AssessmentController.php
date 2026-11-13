<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use App\Models\Assessment;
use App\Models\AssessmentSubmission;
use App\Models\Resource;
use App\Models\SystemNotification;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AssessmentController extends Controller
{
    /**
     * Submit an assessment attempt for a specific lesson resource.
     */
    public function submit(Request $request, Resource $resource): RedirectResponse
    {
        $user = Auth::user();

        if (! $user) {
            abort(401, 'Please sign in to submit an assessment.');
        }

        $assessment = $resource->assessment()
            ->where('is_published', true)
            ->with(['questions' => fn ($q) => $q->orderBy('order', 'asc')])
            ->firstOrFail();

        $validated = $request->validate([
            'answers' => ['required', 'array'],
        ]);

        $submittedAnswers = $validated['answers'];
        $earnedPoints = 0;
        $totalPoints = 0;

        foreach ($assessment->questions as $question) {
            $totalPoints += (int) $question->points;
            $selectedAnswer = $submittedAnswers[$question->id] ?? null;

            if ($selectedAnswer !== null && strcasecmp(trim((string) $selectedAnswer), trim((string) $question->correct_answer)) === 0) {
                $earnedPoints += (int) $question->points;
            }
        }

        $percentage = $totalPoints > 0 ? round(($earnedPoints / $totalPoints) * 100, 2) : 0;
        $isPassed = $percentage >= $assessment->passing_percentage;
        $status = $isPassed ? 'passed' : 'failed';

        $feedback = $isPassed
            ? "Congratulations! You passed with {$earnedPoints}/{$totalPoints} ({$percentage}%)."
            : "You scored {$earnedPoints}/{$totalPoints} ({$percentage}%). The passing requirement is {$assessment->passing_percentage}%. Please review the lesson and try again.";

        $submission = AssessmentSubmission::create([
            'assessment_id' => $assessment->id,
            'user_id' => $user->id,
            'score' => $earnedPoints,
            'total_points' => $totalPoints,
            'percentage' => $percentage,
            'status' => $status,
            'answers' => $submittedAnswers,
            'feedback' => $feedback,
            'submitted_at' => now(),
        ]);

        ActivityLog::record(
            'assessment_submission',
            "Student {$user->name} completed assessment for \"{$resource->title}\" with {$percentage}% ({$status})",
            $user->id,
            AssessmentSubmission::class,
            $submission->id
        );

        SystemNotification::create([
            'user_id' => $user->id,
            'title' => 'Assessment Graded',
            'message' => "Your assessment for \"{$resource->title}\" was graded: {$percentage}% ({$status}).",
            'type' => $isPassed ? 'success' : 'warning',
            'link' => "/student/resources/{$resource->id}",
            'created_at' => now(),
        ]);

        return back()->with('flash_submission', [
            'submission' => $submission->load('assessment'),
            'message' => $feedback,
            'status' => $status,
        ]);
    }
}
