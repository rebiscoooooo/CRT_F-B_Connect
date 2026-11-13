<?php

namespace Tests\Feature;

use App\Models\Assessment;
use App\Models\AssessmentQuestion;
use App\Models\Resource;
use App\Models\ResourceCategory;
use App\Models\User;
use App\Services\SmartAssessmentService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class SmartAssessmentTest extends TestCase
{
    use RefreshDatabase;

    protected User $admin;

    protected User $student;

    protected ResourceCategory $category;

    protected function setUp(): void
    {
        parent::setUp();

        Storage::fake('public');

        $this->admin = User::factory()->create([
            'role' => 'admin',
            'status' => 'active',
        ]);

        $this->student = User::factory()->create([
            'role' => 'student',
            'status' => 'active',
            'student_number' => '2024-CRT-1001',
        ]);

        $this->category = ResourceCategory::create([
            'name' => 'Video Lessons',
            'slug' => 'video-lessons',
            'description' => 'Instructional video demonstrations',
            'icon' => 'video',
        ]);
    }

    public function test_uploading_resource_automatically_creates_smart_10_question_assessment(): void
    {
        $file = UploadedFile::fake()->create('banquet_service.mp4', 1024, 'video/mp4');

        $response = $this->actingAs($this->admin)->post('/admin/resources', [
            'title' => 'American Banquet Service & Table Cover Rules',
            'description' => 'Learn the standard flatware positioning, silent service, and three-plate carrying method.',
            'category_id' => $this->category->id,
            'resource_type' => 'video',
            'visibility' => 'published',
            'file' => $file,
            'generate_smart_assessment' => true,
            'passing_percentage' => 75,
            'time_limit_minutes' => 15,
            'assessment_published' => true,
        ]);

        $resource = Resource::where('title', 'American Banquet Service & Table Cover Rules')->first();
        $this->assertNotNull($resource);

        $response->assertRedirect(route('admin.resources.show', $resource->id));

        $assessment = Assessment::where('resource_id', $resource->id)->first();
        $this->assertNotNull($assessment);
        $this->assertEquals(75, $assessment->passing_percentage);
        $this->assertEquals(15, $assessment->time_limit_minutes);
        $this->assertTrue($assessment->is_published);

        // Verify exactly 10 questions were created
        $questions = AssessmentQuestion::where('assessment_id', $assessment->id)->get();
        $this->assertCount(10, $questions);

        // Verify each question has 4 options, valid correct answer, and explanation
        foreach ($questions as $index => $q) {
            $this->assertEquals($index + 1, $q->order);
            $this->assertCount(4, $q->options);
            $this->assertContains($q->correct_answer, ['A', 'B', 'C', 'D']);
            $this->assertNotEmpty($q->explanation);
            $this->assertEquals(1, $q->points);
        }

        $this->assertDatabaseHas('activity_logs', [
            'action' => 'assessment_smart_generated',
            'subject_type' => Assessment::class,
            'subject_id' => $assessment->id,
        ]);
    }

    public function test_admin_can_regenerate_smart_assessment_for_existing_resource(): void
    {
        $resource = Resource::create([
            'category_id' => $this->category->id,
            'title' => 'Wine Decanting and Glassware Selection',
            'slug' => 'wine-decanting-and-glassware-selection',
            'description' => 'Techniques for presenting and serving vintage red wine with candle decanting.',
            'resource_type' => 'video',
            'visibility' => 'published',
            'uploaded_by' => $this->admin->id,
        ]);

        $response = $this->actingAs($this->admin)->post("/admin/resources/{$resource->id}/assessment/smart-generate", [
            'passing_percentage' => 80,
            'time_limit_minutes' => 20,
            'is_published' => true,
        ]);

        $response->assertRedirect();

        $assessment = Assessment::where('resource_id', $resource->id)->first();
        $this->assertNotNull($assessment);
        $this->assertEquals(80, $assessment->passing_percentage);
        $this->assertEquals(20, $assessment->time_limit_minutes);
        $this->assertEquals(10, $assessment->questions()->count());
    }

    public function test_admin_can_toggle_assessment_live_and_draft_status(): void
    {
        $resource = Resource::create([
            'category_id' => $this->category->id,
            'title' => 'Food Safety & HACCP Standards',
            'slug' => 'food-safety-haccp-standards',
            'description' => 'Understanding Temperature Danger Zones and FIFO storage.',
            'resource_type' => 'pdf',
            'visibility' => 'published',
            'uploaded_by' => $this->admin->id,
        ]);

        $smartService = app(SmartAssessmentService::class);
        $assessment = $smartService->generateForResource($resource, isPublished: true);
        $this->assertTrue($assessment->is_published);

        // Toggle to draft
        $response = $this->actingAs($this->admin)->post("/admin/resources/{$resource->id}/assessment/toggle-status");
        $response->assertRedirect();
        $this->assertFalse($assessment->fresh()->is_published);

        // Toggle back to live
        $response = $this->actingAs($this->admin)->post("/admin/resources/{$resource->id}/assessment/toggle-status");
        $response->assertRedirect();
        $this->assertTrue($assessment->fresh()->is_published);
    }

    public function test_student_can_take_and_pass_smart_assessment_with_10_questions(): void
    {
        $resource = Resource::create([
            'category_id' => $this->category->id,
            'title' => 'Fine Dining Table Setting Protocols',
            'slug' => 'fine-dining-table-setting-protocols',
            'description' => 'Cover setup, flatware spacing, and glassware alignments.',
            'resource_type' => 'illustration',
            'visibility' => 'published',
            'uploaded_by' => $this->admin->id,
        ]);

        $smartService = app(SmartAssessmentService::class);
        $assessment = $smartService->generateForResource($resource, passingPercentage: 70);

        // Student submits answers matching the correct answers for all 10 questions
        $answers = [];
        foreach ($assessment->questions as $question) {
            $answers[$question->id] = $question->correct_answer;
        }

        $response = $this->actingAs($this->student)->post("/student/resources/{$resource->id}/assessment", [
            'answers' => $answers,
        ]);

        $response->assertRedirect();

        $this->assertDatabaseHas('assessment_submissions', [
            'assessment_id' => $assessment->id,
            'user_id' => $this->student->id,
            'score' => 10,
            'total_points' => 10,
            'percentage' => 100.0,
            'status' => 'passed',
        ]);
    }
}
