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
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class AuthController extends Controller
{
    public function showLogin(): Response|RedirectResponse
    {
        if (Auth::check()) {
            $user = Auth::user();

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
            RateLimiter::clear($throttleKey);
            $request->session()->regenerate();

            /** @var User $user */
            $user = Auth::user();

            if (! $user->isActive()) {
                Auth::logout();
                $request->session()->invalidate();
                $request->session()->regenerateToken();

                throw ValidationException::withMessages([
                    'login' => 'Your account is deactivated. Please contact your instructor.',
                ]);
            }

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
            return Auth::user()->isAdmin()
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
            'status' => 'active',
            'email_verified_at' => now(),
        ]);

        Auth::login($user);
        $request->session()->regenerate();

        ActivityLog::record('register', "Student {$user->name} registered with ID {$user->student_number}", $user->id, User::class, $user->id);

        SystemNotification::create([
            'user_id' => $user->id,
            'title' => 'Welcome to CRT F&B Connect!',
            'message' => 'Your student account has been successfully created. Explore educational modules and video lessons.',
            'type' => 'account',
            'link' => '/student/dashboard',
        ]);

        return redirect()->route('student.dashboard')->with('success', 'Your student account has been registered successfully!');
    }

    public function logout(Request $request): RedirectResponse
    {
        $userId = Auth::id();
        if ($userId) {
            ActivityLog::record('logout', 'User logged out', $userId);
        }

        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route('login')->with('info', 'You have been logged out safely.');
    }
}
