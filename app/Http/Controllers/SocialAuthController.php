<?php

namespace App\Http\Controllers;

use App\Models\ActivityLog;
use App\Models\SystemNotification;
use App\Models\SystemSetting;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Inertia\Response;
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

        // Find existing user by google_id or by email (case-insensitive)
        $googleEmail = strtolower(trim((string) $googleUser->getEmail()));
        $user = User::where('google_id', $googleUser->getId())->first()
            ?? User::whereRaw('LOWER(email) = ?', [$googleEmail])->first();

        if ($user) {
            // Rule: If user is already registered in the system, do NOT overwrite their entry.
            // Preserve their existing name, student number, role, profile picture, and password.
            // Only link google_id if not already set to enable Google OAuth for this registered account.
            $linkData = [];
            if (! $user->google_id) {
                $linkData['google_id'] = $googleUser->getId();
            }
            if ($user->email_verified_at === null) {
                $linkData['email_verified_at'] = now();
            }
            if (! empty($linkData)) {
                $user->update($linkData);
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

                return redirect()->route('approval.pending')->with('info', "Account recognized for {$user->email}. Your registration is currently awaiting instructor approval.");
            }

            // Log the user into their existing registered account
            Auth::login($user, true);
            request()->session()->regenerate();
            ActivityLog::record('login', 'User signed into existing registered account via Google OAuth', $user->id, User::class, $user->id);

            return $user->isAdmin()
                ? redirect()->intended(route('admin.dashboard'))->with('success', "Signed in to your existing account ({$user->email}). Welcome back, {$user->name}!")
                : redirect()->intended(route('student.dashboard'))->with('success', "Signed in to your existing account ({$user->email}). Welcome back, {$user->name}!");
        }

        // --- New user via Google: complete profile before submitting for approval ---
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
        $lastName = $nameParts[1] ?? '';

        request()->session()->put('google_signup_profile', [
            'google_id' => $googleUser->getId(),
            'email' => $googleUser->getEmail(),
            'name' => $rawName,
            'first_name' => $firstName,
            'last_name' => $lastName,
            'avatar' => $googleUser->getAvatar(),
        ]);

        return redirect()->route('auth.google.complete');
    }

    /**
     * Show profile completion form for a new Google user.
     */
    public function showCompleteProfile(Request $request): Response|RedirectResponse
    {
        $googleProfile = $request->session()->get('google_signup_profile');

        if (! $googleProfile) {
            return redirect()->route('register')->with('info', 'Please click "Continue with Google" to complete your registration.');
        }

        return Inertia::render('Auth/CompleteGoogleProfile', [
            'googleProfile' => $googleProfile,
        ]);
    }

    /**
     * Finalize profile completion and create student account for approval.
     */
    public function completeProfile(Request $request): RedirectResponse
    {
        $googleProfile = $request->session()->get('google_signup_profile');

        if (! $googleProfile) {
            return redirect()->route('register')->withErrors([
                'login' => 'Your Google session has expired. Please sign up with Google again.',
            ]);
        }

        $validated = $request->validate([
            'student_number' => ['required', 'string', 'max:50', 'unique:users,student_number'],
            'first_name' => ['required', 'string', 'max:100'],
            'middle_name' => ['nullable', 'string', 'max:100'],
            'last_name' => ['required', 'string', 'max:100'],
            'contact_number' => ['nullable', 'string', 'max:30'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
            'terms' => ['accepted'],
        ], [
            'terms.accepted' => 'You must agree to the Terms of Service and student conduct policies.',
        ]);

        // Safety check if email was registered concurrently
        if (User::where('email', $googleProfile['email'])->exists()) {
            $request->session()->forget('google_signup_profile');

            return redirect()->route('login')->withErrors([
                'login' => 'An account with this email address is already registered. Please sign in.',
            ]);
        }

        $fullName = trim($validated['first_name'].' '.($validated['middle_name'] ? $validated['middle_name'].' ' : '').$validated['last_name']);

        $user = User::create([
            'student_number' => $validated['student_number'],
            'first_name' => $validated['first_name'],
            'middle_name' => $validated['middle_name'] ?? null,
            'last_name' => $validated['last_name'],
            'name' => $fullName,
            'email' => $googleProfile['email'],
            'contact_number' => $validated['contact_number'] ?? null,
            'password' => Hash::make($validated['password']),
            'google_id' => $googleProfile['google_id'],
            'google_avatar' => $googleProfile['avatar'] ?? null,
            'role' => 'student',
            'status' => 'pending',
            'email_verified_at' => now(), // Verified by Google
        ]);

        ActivityLog::record(
            'register',
            "Student {$user->name} registered with ID {$user->student_number} via Google (Profile completed, awaiting approval)",
            $user->id,
            User::class,
            $user->id
        );

        // Notify all admins and teachers
        $admins = User::whereIn('role', ['admin', 'teacher'])->get();
        foreach ($admins as $admin) {
            SystemNotification::create([
                'user_id' => $admin->id,
                'title' => 'New Student Awaiting Approval',
                'message' => "Student {$user->name} ({$user->student_number}) registered via Google with completed profile and is awaiting approval.",
                'type' => 'student',
                'link' => '/admin/students?status=pending',
            ]);
        }

        $request->session()->forget('google_signup_profile');
        $request->session()->put('pending_approval_user_id', $user->id);

        return redirect()->route('approval.pending')->with('success', 'Profile completed! Your student account is now awaiting teacher approval.');
    }

    /**
     * Cancel Google profile completion.
     */
    public function cancelGoogleProfile(Request $request): RedirectResponse
    {
        $request->session()->forget('google_signup_profile');

        return redirect()->route('register');
    }
}
