import { router } from '@inertiajs/react';

/**
 * Perform a clean, secure logout that wipes all client-side state,
 * invalidates session on the backend, and uses window.location.replace
 * to eliminate the protected page from browser history (preventing back-button access).
 */
export function secureLogout(customRedirectUrl = '/login') {
    try {
        sessionStorage.clear();
        localStorage.removeItem('crt_authenticated');
        localStorage.removeItem('crt_session_active');
        localStorage.removeItem('crt_last_active');
    } catch (err) {
        // Ignore storage errors in restrictive environments
    }

    router.post('/logout', {}, {
        onFinish: () => {
            window.location.replace(customRedirectUrl);
        },
        onError: () => {
            window.location.replace(customRedirectUrl);
        }
    });
}
