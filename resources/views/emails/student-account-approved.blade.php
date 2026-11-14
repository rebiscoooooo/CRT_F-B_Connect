<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Account Approved — CRT F&B Connect</title>
</head>
<body style="margin: 0; padding: 0; background-color: #F1F5F9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #0F172A;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #F1F5F9; padding: 32px 16px;">
        <tr>
            <td align="center">
                <table role="presentation" width="100%" style="max-width: 560px; background-color: #FFFFFF; border-radius: 20px; overflow: hidden; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05); border: 1px solid #E2E8F0;" cellspacing="0" cellpadding="0">
                    <!-- Header -->
                    <tr>
                        <td style="background: linear-gradient(135deg, #059669 0%, #10B981 100%); padding: 32px 32px; text-align: center;">
                            <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                                <tr>
                                    <td align="center">
                                        @php
                                            $logoPath = public_path('images/logo-badge.png');
                                            $logoSrc = (isset($message) && method_exists($message, 'embed') && file_exists($logoPath))
                                                ? $message->embed($logoPath)
                                                : url('/images/logo-badge.png');
                                        @endphp
                                        <div style="background-color: #FFFFFF; width: 68px; height: 68px; border-radius: 50%; padding: 4px; display: inline-block; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2); text-align: center;">
                                            <img src="{{ $logoSrc }}" alt="CRT F&B Connect Logo" width="68" height="68" style="border-radius: 50%; display: block; border: 0; width: 68px; height: 68px; object-fit: cover;" />
                                        </div>
                                        <h1 style="color: #FFFFFF; margin: 12px 0 2px 0; font-size: 20px; font-weight: 800; letter-spacing: -0.5px;">
                                            Account Officially Approved!
                                        </h1>
                                        <p style="color: #D1FAE5; margin: 0; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; font-weight: 600;">
                                            CRT F&amp;B Connect — Digital Classroom LMS
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
                                Mabuhay, <strong>{{ $user->name }}</strong>!
                            </p>
                            
                            <p style="font-size: 13px; line-height: 1.6; color: #475569; margin-bottom: 20px;">
                                Great news! Your student registration has been reviewed and <strong>officially approved</strong> by your CRT F&B instructor/administrator {{ $approver ? "({$approver->name})" : '' }}.
                            </p>

                            <div style="background-color: #ECFDF5; border-left: 4px solid #10B981; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
                                <p style="margin: 0 0 6px 0; font-size: 12px; font-weight: 700; color: #065F46; text-transform: uppercase;">
                                    ✓ Student Enrollment Verified
                                </p>
                                <p style="margin: 0; font-size: 12px; color: #047857; line-height: 1.5;">
                                    Student ID: <strong>{{ $user->student_number }}</strong><br>
                                    Registered Email: <strong>{{ $user->email }}</strong>
                                </p>
                            </div>

                            <p style="font-size: 13px; line-height: 1.6; color: #475569; margin-bottom: 24px;">
                                You now have full access to all curriculum learning materials, including instructional video masterclasses, technical schematics, PDF manuals, text lessons, and smart assessment quizzes.
                            </p>

                            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-bottom: 24px;">
                                <tr>
                                    <td align="center">
                                        <a href="{{ url('/login') }}" target="_blank" style="background: linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%); color: #FFFFFF; text-decoration: none; font-size: 14px; font-weight: 700; padding: 14px 32px; border-radius: 12px; display: inline-block; box-shadow: 0 4px 10px rgba(37, 99, 235, 0.3);">
                                            Sign In to Student Classroom →
                                        </a>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #F8FAFC; padding: 24px 32px; border-top: 1px solid #E2E8F0; text-align: center;">
                            <p style="margin: 0 0 4px 0; font-size: 11px; color: #94A3B8;">
                                College of Research &amp; Technology — Department of Food and Beverage Services Management.
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

