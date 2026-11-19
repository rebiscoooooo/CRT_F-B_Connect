import React, { useState, useEffect, useRef } from 'react';
import { usePage } from '@inertiajs/react';
import { Clock, ShieldAlert, LogOut, ShieldCheck } from 'lucide-react';
import Navbar from '../Components/Navbar';
import Sidebar from '../Components/Sidebar';
import Toast from '../Components/Toast';
import ErrorBoundary from '../Components/ErrorBoundary';
import { secureLogout } from '../utils/auth';

export default function AppLayout({ children, title }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const { auth, settings } = usePage().props;

    // Timeout duration in milliseconds (default: 30 minutes, minimum 5 minutes)
    const configuredMinutes = Number(settings?.session_timeout) || 30;
    const timeoutDurationMs = Math.max(5, configuredMinutes) * 60 * 1000;
    const warningLeadTimeMs = 60 * 1000; // Show warning modal 60 seconds prior

    const [showWarningModal, setShowWarningModal] = useState(false);
    const [secondsLeft, setSecondsLeft] = useState(60);
    const warningIntervalRef = useRef(null);

    // 1. Session integrity check on mount & popstate (Back/Forward device button guard)
    useEffect(() => {
        if (!auth?.user) {
            window.location.replace('/login');
            return;
        }

        // Establish active session indicators
        try {
            sessionStorage.setItem('crt_authenticated', 'true');
            localStorage.setItem('crt_session_active', String(auth.user.id));
            if (!localStorage.getItem('crt_last_active')) {
                localStorage.setItem('crt_last_active', String(Date.now()));
            }
        } catch (e) {}

        // Listen for back/forward navigation within the window
        const handlePopState = () => {
            if (sessionStorage.getItem('crt_authenticated') !== 'true') {
                window.location.replace('/login');
            }
        };

        // Listen for cross-tab logout (if user signed out in another browser tab)
        const handleStorageChange = (e) => {
            if (e.key === 'crt_session_active' && !e.newValue) {
                window.location.replace('/login');
            }
        };

        window.addEventListener('popstate', handlePopState);
        window.addEventListener('storage', handleStorageChange);

        return () => {
            window.removeEventListener('popstate', handlePopState);
            window.removeEventListener('storage', handleStorageChange);
        };
    }, [auth?.user]);

    // 2. Idle inactivity tracker & auto-logout
    useEffect(() => {
        if (!auth?.user) return;

        let lastRecordTime = Date.now();

        // Update activity timestamp (throttled to at most once per 5 seconds)
        const recordUserActivity = () => {
            const now = Date.now();
            if (now - lastRecordTime > 5000) {
                lastRecordTime = now;
                try {
                    localStorage.setItem('crt_last_active', String(now));
                } catch (e) {}
            }
            if (showWarningModal) {
                setShowWarningModal(false);
            }
        };

        const activityEvents = ['mousedown', 'keydown', 'touchstart', 'scroll', 'click'];
        activityEvents.forEach((eventName) => {
            window.addEventListener(eventName, recordUserActivity, { passive: true });
        });

        // Periodic check every 5 seconds
        const timerInterval = setInterval(() => {
            const lastActive = Number(localStorage.getItem('crt_last_active') || Date.now());
            const idleTime = Date.now() - lastActive;

            if (idleTime >= timeoutDurationMs) {
                // Inactivity limit reached -> Auto logout safely
                clearInterval(timerInterval);
                secureLogout('/login?timeout=1');
            } else if (idleTime >= (timeoutDurationMs - warningLeadTimeMs)) {
                // Approaching timeout -> Show warning modal
                const remaining = Math.max(1, Math.ceil((timeoutDurationMs - idleTime) / 1000));
                setSecondsLeft(remaining);
                setShowWarningModal(true);
            } else {
                setShowWarningModal(false);
            }
        }, 5000);

        return () => {
            activityEvents.forEach((eventName) => {
                window.removeEventListener(eventName, recordUserActivity);
            });
            clearInterval(timerInterval);
        };
    }, [auth?.user, timeoutDurationMs, showWarningModal]);

    // Countdown timer for warning modal
    useEffect(() => {
        if (showWarningModal) {
            warningIntervalRef.current = setInterval(() => {
                setSecondsLeft((prev) => {
                    if (prev <= 1) {
                        clearInterval(warningIntervalRef.current);
                        secureLogout('/login?timeout=1');
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        } else {
            if (warningIntervalRef.current) {
                clearInterval(warningIntervalRef.current);
            }
        }
        return () => {
            if (warningIntervalRef.current) {
                clearInterval(warningIntervalRef.current);
            }
        };
    }, [showWarningModal]);

    const handleStayLoggedIn = () => {
        try {
            localStorage.setItem('crt_last_active', String(Date.now()));
        } catch (e) {}
        setShowWarningModal(false);
    };

    return (
        <div className="min-h-screen bg-slate-50 relative flex flex-col font-sans selection:bg-blue-600 selection:text-white">
            {/* Atmospheric Background Canvas */}
            {/* Atmospheric Glassmorphic HSL Background Canvas */}
            <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
                {/* Dynamic Base Gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100/70" />
                {/* Dynamic HSL Chromatic Base Wash */}
                <div
                    className="absolute inset-0"
                    style={{
                        background: 'linear-gradient(135deg, #f8fafc 0%, hsla(var(--h-c1), 85%, 96%, 0.4) 40%, hsla(var(--h-c4), 75%, 96%, 0.3) 100%)',
                    }}
                />

                {/* Subtle Engineering Dot Grid */}
                <div className="absolute inset-0 dashboard-grid-pattern opacity-75" />
                <div className="absolute inset-0 dashboard-grid-pattern opacity-70" />

                {/* Primary Official Blue & Sky Ambient Glows (Top) */}
                <div className="absolute -top-32 left-1/4 w-[680px] h-[520px] bg-gradient-to-br from-blue-500/18 via-sky-400/15 to-transparent rounded-full blur-3xl transform -rotate-12 animate-pulse [animation-duration:10s]" />
                <div className="absolute -top-10 right-0 w-[550px] h-[480px] bg-gradient-to-bl from-sky-400/18 via-cyan-400/12 to-transparent rounded-full blur-3xl" />
                {/* Orb 1: --c1 (Electric Azure) & --c2 (Ultramarine) - Top-Left */}
                <div
                    className="absolute -top-32 left-1/4 w-[720px] h-[540px] rounded-full blur-3xl transform -rotate-12 animate-pulse [animation-duration:12s]"
                    style={{
                        background: 'radial-gradient(circle at center, hsla(var(--h-c1), var(--s-c1), var(--l-c1), 0.22) 0%, hsla(var(--h-c2), var(--s-c2), var(--l-c2), 0.12) 60%, transparent 80%)',
                    }}
                />

                {/* Harmonic Accent: Soft Indigo / Deep Blue (Middle-Left) */}
                <div className="absolute top-1/3 -left-40 w-[520px] h-[520px] bg-gradient-to-tr from-blue-600/12 via-indigo-500/10 to-transparent rounded-full blur-3xl" />
                {/* Orb 2: --c5 (Fuchsia) & --c4 (Orchid) - Top-Right */}
                <div
                    className="absolute -top-16 right-0 w-[600px] h-[520px] rounded-full blur-3xl"
                    style={{
                        background: 'radial-gradient(circle at center, hsla(var(--h-c5), var(--s-c5), var(--l-c5), 0.20) 0%, hsla(var(--h-c4), var(--s-c4), var(--l-c4), 0.12) 60%, transparent 80%)',
                    }}
                />

                {/* Harmonic Warmth: Hospitality Amber Light Accent (Center-Right) */}
                <div className="absolute top-1/2 right-1/4 w-[420px] h-[420px] bg-gradient-to-bl from-amber-400/8 via-sky-300/10 to-transparent rounded-full blur-3xl" />
                {/* Orb 3: --c3 (Royal Violet) - Middle-Left */}
                <div
                    className="absolute top-1/3 -left-36 w-[560px] h-[560px] rounded-full blur-3xl"
                    style={{
                        background: 'radial-gradient(circle at center, hsla(var(--h-c3), var(--s-c3), var(--l-c3), 0.18) 0%, hsla(var(--h-c2), var(--s-c2), var(--l-c2), 0.10) 60%, transparent 80%)',
                    }}
                />

                {/* Ambient Foundation Glow (Bottom-Right) */}
                <div className="absolute -bottom-36 right-10 w-[620px] h-[500px] bg-gradient-to-tl from-sky-400/16 via-blue-500/10 to-transparent rounded-full blur-3xl" />
                {/* Orb 4: --c4 (Orchid) & --c5 (Fuchsia) Warmth - Center-Right */}
                <div
                    className="absolute top-1/2 right-1/4 w-[460px] h-[460px] rounded-full blur-3xl"
                    style={{
                        background: 'radial-gradient(circle at center, hsla(var(--h-c4), var(--s-c4), var(--l-c4), 0.15) 0%, hsla(var(--h-c5), var(--s-c5), var(--l-c5), 0.08) 60%, transparent 80%)',
                    }}
                />

                {/* Orb 5: --c1 & --c5 Aurora Foundation - Bottom-Right */}
                <div
                    className="absolute -bottom-36 right-10 w-[650px] h-[520px] rounded-full blur-3xl"
                    style={{
                        background: 'radial-gradient(circle at center, hsla(var(--h-c5), var(--s-c5), var(--l-c5), 0.16) 0%, hsla(var(--h-c1), var(--s-c1), var(--l-c1), 0.10) 60%, transparent 80%)',
                    }}
                />
            </div>

            {/* Sidebar */}
            <Sidebar
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
            />

            {/* Main Area with dynamic margin for desktop sidebar */}
            <div className="relative z-10 flex-1 lg:pl-64 flex flex-col min-h-screen">
                <Navbar onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

                <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
                    <ErrorBoundary>
                        {children}
                    </ErrorBoundary>
                </main>

                <footer className="py-6 px-6 text-center text-xs text-slate-500 border-t border-slate-200/60 mt-auto bg-white/40 backdrop-blur-md">
                    <p>© {new Date().getFullYear()} CRT F&amp;B Connect — College of Research &amp; Technology Food &amp; Beverage LMS. All rights reserved.</p>
                </footer>
            </div>

            {/* Idle Inactivity Warning Modal */}
            {showWarningModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-7 shadow-2xl border border-slate-100 overflow-hidden transform animate-in zoom-in-95 duration-200 text-center">
                        <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center mb-4">
                            <Clock className="w-7 h-7 text-amber-600 animate-pulse" />
                        </div>

                        <h3 className="text-lg font-extrabold text-slate-900 tracking-tight">
                            Session Inactivity Warning
                        </h3>

                        <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                            You have been inactive for a while. For your security, your session will automatically log out in:
                        </p>

                        <div className="my-4 py-2.5 px-4 bg-amber-50/80 rounded-2xl border border-amber-200/60 inline-flex items-center gap-2">
                            <span className="text-2xl font-black text-amber-700 font-mono tracking-tight">
                                {secondsLeft}
                            </span>
                            <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">
                                seconds
                            </span>
                        </div>

                        <p className="text-[11px] text-slate-400 mb-6">
                            Click <strong className="text-slate-600">"Stay Logged In"</strong> or move your cursor to continue your session without interruption.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center gap-2.5 justify-center">
                            <button
                                type="button"
                                onClick={handleStayLoggedIn}
                                className="w-full sm:w-auto px-5 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm shadow-blue-500/20 hover:shadow-md transition-all cursor-pointer"
                            >
                                Stay Logged In
                            </button>
                            <button
                                type="button"
                                onClick={() => secureLogout()}
                                className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs font-bold text-slate-700 bg-white hover:bg-rose-50 hover:text-rose-600 border border-slate-200 hover:border-rose-200 rounded-xl transition-all cursor-pointer"
                            >
                                <LogOut className="w-3.5 h-3.5" />
                                Sign Out Now
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Global Flash Toasts */}
            <Toast />
        </div>
    );
}
