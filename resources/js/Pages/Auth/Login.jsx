import React, { useState, useEffect } from 'react';
import { useForm, Link, Head, usePage, router } from '@inertiajs/react';
import GuestLayout from '@/Layouts/GuestLayout';
import { Eye, EyeOff, Lock, Mail, ShieldAlert, Clock, HelpCircle, X } from 'lucide-react';

export default function Login() {
    const { auth } = usePage().props;
    const [showPassword, setShowPassword] = useState(false);
    const [showForgotModal, setShowForgotModal] = useState(false);
    const isTimeout = typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('timeout') === '1';

    // Clear any stale local auth state on login screen
    useEffect(() => {
        try {
            sessionStorage.removeItem('crt_authenticated');
            localStorage.removeItem('crt_session_active');
            localStorage.removeItem('crt_last_active');
        } catch (e) { }
    }, []);

    // If already logged in, automatically return to active session instead of showing login
    useEffect(() => {
        if (auth?.user) {
            const destination = auth.user.is_admin
                ? '/admin/dashboard'
                : (auth.user.status === 'pending' ? '/approval-pending' : '/student/dashboard');
            router.visit(destination, { replace: true });
        }
    }, [auth]);

    // Handle browser back button bfcache restoration
    useEffect(() => {
        const handlePageShow = (event) => {
            if (event.persisted && auth?.user) {
                const destination = auth.user.is_admin
                    ? '/admin/dashboard'
                    : (auth.user.status === 'pending' ? '/approval-pending' : '/student/dashboard');
                router.visit(destination, { replace: true });
            }
        };

        window.addEventListener('pageshow', handlePageShow);
        return () => window.removeEventListener('pageshow', handlePageShow);
    }, [auth]);

    const { data, setData, post, processing, errors, reset } = useForm({
        login: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();
        post('/login', {
            onFinish: () => reset('password'),
        });
    };

    return (
        <GuestLayout variant="glassmorphic">
            <Head title="Sign In — CRT F&B Connect" />

            {/* Brand Header: Original Logo + Brand Name + Tagline */}
            <div className="flex items-center justify-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-[#0B6E8A]/25 p-1 border border-[#2EC4D6]/40 shadow-[0_0_18px_rgba(46,196,214,0.35)] flex items-center justify-center shrink-0">
                    <img
                        src="/images/logo-badge.png"
                        alt="CRT Logo"
                        className="w-full h-full object-contain rounded-lg"
                        onError={(e) => {
                            e.target.src = '/images/logo.png';
                        }}
                    />
                </div>
                <div className="text-left">
                    <span className="block text-[15px] font-bold text-[#F4FBFC] tracking-[0.08em] uppercase font-sans leading-tight">
                        CRT F-B CONNECT
                    </span>
                    <span className="block text-[9px] font-semibold text-[#2EC4D6] tracking-[0.22em] uppercase leading-tight mt-0.5">
                        EMPOWERING LEARNERS
                    </span>
                </div>
            </div>

            {/* Welcome Heading & Subtitle */}
            <div className="text-center mb-6">
                <h2 className="text-2xl sm:text-3xl font-semibold text-[#F4FBFC] tracking-tight leading-snug">
                    Welcome Back
                </h2>
                <p className="text-xs text-[#A8E6E8]/80 font-normal mt-1">
                    Sign in to continue to your dashboard
                </p>
            </div>

            {/* Inactivity Timeout Banner */}
            {isTimeout && (
                <div className="mb-4 p-3 bg-amber-500/20 backdrop-blur-md rounded-2xl border border-amber-400/30 text-xs text-amber-200 flex items-center gap-2.5 animate-in fade-in duration-200">
                    <Clock className="w-4 h-4 text-amber-300 shrink-0" />
                    <span>Your session has timed out due to inactivity. Please sign in again.</span>
                </div>
            )}

            <form onSubmit={submit} className="space-y-4">
                {/* Email Field */}
                <div>
                    <label className="block text-xs font-normal text-[#A8E6E8] mb-1.5 ml-1">
                        Email
                    </label>
                    <div className={`relative flex items-center rounded-2xl cyber-glass-input px-3.5 py-3 ${errors.login ? 'border-rose-400/80 bg-rose-500/10' : ''}`}>
                        <Mail className="w-4 h-4 text-[#A8E6E8]/75 shrink-0 ml-0.5" />
                        <input
                            type="text"
                            value={data.login}
                            onChange={(e) => setData('login', e.target.value)}
                            placeholder="Email address"
                            className="w-full bg-transparent border-0 text-[#F4FBFC] placeholder-[#A8E6E8]/40 text-sm focus:ring-0 focus:outline-none pl-3 pr-1 py-0"
                            required
                            autoFocus
                        />
                    </div>
                    {errors.login && (
                        <p className="mt-1.5 px-3 py-1 rounded-full bg-rose-500/20 border border-rose-400/30 text-xs text-rose-200 font-medium flex items-center gap-1.5 animate-in fade-in">
                            <ShieldAlert className="w-3.5 h-3.5 shrink-0 text-rose-300" />
                            {errors.login}
                        </p>
                    )}
                </div>

                {/* Password Field */}
                <div>
                    <label className="block text-xs font-normal text-[#A8E6E8] mb-1.5 ml-1">
                        Password
                    </label>
                    <div className={`relative flex items-center rounded-2xl cyber-glass-input px-3.5 py-3 ${errors.password ? 'border-rose-400/80 bg-rose-500/10' : ''}`}>
                        <Lock className="w-4 h-4 text-[#A8E6E8]/75 shrink-0 ml-0.5" />
                        <input
                            type={showPassword ? 'text' : 'password'}
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            placeholder="••••••••"
                            className={`w-full bg-transparent border-0 text-[#F4FBFC] placeholder-[#A8E6E8]/40 text-sm focus:ring-0 focus:outline-none pl-3 pr-2 py-0 ${!showPassword && data.password ? 'tracking-widest' : ''}`}
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="text-[#A8E6E8]/75 hover:text-[#F4FBFC] transition-colors cursor-pointer p-0.5 mr-0.5"
                            title={showPassword ? 'Hide password' : 'Show password'}
                        >
                            {showPassword ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                        </button>
                    </div>
                    {errors.password && (
                        <p className="mt-1.5 px-3 py-1 rounded-full bg-rose-500/20 border border-rose-400/30 text-xs text-rose-200 font-medium flex items-center gap-1.5 animate-in fade-in">
                            <ShieldAlert className="w-3.5 h-3.5 shrink-0 text-rose-300" />
                            {errors.password}
                        </p>
                    )}
                </div>

                {/* Remember Me & Forgot Password Row */}
                <div className="flex items-center justify-between text-xs px-1 pt-0.5 mb-2">
                    <label className="flex items-center gap-2 cursor-pointer select-none text-[#A8E6E8]/80 hover:text-[#F4FBFC] transition-colors">
                        <input
                            type="checkbox"
                            checked={data.remember}
                            onChange={(e) => setData('remember', e.target.checked)}
                            className="w-3.5 h-3.5 rounded bg-[#0A3D4F]/50 border-[#A8E6E8]/30 text-[#2EC4D6] focus:ring-0 focus:ring-offset-0 cursor-pointer"
                        />
                        <span>Remember me</span>
                    </label>

                    <button
                        type="button"
                        onClick={() => setShowForgotModal(true)}
                        className="text-[#A8E6E8]/80 hover:text-[#2EC4D6] transition-colors cursor-pointer"
                    >
                        Forgot Password?
                    </button>
                </div>

                {/* Sign In Button (Lagoona Blue Radiant Gradient Pill) */}
                <button
                    type="submit"
                    disabled={processing}
                    className="w-full mt-3 py-3 px-6 rounded-2xl sm:rounded-full text-sm font-semibold text-[#F4FBFC] cyber-glow-btn flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                >
                    {processing ? 'Signing in...' : 'Sign in'}
                </button>
            </form>

            {/* Divider */}
            <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-[#A8E6E8]/15" />
                </div>
                <div className="relative flex justify-center text-xs">
                    <span className="px-3 text-[#A8E6E8]/60 text-[11px] font-normal bg-transparent">or continue with</span>
                </div>
            </div>

            {/* Google OAuth Button */}
            <a
                href="/auth/google"
                className="w-full flex items-center justify-center gap-3 py-2.5 sm:py-3 px-4 rounded-2xl sm:rounded-full cyber-oauth-btn text-sm font-normal text-[#F4FBFC] shadow-sm transition-all duration-200 cursor-pointer"
            >
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z" fill="#FFC107" />
                    <path d="M6.306 14.691l6.571 4.819C14.655 15.108 19.001 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C16.318 4 9.656 8.337 6.306 14.691z" fill="#FF3D00" />
                    <path d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z" fill="#4CAF50" />
                    <path d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002l6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z" fill="#1976D2" />
                </svg>
                <span>Sign in with Google</span>
            </a>

            {/* Footer Information */}
            <div className="mt-6 text-center space-y-1">
                <p className="text-xs text-[#A8E6E8]/80 font-normal">
                    Student, Teacher &amp; Admin Portal
                </p>
                <p className="text-xs text-[#A8E6E8]/60">
                    Don't have an account?{' '}
                    <button
                        type="button"
                        onClick={() => setShowForgotModal(true)}
                        className="text-[#2EC4D6] hover:text-[#F4FBFC] underline underline-offset-2 transition-colors cursor-pointer"
                    >
                        Contact your admin
                    </button>
                    <span className="mx-1 text-[#0B6E8A]">•</span>
                    <Link
                        href="/register"
                        className="text-[#2EC4D6] hover:text-[#F4FBFC] underline underline-offset-2 transition-colors"
                    >
                        Register
                    </Link>
                </p>
            </div>

            {/* Frosted Modal for Admin Support / Password Reset */}
            {showForgotModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
                    <div className="relative w-full max-w-sm cyber-glass-card rounded-2xl p-6 text-white shadow-2xl border border-[#A8E6E8]/25 animate-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between pb-3 border-b border-[#A8E6E8]/15 mb-4">
                            <div className="flex items-center gap-2">
                                <HelpCircle className="w-5 h-5 text-[#2EC4D6]" />
                                <h3 className="font-semibold text-sm text-[#F4FBFC]">Account &amp; Password Support</h3>
                            </div>
                            <button
                                onClick={() => setShowForgotModal(false)}
                                className="p-1 rounded-full text-[#A8E6E8] hover:text-[#F4FBFC] hover:bg-[#0B6E8A]/30 transition-colors cursor-pointer"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="space-y-3 text-xs text-[#A8E6E8]/90 leading-relaxed">
                            <p>
                                Student and faculty accounts are managed by the College of Research &amp; Technology Administration.
                            </p>
                            <div className="p-3 rounded-xl bg-[#0A3D4F]/60 border border-[#A8E6E8]/20">
                                <p className="font-medium text-[#F4FBFC]">How to reset your credentials:</p>
                                <ul className="mt-1 space-y-1 list-disc list-inside text-[#A8E6E8]">
                                    <li>Contact your course instructor or department head.</li>
                                    <li>Visit the CRT Computer Lab / Admin Office.</li>
                                    <li>Present your official Student / Faculty ID.</li>
                                </ul>
                            </div>
                            <p className="text-[11px] text-[#A8E6E8]/70">
                                An administrator will promptly verify your record and reset your credentials.
                            </p>
                        </div>

                        <div className="mt-5">
                            <button
                                type="button"
                                onClick={() => setShowForgotModal(false)}
                                className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-[#F4FBFC] cyber-glow-btn text-center cursor-pointer"
                            >
                                Understood
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </GuestLayout>
    );
}
