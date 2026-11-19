<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" class="h-full bg-slate-50">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title inertia>{{ config('app.name', 'CRT F&B Connect') }}</title>

    <!-- Favicon & Brand Icons -->
    <link rel="icon" type="image/png" href="/favicon.png">
    <link rel="shortcut icon" href="/favicon.ico">
    <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
    <link rel="apple-touch-icon" sizes="192x192" href="/images/icons/icon-192x192.png">
    <link rel="apple-touch-icon" sizes="512x512" href="/images/icons/icon-512x512.png">

    <!-- Progressive Web App (PWA) Manifest & Meta -->
    <link rel="manifest" href="/manifest.json">
    <meta name="theme-color" content="#2563eb">
    <meta name="mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="default">
    <meta name="apple-mobile-web-app-title" content="CRT F&B">
    <meta name="application-name" content="CRT F&B Connect">
    <meta name="msapplication-TileColor" content="#2563eb">
    <meta name="msapplication-TileImage" content="/images/icons/icon-144x144.png">

    <!-- Google Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">

    <!-- Anti-bfcache & Back-Navigation History Protection -->
    <script>
        (function() {
            window.addEventListener('pageshow', function(event) {
                if (event.persisted) {
                    window.location.reload();
                    return;
                }
                try {
                    var entries = window.performance && window.performance.getEntriesByType ? window.performance.getEntriesByType('navigation') : null;
                    if (entries && entries.length > 0 && entries[0].type === 'back_forward') {
                        var isProtected = /^\/(admin|student|profile|notifications)/i.test(window.location.pathname);
                        if (isProtected && sessionStorage.getItem('crt_authenticated') !== 'true') {
                            window.location.replace('/login');
                        }
                    }
                } catch (e) {}
            });
        })();
    </script>

    <!-- Scripts and Styles -->
    @routes
    @viteReactRefresh
    @vite(['resources/css/app.css', 'resources/js/app.jsx'])
    @inertiaHead
</head>
<body class="h-full font-sans antialiased text-slate-900 bg-slate-50 selection:bg-blue-600 selection:text-white">
    @inertia
</body>
</html>

