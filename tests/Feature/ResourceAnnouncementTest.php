<?php

namespace Tests\Feature;

use App\Mail\ResourceAnnouncementMail;
use App\Models\Resource;
use App\Models\ResourceCategory;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class ResourceAnnouncementTest extends TestCase
{
    use RefreshDatabase;

    protected User $admin;

    protected User $student1;

    protected User $student2;

    protected ResourceCategory $category;

    protected function setUp(): void
    {
        parent::setUp();

        Storage::fake('public');
        Mail::fake();

        $this->admin = User::factory()->create([
            'role' => 'admin',
            'status' => 'active',
            'first_name' => 'Maria',
            'last_name' => 'Santos',
            'name' => 'Chef Maria Santos',
            'email' => 'admin@crt.edu.ph',
        ]);

        $this->student1 = User::factory()->create([
            'role' => 'student',
            'status' => 'active',
            'email' => 'student1@crt.edu.ph',
            'name' => 'Student Juan Dela Cruz',
        ]);

        $this->student2 = User::factory()->create([
            'role' => 'student',
            'status' => 'active',
            'email' => 'student2@crt.edu.ph',
            'name' => 'Student Angela Bautista',
        ]);

        $this->category = ResourceCategory::create([
            'name' => 'Video Lessons',
            'slug' => 'video-lessons',
            'description' => 'Culinary masterclass videos',
            'icon' => 'video',
        ]);
    }

    public function test_uploading_resource_with_announcement_sends_email_to_all_registered_students(): void
    {
        $videoFile = UploadedFile::fake()->create('demo_video.mp4', 1024, 'video/mp4');

        $response = $this->actingAs($this->admin)->post('/admin/resources', [
            'category_id' => $this->category->id,
            'title' => 'Espresso Extraction Calibration',
            'description' => 'Detailed walkthrough on dialling in grind size and timing.',
            'resource_type' => 'video',
            'visibility' => 'published',
            'file' => $videoFile,
            'send_announcement' => '1',
            'announcement_message' => 'Please watch this video before tomorrow morning lab.',
        ]);

        $response->assertRedirect();

        $resource = Resource::where('slug', 'espresso-extraction-calibration')->first();
        $this->assertNotNull($resource);

        // Verify emails sent to all active students
        Mail::assertSent(ResourceAnnouncementMail::class, function ($mail) {
            return $mail->hasTo('student1@crt.edu.ph')
                && $mail->resource->title === 'Espresso Extraction Calibration'
                && str_contains($mail->announcementMessage, 'Please watch this video');
        });

        Mail::assertSent(ResourceAnnouncementMail::class, function ($mail) {
            return $mail->hasTo('student2@crt.edu.ph');
        });

        // Verify in-app notifications created
        $this->assertDatabaseHas('system_notifications', [
            'user_id' => $this->student1->id,
            'title' => 'New Learning Material: Espresso Extraction Calibration',
        ]);

        $this->assertDatabaseHas('system_notifications', [
            'user_id' => $this->student2->id,
            'title' => 'New Learning Material: Espresso Extraction Calibration',
        ]);

        // Verify activity log recorded
        $this->assertDatabaseHas('activity_logs', [
            'user_id' => $this->admin->id,
            'action' => 'announcement_broadcast',
        ]);
    }

    public function test_uploading_without_announcement_does_not_send_emails(): void
    {
        $videoFile = UploadedFile::fake()->create('silent_video.mp4', 512, 'video/mp4');

        $response = $this->actingAs($this->admin)->post('/admin/resources', [
            'category_id' => $this->category->id,
            'title' => 'Silent Resource Upload',
            'description' => 'Uploaded without announcement.',
            'resource_type' => 'video',
            'visibility' => 'published',
            'file' => $videoFile,
            'send_announcement' => '0',
        ]);

        $response->assertRedirect();
        Mail::assertNothingSent();
    }

    public function test_broadcasting_announcement_for_existing_resource(): void
    {
        $resource = Resource::create([
            'category_id' => $this->category->id,
            'title' => 'Sanitation Protocol Guide',
            'slug' => 'sanitation-protocol-guide',
            'description' => 'Food safety review.',
            'resource_type' => 'pdf',
            'visibility' => 'published',
            'uploaded_by' => $this->admin->id,
        ]);

        $response = $this->actingAs($this->admin)->post("/admin/resources/{$resource->id}/announce", [
            'announcement_message' => 'Mandatory reading for all hospitality students.',
        ]);

        $response->assertRedirect();

        Mail::assertSent(ResourceAnnouncementMail::class, 2);

        $this->assertDatabaseHas('system_notifications', [
            'user_id' => $this->student1->id,
            'title' => 'New Learning Material: Sanitation Protocol Guide',
        ]);
    }

    public function test_email_renders_logo_correctly(): void
    {
        $resource = Resource::create([
            'category_id' => $this->category->id,
            'title' => 'Espresso Extraction Fundamentals',
            'slug' => 'espresso-extraction-fundamentals-test',
            'description' => 'Coffee tasting.',
            'resource_type' => 'video',
            'visibility' => 'published',
            'uploaded_by' => $this->admin->id,
        ]);

        $mailable = new ResourceAnnouncementMail($resource, $this->student1, 'Please review', $this->admin);
        $rendered = $mailable->render();

        $this->assertStringContainsString('CRT F&amp;B Connect', $rendered);
        $this->assertStringContainsString('alt="CRT F&B Connect Logo"', $rendered);
        $this->assertStringContainsString('Open Learning Material', $rendered);
    }
}
