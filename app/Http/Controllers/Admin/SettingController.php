<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use App\Models\SystemSetting;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class SettingController extends Controller
{
    public function index(): Response
    {
        $settings = [
            'site_name' => SystemSetting::get('site_name', 'CRT F&B Connect'),
            'institution' => SystemSetting::get('institution', 'College of Research & Technology'),
            'department_name' => SystemSetting::get('department_name', 'Food & Beverage Services Management'),
            'contact_email' => SystemSetting::get('contact_email', 'fnb.support@crt.edu.ph'),
            'contact_phone' => SystemSetting::get('contact_phone', '+63 (044) 463-0000'),
            'allow_registration' => SystemSetting::get('allow_registration', '1'),
            'system_announcement' => SystemSetting::get('system_announcement', ''),
        ];

        return Inertia::render('Admin/Settings/Index', [
            'settings' => $settings,
        ]);
    }

    public function update(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'site_name' => ['required', 'string', 'max:255'],
            'institution' => ['required', 'string', 'max:255'],
            'department_name' => ['required', 'string', 'max:255'],
            'contact_email' => ['required', 'email', 'max:255'],
            'contact_phone' => ['nullable', 'string', 'max:50'],
            'allow_registration' => ['required', 'in:0,1'],
            'system_announcement' => ['nullable', 'string', 'max:2000'],
        ]);

        foreach ($validated as $key => $value) {
            SystemSetting::set($key, (string) $value);
        }

        ActivityLog::record('updated', 'Updated system settings and announcements', Auth::id(), SystemSetting::class);

        return back()->with('success', 'System settings saved successfully!');
    }
}
