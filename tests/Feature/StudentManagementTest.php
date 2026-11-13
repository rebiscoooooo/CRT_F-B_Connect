<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class StudentManagementTest extends TestCase
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

    public function test_admin_can_view_students_list(): void
    {
        $response = $this->actingAs($this->admin)->get('/admin/students');
        $response->assertStatus(200);
    }

    public function test_admin_can_add_student(): void
    {
        $response = $this->actingAs($this->admin)->post('/admin/students', [
            'student_number' => '2024-CRT-0888',
            'first_name' => 'Lorenzo',
            'middle_name' => 'Diaz',
            'last_name' => 'Aquino',
            'email' => 'lorenzo.aquino@crt.edu.ph',
            'contact_number' => '+63 918 111 2222',
            'password' => 'password123',
            'status' => 'active',
        ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('users', [
            'student_number' => '2024-CRT-0888',
            'email' => 'lorenzo.aquino@crt.edu.ph',
            'role' => 'student',
        ]);
    }

    public function test_admin_can_view_student_profile(): void
    {
        $response = $this->actingAs($this->admin)->get("/admin/students/{$this->student->id}");
        $response->assertStatus(200);
    }

    public function test_admin_can_update_student(): void
    {
        $response = $this->actingAs($this->admin)->put("/admin/students/{$this->student->id}", [
            'student_number' => $this->student->student_number,
            'first_name' => 'UpdatedFirst',
            'middle_name' => 'UpdatedMiddle',
            'last_name' => 'UpdatedLast',
            'email' => 'updated.student@crt.edu.ph',
            'contact_number' => '+63 999 888 7777',
            'status' => 'active',
        ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('users', [
            'id' => $this->student->id,
            'first_name' => 'UpdatedFirst',
            'email' => 'updated.student@crt.edu.ph',
        ]);
    }

    public function test_admin_can_toggle_student_status(): void
    {
        $initialStatus = $this->student->status;

        $response = $this->actingAs($this->admin)->post("/admin/students/{$this->student->id}/toggle-status");

        $response->assertRedirect();
        $this->student->refresh();
        $this->assertNotEquals($initialStatus, $this->student->status);
    }

    public function test_admin_can_export_students_csv(): void
    {
        $response = $this->actingAs($this->admin)->get('/admin/students/export');

        $response->assertStatus(200);
        $this->assertTrue(str_contains($response->headers->get('content-type'), 'text/csv'));
    }

    public function test_admin_can_delete_student(): void
    {
        $studentId = $this->student->id;

        $response = $this->actingAs($this->admin)->delete("/admin/students/{$studentId}");

        $response->assertRedirect('/admin/students');
        $this->assertDatabaseMissing('users', [
            'id' => $studentId,
        ]);
    }
}
