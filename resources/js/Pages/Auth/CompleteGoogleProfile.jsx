import React, { useState } from 'react';
import { useForm, Head, router } from '@inertiajs/react';
import GuestLayout from '@/Layouts/GuestLayout';
import {
    Eye,
    EyeOff,
    CheckCircle2,
    ShieldAlert,
    UserCheck,
    X,
    BadgeCheck,
    Lock,
    Phone,
    IdCard,
    Sparkles,
} from 'lucide-react';

export default function CompleteGoogleProfile({ googleProfile }) {
    const [showPassword, setShowPassword] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        student_number: '',
        first_name: googleProfile?.first_name || '',
        middle_name: '',
        last_name: googleProfile?.last_name || '',
        contact_number: '',
        password: '',
        password_confirmation: '',
        terms: false,
    });

    const submit = (e) => {
        e.preventDefault();
        post('/auth/google/complete-profile', {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    const handleCancel = () => {
        if (confirm('Cancel registration with this Google account? Your inputs will be cleared.')) {
            router.post('/auth/google/cancel');
        }
    };

    return (
        <GuestLayout maxWidth="max-w-xl">
            <Head title="Complete Student Profile — CRT F&B Connect" />

            {/* Top Bar: Connected Google Account Indicator */}
            <div className="mb-5 flex items-center justify-between">
                <button
                    type="button"
                    onClick={handleCancel}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-[#A8E6E8] hover:text-rose-300 cyber-oauth-btn border border-[#A8E6E8]/20 hover:border-rose-400/40 transition-all duration-200 cursor-pointer"
                    title="Cancel Google Sign-Up and return to Registration"
                >
                    <X className="w-3.5 h-3.5" />
                    <span>Cancel</span>
                </button>

                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#2EC4D6]/20 border border-[#2EC4D6]/40 rounded-full text-[11px] font-semibold text-[#2EC4D6]">
                    <BadgeCheck className="w-3.5 h-3.5 text-[#2EC4D6]" />
                    <span>Google Verified</span>
                </div>
            </div>

            <div className="mb-4 text-center">
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#0B6E8A]/25 border border-[#2EC4D6]/40 text-[#2EC4D6] text-[11px] font-bold uppercase tracking-wider mb-2">
                    <Sparkles className="w-3.5 h-3.5 text-[#2EC4D6]" />
                    Step 2: Profile Completion
                </div>
                <h2 className="text-2xl sm:text-3xl font-semibold text-[#F4FBFC] tracking-tight leading-snug">
                    Complete Your Profile
                </h2>
                <p className="text-xs text-[#A8E6E8]/80 font-normal mt-1">
                    Provide your student details to submit your account for instructor approval.
                </p>
            </div>

            {/* Google Profile Connected Card */}
            <div className="p-3.5 bg-[#0A3D4F]/50 border border-[#A8E6E8]/20 rounded-2xl mb-4 flex items-center gap-3">
                <div className="relative shrink-0">
                    {googleProfile?.avatar ? (
                        <img
                            src={googleProfile.avatar}
                            alt={googleProfile.name}
                            className="w-11 h-11 rounded-full ring-2 ring-[#2EC4D6]/40 object-cover"
                        />
                    ) : (
                        <div className="w-11 h-11 rounded-full bg-[#0B6E8A] text-[#F4FBFC] font-bold flex items-center justify-center text-sm shadow-xs">
                            {googleProfile?.first_name?.[0] || 'G'}
                        </div>
                    )}
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-[#061923] rounded-full p-0.5 shadow-xs flex items-center justify-center border border-[#A8E6E8]/20">
                        <svg className="w-3.5 h-3.5" viewBox="0 0 48 48" fill="none">
                            <path d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z" fill="#FFC107"/>
                            <path d="M6.306 14.691l6.571 4.819C14.655 15.108 19.001 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C16.318 4 9.656 8.337 6.306 14.691z" fill="#FF3D00"/>
                            <path d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z" fill="#4CAF50"/>
                            <path d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002l6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z" fill="#1976D2"/>
                        </svg>
                    </div>
                </div>

                <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-[#F4FBFC] truncate">
                        {googleProfile?.name || 'Google User'}
                    </p>
                    <p className="text-[11px] text-[#A8E6E8] font-medium truncate flex items-center gap-1.5 mt-0.5">
                        <span className="text-[#A8E6E8]/90 font-semibold">{googleProfile?.email}</span>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300 shrink-0 inline" />
                    </p>
                </div>
            </div>

            {/* Guidance Alert */}
            <div className="p-3 bg-[#0B6E8A]/20 border border-[#2EC4D6]/30 backdrop-blur-md rounded-2xl mb-4 flex items-start gap-2.5">
                <ShieldAlert className="w-4 h-4 text-[#2EC4D6] shrink-0 mt-0.5" />
                <div className="text-[11px] text-[#A8E6E8] leading-normal">
                    <span className="font-semibold text-[#F4FBFC]">Required Information:</span> Please enter your official Student ID number, verify your full name, and create your portal password before account approval.
                </div>
            </div>

            <form onSubmit={submit} className="space-y-3.5">
                {/* Student Number */}
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
                            <input
                                type="text"
                                value={data.first_name}
                                onChange={(e) => setData('first_name', e.target.value)}
                                placeholder="Juan"
                                className="w-full bg-transparent border-0 text-[#F4FBFC] placeholder-[#A8E6E8]/40 text-sm focus:ring-0 focus:outline-none pl-1 pr-1 py-0"
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
                            <input
                                type="text"
                                value={data.last_name}
                                onChange={(e) => setData('last_name', e.target.value)}
                                placeholder="Dela Cruz"
                                className="w-full bg-transparent border-0 text-[#F4FBFC] placeholder-[#A8E6E8]/40 text-sm focus:ring-0 focus:outline-none pl-1 pr-1 py-0"
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
                            <input
                                type="text"
                                value={data.middle_name}
                                onChange={(e) => setData('middle_name', e.target.value)}
                                placeholder="Santos"
                                className="w-full bg-transparent border-0 text-[#F4FBFC] placeholder-[#A8E6E8]/40 text-sm focus:ring-0 focus:outline-none pl-1 pr-1 py-0"
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

                {/* Passwords */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                        <label className="block text-xs font-normal text-[#A8E6E8] mb-1.5 ml-1">
                            Create Password <span className="text-[#2EC4D6]">*</span>
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
                            >
                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                        {errors.password && (
                            <p className="mt-1 text-xs text-[#F4FBFC] font-medium ml-1">{errors.password}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-xs font-normal text-[#A8E6E8] mb-1.5 ml-1">
                            Confirm Password <span className="text-[#2EC4D6]">*</span>
                        </label>
                        <div className="relative flex items-center rounded-2xl cyber-glass-input px-3.5 py-2.5">
                            <Lock className="w-4 h-4 text-[#A8E6E8]/75 shrink-0 ml-0.5" />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={data.password_confirmation}
                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                placeholder="Repeat password"
                                className="w-full bg-transparent border-0 text-[#F4FBFC] placeholder-[#A8E6E8]/40 text-sm focus:ring-0 focus:outline-none pl-3 pr-1 py-0"
                                required
                            />
                        </div>
                    </div>
                </div>

                {/* Terms and conditions */}
                <div className="pt-2">
                    <label className="flex items-start gap-2.5 cursor-pointer select-none">
                        <input
                            type="checkbox"
                            checked={data.terms}
                            onChange={(e) => setData('terms', e.target.checked)}
                            className="w-4 h-4 mt-0.5 rounded bg-[#0A3D4F]/50 border-[#A8E6E8]/30 text-[#2EC4D6] focus:ring-0 focus:ring-offset-0 cursor-pointer"
                            required
                        />
                        <span className="text-xs text-[#A8E6E8]/80 leading-normal">
                            I verify that my student credentials are correct and agree to the{' '}
                            <span className="font-semibold text-[#2EC4D6]">Terms of Use</span> of the CRT F&amp;B LMS.
                        </span>
                    </label>
                    {errors.terms && (
                        <p className="mt-1 text-xs text-[#F4FBFC] font-medium ml-1">{errors.terms}</p>
                    )}
                </div>

                {/* Submit button */}
                <button
                    type="submit"
                    disabled={processing}
                    className="w-full mt-4 py-3 px-6 rounded-2xl sm:rounded-full text-sm font-semibold text-[#F4FBFC] cyber-glow-btn flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                >
                    <UserCheck className="w-4 h-4" />
                    {processing ? 'Submitting Details...' : 'Complete Profile & Submit for Approval'}
                </button>
            </form>
        </GuestLayout>
    );
}
