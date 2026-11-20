import React from 'react';
import { Link } from '@inertiajs/react';
import ApplicationLogo from '@/Components/ApplicationLogo';
import Toast from '../Components/Toast';

export default function GuestLayout({ children }) {
    return (
        <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Background Decorative Gradients */}
            <div className="absolute top-0 -left-40 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 -right-40 w-96 h-96 bg-sky-400/10 rounded-full blur-3xl pointer-events-none" />

            <div className="sm:mx-auto sm:w-full sm:max-w-md text-center z-10 px-4">
                <Link href="/" className="inline-flex flex-col items-center group">
                    <div className="w-20 h-20 rounded-full bg-white ring-4 ring-blue-500/20 shadow-xl shadow-blue-500/15 overflow-hidden flex items-center justify-center group-hover:scale-105 transition-transform">
                        <img
                            src="/images/logo-badge.png"
                            alt="CRT F&B Connect Logo"
                            className="w-full h-full object-cover"
                            onError={(e) => {
                                e.target.src = '/images/logo.png';
                            }}
                        />
                    </div>
                    <div className="mt-3 text-center">
                        <span className="text-xl font-black tracking-tight text-slate-900 block group-hover:text-blue-600 transition-colors">
                            CRT F&amp;B Connect
                        </span>
                        <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">
                            Digital LMS Platform
                        </span>
                    </div>
                </Link>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 z-10">
                <div className="bg-white/90 backdrop-blur-md py-8 px-6 sm:px-10 shadow-xl shadow-slate-200/50 rounded-3xl border border-slate-100">
                    {children}
                </div>
            </div>

            <div className="mt-8 text-center text-xs text-slate-400 z-10">
                <p>College of Research and Technology • Bachelor of Technical Vocational Teachers Education (BTVTE)</p>
            </div>

            <Toast />
        </div>
    );
}

