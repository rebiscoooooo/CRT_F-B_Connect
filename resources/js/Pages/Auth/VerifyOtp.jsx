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
                <div className="flex items-center justify-between text-xs font-semibold text-[#A8E6E8]/70 mb-2">
                    <span className="flex items-center gap-1.5 text-[#2EC4D6] font-bold">
                        <span className="w-5 h-5 rounded-full cyber-glow-btn text-[#F4FBFC] flex items-center justify-center text-[10px] font-bold">1</span>
                        Email OTP
                    </span>
                    <span className="h-0.5 flex-1 mx-3 bg-[#A8E6E8]/20"></span>
                    <span className="flex items-center gap-1.5 text-[#A8E6E8]/50">
                        <span className="w-5 h-5 rounded-full bg-[#0A3D4F]/80 text-[#A8E6E8]/60 flex items-center justify-center text-[10px]">2</span>
                        Teacher Approval
                    </span>
                </div>
            </div>

            <div className="text-center mb-6">
                <div className="w-14 h-14 bg-[#0B6E8A]/25 text-[#2EC4D6] rounded-2xl flex items-center justify-center mx-auto mb-3 border border-[#2EC4D6]/40 shadow-[0_0_18px_rgba(46,196,214,0.3)]">
                    <Mail className="w-7 h-7" />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-[#F4FBFC] tracking-tight">Check Your Email</h2>
                <p className="text-xs text-[#A8E6E8]/80 mt-1.5 leading-relaxed">
                    We sent a 6-digit one-time verification code to{' '}
                    <span className="font-semibold text-[#F4FBFC] break-all">{email || 'your email'}</span>
                </p>
                {studentNumber && (
                    <p className="text-[11px] font-mono text-[#A8E6E8]/70 mt-1">
                        Student ID: <span className="font-bold text-[#2EC4D6]">{studentNumber}</span>
                    </p>
                )}
            </div>

            <form onSubmit={submit} className="space-y-4">
                <div>
                    <label className="block text-xs font-semibold text-[#A8E6E8] uppercase tracking-wider mb-2 text-center">
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
                            className={`w-full py-3 px-4 text-center font-mono text-2xl tracking-[0.5em] font-extrabold cyber-glass-input rounded-2xl ${
                                errors.code ? 'border-[#F4FBFC] bg-[#F4FBFC]/10' : 'focus:border-[#2EC4D6]'
                            } transition-all`}
                            autoFocus
                            required
                        />
                    </div>
                    {errors.code && (
                        <p className="mt-2 text-xs text-[#F4FBFC] font-medium text-center">{errors.code}</p>
                    )}
                </div>

                <button
                    type="submit"
                    disabled={processing || data.code.length !== 6}
                    className="w-full py-3 px-4 rounded-xl text-sm font-semibold text-[#F4FBFC] cyber-glow-btn disabled:opacity-50 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                    <ShieldCheck className="w-4 h-4" />
                    {processing ? 'Verifying Code...' : 'Verify Email & Proceed'}
                </button>
            </form>

            {/* Resend Code Section */}
            <div className="mt-6 pt-5 border-t border-[#A8E6E8]/15 text-center">
                <p className="text-xs text-[#A8E6E8]/70 mb-2">Didn't receive the email?</p>
                <button
                    type="button"
                    onClick={handleResend}
                    disabled={resendCooldown > 0 || isResending}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#2EC4D6] hover:text-[#F4FBFC] disabled:text-[#A8E6E8]/40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                >
                    <RefreshCw className={`w-3.5 h-3.5 ${isResending ? 'animate-spin' : ''}`} />
                    {resendCooldown > 0 ? `Resend Code in ${resendCooldown}s` : 'Resend Verification Code'}
                </button>
                <div className="mt-4">
                    <Link
                        href="/login"
                        className="text-[11px] text-[#A8E6E8]/60 hover:text-[#F4FBFC] hover:underline"
                    >
                        Sign in with another account
                    </Link>
                </div>
            </div>
        </GuestLayout>
    );
}

