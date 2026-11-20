<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Socialite\Facades\Socialite;
use Laravel\Socialite\Two\GoogleProvider;
use Laravel\Socialite\Two\User as SocialiteUser;
use Mockery;
use Tests\TestCase;

class GoogleOAuthTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed();
    }

    public function test_redirect_to_google_fails_gracefully_when_credentials_not_set(): void
    {
        config(['services.google.client_id' => null]);
        config(['services.google.client_secret' => null]);

        $response = $this->get('/auth/google');

        $response->assertRedirect('/login');
        $response->assertSessionHasErrors('login');
    }

    public function test_redirect_to_google_redirects_when_credentials_set(): void
    {
        config(['services.google.client_id' => 'test-client-id']);
        config(['services.google.client_secret' => 'test-client-secret']);

        $provider = Mockery::mock(GoogleProvider::class);
        $provider->shouldReceive('redirect')->andReturn(redirect('https://accounts.google.com/o/oauth2/auth'));

        Socialite::shouldReceive('driver')->with('google')->andReturn($provider);

        $response = $this->get('/auth/google');

        $response->assertRedirect('https://accounts.google.com/o/oauth2/auth');
    }

    public function test_callback_logs_in_existing_active_student(): void
    {
        config(['services.google.client_id' => 'test-client-id']);
        config(['services.google.client_secret' => 'test-client-secret']);

        $existingStudent = User::where('role', 'student')->where('status', 'active')->first();

        $googleUser = Mockery::mock(SocialiteUser::class);
        $googleUser->shouldReceive('getId')->andReturn('google-unique-id-999');
        $googleUser->shouldReceive('getName')->andReturn($existingStudent->name);
        $googleUser->shouldReceive('getEmail')->andReturn($existingStudent->email);
        $googleUser->shouldReceive('getAvatar')->andReturn('https://google.com/avatar.jpg');

        $provider = Mockery::mock(GoogleProvider::class);
        $provider->shouldReceive('user')->andReturn($googleUser);

        Socialite::shouldReceive('driver')->with('google')->andReturn($provider);

        $response = $this->get('/auth/google/callback');

        $response->assertRedirect('/student/dashboard');
        $this->assertAuthenticatedAs($existingStudent);
        $this->assertEquals('google-unique-id-999', $existingStudent->fresh()->google_id);
    }

    public function test_callback_logs_in_existing_admin(): void
    {
        config(['services.google.client_id' => 'test-client-id']);
        config(['services.google.client_secret' => 'test-client-secret']);

        $admin = User::where('role', 'admin')->first();

        $googleUser = Mockery::mock(SocialiteUser::class);
        $googleUser->shouldReceive('getId')->andReturn('google-admin-id-123');
        $googleUser->shouldReceive('getName')->andReturn($admin->name);
        $googleUser->shouldReceive('getEmail')->andReturn($admin->email);
        $googleUser->shouldReceive('getAvatar')->andReturn('https://google.com/avatar.jpg');

        $provider = Mockery::mock(GoogleProvider::class);
        $provider->shouldReceive('user')->andReturn($googleUser);

        Socialite::shouldReceive('driver')->with('google')->andReturn($provider);

        $response = $this->get('/auth/google/callback');

        $response->assertRedirect('/admin/dashboard');
        $this->assertAuthenticatedAs($admin);
    }

    public function test_callback_registers_new_user_as_pending_student(): void
    {
        config(['services.google.client_id' => 'test-client-id']);
        config(['services.google.client_secret' => 'test-client-secret']);

        $googleUser = Mockery::mock(SocialiteUser::class);
        $googleUser->shouldReceive('getId')->andReturn('google-new-student-456');
        $googleUser->shouldReceive('getName')->andReturn('Maria Santos');
        $googleUser->shouldReceive('getEmail')->andReturn('maria.santos@gmail.com');
        $googleUser->shouldReceive('getAvatar')->andReturn('https://google.com/maria.jpg');

        $provider = Mockery::mock(GoogleProvider::class);
        $provider->shouldReceive('user')->andReturn($googleUser);

        Socialite::shouldReceive('driver')->with('google')->andReturn($provider);

        $response = $this->get('/auth/google/callback');

        $response->assertRedirect('/approval-pending');

        $user = User::where('email', 'maria.santos@gmail.com')->first();
        $this->assertNotNull($user);
        $this->assertEquals('student', $user->role);
        $this->assertEquals('pending', $user->status);
        $this->assertNotNull($user->email_verified_at);
        $this->assertEquals('google-new-student-456', $user->google_id);
        $this->assertNotNull($user->student_number);
    }

    public function test_callback_redirects_existing_pending_student_to_approval_pending(): void
    {
        config(['services.google.client_id' => 'test-client-id']);
        config(['services.google.client_secret' => 'test-client-secret']);

        $pendingStudent = User::factory()->create([
            'role' => 'student',
            'status' => 'pending',
            'email' => 'pending.student@gmail.com',
            'google_id' => 'google-pending-123',
        ]);

        $googleUser = Mockery::mock(SocialiteUser::class);
        $googleUser->shouldReceive('getId')->andReturn('google-pending-123');
        $googleUser->shouldReceive('getName')->andReturn($pendingStudent->name);
        $googleUser->shouldReceive('getEmail')->andReturn($pendingStudent->email);
        $googleUser->shouldReceive('getAvatar')->andReturn(null);

        $provider = Mockery::mock(GoogleProvider::class);
        $provider->shouldReceive('user')->andReturn($googleUser);

        Socialite::shouldReceive('driver')->with('google')->andReturn($provider);

        $response = $this->get('/auth/google/callback');

        $response->assertRedirect('/approval-pending');
        $this->assertGuest();
    }

    public function test_callback_handles_oauth_exceptions_gracefully(): void
    {
        config(['services.google.client_id' => 'test-client-id']);
        config(['services.google.client_secret' => 'test-client-secret']);

        $provider = Mockery::mock(GoogleProvider::class);
        $provider->shouldReceive('user')->andThrow(new \Exception('OAuth token exchange failed'));

        Socialite::shouldReceive('driver')->with('google')->andReturn($provider);

        $response = $this->get('/auth/google/callback');

        $response->assertRedirect('/login');
        $response->assertSessionHasErrors('login');
    }
}
