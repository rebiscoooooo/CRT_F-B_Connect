<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserIsActive
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if ($user && ! $user->isActive()) {
            $isPending = $user->isPending();
            $userId = $user->id;

            Auth::logout();
            $request->session()->invalidate();
            $request->session()->regenerateToken();

            if ($isPending) {
                $request->session()->put('pending_approval_user_id', $userId);

                return redirect()->route('approval.pending')->with('info', 'Your account is pending instructor approval.');
            }

            return redirect()->route('login')->withErrors([
                'login' => 'Your account has been deactivated. Please contact your instructor or administrator.',
            ]);
        }

        return $next($request);
    }
}
