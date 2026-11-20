<?php

namespace App\Http\Controllers;

use App\Mail\StudentOtpVerificationMail;
use App\Models\ActivityLog;
use App\Models\SystemNotification;
use App\Models\SystemSetting;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\Response as SymfonyResponse;

class AuthController extends Controller
{
    public function showLogin(): Response|RedirectResponse
    {
        if (Auth::check()) {
            /** @var User $user */
            $user = Auth::user();

            if ($user->isStudent() && $user->isPending()) {
                return redirect()->route('approval.pending');
            }

            return $user->isAdmin()
                ? redirect()->route('admin.dashboard')
                : redirect()->route('student.dashboard');
        }

        return Inertia::render('Auth/Login');
    }

    public function login(Request $request): RedirectResponse
    {
        $request->validate([
            'login' => ['required', 'string'],
            'password' => ['required', 'string'],
            'remember' => ['nullable', 'boolean'],
        ]);

        $throttleKey = Str::transliterate(Str::lower($request->input('login')).'|'.$request->ip());

        if (RateLimiter::tooManyAttempts($throttleKey, 5)) {
            $seconds = RateLimiter::availableIn($throttleKey);
            throw ValidationException::withMessages([
                'login' => trans('auth.throttle', [
                    'seconds' => $seconds,
                    'minutes' => ceil($seconds / 60),
                ]),
            ]);
        }

        $loginInput = $request->input('login');
        $field = filter_var($loginInput, FILTER_VALIDATE_EMAIL) ? 'email' : 'student_number';

        $credentials = [
            $field => $loginInput,
            'password' => $request->input('password'),
        ];

        if (Auth::attempt($credentials, (bool) $request->input('remember'))) {
            /** @var User $user */
            $user = Auth::user();

            // 1. Email OTP verification check for students
            if ($user->isStudent() && $user->email_verified_at === null) {
                $otp = str_pad((string) random_int(100000, 999999), 6, '0', STR_PAD_LEFT);
                $user->update([
                    'otp_code' => $otp,
                    'otp_expires_at' => now()->addMinutes(10),
                ]);

                try {
                    Mail::to($user->email)->send(new StudentOtpVerificationMail($user, $otp));
                } catch (\Throwable $e) {
                    Log::warning('Failed sending login verification OTP: '.$e->getMessage());
                }

                $userId = $user->id;
                Auth::logout();
                $request->session()->invalidate();
                $request->session()->regenerateToken();
                $request->session()->put('pending_user_id', $userId);

                return redirect()->route('verification.otp')->with('info', "Please verify your email address. A 6-digit verification code has been sent to {$user->email}.");
            }

            // 2. Teacher/Admin Approval check for students
            if ($user->isStudent() && $user->isPending()) {
                $userId = $user->id;
                Auth::logout();
                $request->session()->invalidate();
                $request->session()->regenerateToken();
                $request->session()->put('pending_approval_user_id', $userId);

                return redirect()->route('approval.pending');
            }

            // 3. Deactivated check
            if (! $user->isActive()) {
                Auth::logout();
                $request->session()->invalidate();
                $request->session()->regenerateToken();

                throw ValidationException::withMessages([
                    'login' => 'Your account is deactivated. Please contact your instructor or administrator.',
                ]);
            }

            RateLimiter::clear($throttleKey);
            $request->session()->regenerate();

            ActivityLog::record('login', 'User logged in to the LMS', $user->id, User::class, $user->id);

            if ($user->isAdmin()) {
                return redirect()->intended(route('admin.dashboard'))->with('success', "Welcome back, {$user->name}!");
            }

            return redirect()->intended(route('student.dashboard'))->with('success', "Welcome back, {$user->name}!");
        }

        RateLimiter::hit($throttleKey);

        throw ValidationException::withMessages([
            'login' => 'The provided credentials do not match our records.',
        ]);
    }

    public function showRegister(): Response|RedirectResponse
    {
        if (Auth::check()) {
            /** @var User $user */
            $user = Auth::user();

            if ($user->isStudent() && $user->isPending()) {
                return redirect()->route('approval.pending');
            }

            return $user->isAdmin()
                ? redirect()->route('admin.dashboard')
                : redirect()->route('student.dashboard');
        }

        $allowRegistration = SystemSetting::get('allow_registration', '1') === '1';

        return Inertia::render('Auth/Register', [
            'allowRegistration' => $allowRegistration,
        ]);
    }

    public function register(Request $request): RedirectResponse
    {
        $allowRegistration = SystemSetting::get('allow_registration', '1') === '1';
        if (! $allowRegistration) {
            return back()->with('error', 'Student registration is currently closed. Please contact administration.');
        }

        $email = strtolower(trim((string) $request->input('email')));
        $existingUser = $email !== '' ? User::whereRaw('LOWER(email) = ?', [$email])->first() : null;

        // Rule: If user is already registered in the system, don't overwrite entry;
        // instead, sign in their account using the email registered if credentials match.
        if ($existingUser && $request->filled('password')) {
            if ($existingUser->password && Hash::check((string) $request->input('password'), $existingUser->password)) {
                // If inactive
                if (! $existingUser->isActive()) {
                    if ($existingUser->isStudent() && $existingUser->isPending()) {
                        $request->session()->put('pending_approval_user_id', $existingUser->id);

                        return redirect()->route('approval.pending')->with('info', "Account recognized for {$existingUser->email}. Your registration is currently awaiting instructor approval.");
                    }

                    throw ValidationException::withMessages([
                        'email' => 'Your account is deactivated. Please contact your instructor or administrator.',
                    ]);
                }

                // Check email verification for students
                if ($existingUser->isStudent() && $existingUser->email_verified_at === null) {
                    $otp = str_pad((string) random_int(100000, 999999), 6, '0', STR_PAD_LEFT);
                    $existingUser->update([
                        'otp_code' => $otp,
                        'otp_expires_at' => now()->addMinutes(10),
                    ]);

                    try {
                        Mail::to($existingUser->email)->send(new StudentOtpVerificationMail($existingUser, $otp));
                    } catch (\Throwable $e) {
                        Log::warning('Failed sending OTP email during registered sign-in: '.$e->getMessage());
                    }

                    $request->session()->put('pending_user_id', $existingUser->id);

                    return redirect()->route('verification.otp')->with('info', "Account already registered. Please verify your email with the 6-digit code sent to {$existingUser->email}.");
                }

                // Credentials match! Sign them in directly to their existing account without overwriting entry
                Auth::login($existingUser, true);
                $request->session()->regenerate();
                ActivityLog::record('login', 'User signed into existing registered account via registration form', $existingUser->id, User::class, $existingUser->id);

                return $existingUser->isAdmin()
                    ? redirect()->intended(route('admin.dashboard'))->with('success', "Account already exists! Signed in successfully as {$existingUser->name}.")
                    : redirect()->intended(route('student.dashboard'))->with('success', "Account already exists! Signed in successfully as {$existingUser->name}.");
            }
        }

        $validated = $request->validate([
            'student_number' => ['required', 'string', 'max:50', 'unique:users,student_number'],
            'first_name' => ['required', 'string', 'max:100'],
            'middle_name' => ['nullable', 'string', 'max:100'],
            'last_name' => ['required', 'string', 'max:100'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email'],
            'contact_number' => ['nullable', 'string', 'max:30'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
            'terms' => ['accepted'],
        ], [
            'terms.accepted' => 'You must agree to the Terms of Service and Privacy Policy to register.',
        ]);

        $fullName = trim($validated['first_name'].' '.($validated['middle_name'] ? $validated['middle_name'].' ' : '').$validated['last_name']);

        $otp = str_pad((string) random_int(100000, 999999), 6, '0', STR_PAD_LEFT);

        $user = User::create([
            'student_number' => $validated['student_number'],
            'first_name' => $validated['first_name'],
            'middle_name' => $validated['middle_name'] ?? null,
            'last_name' => $validated['last_name'],
            'name' => $fullName,
            'email' => $validated['email'],
            'contact_number' => $validated['contact_number'] ?? null,
            'password' => Hash::make($validated['password']),
            'role' => 'student',
            'status' => 'pending',
            'email_verified_at' => null,
            'otp_code' => $otp,
            'otp_expires_at' => now()->addMinutes(10),
        ]);

        try {
            Mail::to($user->email)->send(new StudentOtpVerificationMail($user, $otp));
        } catch (\Throwable $e) {
            Log::warning('Failed sending OTP email during registration: '.$e->getMessage());
        }

        ActivityLog::record('register', "Student {$user->name} registered with ID {$user->student_number} (Awaiting OTP verification & teacher approval)", $user->id, User::class, $user->id);

        $request->session()->put('pending_user_id', $user->id);

        return redirect()->route('verification.otp')->with('success', 'Registration submitted! Please enter the 6-digit verification code sent to your email.');
    }

    public function showVerifyOtp(Request $request): Response|RedirectResponse
    {
        $userId = $request->session()->get('pending_user_id');

        if (! $userId && Auth::check() && Auth::user()->isStudent() && Auth::user()->email_verified_at === null) {
            $userId = Auth::id();
        }

        if (! $userId) {
            return redirect()->route('login');
        }

        $user = User::find($userId);

        if (! $user) {
            $request->session()->forget('pending_user_id');

            return redirect()->route('login');
        }

        if ($user->email_verified_at !== null) {
            if ($user->isPending()) {
                $request->session()->put('pending_approval_user_id', $user->id);

                return redirect()->route('approval.pending');
            }

            return redirect()->route('login');
        }

        return Inertia::render('Auth/VerifyOtp', [
            'email' => $user->email,
            'studentNumber' => $user->student_number,
            'expiresAt' => $user->otp_expires_at?->toISOString(),
        ]);
    }

    public function verifyOtp(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'code' => ['required', 'string', 'size:6'],
        ], [
            'code.required' => 'Please enter the 6-digit verification code.',
            'code.size' => 'The verification code must be exactly 6 digits.',
        ]);

        $userId = $request->session()->get('pending_user_id');

        if (! $userId && Auth::check()) {
            $userId = Auth::id();
        }

        if (! $userId) {
            return redirect()->route('login')->withErrors([
                'login' => 'Session expired. Please sign in again.',
            ]);
        }

        $user = User::find($userId);

        if (! $user) {
            return redirect()->route('login');
        }

        if ($user->otp_expires_at && $user->otp_expires_at->isPast()) {
            throw ValidationException::withMessages([
                'code' => 'The verification code has expired. Please click "Resend Code" to receive a new one.',
            ]);
        }

        if ((string) $user->otp_code !== (string) $validated['code']) {
            throw ValidationException::withMessages([
                'code' => 'The 6-digit verification code you entered is incorrect.',
            ]);
        }

        $user->update([
            'email_verified_at' => now(),
            'otp_code' => null,
            'otp_expires_at' => null,
        ]);

        ActivityLog::record('verified', "Student {$user->name} verified email address", $user->id, User::class, $user->id);

        // Notify faculty and administrators that a verified student is awaiting approval
        $admins = User::whereIn('role', ['admin', 'teacher'])->get();
        foreach ($admins as $admin) {
            SystemNotification::create([
                'user_id' => $admin->id,
                'title' => 'New Student Awaiting Approval',
                'message' => "Student {$user->name} ({$user->student_number}) verified their email and is waiting for account approval.",
                'type' => 'student',
                'link' => '/admin/students?status=pending',
            ]);
        }

        $request->session()->forget('pending_user_id');
        $request->session()->put('pending_approval_user_id', $user->id);

        return redirect()->route('approval.pending')->with('success', 'Email verified successfully! Your account is now awaiting teacher approval.');
    }

    public function resendOtp(Request $request): RedirectResponse
    {
        $userId = $request->session()->get('pending_user_id');

        if (! $userId && Auth::check()) {
            $userId = Auth::id();
        }

        if (! $userId) {
            return redirect()->route('login');
        }

        $user = User::find($userId);

        if (! $user) {
            return redirect()->route('login');
        }

        $throttleKey = 'resend-otp|'.$user->id;
        if (RateLimiter::tooManyAttempts($throttleKey, 1)) {
            $seconds = RateLimiter::availableIn($throttleKey);

            return back()->with('error', "Please wait {$seconds} seconds before requesting another verification code.");
        }
        RateLimiter::hit($throttleKey, 60);

        $otp = str_pad((string) random_int(100000, 999999), 6, '0', STR_PAD_LEFT);
        $user->update([
            'otp_code' => $otp,
            'otp_expires_at' => now()->addMinutes(10),
        ]);

        try {
            Mail::to($user->email)->send(new StudentOtpVerificationMail($user, $otp));
        } catch (\Throwable $e) {
            Log::warning('Failed resending OTP email: '.$e->getMessage());
        }

        return back()->with('success', "A new 6-digit verification code has been sent to {$user->email}.");
    }

    public function showApprovalPending(Request $request): Response|RedirectResponse
    {
        $userId = $request->session()->get('pending_approval_user_id') ?? $request->session()->get('pending_user_id');

        if (! $userId && Auth::check()) {
            $userId = Auth::id();
        }

        if (! $userId) {
            return redirect()->route('login');
        }

        $user = User::find($userId);

        if (! $user) {
            $request->session()->forget(['pending_approval_user_id', 'pending_user_id']);

            return redirect()->route('login');
        }

        if ($user->isActive()) {
            $request->session()->forget(['pending_approval_user_id', 'pending_user_id']);

            return redirect()->route('login')->with('success', 'Great news! Your account has been approved by your teacher. You may now sign in.');
        }

        return Inertia::render('Auth/ApprovalPending', [
            'student' => [
                'name' => $user->name,
                'student_number' => $user->student_number,
                'email' => $user->email,
                'status' => $user->status,
                'email_verified' => $user->email_verified_at !== null,
                'registered_at' => $user->created_at->format('M d, Y h:i A'),
            ],
        ]);
    }

    public function logout(Request $request): SymfonyResponse|RedirectResponse
    {
        $userId = Auth::id();
        if ($userId) {
            ActivityLog::record('logout', 'User logged out', $userId);
        }

        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        $response = $request->inertia()
            ? Inertia::location(route('login'))
            : redirect()->route('login')->with('info', 'You have been logged out safely.');

        $response->headers->set('Clear-Site-Data', '"cache"');
        $response->headers->set('Cache-Control', 'no-cache, no-store, max-age=0, must-revalidate');
        $response->headers->set('Pragma', 'no-cache');
        $response->headers->set('Expires', 'Sun, 02 Jan 1990 00:00:00 GMT');

        return $response;
    }
}
