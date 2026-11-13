<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Learning Material Announcement</title>
</head>
<body style="margin: 0; padding: 0; background-color: #F1F5F9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #0F172A;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #F1F5F9; padding: 32px 16px;">
        <tr>
            <td align="center">
                <!-- Main Container -->
                <table role="presentation" width="100%" style="max-width: 600px; background-color: #FFFFFF; border-radius: 20px; overflow: hidden; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05); border: 1px solid #E2E8F0;" cellspacing="0" cellpadding="0">
                    
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
                                            College of Research &amp; Technology — Digital LMS
                                        </p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- Body Content -->
                    <tr>
                        <td style="padding: 32px 32px;">
                            <p style="font-size: 14px; margin-top: 0; margin-bottom: 16px; color: #475569;">
                                Hello, <strong>{{ $student->name }}</strong>,
                            </p>
                            
                            <p style="font-size: 14px; line-height: 1.6; color: #334155; margin-bottom: 24px;">
                                A new curriculum learning material has just been published by your instructor in <strong>{{ $resource->category?->name ?? 'Classroom' }}</strong>.
                            </p>

                            <!-- Announcement Custom Callout if present -->
                            @if (!empty($announcementMessage))
                                <div style="background-color: #EFF6FF; border-left: 4px solid #2563EB; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
                                    <p style="margin: 0 0 6px 0; font-size: 12px; font-weight: 700; color: #1E3A8A; text-transform: uppercase; letter-spacing: 0.5px;">
                                        📢 Instructor's Announcement Note:
                                    </p>
                                    <p style="margin: 0; font-size: 13px; color: #1E293B; line-height: 1.5; font-style: italic;">
                                        "{{ $announcementMessage }}"
                                    </p>
                                    @if ($instructor)
                                        <p style="margin: 8px 0 0 0; font-size: 11px; color: #64748B; font-weight: 600;">
                                            — {{ $instructor->name }} (Instructor)
                                        </p>
                                    @endif
                                </div>
                            @endif

                            <!-- Resource Summary Card -->
                            <table role="presentation" width="100%" style="background-color: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 12px; margin-bottom: 28px; padding: 20px;" cellspacing="0" cellpadding="0">
                                <tr>
                                    <td>
                                        <span style="display: inline-block; background-color: #2563EB; color: #FFFFFF; font-size: 10px; font-weight: 800; text-transform: uppercase; padding: 3px 8px; border-radius: 6px; letter-spacing: 0.5px; margin-bottom: 8px;">
                                            {{ strtoupper($resource->resource_type) }} LESSON
                                        </span>
                                        <h2 style="font-size: 18px; font-weight: 800; color: #0F172A; margin: 4px 0 8px 0; line-height: 1.3;">
                                            {{ $resource->title }}
                                        </h2>
                                        @if ($resource->description)
                                            <p style="font-size: 13px; color: #64748B; margin: 0 0 12px 0; line-height: 1.5;">
                                                {{ Str::limit($resource->description, 180) }}
                                            </p>
                                        @endif
                                        <table role="presentation" width="100%" style="border-top: 1px solid #E2E8F0; padding-top: 8px; margin-top: 8px; font-size: 11px; color: #64748B;" cellspacing="0" cellpadding="0">
                                            <tr>
                                                <td align="left">
                                                    Category: <strong style="color: #334155;">{{ $resource->category?->name ?? 'Curriculum' }}</strong>
                                                </td>
                                                <td align="right">
                                                    Instructor: <strong style="color: #334155;">{{ $instructor?->name ?? $resource->uploader?->name ?? 'Chef Instructor' }}</strong>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>

                            <!-- CTA Button -->
                            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-bottom: 24px;">
                                <tr>
                                    <td align="center">
                                        <a href="{{ $resourceUrl }}" style="display: inline-block; background-color: #2563EB; color: #FFFFFF; text-decoration: none; font-size: 14px; font-weight: 700; padding: 14px 32px; border-radius: 12px; box-shadow: 0 4px 10px rgba(37, 99, 235, 0.25);">
                                            Open Learning Material &rarr;
                                        </a>
                                    </td>
                                </tr>
                            </table>

                            <p style="font-size: 12px; color: #94A3B8; text-align: center; margin: 0; line-height: 1.5;">
                                You can also access this material anytime from your <a href="{{ url('/student/dashboard') }}" style="color: #2563EB; text-decoration: underline;">Student Classroom Dashboard</a>.
                            </p>
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #F8FAFC; border-top: 1px solid #E2E8F0; padding: 20px 32px; text-align: center; font-size: 11px; color: #94A3B8; line-height: 1.5;">
                            <p style="margin: 0 0 4px 0;">
                                &copy; {{ date('Y') }} CRT F&amp;B Connect — College of Research &amp; Technology.
                            </p>
                            <p style="margin: 0;">
                                This is an automated academic notification sent to all registered students of CRT F&amp;B Connect.
                            </p>
                        </td>
                    </tr>

                </table>
            </td>
        </tr>
    </table>
</body>
</html>

