import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import GuestLayout from '@/Layouts/GuestLayout';
import { Clock, CheckCircle2, ShieldCheck, UserCheck, RefreshCw, LogIn, AlertCircle } from 'lucide-react';

export default function ApprovalPending({ student }) {
    const [isChecking, setIsChecking] = useState(false);

    const handleCheckStatus = () => {
        setIsChecking(true);
        router.get('/approval-pending', {}, {
            preserveScroll: true,
            onFinish: () => setIsChecking(false),
        });
    };

    return (
        <GuestLayout>
            <Head title="Account Pending Approval — CRT F&B Connect" />

            {/* 2-Step Progress Indicator */}
            <div className="mb-6">
                <div className="flex items-center justify-between text-xs font-semibold text-[#A8E6E8]/70 mb-2">
                    <span className="flex items-center gap-1.5 text-[#2EC4D6] font-bold">
                        <CheckCircle2 className="w-4 h-4 text-[#2EC4D6]" />
                        1. Email Verified
                    </span>
                    <span className="h-0.5 flex-1 mx-3 bg-[#2EC4D6]/40"></span>
                    <span className="flex items-center gap-1.5 text-amber-300 font-bold">
                        <span className="w-5 h-5 rounded-full bg-amber-500 text-[#061923] flex items-center justify-center text-[10px] font-bold animate-pulse">2</span>
                        2. Teacher Approval
                    </span>
                </div>
            </div>

            {/* Status Icon */}
            <div className="text-center mb-6">
                <div className="w-16 h-16 bg-[#0B6E8A]/25 text-[#2EC4D6] rounded-3xl flex items-center justify-center mx-auto mb-3.5 border border-[#2EC4D6]/40 shadow-[0_0_20px_rgba(46,196,214,0.3)]">
                    <Clock className="w-8 h-8 animate-pulse" />
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-amber-500/20 border border-amber-400/30 text-amber-300 uppercase tracking-wider mb-2">
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                    Pending Verification
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-[#F4FBFC] tracking-tight">Account Awaiting Approval</h2>
                <p className="text-xs text-[#A8E6E8]/80 mt-2 leading-relaxed">
                    Thank you for verifying your email. To protect our learning environment and prevent dummy accounts, your instructor or department administrator must confirm your enrollment before access is granted.
                </p>
            </div>

            {/* Student Info Card */}
            <div className="cyber-glass-card-subtle rounded-2xl p-4 mb-6 space-y-2.5 text-xs text-[#F4FBFC]">
                <div className="flex items-center justify-between">
                    <span className="text-[#A8E6E8]">Student Name</span>
                    <span className="font-bold text-[#F4FBFC]">{student?.name || '—'}</span>
                </div>
                <div className="flex items-center justify-between">
                    <span className="text-[#A8E6E8]">Student ID Number</span>
                    <span className="font-mono font-bold text-[#2EC4D6]">{student?.student_number || '—'}</span>
                </div>
                <div className="flex items-center justify-between">
                    <span className="text-[#A8E6E8]">Email Address</span>
                    <span className="font-medium text-[#F4FBFC] truncate max-w-[180px]">{student?.email || '—'}</span>
                </div>
                <div className="flex items-center justify-between pt-1 border-t border-[#A8E6E8]/15">
                    <span className="text-[#A8E6E8]">Email Status</span>
                    <span className="inline-flex items-center gap-1 text-emerald-300 font-bold">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Verified
                    </span>
                </div>
                <div className="flex items-center justify-between">
                    <span className="text-[#A8E6E8]">Approval Status</span>
                    <span className="inline-flex items-center gap-1 text-amber-300 font-bold">
                        <Clock className="w-3.5 h-3.5" />
                        In Review
                    </span>
                </div>
            </div>

            {/* Notification Information */}
            <div className="p-3 bg-[#0B6E8A]/20 border border-[#2EC4D6]/30 backdrop-blur-md rounded-xl mb-6 flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-[#2EC4D6] shrink-0 mt-0.5" />
                <p className="text-[11px] text-[#A8E6E8] leading-normal">
                    You will receive an email confirmation once your instructor approves your account. You can also click the button below at any time to re-check your status.
                </p>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2.5">
                <button
                    type="button"
                    onClick={handleCheckStatus}
                    disabled={isChecking}
                    className="w-full py-3 px-4 rounded-xl text-sm font-semibold text-[#F4FBFC] cyber-glow-btn disabled:opacity-60 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                    <RefreshCw className={`w-4 h-4 ${isChecking ? 'animate-spin' : ''}`} />
                    {isChecking ? 'Checking Status...' : 'Check Approval Status'}
                </button>

                <Link
                    href="/login"
                    className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-[#A8E6E8] hover:text-[#F4FBFC] cyber-oauth-btn transition-all flex items-center justify-center gap-1.5"
                >
                    <LogIn className="w-3.5 h-3.5" />
                    Return to Login
                </Link>
            </div>
        </GuestLayout>
    );
}

