<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserRole
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        $user = $request->user();

        if (! $user) {
            return redirect()->route('login');
        }

        // 'admin' param matches admin and teacher
        if (in_array('admin', $roles, true) && $user->isAdmin()) {
            return $next($request);
        }

        if (in_array($user->role, $roles, true)) {
            return $next($request);
        }

        // If a student tries to access admin routes, redirect to student dashboard
        if ($user->isStudent() && in_array('admin', $roles, true)) {
            return redirect()->route('student.dashboard')->with('error', 'You do not have administrative privileges.');
        }

        // If an admin accesses student routes, allow them or handle gracefully
        if ($user->isAdmin() && in_array('student', $roles, true)) {
            return $next($request);
        }

        abort(403, 'Unauthorized access.');
    }
}
