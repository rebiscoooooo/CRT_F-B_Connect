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
        <GuestLayout>
            <Head title="Complete Student Profile — CRT F&B Connect" />

            {/* Top Bar: Connected Google Account Indicator */}
            <div className="mb-5 flex items-center justify-between">
                <button
                    type="button"
                    onClick={handleCancel}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-600 hover:text-rose-600 bg-slate-100/90 hover:bg-rose-50 border border-slate-200/80 hover:border-rose-200 transition-all duration-200"
                    title="Cancel Google Sign-Up and return to Registration"
                >
                    <X className="w-3.5 h-3.5" />
                    <span>Cancel</span>
                </button>

                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 border border-emerald-200/80 rounded-full text-[11px] font-bold text-emerald-700">
                    <BadgeCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Google Verified</span>
                </div>
            </div>

            <div className="mb-4 text-center">
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-50 border border-blue-200/60 text-blue-700 text-[11px] font-bold uppercase tracking-wider mb-2">
                    <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                    Step 2: Profile Completion
                </div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">Complete Your Profile</h2>
                <p className="text-xs text-slate-500 mt-1">
                    Provide your student details to submit your account for instructor approval.
                </p>
            </div>

            {/* Google Profile Connected Card */}
            <div className="p-3.5 bg-gradient-to-r from-blue-50/90 via-sky-50/60 to-slate-50 border border-blue-200/80 rounded-2xl mb-4 flex items-center gap-3">
                <div className="relative shrink-0">
                    {googleProfile?.avatar ? (
                        <img
                            src={googleProfile.avatar}
                            alt={googleProfile.name}
                            className="w-11 h-11 rounded-full ring-2 ring-blue-500/30 object-cover"
                        />
                    ) : (
                        <div className="w-11 h-11 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-sm shadow-xs">
                            {googleProfile?.first_name?.[0] || 'G'}
                        </div>
                    )}
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-white rounded-full p-0.5 shadow-xs flex items-center justify-center">
                        <svg className="w-3.5 h-3.5" viewBox="0 0 48 48" fill="none">
                            <path d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z" fill="#FFC107"/>
                            <path d="M6.306 14.691l6.571 4.819C14.655 15.108 19.001 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C16.318 4 9.656 8.337 6.306 14.691z" fill="#FF3D00"/>
                            <path d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z" fill="#4CAF50"/>
                            <path d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002l6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z" fill="#1976D2"/>
                        </svg>
                    </div>
                </div>

                <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-slate-800 truncate">
                        {googleProfile?.name || 'Google User'}
                    </p>
                    <p className="text-[11px] text-slate-500 font-medium truncate flex items-center gap-1.5 mt-0.5">
                        <span className="text-slate-700 font-semibold">{googleProfile?.email}</span>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 inline" />
                    </p>
                </div>
            </div>

            {/* Guidance Alert */}
            <div className="p-3 bg-amber-50/80 border border-amber-200/80 rounded-2xl mb-4 flex items-start gap-2.5">
                <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div className="text-[11px] text-amber-900 leading-normal">
                    <span className="font-bold">Required Information:</span> Please enter your official Student ID number, verify your full name, and create your portal password before account approval.
                </div>
            </div>

            <form onSubmit={submit} className="space-y-3.5">
                {/* Student Number */}
                <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Student ID Number <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                            <IdCard className="w-4 h-4" />
                        </div>
                        <input
                            type="text"
                            value={data.student_number}
                            onChange={(e) => setData('student_number', e.target.value)}
                            placeholder="e.g. 2024-CRT-0210"
                            className={`w-full pl-10 pr-4 py-2 text-sm bg-white rounded-xl border ${
                                errors.student_number ? 'border-rose-400 focus:ring-rose-400' : 'border-slate-200 focus:border-blue-600'
                            } focus:outline-none focus:ring-2 focus:ring-blue-600/20 transition-all`}
                            required
                            autoFocus
                        />
                    </div>
                    {errors.student_number && (
                        <p className="mt-1 text-xs text-rose-600 font-medium">{errors.student_number}</p>
                    )}
                </div>

                {/* Name Fields: First & Last Name */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                            First Name <span className="text-rose-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={data.first_name}
                            onChange={(e) => setData('first_name', e.target.value)}
                            placeholder="Juan"
                            className={`w-full px-3.5 py-2 text-sm bg-white rounded-xl border ${
                                errors.first_name ? 'border-rose-400' : 'border-slate-200 focus:border-blue-600'
                            } focus:outline-none focus:ring-2 focus:ring-blue-600/20 transition-all`}
                            required
                        />
                        {errors.first_name && (
                            <p className="mt-1 text-xs text-rose-600 font-medium">{errors.first_name}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                            Last Name <span className="text-rose-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={data.last_name}
                            onChange={(e) => setData('last_name', e.target.value)}
                            placeholder="Dela Cruz"
                            className={`w-full px-3.5 py-2 text-sm bg-white rounded-xl border ${
                                errors.last_name ? 'border-rose-400' : 'border-slate-200 focus:border-blue-600'
                            } focus:outline-none focus:ring-2 focus:ring-blue-600/20 transition-all`}
                            required
                        />
                        {errors.last_name && (
                            <p className="mt-1 text-xs text-rose-600 font-medium">{errors.last_name}</p>
                        )}
                    </div>
                </div>

                {/* Middle Name & Contact Number */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                            Middle Name <span className="text-slate-400 text-[10px] font-normal">(Optional)</span>
                        </label>
                        <input
                            type="text"
                            value={data.middle_name}
                            onChange={(e) => setData('middle_name', e.target.value)}
                            placeholder="Santos"
                            className="w-full px-3.5 py-2 text-sm bg-white rounded-xl border border-slate-200 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20 transition-all"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                            Contact Number <span className="text-slate-400 text-[10px] font-normal">(Optional)</span>
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                                <Phone className="w-3.5 h-3.5" />
                            </div>
                            <input
                                type="text"
                                value={data.contact_number}
                                onChange={(e) => setData('contact_number', e.target.value)}
                                placeholder="+63 917 000 0000"
                                className="w-full pl-9 pr-3.5 py-2 text-sm bg-white rounded-xl border border-slate-200 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20 transition-all"
                            />
                        </div>
                    </div>
                </div>

                {/* Passwords */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                            Create Password <span className="text-rose-500">*</span>
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                                <Lock className="w-3.5 h-3.5" />
                            </div>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                placeholder="Min. 8 characters"
                                className={`w-full pl-9 pr-9 py-2 text-sm bg-white rounded-xl border ${
                                    errors.password ? 'border-rose-400' : 'border-slate-200 focus:border-blue-600'
                                } focus:outline-none focus:ring-2 focus:ring-blue-600/20 transition-all`}
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                            >
                                {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                            </button>
                        </div>
                        {errors.password && (
                            <p className="mt-1 text-xs text-rose-600 font-medium">{errors.password}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                            Confirm Password <span className="text-rose-500">*</span>
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                                <Lock className="w-3.5 h-3.5" />
                            </div>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={data.password_confirmation}
                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                placeholder="Repeat password"
                                className="w-full pl-9 pr-3.5 py-2 text-sm bg-white rounded-xl border border-slate-200 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20 transition-all"
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
                            className="w-4 h-4 mt-0.5 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                            required
                        />
                        <span className="text-xs text-slate-600 leading-normal">
                            I verify that my student credentials are correct and agree to the{' '}
                            <span className="font-semibold text-blue-600">Terms of Use</span> of the CRT F&amp;B LMS.
                        </span>
                    </label>
                    {errors.terms && (
                        <p className="mt-1 text-xs text-rose-600 font-medium">{errors.terms}</p>
                    )}
                </div>

                {/* Submit button */}
                <button
                    type="submit"
                    disabled={processing}
                    className="w-full mt-4 py-3 px-4 rounded-xl text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:opacity-60 shadow-md shadow-blue-600/20 hover:shadow-lg transition-all flex items-center justify-center gap-2"
                >
                    <UserCheck className="w-4 h-4" />
                    {processing ? 'Submitting Details...' : 'Complete Profile & Submit for Approval'}
                </button>
            </form>
        </GuestLayout>
    );
}
