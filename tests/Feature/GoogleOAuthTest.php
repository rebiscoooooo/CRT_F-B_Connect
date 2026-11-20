<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
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

    public function test_google_callback_does_not_overwrite_existing_user_entry_fields(): void
    {
        config(['services.google.client_id' => 'test-client-id']);
        config(['services.google.client_secret' => 'test-client-secret']);

        $originalStudent = User::factory()->create([
            'first_name' => 'OriginalFirst',
            'last_name' => 'OriginalLast',
            'name' => 'OriginalFirst OriginalLast',
            'student_number' => '2024-ORIG-001',
            'email' => 'registered.user@crt.edu.ph',
            'role' => 'student',
            'status' => 'active',
            'google_id' => null,
            'google_avatar' => null,
            'password' => 'secret_hashed_pw',
        ]);

        $googleUser = Mockery::mock(SocialiteUser::class);
        $googleUser->shouldReceive('getId')->andReturn('google-id-different-999');
        $googleUser->shouldReceive('getName')->andReturn('Completely Different Name');
        $googleUser->shouldReceive('getEmail')->andReturn('registered.user@crt.edu.ph');
        $googleUser->shouldReceive('getAvatar')->andReturn('https://google.com/new-avatar.jpg');

        $provider = Mockery::mock(GoogleProvider::class);
        $provider->shouldReceive('user')->andReturn($googleUser);

        Socialite::shouldReceive('driver')->with('google')->andReturn($provider);

        $response = $this->get('/auth/google/callback');

        $response->assertRedirect('/student/dashboard');
        $this->assertAuthenticatedAs($originalStudent);

        $fresh = $originalStudent->fresh();
        // Assert entry was NOT overwritten
        $this->assertEquals('OriginalFirst', $fresh->first_name);
        $this->assertEquals('OriginalLast', $fresh->last_name);
        $this->assertEquals('OriginalFirst OriginalLast', $fresh->name);
        $this->assertEquals('2024-ORIG-001', $fresh->student_number);
        $this->assertTrue(Hash::check('secret_hashed_pw', $fresh->password));
        // Only google_id linked
        $this->assertEquals('google-id-different-999', $fresh->google_id);
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

    public function test_callback_redirects_new_google_user_to_complete_profile(): void
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

        // Must redirect to complete-profile, NOT immediately create account
        $response->assertRedirect('/auth/google/complete-profile');
        $response->assertSessionHas('google_signup_profile');
        $this->assertDatabaseMissing('users', ['email' => 'maria.santos@gmail.com']);
    }

    public function test_new_google_user_can_complete_profile_and_submit_for_approval(): void
    {
        $sessionData = [
            'google_id' => 'google-new-student-456',
            'email' => 'maria.santos@gmail.com',
            'name' => 'Maria Santos',
            'first_name' => 'Maria',
            'last_name' => 'Santos',
            'avatar' => 'https://google.com/maria.jpg',
        ];

        // 1. Can view complete profile page
        $pageResponse = $this->withSession(['google_signup_profile' => $sessionData])
            ->get('/auth/google/complete-profile');
        $pageResponse->assertOk();
        $pageResponse->assertInertia(fn ($page) => $page
            ->component('Auth/CompleteGoogleProfile')
            ->has('googleProfile')
        );

        // 2. Can submit complete profile form
        $submitResponse = $this->withSession(['google_signup_profile' => $sessionData])
            ->post('/auth/google/complete-profile', [
                'student_number' => '2024-CRT-5544',
                'first_name' => 'Maria Theresa',
                'middle_name' => 'Delos',
                'last_name' => 'Santos',
                'contact_number' => '+63 917 123 4567',
                'password' => 'SecurePass2026',
                'password_confirmation' => 'SecurePass2026',
                'terms' => true,
            ]);

        $submitResponse->assertRedirect('/approval-pending');

        $user = User::where('email', 'maria.santos@gmail.com')->first();
        $this->assertNotNull($user);
        $this->assertEquals('student', $user->role);
        $this->assertEquals('pending', $user->status);
        $this->assertEquals('2024-CRT-5544', $user->student_number);
        $this->assertEquals('Maria Theresa', $user->first_name);
        $this->assertEquals('Delos', $user->middle_name);
        $this->assertEquals('Santos', $user->last_name);
        $this->assertEquals('+63 917 123 4567', $user->contact_number);
        $this->assertEquals('google-new-student-456', $user->google_id);
        $this->assertEquals('https://google.com/maria.jpg', $user->google_avatar);
        $this->assertTrue(Hash::check('SecurePass2026', $user->password));
        $this->assertNotNull($user->email_verified_at);
    }

    public function test_new_google_user_can_cancel_profile_completion(): void
    {
        $sessionData = [
            'google_id' => 'google-new-student-456',
            'email' => 'maria.santos@gmail.com',
            'name' => 'Maria Santos',
        ];

        $response = $this->withSession(['google_signup_profile' => $sessionData])
            ->post('/auth/google/cancel');

        $response->assertRedirect('/register');
        $response->assertSessionMissing('google_signup_profile');
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
