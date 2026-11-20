<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Staff Account Registration — CRT F&amp;B Connect</title>
</head>
<body style="margin: 0; padding: 0; background-color: #F1F5F9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #0F172A;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #F1F5F9; padding: 32px 16px;">
        <tr>
            <td align="center">
                <table role="presentation" width="100%" style="max-width: 560px; background-color: #FFFFFF; border-radius: 20px; overflow: hidden; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05); border: 1px solid #E2E8F0;" cellspacing="0" cellpadding="0">
                    <!-- Header -->
                    <tr>
                        <td style="background: linear-gradient(135deg, #1E3A8A 0%, #2563EB 50%, #3B82F6 100%); padding: 36px 32px; text-align: center;">
                            <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                                <tr>
                                    <td align="center">
                                        @php
                                            $logoPath = public_path('images/logo-badge.png');
                                            $logoSrc = (isset($message) && method_exists($message, 'embed') && file_exists($logoPath))
                                                ? $message->embed($logoPath)
                                                : url('/images/logo-badge.png');
                                        @endphp
                                        <div style="background-color: #FFFFFF; width: 68px; height: 68px; border-radius: 50%; padding: 4px; display: inline-block; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25); text-align: center;">
                                            <img src="{{ $logoSrc }}" alt="CRT F&amp;B Connect Logo" width="68" height="68" style="border-radius: 50%; display: block; border: 0; width: 68px; height: 68px; object-fit: cover;" />
                                        </div>
                                        <h1 style="color: #FFFFFF; margin: 14px 0 3px 0; font-size: 21px; font-weight: 800; letter-spacing: -0.5px;">
                                            Welcome to the Team!
                                        </h1>
                                        <p style="color: #BFDBFE; margin: 0; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; font-weight: 600;">
                                            CRT F&amp;B Connect — Staff &amp; Faculty Portal
                                        </p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- Body Content -->
                    <tr>
                        <td style="padding: 32px 32px;">
                            <p style="font-size: 15px; margin-top: 0; margin-bottom: 12px; color: #1E293B;">
                                Hello, <strong>{{ $user->name }}</strong>!
                            </p>
                            
                            <p style="font-size: 13px; line-height: 1.6; color: #475569; margin-bottom: 20px;">
                                You have been officially registered as a <strong>{{ $roleTitle }}</strong> in the CRT Food &amp; Beverage Connect Digital Learning Management System by {{ $creator ? $creator->name : 'System Administration' }}.
                            </p>

                            <!-- Credentials Box -->
                            <div style="background-color: #F8FAFC; border: 1px solid #E2E8F0; border-left: 4px solid #2563EB; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
                                <p style="margin: 0 0 12px 0; font-size: 12px; font-weight: 700; color: #1E3A8A; text-transform: uppercase; letter-spacing: 0.5px;">
                                    ✓ Your Login Credentials
                                </p>
                                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="font-size: 13px; color: #334155;">
                                    <tr>
                                        <td style="padding: 4px 0; color: #64748B; width: 130px; font-weight: 600;">Role:</td>
                                        <td style="padding: 4px 0; font-weight: 700; color: #1E293B;">
                                            <span style="display: inline-block; padding: 2px 10px; font-size: 11px; border-radius: 999px; background-color: {{ $user->role === 'admin' ? '#FEF3C7' : '#E0F2FE' }}; color: {{ $user->role === 'admin' ? '#92400E' : '#0369A1' }}; font-weight: 700; text-transform: uppercase;">
                                                {{ $roleTitle }}
                                            </span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 6px 0; color: #64748B; font-weight: 600;">Login Email:</td>
                                        <td style="padding: 6px 0; font-weight: 700; color: #0F172A;">
                                            <a href="mailto:{{ $user->email }}" style="color: #2563EB; text-decoration: none;">{{ $user->email }}</a>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 6px 0; color: #64748B; font-weight: 600;">Initial Password:</td>
                                        <td style="padding: 6px 0;">
                                            <code style="background-color: #E2E8F0; color: #0F172A; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; font-size: 13px; font-weight: 700; padding: 4px 10px; border-radius: 6px; border: 1px solid #CBD5E1; display: inline-block; letter-spacing: 0.5px;">{{ $plainPassword }}</code>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 4px 0; color: #64748B; font-weight: 600;">Portal Status:</td>
                                        <td style="padding: 4px 0; font-weight: 700; color: {{ $user->status === 'active' ? '#16A34A' : '#DC2626' }};">
                                            {{ ucfirst($user->status) }}
                                        </td>
                                    </tr>
                                </table>
                            </div>

                            <p style="font-size: 13px; line-height: 1.6; color: #475569; margin-bottom: 24px;">
                                You can now sign in to your dashboard to manage curriculum modules, upload high-definition video masterclasses and technical illustrations, monitor student enrollments, and supervise digital assessments.
                            </p>

                            <!-- Call to Action -->
                            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-bottom: 24px;">
                                <tr>
                                    <td align="center">
                                        <a href="{{ url('/login') }}" target="_blank" style="background: linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%); color: #FFFFFF; text-decoration: none; font-size: 14px; font-weight: 700; padding: 14px 34px; border-radius: 12px; display: inline-block; box-shadow: 0 4px 12px rgba(37, 99, 235, 0.35);">
                                            Sign In to Staff Portal →
                                        </a>
                                    </td>
                                </tr>
                            </table>

                            <!-- Security Advisory -->
                            <div style="background-color: #FFFBEB; border: 1px solid #FDE68A; border-radius: 10px; padding: 14px 16px;">
                                <p style="margin: 0; font-size: 12px; color: #92400E; line-height: 1.5;">
                                    🔒 <strong>Security Recommendation:</strong> For your protection, please update your temporary password after logging in by visiting <strong>Profile Settings → Change Password</strong>.
                                </p>
                            </div>
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #F8FAFC; padding: 24px 32px; border-top: 1px solid #E2E8F0; text-align: center;">
                            <p style="margin: 0 0 4px 0; font-size: 11px; color: #94A3B8;">
                                College of Research &amp; Technology — Department of Food and Beverage Services Management.
                            </p>
                            <p style="margin: 0 0 4px 0; font-size: 11px; color: #CBD5E1;">
                                This is an automated administrative notification. Please do not reply directly to this email.
                            </p>
                            <p style="margin: 0; font-size: 11px; color: #CBD5E1;">
                                © {{ date('Y') }} CRT F&amp;B Connect. All rights reserved.
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
