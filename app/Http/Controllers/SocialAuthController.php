<?php

namespace App\Http\Controllers;

use App\Models\ActivityLog;
use App\Models\SystemNotification;
use App\Models\SystemSetting;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Laravel\Socialite\Facades\Socialite;

class SocialAuthController extends Controller
{
    /**
     * Redirect to Google's OAuth page.
     */
    public function redirectToGoogle(): RedirectResponse
    {
        if (empty(config('services.google.client_id')) || empty(config('services.google.client_secret'))) {
            return redirect()->route('login')->withErrors([
                'login' => 'Google sign-in is not yet configured with API credentials. Please contact the administrator.',
            ]);
        }

        try {
            return Socialite::driver('google')->redirect();
        } catch (\Throwable $e) {
            Log::error('Google OAuth redirect error: '.$e->getMessage());

            return redirect()->route('login')->withErrors([
                'login' => 'Unable to connect to Google authentication service. Please try again.',
            ]);
        }
    }

    /**
     * Handle the Google OAuth callback.
     */
    public function handleGoogleCallback(): RedirectResponse
    {
        if (empty(config('services.google.client_id')) || empty(config('services.google.client_secret'))) {
            return redirect()->route('login')->withErrors([
                'login' => 'Google authentication credentials are not configured.',
            ]);
        }

        try {
            $googleUser = Socialite::driver('google')->user();
        } catch (\Throwable $e) {
            Log::error('Google OAuth callback error: '.$e->getMessage());

            return redirect()->route('login')->withErrors([
                'login' => 'Google sign-in failed or was cancelled. Please try again or use your password.',
            ]);
        }

        if (! $googleUser || ! $googleUser->getEmail()) {
            return redirect()->route('login')->withErrors([
                'login' => 'Unable to retrieve your email address from Google. Please try another sign-in method.',
            ]);
        }

        // Find existing user by google_id or by email
        $user = User::where('google_id', $googleUser->getId())->first()
            ?? User::where('email', $googleUser->getEmail())->first();

        if ($user) {
            // Link google_id and avatar if not already set
            $updateData = [];
            if (! $user->google_id) {
                $updateData['google_id'] = $googleUser->getId();
            }
            if (! $user->google_avatar && $googleUser->getAvatar()) {
                $updateData['google_avatar'] = $googleUser->getAvatar();
            }
            if ($user->email_verified_at === null) {
                $updateData['email_verified_at'] = now();
            }
            if (! empty($updateData)) {
                $user->update($updateData);
            }

            // Inactive account check
            if ($user->isInactive()) {
                return redirect()->route('login')->withErrors([
                    'login' => 'Your account is deactivated. Please contact your instructor or administrator.',
                ]);
            }

            // Pending approval check
            if ($user->isStudent() && $user->isPending()) {
                request()->session()->put('pending_approval_user_id', $user->id);

                return redirect()->route('approval.pending');
            }

            // Log the user in
            Auth::login($user, true);
            request()->session()->regenerate();
            ActivityLog::record('login', 'User signed in via Google OAuth', $user->id, User::class, $user->id);

            return $user->isAdmin()
                ? redirect()->intended(route('admin.dashboard'))->with('success', "Welcome back, {$user->name}!")
                : redirect()->intended(route('student.dashboard'))->with('success', "Welcome back, {$user->name}!");
        }

        // --- New user via Google: register as a pending student ---
        $allowRegistration = SystemSetting::get('allow_registration', '1') === '1';
        if (! $allowRegistration) {
            return redirect()->route('login')->withErrors([
                'login' => 'Student registration is currently closed. Please contact administration.',
            ]);
        }

        $rawName = trim($googleUser->getName() ?? '');
        if ($rawName === '') {
            $rawName = explode('@', $googleUser->getEmail())[0];
        }

        $nameParts = explode(' ', $rawName, 2);
        $firstName = $nameParts[0] ?? $rawName;
        $lastName = $nameParts[1] ?? 'Student';

        // Generate a provisional student ID
        $provisionalStudentNumber = 'CRT-'.date('Y').'-'.str_pad((string) random_int(1000, 9999), 4, '0', STR_PAD_LEFT);
        while (User::where('student_number', $provisionalStudentNumber)->exists()) {
            $provisionalStudentNumber = 'CRT-'.date('Y').'-'.str_pad((string) random_int(1000, 9999), 4, '0', STR_PAD_LEFT);
        }

        $user = User::create([
            'student_number' => $provisionalStudentNumber,
            'first_name' => $firstName,
            'last_name' => $lastName,
            'name' => $rawName,
            'email' => $googleUser->getEmail(),
            'google_id' => $googleUser->getId(),
            'google_avatar' => $googleUser->getAvatar(),
            'password' => null, // Google-auth users do not require initial password
            'role' => 'student',
            'status' => 'pending',
            'email_verified_at' => now(), // Google already verified their email address
        ]);

        ActivityLog::record('register', "Student {$user->name} registered via Google (ID: {$user->student_number}, awaiting approval)", $user->id, User::class, $user->id);

        // Notify all admins and teachers
        $admins = User::whereIn('role', ['admin', 'teacher'])->get();
        foreach ($admins as $admin) {
            SystemNotification::create([
                'user_id' => $admin->id,
                'title' => 'New Student Awaiting Approval',
                'message' => "Student {$user->name} ({$user->student_number}) registered via Google sign-in and is waiting for account approval.",
                'type' => 'student',
                'link' => '/admin/students?status=pending',
            ]);
        }

        request()->session()->put('pending_approval_user_id', $user->id);

        return redirect()->route('approval.pending')->with('success', 'Account created with Google! Your student account is now awaiting teacher approval.');
    }
}
