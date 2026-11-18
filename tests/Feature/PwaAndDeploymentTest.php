<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PwaAndDeploymentTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test that root .htaccess exists and contains essential Hostinger rewrite directives.
     */
    public function test_root_htaccess_exists_and_routes_to_public(): void
    {
        $htaccessPath = base_path('.htaccess');
        $this->assertFileExists($htaccessPath);

        $content = file_get_contents($htaccessPath);
        $this->assertStringContainsString('RewriteEngine On', $content);
        $this->assertStringContainsString('RewriteRule ^(.*)$ public/$1 [L]', $content);
        $this->assertStringContainsString('\.env', $content);
    }

    /**
     * Test that web manifest is valid and has required PWA fields.
     */
    public function test_web_manifest_is_valid_pwa_configuration(): void
    {
        $manifestPath = public_path('manifest.json');
        $this->assertFileExists($manifestPath);

        $json = json_decode(file_get_contents($manifestPath), true);
        $this->assertIsArray($json);
        $this->assertEquals('CRT F&B Connect', $json['name']);
        $this->assertEquals('CRT F&B', $json['short_name']);
        $this->assertEquals('/', $json['start_url']);
        $this->assertEquals('standalone', $json['display']);
        $this->assertNotEmpty($json['icons']);

        // Check icon file existence
        foreach ($json['icons'] as $icon) {
            $relativePath = ltrim($icon['src'], '/');
            $this->assertFileExists(public_path($relativePath));
        }
    }

    /**
     * Test that service worker and offline fallback files exist.
     */
    public function test_service_worker_and_offline_page_exist(): void
    {
        $this->assertFileExists(public_path('sw.js'));
        $this->assertFileExists(public_path('offline.html'));
        $this->assertFileExists(public_path('apple-touch-icon.png'));

        $swContent = file_get_contents(public_path('sw.js'));
        $this->assertStringContainsString('addEventListener(\'install\'', $swContent);
        $this->assertStringContainsString('addEventListener(\'fetch\'', $swContent);
    }

    /**
     * Test that the landing page includes manifest and PWA meta tags.
     */
    public function test_landing_page_renders_pwa_meta_tags(): void
    {
        $response = $this->get('/');
        $response->assertStatus(200);
        $response->assertSee('manifest.json', false);
        $response->assertSee('theme-color', false);
        $response->assertSee('apple-touch-icon', false);
    }
}
