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

        $response->assertRedirect('/student/dashboard');
        $this->assertDatabaseHas('users', [
            'student_number' => '2024-CRT-9999',
            'email' => 'ben.santos@crt.edu.ph',
            'role' => 'student',
        ]);
        $this->assertAuthenticated();
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
}
