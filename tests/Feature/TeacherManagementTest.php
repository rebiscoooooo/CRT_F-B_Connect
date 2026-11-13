<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class TeacherManagementTest extends TestCase
{
    use RefreshDatabase;

    protected User $admin;

    protected User $student;

    protected function setUp(): void
    {
        parent::setUp();

        $this->admin = User::factory()->create([
            'role' => 'admin',
            'status' => 'active',
            'first_name' => 'Maria',
            'last_name' => 'Santos',
            'name' => 'Chef Maria Santos',
            'email' => 'admin@crt.edu.ph',
        ]);

        $this->student = User::factory()->create([
            'role' => 'student',
            'status' => 'active',
            'student_number' => '2024-CRT-0101',
        ]);
    }

    public function test_admin_can_view_teachers_and_admins_index(): void
    {
        User::factory()->create([
            'role' => 'teacher',
            'status' => 'active',
            'first_name' => 'Antonio',
            'last_name' => 'Reyes',
            'name' => 'Chef Antonio Reyes',
        ]);

        $response = $this->actingAs($this->admin)->get('/admin/teachers');

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->component('Admin/Teachers/Index')
            ->has('teachers.data', 2)
            ->where('stats.total_staff', 2)
            ->where('stats.admin_count', 1)
            ->where('stats.teacher_count', 1)
        );
    }

    public function test_admin_can_create_new_teacher_account(): void
    {
        $response = $this->actingAs($this->admin)->post('/admin/teachers', [
            'first_name' => 'Rolando',
            'middle_name' => 'Cruz',
            'last_name' => 'Villanueva',
            'email' => 'rolando.villanueva@crt.edu.ph',
            'contact_number' => '+63 917 555 4321',
            'role' => 'teacher',
            'password' => 'SecurePass2026',
            'status' => 'active',
        ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('users', [
            'email' => 'rolando.villanueva@crt.edu.ph',
            'first_name' => 'Rolando',
            'last_name' => 'Villanueva',
            'role' => 'teacher',
            'status' => 'active',
        ]);

        $createdUser = User::where('email', 'rolando.villanueva@crt.edu.ph')->first();
        $this->assertTrue(Hash::check('SecurePass2026', $createdUser->password));

        $this->assertDatabaseHas('activity_logs', [
            'user_id' => $this->admin->id,
            'action' => 'created',
        ]);
    }

    public function test_admin_can_create_another_admin_account(): void
    {
        $response = $this->actingAs($this->admin)->post('/admin/teachers', [
            'first_name' => 'Beatriz',
            'middle_name' => null,
            'last_name' => 'Navarro',
            'email' => 'beatriz.navarro@crt.edu.ph',
            'contact_number' => '+63 920 888 1234',
            'role' => 'admin',
            'password' => 'AdminMaster2026',
            'status' => 'active',
        ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('users', [
            'email' => 'beatriz.navarro@crt.edu.ph',
            'role' => 'admin',
            'status' => 'active',
        ]);
    }

    public function test_admin_can_update_teacher_details(): void
    {
        $teacher = User::factory()->create([
            'role' => 'teacher',
            'status' => 'active',
            'first_name' => 'Gino',
            'last_name' => 'Alvarez',
            'email' => 'gino.alvarez@crt.edu.ph',
        ]);

        $response = $this->actingAs($this->admin)->put("/admin/teachers/{$teacher->id}", [
            'first_name' => 'Chef Gino',
            'middle_name' => 'M',
            'last_name' => 'Alvarez',
            'email' => 'chef.gino@crt.edu.ph',
            'contact_number' => '+63 919 111 2222',
            'role' => 'teacher',
            'status' => 'active',
        ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('users', [
            'id' => $teacher->id,
            'email' => 'chef.gino@crt.edu.ph',
            'first_name' => 'Chef Gino',
        ]);
    }

    public function test_admin_can_toggle_teacher_status(): void
    {
        $teacher = User::factory()->create([
            'role' => 'teacher',
            'status' => 'active',
        ]);

        $response = $this->actingAs($this->admin)->post("/admin/teachers/{$teacher->id}/toggle-status");

        $response->assertRedirect();
        $this->assertDatabaseHas('users', [
            'id' => $teacher->id,
            'status' => 'inactive',
        ]);

        // Toggle back
        $response2 = $this->actingAs($this->admin)->post("/admin/teachers/{$teacher->id}/toggle-status");
        $response2->assertRedirect();
        $this->assertDatabaseHas('users', [
            'id' => $teacher->id,
            'status' => 'active',
        ]);
    }

    public function test_admin_cannot_deactivate_or_delete_own_account(): void
    {
        // Toggle self
        $toggleResponse = $this->actingAs($this->admin)->post("/admin/teachers/{$this->admin->id}/toggle-status");
        $toggleResponse->assertRedirect();
        $this->assertDatabaseHas('users', [
            'id' => $this->admin->id,
            'status' => 'active',
        ]);

        // Delete self
        $deleteResponse = $this->actingAs($this->admin)->delete("/admin/teachers/{$this->admin->id}");
        $deleteResponse->assertRedirect();
        $this->assertDatabaseHas('users', [
            'id' => $this->admin->id,
        ]);
    }

    public function test_admin_can_delete_other_teacher_account(): void
    {
        $teacher = User::factory()->create([
            'role' => 'teacher',
            'status' => 'active',
        ]);

        $response = $this->actingAs($this->admin)->delete("/admin/teachers/{$teacher->id}");

        $response->assertRedirect();
        $this->assertDatabaseMissing('users', [
            'id' => $teacher->id,
        ]);
    }

    public function test_student_cannot_access_teacher_management(): void
    {
        $response = $this->actingAs($this->student)->get('/admin/teachers');

        $response->assertRedirect(route('student.dashboard'));
    }
}

