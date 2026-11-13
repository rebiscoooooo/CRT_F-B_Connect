<?php

namespace Tests\Feature;

use App\Models\Resource;
use App\Models\ResourceCategory;
use App\Models\ResourceFolder;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class AdminDashboardAndResourcesTest extends TestCase
{
    use RefreshDatabase;

    protected User $admin;

    protected User $student;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed();

        $this->admin = User::where('role', 'admin')->first();
        $this->student = User::where('role', 'student')->where('status', 'active')->first();
    }

    public function test_admin_can_access_dashboard_with_statistics(): void
    {
        $response = $this->actingAs($this->admin)->get('/admin/dashboard');
        $response->assertStatus(200);
    }

    public function test_student_cannot_access_admin_dashboard(): void
    {
        $response = $this->actingAs($this->student)->get('/admin/dashboard');
        $response->assertRedirect('/student/dashboard');
    }

    public function test_admin_can_view_resources_index(): void
    {
        $response = $this->actingAs($this->admin)->get('/admin/resources');
        $response->assertStatus(200);
    }

    public function test_admin_can_create_new_folder(): void
    {
        $category = ResourceCategory::first();

        $response = $this->actingAs($this->admin)->post('/admin/folders', [
            'category_id' => $category->id,
            'name' => 'Cocktail Mixology & Garnishing',
            'description' => 'Comprehensive lessons on classical and contemporary cocktail techniques.',
        ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('resource_folders', [
            'name' => 'Cocktail Mixology & Garnishing',
            'category_id' => $category->id,
        ]);
    }

    public function test_admin_can_update_folder(): void
    {
        $folder = ResourceFolder::first();

        $response = $this->actingAs($this->admin)->put("/admin/folders/{$folder->id}", [
            'name' => 'Updated Folder Name',
            'description' => 'Updated description.',
        ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('resource_folders', [
            'id' => $folder->id,
            'name' => 'Updated Folder Name',
        ]);
    }

    public function test_admin_can_upload_new_resource(): void
    {
        Storage::fake('public');
        $category = ResourceCategory::where('slug', 'video-lessons')->first();

        $file = UploadedFile::fake()->create('sample_lesson.mp4', 5000, 'video/mp4');

        $response = $this->actingAs($this->admin)->post('/admin/resources', [
            'title' => 'Espresso Extraction Masterclass',
            'description' => 'Detailed technique on espresso timing and crema.',
            'category_id' => $category->id,
            'resource_type' => 'video',
            'visibility' => 'published',
            'file' => $file,
        ]);

        $this->assertDatabaseHas('resources', [
            'title' => 'Espresso Extraction Masterclass',
            'resource_type' => 'video',
            'category_id' => $category->id,
        ]);
    }

    public function test_admin_can_move_resource_to_another_folder(): void
    {
        $resource = Resource::first();
        $targetFolder = ResourceFolder::where('id', '!=', $resource->folder_id)->first();

        $response = $this->actingAs($this->admin)->post("/admin/resources/{$resource->id}/move", [
            'folder_id' => $targetFolder->id,
        ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('resources', [
            'id' => $resource->id,
            'folder_id' => $targetFolder->id,
        ]);
    }

    public function test_admin_can_update_visibility(): void
    {
        $resource = Resource::first();

        $response = $this->actingAs($this->admin)->post("/admin/resources/{$resource->id}/visibility", [
            'visibility' => 'draft',
        ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('resources', [
            'id' => $resource->id,
            'visibility' => 'draft',
        ]);
    }

    public function test_admin_can_upload_large_resource_up_to_1gb(): void
    {
        Storage::fake('public');
        $category = ResourceCategory::where('slug', 'video-lessons')->first();

        // 150MB file (exceeds previous 100MB limit, within 1GB limit)
        $file = UploadedFile::fake()->create('large_video.mp4', 150000, 'video/mp4');

        $response = $this->actingAs($this->admin)->post('/admin/resources', [
            'title' => 'High Definition Masterclass 150MB',
            'description' => 'Large file testing.',
            'category_id' => $category->id,
            'resource_type' => 'video',
            'visibility' => 'published',
            'file' => $file,
        ]);

        $response->assertSessionHasNoErrors();
        $this->assertDatabaseHas('resources', [
            'title' => 'High Definition Masterclass 150MB',
            'file_size' => 150000 * 1024,
        ]);
    }

    public function test_resource_upload_rejects_files_larger_than_1gb(): void
    {
        Storage::fake('public');
        $category = ResourceCategory::where('slug', 'video-lessons')->first();

        // 1.2GB file (exceeds 1GB limit = 1,048,576 KB)
        $file = UploadedFile::fake()->create('too_large_video.mp4', 1200000, 'video/mp4');

        $response = $this->actingAs($this->admin)->post('/admin/resources', [
            'title' => 'Excessively Large Video',
            'description' => 'Exceeds 1GB.',
            'category_id' => $category->id,
            'resource_type' => 'video',
            'visibility' => 'published',
            'file' => $file,
        ]);

        $response->assertSessionHasErrors('file');
    }

    public function test_admin_can_upload_pdf_module_over_2mb(): void
    {
        Storage::fake('public');
        $category = ResourceCategory::where('slug', 'pdf-modules')->first();

        // 5MB PDF file (exceeds default 2MB PHP limit)
        $file = UploadedFile::fake()->create('Fortify-Spatie.pdf', 5000, 'application/pdf');

        $response = $this->actingAs($this->admin)->post('/admin/resources', [
            'title' => 'Fortify and Spatie Guide',
            'description' => 'Security guide.',
            'category_id' => $category->id,
            'resource_type' => 'pdf',
            'visibility' => 'published',
            'file' => $file,
        ]);

        $response->assertSessionHasNoErrors();
        $this->assertDatabaseHas('resources', [
            'title' => 'Fortify and Spatie Guide',
            'resource_type' => 'pdf',
        ]);
    }

    public function test_admin_can_delete_resource(): void
    {
        $resource = Resource::first();

        $response = $this->actingAs($this->admin)->delete("/admin/resources/{$resource->id}");

        $response->assertRedirect('/admin/resources');
        $this->assertDatabaseMissing('resources', [
            'id' => $resource->id,
        ]);
    }
}
