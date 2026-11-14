<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Email Verification Code — CRT F&B Connect</title>
</head>
<body style="margin: 0; padding: 0; background-color: #F1F5F9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #0F172A;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #F1F5F9; padding: 32px 16px;">
        <tr>
            <td align="center">
                <table role="presentation" width="100%" style="max-width: 560px; background-color: #FFFFFF; border-radius: 20px; overflow: hidden; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05); border: 1px solid #E2E8F0;" cellspacing="0" cellpadding="0">
                    <!-- Header -->
                    <tr>
                        <td style="background: linear-gradient(135deg, #1E3A8A 0%, #2563EB 100%); padding: 32px 32px; text-align: center;">
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
                                            CRT F&amp;B Connect
                                        </h1>
                                        <p style="color: #DBEAFE; margin: 0; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; font-weight: 600;">
                                            College of Research &amp; Technology — Student Verification
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
                                Hello, <strong>{{ $user->name }}</strong>,
                            </p>
                            
                            <p style="font-size: 13px; line-height: 1.6; color: #475569; margin-bottom: 24px;">
                                Thank you for creating an account on the <strong>CRT F&B Connect Digital LMS</strong>. To confirm your identity and prevent dummy accounts, please enter the following 6-digit verification code:
                            </p>

                            <!-- OTP Box -->
                            <div style="background: linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%); border: 2px dashed #3B82F6; border-radius: 16px; padding: 24px; text-align: center; margin: 24px 0;">
                                <span style="display: block; font-size: 11px; font-weight: 700; color: #1E40AF; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 8px;">
                                    Your One-Time Verification Code
                                </span>
                                <div style="font-size: 36px; font-weight: 900; letter-spacing: 10px; color: #1E3A8A; font-family: 'Courier New', Courier, monospace;">
                                    {{ $otp }}
                                </div>
                                <span style="display: block; font-size: 11px; color: #64748B; margin-top: 8px;">
                                    ⏰ Valid for 10 minutes. Never share this code with anyone.
                                </span>
                            </div>

                            <!-- Two Step Notice -->
                            <div style="background-color: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 12px; padding: 16px; margin-top: 24px;">
                                <p style="margin: 0 0 6px 0; font-size: 12px; font-weight: 700; color: #0F172A;">
                                    🔒 Two-Step Security Enrollment Notice:
                                </p>
                                <p style="margin: 0; font-size: 12px; color: #64748B; line-height: 1.5;">
                                    After entering this OTP code, your account will undergo final verification and approval by your CRT F&B instructor/administrator to confirm official student enrollment.
                                </p>
                            </div>
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #F8FAFC; padding: 24px 32px; border-top: 1px solid #E2E8F0; text-align: center;">
                            <p style="margin: 0 0 4px 0; font-size: 11px; color: #94A3B8;">
                                If you did not create an account on CRT F&B Connect, please ignore this email.
                            </p>
                            <p style="margin: 0; font-size: 11px; color: #CBD5E1;">
                                © {{ date('Y') }} College of Research &amp; Technology — Department of Food and Beverage Services Management.
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>

