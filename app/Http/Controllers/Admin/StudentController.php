<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;

class StudentController extends Controller
{
    public function index(Request $request): Response
    {
        $search = $request->input('search');
        $status = $request->input('status');
        $sortBy = $request->input('sort', 'latest');

        $query = User::where('role', 'student');

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('student_number', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('contact_number', 'like', "%{$search}%");
            });
        }

        if ($status) {
            $query->where('status', $status);
        }

        match ($sortBy) {
            'oldest' => $query->orderBy('created_at', 'asc'),
            'name' => $query->orderBy('last_name', 'asc'),
            'student_number' => $query->orderBy('student_number', 'asc'),
            default => $query->orderBy('created_at', 'desc'),
        };

        $students = $query->paginate(10)->withQueryString();

        $stats = [
            'total' => User::where('role', 'student')->count(),
            'active' => User::where('role', 'student')->where('status', 'active')->count(),
            'inactive' => User::where('role', 'student')->where('status', 'inactive')->count(),
        ];

        return Inertia::render('Admin/Students/Index', [
            'students' => $students,
            'filters' => [
                'search' => $search,
                'status' => $status,
                'sort' => $sortBy,
            ],
            'stats' => $stats,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'student_number' => ['required', 'string', 'max:50', 'unique:users,student_number'],
            'first_name' => ['required', 'string', 'max:100'],
            'middle_name' => ['nullable', 'string', 'max:100'],
            'last_name' => ['required', 'string', 'max:100'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email'],
            'contact_number' => ['nullable', 'string', 'max:30'],
            'password' => ['required', 'string', 'min:8'],
            'status' => ['required', 'in:active,inactive'],
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
            'status' => $validated['status'],
            'email_verified_at' => now(),
        ]);

        ActivityLog::record('created', "Added student account for {$user->name} ({$user->student_number})", Auth::id(), User::class, $user->id);

        return back()->with('success', "Student {$user->name} registered successfully!");
    }

    public function show(User $user): Response
    {
        if (! $user->isStudent()) {
            abort(404);
        }

        $activities = ActivityLog::where('user_id', $user->id)
            ->orderBy('created_at', 'desc')
            ->take(15)
            ->get();

        return Inertia::render('Admin/Students/Show', [
            'student' => $user,
            'activities' => $activities,
        ]);
    }

    public function update(Request $request, User $user): RedirectResponse
    {
        if (! $user->isStudent()) {
            abort(403);
        }

        $validated = $request->validate([
            'student_number' => ['required', 'string', 'max:50', 'unique:users,student_number,'.$user->id],
            'first_name' => ['required', 'string', 'max:100'],
            'middle_name' => ['nullable', 'string', 'max:100'],
            'last_name' => ['required', 'string', 'max:100'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email,'.$user->id],
            'contact_number' => ['nullable', 'string', 'max:30'],
            'status' => ['required', 'in:active,inactive'],
            'password' => ['nullable', 'string', 'min:8'],
        ]);

        $fullName = trim($validated['first_name'].' '.($validated['middle_name'] ? $validated['middle_name'].' ' : '').$validated['last_name']);

        $updateData = [
            'student_number' => $validated['student_number'],
            'first_name' => $validated['first_name'],
            'middle_name' => $validated['middle_name'] ?? null,
            'last_name' => $validated['last_name'],
            'name' => $fullName,
            'email' => $validated['email'],
            'contact_number' => $validated['contact_number'] ?? null,
            'status' => $validated['status'],
        ];

        if (! empty($validated['password'])) {
            $updateData['password'] = Hash::make($validated['password']);
        }

        $user->update($updateData);

        ActivityLog::record('updated', "Updated student record for {$user->name}", Auth::id(), User::class, $user->id);

        return back()->with('success', 'Student record updated successfully.');
    }

    public function toggleStatus(User $user): RedirectResponse
    {
        if (! $user->isStudent()) {
            abort(403);
        }

        $newStatus = $user->status === 'active' ? 'inactive' : 'active';
        $user->update(['status' => $newStatus]);

        ActivityLog::record('updated', "Set student status for {$user->name} to {$newStatus}", Auth::id(), User::class, $user->id);

        return back()->with('success', "Student {$user->name} is now {$newStatus}.");
    }

    public function destroy(User $user): RedirectResponse
    {
        if (! $user->isStudent()) {
            abort(403);
        }

        $name = $user->name;
        $studentNumber = $user->student_number;

        $user->delete();

        ActivityLog::record('deleted', "Deleted student account {$name} ({$studentNumber})", Auth::id());

        return redirect()->route('admin.students.index')->with('success', "Student {$name} removed successfully.");
    }

    public function export(): StreamedResponse
    {
        ActivityLog::record('export', 'Exported student records CSV', Auth::id());

        $fileName = 'CRT_Students_'.date('Y-m-d_His').'.csv';

        $students = User::where('role', 'student')
            ->orderBy('student_number')
            ->get();

        $headers = [
            'Content-Type' => 'text/csv; charset=UTF-8',
            'Content-Disposition' => "attachment; filename=\"{$fileName}\"",
        ];

        return response()->stream(function () use ($students) {
            $handle = fopen('php://output', 'w');
            // UTF-8 BOM for Excel compatibility
            fprintf($handle, chr(0xEF).chr(0xBB).chr(0xBF));

            fputcsv($handle, [
                'Student Number',
                'Full Name',
                'First Name',
                'Middle Name',
                'Last Name',
                'Email Address',
                'Contact Number',
                'Account Status',
                'Registration Date',
            ]);

            foreach ($students as $student) {
                fputcsv($handle, [
                    $student->student_number,
                    $student->name,
                    $student->first_name,
                    $student->middle_name ?? '',
                    $student->last_name,
                    $student->email,
                    $student->contact_number ?? '',
                    ucfirst($student->status),
                    $student->created_at->format('Y-m-d H:i'),
                ]);
            }

            fclose($handle);
        }, 200, $headers);
    }
}
