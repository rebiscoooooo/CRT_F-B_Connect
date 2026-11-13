<?php

namespace Tests\Feature;

use Illuminate\Contracts\Foundation\ExceptionRenderer;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Route;
use Spatie\FlareClient\Flare;
use Spatie\LaravelIgnition\Renderers\IgnitionExceptionRenderer;
use Tests\TestCase;

class IgnitionFlareTest extends TestCase
{
    public function test_ignition_renderer_is_registered(): void
    {
        $renderer = app(ExceptionRenderer::class);

        $this->assertInstanceOf(IgnitionExceptionRenderer::class, $renderer);
    }

    public function test_flare_is_bound_in_container(): void
    {
        $this->assertTrue(app()->bound(Flare::class));

        $flare = app(Flare::class);
        $this->assertInstanceOf(Flare::class, $flare);
    }

    public function test_flare_log_channel_is_available(): void
    {
        $logger = Log::channel('flare');

        $this->assertNotNull($logger);
    }

    public function test_ignition_renders_error_page_on_unhandled_exception(): void
    {
        config(['app.debug' => true]);

        Route::get('/_test-ignition-exception', function () {
            throw new \RuntimeException('Ignition test explosion');
        });

        $response = $this->get('/_test-ignition-exception');

        $response->assertStatus(500);
        $this->assertStringContainsString('Ignition test explosion', $response->getContent());
    }
}
