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
        } catch (e) { }

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
                } catch (e) { }
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
        } catch (e) { }
        setShowWarningModal(false);
    };

    return (
        <div className="min-h-screen cyber-grid-container relative flex flex-col font-sans selection:bg-[#2EC4D6] selection:text-[#061923] text-[#F4FBFC] w-full overflow-x-hidden">
            {/* Atmospheric Glassmorphic Nebula Glows */}
            <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
                <div className="absolute top-1/4 left-1/3 w-[680px] h-[520px] bg-[#0B6E8A]/20 rounded-full blur-[140px] pointer-events-none" />
                <div className="absolute top-10 right-10 w-[550px] h-[480px] bg-[#2EC4D6]/15 rounded-full blur-[110px] pointer-events-none" />
                <div className="absolute bottom-10 left-10 w-[600px] h-[520px] bg-[#0A3D4F]/30 rounded-full blur-[130px] pointer-events-none" />
            </div>

            {/* Sidebar */}
            <Sidebar
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
            />

            {/* Main Area with dynamic margin for desktop sidebar */}
            <div className="relative z-10 flex-1 lg:pl-64 flex flex-col min-h-screen w-full min-w-0">
                <Navbar onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

                <main className="flex-1 p-3.5 sm:p-6 lg:p-8 max-w-7xl w-full min-w-0 mx-auto">
                    <ErrorBoundary>
                        {children}
                    </ErrorBoundary>
                </main>

                <footer className="py-6 px-6 text-center text-xs text-[#A8E6E8]/70 border-t border-[#A8E6E8]/15 mt-auto bg-[#061923]/75 backdrop-blur-md">
                    <p>© {new Date().getFullYear()} CRT F&amp;B Connect — College of Research &amp; Technology Food &amp; Beverage LMS. All rights reserved.</p>
                </footer>
            </div>

            {/* Idle Inactivity Warning Modal */}
            {showWarningModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
                    <div className="relative w-full max-w-md cyber-glass-card rounded-3xl p-6 sm:p-7 shadow-2xl border border-[#A8E6E8]/25 overflow-hidden transform animate-in zoom-in-95 duration-200 text-center text-[#F4FBFC]">
                        <div className="w-14 h-14 mx-auto rounded-2xl bg-[#2EC4D6]/20 border border-[#2EC4D6]/30 flex items-center justify-center mb-4">
                            <Clock className="w-7 h-7 text-[#2EC4D6] animate-pulse" />
                        </div>

                        <h3 className="text-lg font-bold text-[#F4FBFC] tracking-tight">
                            Session Inactivity Warning
                        </h3>

                        <p className="text-xs text-[#A8E6E8]/80 mt-2 leading-relaxed">
                            You have been inactive for a while. For your security, your session will automatically log out in:
                        </p>

                        <div className="my-4 py-2.5 px-4 bg-[#2EC4D6]/20 rounded-2xl border border-[#2EC4D6]/30 inline-flex items-center gap-2">
                            <span className="text-2xl font-black text-[#2EC4D6] font-mono tracking-tight">
                                {secondsLeft}
                            </span>
                            <span className="text-xs font-bold text-[#2EC4D6] uppercase tracking-wider">
                                seconds
                            </span>
                        </div>

                        <p className="text-[11px] text-[#A8E6E8]/60 mb-6">
                            Click <strong className="text-[#2EC4D6]">"Stay Logged In"</strong> or move your cursor to continue your session without interruption.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center gap-2.5 justify-center">
                            <button
                                type="button"
                                onClick={handleStayLoggedIn}
                                className="w-full sm:w-auto px-5 py-2.5 text-xs font-semibold text-[#F4FBFC] cyber-glow-btn rounded-xl shadow-sm transition-all cursor-pointer"
                            >
                                Stay Logged In
                            </button>
                            <button
                                type="button"
                                onClick={() => secureLogout()}
                                className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-[#A8E6E8] hover:text-[#F4FBFC] cyber-oauth-btn border border-[#A8E6E8]/20 hover:border-[#2EC4D6]/40 rounded-xl transition-all cursor-pointer"
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
