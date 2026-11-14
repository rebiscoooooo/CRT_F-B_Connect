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
                <div className="flex items-center justify-between text-xs font-bold text-slate-500 mb-2">
                    <span className="flex items-center gap-1.5 text-emerald-600 font-extrabold">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        1. Email Verified
                    </span>
                    <span className="h-0.5 flex-1 mx-3 bg-emerald-500"></span>
                    <span className="flex items-center gap-1.5 text-amber-600 font-extrabold">
                        <span className="w-5 h-5 rounded-full bg-amber-500 text-white flex items-center justify-center text-[10px] animate-pulse">2</span>
                        2. Teacher Approval
                    </span>
                </div>
            </div>

            {/* Status Icon */}
            <div className="text-center mb-6">
                <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-3xl flex items-center justify-center mx-auto mb-3.5 shadow-inner ring-4 ring-amber-50">
                    <Clock className="w-8 h-8 animate-pulse" />
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 uppercase tracking-wider mb-2">
                    <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                    Pending Verification
                </div>
                <h2 className="text-xl font-black text-slate-900 tracking-tight">Account Awaiting Approval</h2>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                    Thank you for verifying your email. To protect our learning environment and prevent dummy accounts, your instructor or department administrator must confirm your enrollment before access is granted.
                </p>
            </div>

            {/* Student Info Card */}
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 mb-6 space-y-2.5 text-xs">
                <div className="flex items-center justify-between">
                    <span className="text-slate-500 font-medium">Student Name</span>
                    <span className="font-bold text-slate-900">{student?.name || '—'}</span>
                </div>
                <div className="flex items-center justify-between">
                    <span className="text-slate-500 font-medium">Student ID Number</span>
                    <span className="font-mono font-bold text-slate-900">{student?.student_number || '—'}</span>
                </div>
                <div className="flex items-center justify-between">
                    <span className="text-slate-500 font-medium">Email Address</span>
                    <span className="font-medium text-slate-700 truncate max-w-[180px]">{student?.email || '—'}</span>
                </div>
                <div className="flex items-center justify-between pt-1 border-t border-slate-200">
                    <span className="text-slate-500 font-medium">Email Status</span>
                    <span className="inline-flex items-center gap-1 text-emerald-600 font-bold">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Verified
                    </span>
                </div>
                <div className="flex items-center justify-between">
                    <span className="text-slate-500 font-medium">Approval Status</span>
                    <span className="inline-flex items-center gap-1 text-amber-700 font-bold">
                        <Clock className="w-3.5 h-3.5" />
                        In Review
                    </span>
                </div>
            </div>

            {/* Notification Information */}
            <div className="p-3 bg-blue-50/70 border border-blue-200/70 rounded-xl mb-6 flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <p className="text-[11px] text-blue-800 leading-normal">
                    You will receive an email confirmation once your instructor approves your account. You can also click the button below at any time to re-check your status.
                </p>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2.5">
                <button
                    type="button"
                    onClick={handleCheckStatus}
                    disabled={isChecking}
                    className="w-full py-3 px-4 rounded-xl text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:opacity-60 shadow-md shadow-blue-600/20 hover:shadow-lg transition-all flex items-center justify-center gap-2"
                >
                    <RefreshCw className={`w-4 h-4 ${isChecking ? 'animate-spin' : ''}`} />
                    {isChecking ? 'Checking Status...' : 'Check Approval Status'}
                </button>

                <Link
                    href="/login"
                    className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 transition-all flex items-center justify-center gap-1.5"
                >
                    <LogIn className="w-3.5 h-3.5" />
                    Return to Login
                </Link>
            </div>
        </GuestLayout>
    );
}

