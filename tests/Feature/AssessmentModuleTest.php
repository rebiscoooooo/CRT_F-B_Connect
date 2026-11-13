<?php

namespace Tests\Feature;

use App\Models\Assessment;
use App\Models\AssessmentQuestion;
use App\Models\AssessmentSubmission;
use App\Models\Resource;
use App\Models\ResourceCategory;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AssessmentModuleTest extends TestCase
{
    use RefreshDatabase;

    protected User $admin;

    protected User $student;

    protected Resource $resource;

    protected Assessment $assessment;

    protected function setUp(): void
    {
        parent::setUp();

        $this->admin = User::factory()->create([
            'role' => 'admin',
            'status' => 'active',
        ]);

        $this->student = User::factory()->create([
            'role' => 'student',
            'status' => 'active',
            'student_number' => '2024-CRT-9999',
        ]);

        $category = ResourceCategory::create([
            'name' => 'Video Lessons',
            'slug' => 'video-lessons',
            'description' => 'Culinary and beverage video masterclasses',
            'icon' => 'video',
        ]);

        $this->resource = Resource::create([
            'category_id' => $category->id,
            'title' => 'Espresso Extraction Fundamentals',
            'slug' => 'espresso-extraction-fundamentals',
            'description' => 'Master the 1:2 extraction ratio and tamping pressure.',
            'resource_type' => 'video',
            'external_url' => 'https://example.com/video.mp4',
            'visibility' => 'published',
            'uploaded_by' => $this->admin->id,
        ]);

        $this->assessment = Assessment::create([
            'resource_id' => $this->resource->id,
            'title' => 'Espresso Mastery Quiz',
            'description' => 'Test your understanding of extraction times and temperature.',
            'passing_percentage' => 70,
            'time_limit_minutes' => 15,
            'is_published' => true,
            'created_by' => $this->admin->id,
        ]);

        AssessmentQuestion::create([
            'assessment_id' => $this->assessment->id,
            'question_text' => 'What is the standard extraction time for a 1:2 espresso double shot?',
            'question_type' => 'multiple_choice',
            'options' => [
                ['key' => 'A', 'text' => '10-15 seconds'],
                ['key' => 'B', 'text' => '25-30 seconds'],
                ['key' => 'C', 'text' => '60-70 seconds'],
            ],
            'correct_answer' => 'B',
            'points' => 1,
            'order' => 1,
            'explanation' => 'Standard specialty espresso extraction is typically 25 to 30 seconds.',
        ]);

        AssessmentQuestion::create([
            'assessment_id' => $this->assessment->id,
            'question_text' => 'What is the optimal steamed milk temperature for a latte?',
            'question_type' => 'multiple_choice',
            'options' => [
                ['key' => 'A', 'text' => '60°C to 65°C'],
                ['key' => 'B', 'text' => '90°C to 100°C'],
            ],
            'correct_answer' => 'A',
            'points' => 1,
            'order' => 2,
            'explanation' => '60°C to 65°C yields optimal sweetness without burning lactose.',
        ]);
    }

    public function test_student_can_view_lesson_with_assessment(): void
    {
        $response = $this->actingAs($this->student)->get("/student/resources/{$this->resource->id}");

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->component('Student/Resources/Show')
            ->has('assessment')
            ->where('assessment.title', 'Espresso Mastery Quiz')
            ->has('assessment.questions', 2)
            ->where('submission', null)
        );
    }

    public function test_student_passing_assessment(): void
    {
        $question1 = $this->assessment->questions()->where('order', 1)->first();
        $question2 = $this->assessment->questions()->where('order', 2)->first();

        $response = $this->actingAs($this->student)->post("/student/resources/{$this->resource->id}/assessment", [
            'answers' => [
                $question1->id => 'B',
                $question2->id => 'A',
            ],
        ]);

        $response->assertRedirect();

        $this->assertDatabaseHas('assessment_submissions', [
            'assessment_id' => $this->assessment->id,
            'user_id' => $this->student->id,
            'score' => 2,
            'total_points' => 2,
            'percentage' => 100.0,
            'status' => 'passed',
        ]);

        $this->assertDatabaseHas('activity_logs', [
            'user_id' => $this->student->id,
            'action' => 'assessment_submission',
        ]);
    }

    public function test_student_failing_assessment(): void
    {
        $question1 = $this->assessment->questions()->where('order', 1)->first();
        $question2 = $this->assessment->questions()->where('order', 2)->first();

        $response = $this->actingAs($this->student)->post("/student/resources/{$this->resource->id}/assessment", [
            'answers' => [
                $question1->id => 'A', // Incorrect
                $question2->id => 'B', // Incorrect
            ],
        ]);

        $response->assertRedirect();

        $this->assertDatabaseHas('assessment_submissions', [
            'assessment_id' => $this->assessment->id,
            'user_id' => $this->student->id,
            'score' => 0,
            'total_points' => 2,
            'percentage' => 0.0,
            'status' => 'failed',
        ]);
    }

    public function test_admin_can_view_all_student_assessments_in_portal(): void
    {
        // Create a submission
        $submission = AssessmentSubmission::create([
            'assessment_id' => $this->assessment->id,
            'user_id' => $this->student->id,
            'score' => 2,
            'total_points' => 2,
            'percentage' => 100.0,
            'status' => 'passed',
            'answers' => ['1' => 'B', '2' => 'A'],
            'submitted_at' => now(),
        ]);

        $response = $this->actingAs($this->admin)->get('/admin/assessments');

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->component('Admin/Assessments/Index')
            ->has('submissions.data', 1)
            ->where('statistics.total_submissions', 1)
            ->where('statistics.pass_rate', 100)
        );
    }

    public function test_admin_can_view_individual_submission_details(): void
    {
        $submission = AssessmentSubmission::create([
            'assessment_id' => $this->assessment->id,
            'user_id' => $this->student->id,
            'score' => 2,
            'total_points' => 2,
            'percentage' => 100.0,
            'status' => 'passed',
            'answers' => ['1' => 'B', '2' => 'A'],
            'submitted_at' => now(),
        ]);

        $response = $this->actingAs($this->admin)->get("/admin/assessments/{$submission->id}");

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->component('Admin/Assessments/Show')
            ->where('submission.id', $submission->id)
            ->where('submission.user.id', $this->student->id)
        );
    }

    public function test_admin_can_delete_student_submission(): void
    {
        $submission = AssessmentSubmission::create([
            'assessment_id' => $this->assessment->id,
            'user_id' => $this->student->id,
            'score' => 1,
            'total_points' => 2,
            'percentage' => 50.0,
            'status' => 'failed',
            'answers' => ['1' => 'B'],
            'submitted_at' => now(),
        ]);

        $response = $this->actingAs($this->admin)->delete("/admin/assessments/{$submission->id}");

        $response->assertRedirect('/admin/assessments');
        $this->assertDatabaseMissing('assessment_submissions', [
            'id' => $submission->id,
        ]);
    }

    public function test_admin_deleting_submission_from_show_page_redirects_to_index(): void
    {
        $submission = AssessmentSubmission::create([
            'assessment_id' => $this->assessment->id,
            'user_id' => $this->student->id,
            'score' => 2,
            'total_points' => 2,
            'percentage' => 100.0,
            'status' => 'passed',
            'answers' => ['1' => 'B', '2' => 'A'],
            'submitted_at' => now(),
        ]);

        $response = $this->actingAs($this->admin)
            ->from("/admin/assessments/{$submission->id}")
            ->delete("/admin/assessments/{$submission->id}");

        $response->assertRedirect(route('admin.assessments.index'));
        $this->assertDatabaseMissing('assessment_submissions', [
            'id' => $submission->id,
        ]);
    }

    public function test_students_cannot_access_admin_assessments(): void
    {
        $response = $this->actingAs($this->student)->get('/admin/assessments');

        $response->assertRedirect(route('student.dashboard'));
    }
}
