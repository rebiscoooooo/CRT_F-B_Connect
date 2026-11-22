import React, { useState, useEffect } from 'react';
import { useForm, Link, Head, usePage, router } from '@inertiajs/react';
import GuestLayout from '@/Layouts/GuestLayout';
import { Eye, EyeOff, UserPlus, ShieldAlert, GraduationCap, ArrowLeft, Lock, Mail, User, Phone, IdCard } from 'lucide-react';

export default function Register({ allowRegistration = true }) {
    const { auth } = usePage().props;
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // If already logged in, automatically return to active session
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
        student_number: '',
        first_name: '',
        middle_name: '',
        last_name: '',
        email: '',
        contact_number: '',
        password: '',
        password_confirmation: '',
        terms: false,
    });

    const submit = (e) => {
        e.preventDefault();
        post('/register', {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    if (!allowRegistration) {
        return (
            <GuestLayout variant="glassmorphic" maxWidth="max-w-md">
                <Head title="Registration Closed — CRT F&B Connect" />
                <div className="text-center py-6">
                    <GraduationCap className="w-12 h-12 text-[#2EC4D6] mx-auto mb-3" />
                    <h3 className="text-lg font-semibold text-[#F4FBFC]">Registration Currently Closed</h3>
                    <p className="text-xs text-[#A8E6E8]/80 mt-2">
                        Online student registration is disabled by administration. Please contact your CRT F&amp;B instructor.
                    </p>
                    <div className="mt-6">
                        <Link
                            href="/login"
                            className="inline-block px-5 py-2.5 cyber-glow-btn text-[#F4FBFC] font-semibold text-xs rounded-full shadow-sm"
                        >
                            Return to Login
                        </Link>
                    </div>
                </div>
            </GuestLayout>
        );
    }

    return (
        <GuestLayout variant="glassmorphic" maxWidth="max-w-xl">
            <Head title="Student Registration — CRT F&B Connect" />

            {/* Brand Header: Original Logo + Brand Name + Tagline */}
            <div className="flex items-center justify-center gap-3 mb-5">
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

            {/* Heading & Subtitle */}
            <div className="text-center mb-5">
                <h2 className="text-2xl sm:text-3xl font-semibold text-[#F4FBFC] tracking-tight leading-snug">
                    Create Student Account
                </h2>
                <p className="text-xs text-[#A8E6E8]/80 font-normal mt-1">
                    Register your details to access classroom materials
                </p>
            </div>

            {/* Two-Step Verification Notice Banner */}
            <div className="p-3 bg-[#0B6E8A]/20 border border-[#2EC4D6]/30 backdrop-blur-md rounded-2xl mb-5 flex items-start gap-2.5 shadow-sm">
                <ShieldAlert className="w-4 h-4 text-[#2EC4D6] shrink-0 mt-0.5" />
                <div className="text-[11px] text-[#A8E6E8] leading-normal">
                    <span className="font-semibold text-[#F4FBFC]">Two-Step Verification:</span> You will verify your email with a 6-digit OTP, followed by instructor approval to prevent dummy registrations.
                </div>
            </div>

            <form onSubmit={submit} className="space-y-3.5">
                {/* Student ID Number */}
                <div>
                    <label className="block text-xs font-normal text-[#A8E6E8] mb-1.5 ml-1">
                        Student ID Number <span className="text-rose-400">*</span>
                    </label>
                    <div className={`relative flex items-center rounded-2xl cyber-glass-input px-3.5 py-2.5 ${errors.student_number ? 'border-rose-400/80 bg-rose-500/10' : ''}`}>
                        <IdCard className="w-4 h-4 text-[#A8E6E8]/75 shrink-0 ml-0.5" />
                        <input
                            type="text"
                            value={data.student_number}
                            onChange={(e) => setData('student_number', e.target.value)}
                            placeholder="e.g. 2024-CRT-0210"
                            className="w-full bg-transparent border-0 text-[#F4FBFC] placeholder-[#A8E6E8]/40 text-sm focus:ring-0 focus:outline-none pl-3 pr-1 py-0"
                            required
                            autoFocus
                        />
                    </div>
                    {errors.student_number && (
                        <p className="mt-1 text-xs text-rose-300 font-medium ml-1">{errors.student_number}</p>
                    )}
                </div>

                {/* Name Fields: First & Last Name */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                        <label className="block text-xs font-normal text-[#A8E6E8] mb-1.5 ml-1">
                            First Name <span className="text-rose-400">*</span>
                        </label>
                        <div className={`relative flex items-center rounded-2xl cyber-glass-input px-3.5 py-2.5 ${errors.first_name ? 'border-rose-400/80 bg-rose-500/10' : ''}`}>
                            <User className="w-4 h-4 text-[#A8E6E8]/75 shrink-0 ml-0.5" />
                            <input
                                type="text"
                                value={data.first_name}
                                onChange={(e) => setData('first_name', e.target.value)}
                                placeholder="Juan"
                                className="w-full bg-transparent border-0 text-[#F4FBFC] placeholder-[#A8E6E8]/40 text-sm focus:ring-0 focus:outline-none pl-3 pr-1 py-0"
                                required
                            />
                        </div>
                        {errors.first_name && (
                            <p className="mt-1 text-xs text-rose-300 font-medium ml-1">{errors.first_name}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-xs font-normal text-[#A8E6E8] mb-1.5 ml-1">
                            Last Name <span className="text-rose-400">*</span>
                        </label>
                        <div className={`relative flex items-center rounded-2xl cyber-glass-input px-3.5 py-2.5 ${errors.last_name ? 'border-rose-400/80 bg-rose-500/10' : ''}`}>
                            <User className="w-4 h-4 text-[#A8E6E8]/75 shrink-0 ml-0.5" />
                            <input
                                type="text"
                                value={data.last_name}
                                onChange={(e) => setData('last_name', e.target.value)}
                                placeholder="Dela Cruz"
                                className="w-full bg-transparent border-0 text-[#F4FBFC] placeholder-[#A8E6E8]/40 text-sm focus:ring-0 focus:outline-none pl-3 pr-1 py-0"
                                required
                            />
                        </div>
                        {errors.last_name && (
                            <p className="mt-1 text-xs text-rose-300 font-medium ml-1">{errors.last_name}</p>
                        )}
                    </div>
                </div>

                {/* Middle Name & Contact Number */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                        <label className="block text-xs font-normal text-[#A8E6E8] mb-1.5 ml-1">
                            Middle Name <span className="text-[#A8E6E8]/60 text-[10px]">(Optional)</span>
                        </label>
                        <div className="relative flex items-center rounded-2xl cyber-glass-input px-3.5 py-2.5">
                            <User className="w-4 h-4 text-[#A8E6E8]/60 shrink-0 ml-0.5" />
                            <input
                                type="text"
                                value={data.middle_name}
                                onChange={(e) => setData('middle_name', e.target.value)}
                                placeholder="Santos"
                                className="w-full bg-transparent border-0 text-[#F4FBFC] placeholder-[#A8E6E8]/40 text-sm focus:ring-0 focus:outline-none pl-3 pr-1 py-0"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-normal text-[#A8E6E8] mb-1.5 ml-1">
                            Contact Number <span className="text-[#A8E6E8]/60 text-[10px]">(Optional)</span>
                        </label>
                        <div className="relative flex items-center rounded-2xl cyber-glass-input px-3.5 py-2.5">
                            <Phone className="w-4 h-4 text-[#A8E6E8]/60 shrink-0 ml-0.5" />
                            <input
                                type="text"
                                value={data.contact_number}
                                onChange={(e) => setData('contact_number', e.target.value)}
                                placeholder="+63 917 000 0000"
                                className="w-full bg-transparent border-0 text-[#F4FBFC] placeholder-[#A8E6E8]/40 text-sm focus:ring-0 focus:outline-none pl-3 pr-1 py-0"
                            />
                        </div>
                    </div>
                </div>

                {/* Email Address */}
                <div>
                    <label className="block text-xs font-normal text-[#A8E6E8] mb-1.5 ml-1">
                        Email Address <span className="text-rose-400">*</span>
                    </label>
                    <div className={`relative flex items-center rounded-2xl cyber-glass-input px-3.5 py-2.5 ${errors.email ? 'border-rose-400/80 bg-rose-500/10' : ''}`}>
                        <Mail className="w-4 h-4 text-[#A8E6E8]/75 shrink-0 ml-0.5" />
                        <input
                            type="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            placeholder="student@crt.edu.ph"
                            className="w-full bg-transparent border-0 text-[#F4FBFC] placeholder-[#A8E6E8]/40 text-sm focus:ring-0 focus:outline-none pl-3 pr-1 py-0"
                            required
                        />
                    </div>
                    {errors.email && (
                        <p className="mt-1 text-xs text-rose-300 font-medium ml-1">{errors.email}</p>
                    )}
                </div>

                {/* Password & Confirm Password */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                        <label className="block text-xs font-normal text-[#A8E6E8] mb-1.5 ml-1">
                            Password <span className="text-rose-400">*</span>
                        </label>
                        <div className={`relative flex items-center rounded-2xl cyber-glass-input px-3.5 py-2.5 ${errors.password ? 'border-rose-400/80 bg-rose-500/10' : ''}`}>
                            <Lock className="w-4 h-4 text-[#A8E6E8]/75 shrink-0 ml-0.5" />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                placeholder="Min. 8 characters"
                                className={`w-full bg-transparent border-0 text-[#F4FBFC] placeholder-[#A8E6E8]/40 text-sm focus:ring-0 focus:outline-none pl-3 pr-2 py-0 ${!showPassword && data.password ? 'tracking-wider' : ''}`}
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
                            <p className="mt-1 text-xs text-rose-300 font-medium ml-1">{errors.password}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-xs font-normal text-[#A8E6E8] mb-1.5 ml-1">
                            Confirm Password <span className="text-rose-400">*</span>
                        </label>
                        <div className="relative flex items-center rounded-2xl cyber-glass-input px-3.5 py-2.5">
                            <Lock className="w-4 h-4 text-[#A8E6E8]/75 shrink-0 ml-0.5" />
                            <input
                                type={showConfirmPassword ? 'text' : 'password'}
                                value={data.password_confirmation}
                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                placeholder="Repeat password"
                                className={`w-full bg-transparent border-0 text-[#F4FBFC] placeholder-[#A8E6E8]/40 text-sm focus:ring-0 focus:outline-none pl-3 pr-2 py-0 ${!showConfirmPassword && data.password_confirmation ? 'tracking-wider' : ''}`}
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="text-[#A8E6E8]/75 hover:text-[#F4FBFC] transition-colors cursor-pointer p-0.5 mr-0.5"
                                title={showConfirmPassword ? 'Hide password' : 'Show password'}
                            >
                                {showConfirmPassword ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Terms and conditions */}
                <div className="pt-1">
                    <label className="flex items-start gap-2.5 cursor-pointer select-none">
                        <input
                            type="checkbox"
                            checked={data.terms}
                            onChange={(e) => setData('terms', e.target.checked)}
                            className="w-4 h-4 mt-0.5 rounded bg-[#0A3D4F]/50 border-[#A8E6E8]/30 text-[#2EC4D6] focus:ring-0 focus:ring-offset-0 cursor-pointer"
                            required
                        />
                        <span className="text-xs text-[#A8E6E8]/80 leading-normal">
                            I agree to the <span className="font-semibold text-[#2EC4D6]">Terms of Use</span> and student conduct policies of the CRT Food &amp; Beverage LMS.
                        </span>
                    </label>
                    {errors.terms && (
                        <p className="mt-1 text-xs text-rose-300 font-medium ml-1">{errors.terms}</p>
                    )}
                </div>

                {/* Submit button (Lagoona Blue Radiant Gradient Pill) */}
                <button
                    type="submit"
                    disabled={processing}
                    className="w-full mt-4 py-3 px-6 rounded-2xl sm:rounded-full text-sm font-semibold text-[#F4FBFC] cyber-glow-btn flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                >
                    <UserPlus className="w-4 h-4" />
                    {processing ? 'Registering Account...' : 'Complete Registration'}
                </button>
            </form>

            {/* OR Divider */}
            <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-[#A8E6E8]/15" />
                </div>
                <div className="relative flex justify-center text-xs">
                    <span className="px-3 text-[#A8E6E8]/60 text-[11px] font-normal bg-transparent">or sign up with</span>
                </div>
            </div>

            {/* Google Sign Up */}
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
                <span>Continue with Google</span>
            </a>

            {/* Footer link to Login */}
            <div className="mt-5 pt-4 border-t border-[#A8E6E8]/15 text-center">
                <p className="text-xs text-[#A8E6E8]/70">
                    Already registered?{' '}
                    <Link href="/login" className="font-semibold text-[#2EC4D6] hover:text-[#F4FBFC] underline underline-offset-2 transition-colors">
                        Sign in here
                    </Link>
                </p>
            </div>
        </GuestLayout>
    );
}
