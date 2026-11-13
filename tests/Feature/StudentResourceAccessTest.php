<?php

namespace Tests\Feature;

use App\Models\Resource;
use App\Models\ResourceCategory;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class StudentResourceAccessTest extends TestCase
{
    use RefreshDatabase;

    protected User $student;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed();

        $this->student = User::where('role', 'student')->where('status', 'active')->first();
    }

    public function test_student_can_view_dashboard(): void
    {
        $response = $this->actingAs($this->student)->get('/student/dashboard');
        $response->assertStatus(200);
    }

    public function test_student_can_browse_resources(): void
    {
        $response = $this->actingAs($this->student)->get('/student/resources');
        $response->assertStatus(200);
    }

    public function test_student_can_view_category(): void
    {
        $category = ResourceCategory::first();

        $response = $this->actingAs($this->student)->get("/student/resources/category/{$category->slug}");
        $response->assertStatus(200);
    }

    public function test_student_can_view_published_resource(): void
    {
        $resource = Resource::where('visibility', 'published')->first();

        $response = $this->actingAs($this->student)->get("/student/resources/{$resource->id}");
        $response->assertStatus(200);
    }

    public function test_student_cannot_view_draft_resource(): void
    {
        $resource = Resource::first();
        $resource->update(['visibility' => 'draft']);

        $response = $this->actingAs($this->student)->get("/student/resources/{$resource->id}");
        $response->assertStatus(404);
    }

    public function test_student_cannot_upload_or_delete_resources(): void
    {
        $response = $this->actingAs($this->student)->post('/admin/resources', [
            'title' => 'Malicious Student Upload',
        ]);

        $response->assertRedirect('/student/dashboard');

        $resource = Resource::first();
        $deleteResponse = $this->actingAs($this->student)->delete("/admin/resources/{$resource->id}");
        $deleteResponse->assertRedirect('/student/dashboard');
    }
}
