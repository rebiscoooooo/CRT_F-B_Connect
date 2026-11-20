<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Mail\StaffAccountRegisteredMail;
use App\Models\ActivityLog;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;
use Inertia\Response;

class TeacherController extends Controller
{
    /**
     * Display a listing of teachers and administrators.
     */
    public function index(Request $request): Response
    {
        $search = $request->input('search');
        $role = $request->input('role');
        $status = $request->input('status');
        $sortBy = $request->input('sort', 'latest');

        $query = User::whereIn('role', ['admin', 'teacher'])
            ->withCount('resources');

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('contact_number', 'like', "%{$search}%");
            });
        }

        if ($role && in_array($role, ['admin', 'teacher'], true)) {
            $query->where('role', $role);
        }

        if ($status && in_array($status, ['active', 'inactive'], true)) {
            $query->where('status', $status);
        }

        match ($sortBy) {
            'oldest' => $query->orderBy('created_at', 'asc'),
            'name' => $query->orderBy('last_name', 'asc'),
            'resources' => $query->orderBy('resources_count', 'desc'),
            default => $query->orderBy('created_at', 'desc'),
        };

        $teachers = $query->paginate(12)->withQueryString();

        $stats = [
            'total_staff' => User::whereIn('role', ['admin', 'teacher'])->count(),
            'admin_count' => User::where('role', 'admin')->count(),
            'teacher_count' => User::where('role', 'teacher')->count(),
            'active_count' => User::whereIn('role', ['admin', 'teacher'])->where('status', 'active')->count(),
        ];

        return Inertia::render('Admin/Teachers/Index', [
            'teachers' => $teachers,
            'filters' => [
                'search' => $search,
                'role' => $role,
                'status' => $status,
                'sort' => $sortBy,
            ],
            'stats' => $stats,
        ]);
    }

    /**
     * Store a newly created teacher or administrator.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'first_name' => ['required', 'string', 'max:100'],
            'middle_name' => ['nullable', 'string', 'max:100'],
            'last_name' => ['required', 'string', 'max:100'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email'],
            'contact_number' => ['nullable', 'string', 'max:30'],
            'role' => ['required', 'in:admin,teacher'],
            'password' => ['required', 'string', 'min:8'],
            'status' => ['required', 'in:active,inactive'],
        ]);

        $fullName = trim($validated['first_name'].' '.($validated['middle_name'] ? $validated['middle_name'].' ' : '').$validated['last_name']);

        $user = User::create([
            'first_name' => $validated['first_name'],
            'middle_name' => $validated['middle_name'] ?? null,
            'last_name' => $validated['last_name'],
            'name' => $fullName,
            'email' => $validated['email'],
            'contact_number' => $validated['contact_number'] ?? null,
            'password' => Hash::make($validated['password']),
            'role' => $validated['role'],
            'status' => $validated['status'],
            'email_verified_at' => now(),
        ]);

        $roleTitle = $user->role === 'admin' ? 'Administrator' : 'Teacher / Instructor';

        try {
            Mail::to($user->email)->send(new StaffAccountRegisteredMail($user, $validated['password'], Auth::user()));
        } catch (\Throwable $e) {
            Log::warning("Failed sending staff registration email to {$user->email}: ".$e->getMessage());
        }

        ActivityLog::record(
            'created',
            "Added {$roleTitle} account for {$user->name} ({$user->email})",
            Auth::id(),
            User::class,
            $user->id
        );

        return back()->with('success', "{$roleTitle} \"{$user->name}\" registered successfully! Login credentials have been emailed to {$user->email}.");
    }

    /**
     * Update an existing teacher or administrator.
     */
    public function update(Request $request, User $user): RedirectResponse
    {
        if (! $user->isAdmin()) {
            abort(404, 'User is not an administrator or teacher.');
        }

        $validated = $request->validate([
            'first_name' => ['required', 'string', 'max:100'],
            'middle_name' => ['nullable', 'string', 'max:100'],
            'last_name' => ['required', 'string', 'max:100'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email,'.$user->id],
            'contact_number' => ['nullable', 'string', 'max:30'],
            'role' => ['required', 'in:admin,teacher'],
            'status' => ['required', 'in:active,inactive'],
            'password' => ['nullable', 'string', 'min:8'],
        ]);

        // Prevent self-deactivation
        if ($user->id === Auth::id() && $validated['status'] === 'inactive') {
            return back()->with('error', 'You cannot deactivate your own account.');
        }

        $fullName = trim($validated['first_name'].' '.($validated['middle_name'] ? $validated['middle_name'].' ' : '').$validated['last_name']);

        $data = [
            'first_name' => $validated['first_name'],
            'middle_name' => $validated['middle_name'] ?? null,
            'last_name' => $validated['last_name'],
            'name' => $fullName,
            'email' => $validated['email'],
            'contact_number' => $validated['contact_number'] ?? null,
            'role' => $validated['role'],
            'status' => $validated['status'],
        ];

        if (! empty($validated['password'])) {
            $data['password'] = Hash::make($validated['password']);
        }

        $user->update($data);

        ActivityLog::record(
            'updated',
            "Updated staff profile for {$user->name} ({$user->email})",
            Auth::id(),
            User::class,
            $user->id
        );

        return back()->with('success', "Staff account for \"{$user->name}\" updated successfully!");
    }

    /**
     * Toggle active/inactive status.
     */
    public function toggleStatus(User $user): RedirectResponse
    {
        if (! $user->isAdmin()) {
            abort(404);
        }

        if ($user->id === Auth::id()) {
            return back()->with('error', 'You cannot change the status of your own account.');
        }

        $newStatus = $user->status === 'active' ? 'inactive' : 'active';
        $user->update(['status' => $newStatus]);

        ActivityLog::record(
            'status_changed',
            "Changed account status of {$user->name} to {$newStatus}",
            Auth::id(),
            User::class,
            $user->id
        );

        return back()->with('success', "Account status for {$user->name} updated to {$newStatus}.");
    }

    /**
     * Delete a teacher or administrator.
     */
    public function destroy(User $user): RedirectResponse
    {
        if (! $user->isAdmin()) {
            abort(404);
        }

        if ($user->id === Auth::id()) {
            return back()->with('error', 'You cannot delete your own administrator account.');
        }

        $userName = $user->name;
        $userEmail = $user->email;

        ActivityLog::record(
            'deleted',
            "Deleted staff account for {$userName} ({$userEmail})",
            Auth::id(),
            User::class,
            $user->id
        );

        $user->delete();

        return back()->with('success', "Staff account for \"{$userName}\" has been removed.");
    }
}
