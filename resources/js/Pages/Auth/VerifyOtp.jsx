import React, { useState, useEffect } from 'react';
import { useForm, Head, Link, router } from '@inertiajs/react';
import GuestLayout from '@/Layouts/GuestLayout';
import { Mail, ShieldCheck, ArrowRight, RefreshCw, Clock, CheckCircle2 } from 'lucide-react';

export default function VerifyOtp({ email, studentNumber, expiresAt }) {
    const [resendCooldown, setResendCooldown] = useState(60);
    const [isResending, setIsResending] = useState(false);

    const { data, setData, post, processing, errors } = useForm({
        code: '',
    });

    useEffect(() => {
        if (resendCooldown <= 0) return;
        const timer = setInterval(() => {
            setResendCooldown((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);
        return () => clearInterval(timer);
    }, [resendCooldown]);

    const handleCodeChange = (e) => {
        const val = e.target.value.replace(/\D/g, '').slice(0, 6);
        setData('code', val);
    };

    const submit = (e) => {
        e.preventDefault();
        post('/verify-otp');
    };

    const handleResend = () => {
        if (resendCooldown > 0 || isResending) return;
        setIsResending(true);
        router.post('/resend-otp', {}, {
            preserveScroll: true,
            onFinish: () => {
                setIsResending(false);
                setResendCooldown(60);
            },
        });
    };

    return (
        <GuestLayout>
            <Head title="Verify Email Code (OTP) — CRT F&B Connect" />

            {/* 2-Step Progress Indicator */}
            <div className="mb-6">
                <div className="flex items-center justify-between text-xs font-bold text-slate-500 mb-2">
                    <span className="flex items-center gap-1.5 text-blue-600 font-extrabold">
                        <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px]">1</span>
                        Email OTP
                    </span>
                    <span className="h-0.5 flex-1 mx-3 bg-slate-200"></span>
                    <span className="flex items-center gap-1.5 text-slate-400">
                        <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center text-[10px]">2</span>
                        Teacher Approval
                    </span>
                </div>
            </div>

            <div className="text-center mb-6">
                <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-inner ring-4 ring-blue-50">
                    <Mail className="w-7 h-7" />
                </div>
                <h2 className="text-xl font-black text-slate-900 tracking-tight">Check Your Email</h2>
                <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                    We sent a 6-digit one-time verification code to{' '}
                    <span className="font-bold text-slate-800 break-all">{email || 'your email'}</span>
                </p>
                {studentNumber && (
                    <p className="text-[11px] font-mono text-slate-400 mt-1">
                        Student ID: <span className="font-bold text-slate-600">{studentNumber}</span>
                    </p>
                )}
            </div>

            <form onSubmit={submit} className="space-y-4">
                <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 text-center">
                        Enter 6-Digit OTP Code
                    </label>
                    <div className="relative max-w-xs mx-auto">
                        <input
                            type="text"
                            inputMode="numeric"
                            autoComplete="one-time-code"
                            maxLength={6}
                            value={data.code}
                            onChange={handleCodeChange}
                            placeholder="000000"
                            className={`w-full py-3.5 px-4 text-center font-mono text-2xl tracking-[0.5em] font-extrabold bg-slate-50 rounded-2xl border ${
                                errors.code ? 'border-rose-400 focus:ring-rose-400' : 'border-slate-200 focus:border-blue-600 focus:ring-blue-600'
                            } shadow-inner focus:bg-white focus:outline-none focus:ring-2 focus:ring-opacity-20 transition-all`}
                            autoFocus
                            required
                        />
                    </div>
                    {errors.code && (
                        <p className="mt-2 text-xs text-rose-600 font-medium text-center">{errors.code}</p>
                    )}
                </div>

                <button
                    type="submit"
                    disabled={processing || data.code.length !== 6}
                    className="w-full py-3 px-4 rounded-xl text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:opacity-50 shadow-md shadow-blue-600/20 hover:shadow-lg transition-all flex items-center justify-center gap-2"
                >
                    <ShieldCheck className="w-4 h-4" />
                    {processing ? 'Verifying Code...' : 'Verify Email & Proceed'}
                </button>
            </form>

            {/* Resend Code Section */}
            <div className="mt-6 pt-5 border-t border-slate-100 text-center">
                <p className="text-xs text-slate-500 mb-2">Didn't receive the email?</p>
                <button
                    type="button"
                    onClick={handleResend}
                    disabled={resendCooldown > 0 || isResending}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 disabled:text-slate-400 disabled:cursor-not-allowed transition-colors"
                >
                    <RefreshCw className={`w-3.5 h-3.5 ${isResending ? 'animate-spin' : ''}`} />
                    {resendCooldown > 0 ? `Resend Code in ${resendCooldown}s` : 'Resend Verification Code'}
                </button>
                <div className="mt-4">
                    <Link
                        href="/login"
                        className="text-[11px] text-slate-400 hover:text-slate-600 hover:underline"
                    >
                        Sign in with another account
                    </Link>
                </div>
            </div>
        </GuestLayout>
    );
}

