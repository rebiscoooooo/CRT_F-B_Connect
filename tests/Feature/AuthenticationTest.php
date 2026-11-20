<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AuthenticationTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed();
    }

    public function test_guest_can_view_landing_page(): void
    {
        $response = $this->get('/');
        $response->assertStatus(200);
    }

    public function test_guest_can_view_login_page(): void
    {
        $response = $this->get('/login');
        $response->assertStatus(200);
    }

    public function test_admin_can_login_and_is_redirected_to_admin_dashboard(): void
    {
        $response = $this->post('/login', [
            'login' => 'admin@crt.edu.ph',
            'password' => 'password',
        ]);

        $response->assertRedirect('/admin/dashboard');
        $this->assertAuthenticated();
    }

    public function test_student_can_login_using_student_number_and_is_redirected_to_student_dashboard(): void
    {
        $response = $this->post('/login', [
            'login' => '2024-CRT-0101',
            'password' => 'password',
        ]);

        $response->assertRedirect('/student/dashboard');
        $this->assertAuthenticated();
    }

    public function test_student_can_register(): void
    {
        $response = $this->post('/register', [
            'student_number' => '2024-CRT-9999',
            'first_name' => 'Ben',
            'middle_name' => 'Cruz',
            'last_name' => 'Santos',
            'email' => 'ben.santos@crt.edu.ph',
            'contact_number' => '+63 912 345 6789',
            'password' => 'newpassword123',
            'password_confirmation' => 'newpassword123',
            'terms' => true,
        ]);

        $response->assertRedirect('/verify-otp');
        $this->assertDatabaseHas('users', [
            'student_number' => '2024-CRT-9999',
            'email' => 'ben.santos@crt.edu.ph',
            'role' => 'student',
            'status' => 'pending',
            'email_verified_at' => null,
        ]);
        $this->assertGuest();
    }

    public function test_inactive_student_cannot_login(): void
    {
        $response = $this->post('/login', [
            'login' => 'princess.ramos@crt.edu.ph',
            'password' => 'password',
        ]);

        $response->assertSessionHasErrors('login');
        $this->assertGuest();
    }

    public function test_authenticated_user_can_logout(): void
    {
        $user = User::where('role', 'student')->first();

        $response = $this->actingAs($user)->post('/logout');

        $response->assertRedirect('/login');
        $this->assertGuest();
    }

    public function test_authenticated_student_visiting_login_is_redirected_to_student_dashboard(): void
    {
        $student = User::factory()->create([
            'role' => 'student',
            'status' => 'active',
            'email_verified_at' => now(),
        ]);

        $response = $this->actingAs($student)->get('/login');

        $response->assertRedirect(route('student.dashboard'));
    }

    public function test_authenticated_admin_visiting_login_is_redirected_to_admin_dashboard(): void
    {
        $admin = User::factory()->create([
            'role' => 'admin',
            'status' => 'active',
        ]);

        $response = $this->actingAs($admin)->get('/login');

        $response->assertRedirect(route('admin.dashboard'));
    }

    public function test_authenticated_user_visiting_register_is_redirected_to_dashboard(): void
    {
        $student = User::factory()->create([
            'role' => 'student',
            'status' => 'active',
            'email_verified_at' => now(),
        ]);

        $response = $this->actingAs($student)->get('/register');

        $response->assertRedirect(route('student.dashboard'));
    }

    public function test_web_responses_prevent_back_button_caching(): void
    {
        $response = $this->get('/login');

        $response->assertHeader('Cache-Control');
        $this->assertStringContainsString('no-cache', (string) $response->headers->get('Cache-Control'));
        $this->assertStringContainsString('no-store', (string) $response->headers->get('Cache-Control'));
    }

    public function test_register_with_existing_user_email_and_matching_password_signs_in_without_overwriting(): void
    {
        $existing = User::factory()->create([
            'student_number' => '2024-CRT-EXISTING',
            'first_name' => 'Original',
            'last_name' => 'Student',
            'name' => 'Original Student',
            'email' => 'registered.existing@crt.edu.ph',
            'role' => 'student',
            'status' => 'active',
            'password' => 'secret-password-123',
        ]);

        $response = $this->post('/register', [
            'student_number' => '2024-CRT-DIFFERENT',
            'first_name' => 'AttemptedNewFirst',
            'last_name' => 'AttemptedNewLast',
            'email' => 'registered.existing@crt.edu.ph',
            'password' => 'secret-password-123',
            'password_confirmation' => 'secret-password-123',
            'terms' => true,
        ]);

        $response->assertRedirect('/student/dashboard');
        $this->assertAuthenticatedAs($existing);

        $fresh = $existing->fresh();
        // Entry is not overwritten
        $this->assertEquals('Original', $fresh->first_name);
        $this->assertEquals('Student', $fresh->last_name);
        $this->assertEquals('Original Student', $fresh->name);
        $this->assertEquals('2024-CRT-EXISTING', $fresh->student_number);
    }
}
