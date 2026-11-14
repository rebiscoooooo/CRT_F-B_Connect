<?php

use App\Http\Middleware\EnsureUserIsActive;
use App\Http\Middleware\EnsureUserRole;
use App\Http\Middleware\HandleInertiaRequests;
use App\Http\Middleware\PreventBackHistory;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Exceptions\PostTooLargeException;
use Illuminate\Http\Request;
use Spatie\FlareClient\Flare;
use Spatie\LaravelIgnition\Commands\TestCommand as FlareTestCommand;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withCommands([
        FlareTestCommand::class,
    ])
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->web(append: [
            HandleInertiaRequests::class,
            PreventBackHistory::class,
        ]);
        $middleware->alias([
            'role' => EnsureUserRole::class,
            'active' => EnsureUserIsActive::class,
        ]);
        $middleware->redirectGuestsTo(fn (Request $request) => route('login'));
        $middleware->redirectUsersTo(function (Request $request) {
            $user = $request->user();

            if (! $user) {
                return route('home');
            }

            if ($user->isAdmin()) {
                return route('admin.dashboard');
            }

            if ($user->isStudent()) {
                if ($user->isPending()) {
                    return route('approval.pending');
                }

                return route('student.dashboard');
            }

            return route('home');
        });
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        $exceptions->report(function (Throwable $e): void {
            if (app()->bound(Flare::class) && config('flare.key')) {
                app(Flare::class)->report($e);
            }
        });

        $exceptions->render(function (PostTooLargeException $e, Request $request) {
            if ($request->expectsJson()) {
                return response()->json([
                    'message' => 'The uploaded file exceeds the maximum allowed size (1GB).',
                ], 413);
            }

            return back()->with('error', 'The uploaded file exceeds the maximum allowed upload limit of 1GB.');
        });

        $exceptions->shouldRenderJsonWhen(
            fn (Request $request) => $request->is('api/*') || $request->expectsJson(),
        );
    })->create();
