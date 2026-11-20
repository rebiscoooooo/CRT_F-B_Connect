import React, { useState, useEffect } from 'react';
import { useForm, Link, Head, usePage, router } from '@inertiajs/react';
import GuestLayout from '@/Layouts/GuestLayout';
import { Eye, EyeOff, LogIn, Lock, Mail, ShieldAlert, ArrowLeft, Clock } from 'lucide-react';

export default function Login() {
    const { auth } = usePage().props;
    const [showPassword, setShowPassword] = useState(false);
    const isTimeout = typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('timeout') === '1';

    // Clear any stale local auth state on login screen
    useEffect(() => {
        try {
            sessionStorage.removeItem('crt_authenticated');
            localStorage.removeItem('crt_session_active');
            localStorage.removeItem('crt_last_active');
        } catch (e) {}
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
        <GuestLayout>
            <Head title="Sign In — CRT F&B Connect" />

            {/* Back to Menu Navigation */}
            <div className="mb-5 flex items-center justify-between">
                <Link
                    href="/"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-600 hover:text-blue-600 bg-slate-100/90 hover:bg-blue-50 border border-slate-200/80 hover:border-blue-200 transition-all duration-200 group"
                    title="Return to Main Menu / Landing Page"
                >
                    <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
                    <span>Back to Menu</span>
                </Link>

                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Student &amp; Faculty
                </span>
            </div>

            <div className="mb-6 text-center">
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">Welcome Back</h2>
                <p className="text-xs text-slate-500 mt-1">Sign in to your classroom learning account</p>
            </div>

            {isTimeout && (
                <div className="mb-4 p-3 bg-amber-50 rounded-xl border border-amber-200/80 text-xs text-amber-800 flex items-center gap-2.5 animate-in fade-in duration-200">
                    <Clock className="w-4 h-4 text-amber-600 flex-shrink-0" />
                    <span>Your session has timed out due to inactivity. Please sign in again.</span>
                </div>
            )}

            <form onSubmit={submit} className="space-y-4">
                {/* Email or Student Number */}
                <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Email Address or Student ID
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                            <Mail className="w-4 h-4" />
                        </div>
                        <input
                            type="text"
                            value={data.login}
                            onChange={(e) => setData('login', e.target.value)}
                            placeholder="Enter your email address or student ID"
                            className={`w-full pl-10 pr-4 py-2.5 text-sm bg-white rounded-xl border ${
                                errors.login ? 'border-rose-400 focus:ring-rose-400' : 'border-slate-200 focus:border-blue-600 focus:ring-blue-600'
                            } shadow-2xs focus:outline-none focus:ring-2 focus:ring-opacity-20 transition-all`}
                            required
                            autoFocus
                        />
                    </div>
                    {errors.login && (
                        <p className="mt-1 text-xs text-rose-600 font-medium flex items-center gap-1">
                            <ShieldAlert className="w-3.5 h-3.5" />
                            {errors.login}
                        </p>
                    )}
                </div>

                {/* Password with Show/Hide */}
                <div>
                    <div className="flex items-center justify-between mb-1.5">
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                            Password
                        </label>
                    </div>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                            <Lock className="w-4 h-4" />
                        </div>
                        <input
                            type={showPassword ? 'text' : 'password'}
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            placeholder="••••••••"
                            className={`w-full pl-10 pr-10 py-2.5 text-sm bg-white rounded-xl border ${
                                errors.password ? 'border-rose-400 focus:ring-rose-400' : 'border-slate-200 focus:border-blue-600 focus:ring-blue-600'
                            } shadow-2xs focus:outline-none focus:ring-2 focus:ring-opacity-20 transition-all`}
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600"
                        >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                    </div>
                    {errors.password && (
                        <p className="mt-1 text-xs text-rose-600 font-medium flex items-center gap-1">
                            <ShieldAlert className="w-3.5 h-3.5" />
                            {errors.password}
                        </p>
                    )}
                </div>

                {/* Remember Me */}
                <div className="flex items-center justify-between pt-1">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input
                            type="checkbox"
                            checked={data.remember}
                            onChange={(e) => setData('remember', e.target.checked)}
                            className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                        />
                        <span className="text-xs font-medium text-slate-600">Remember this device</span>
                    </label>

                    <span className="text-xs text-slate-400">Secure SSL Session</span>
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={processing}
                    className="w-full mt-2 py-3 px-4 rounded-xl text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:opacity-60 shadow-md shadow-blue-600/20 hover:shadow-lg transition-all flex items-center justify-center gap-2"
                >
                    <LogIn className="w-4 h-4" />
                    {processing ? 'Signing In...' : 'Sign In to LMS'}
                </button>
            </form>

            {/* OR Divider */}
            <div className="relative my-5">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-200" />
                </div>
                <div className="relative flex justify-center text-xs">
                    <span className="bg-white px-3 text-slate-400 font-medium">or continue with</span>
                </div>
            </div>

            {/* Google Sign In */}
            <a
                href="/auth/google"
                className="w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 text-sm font-semibold text-slate-700 shadow-2xs transition-all duration-200 group"
            >
                <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z" fill="#FFC107"/>
                    <path d="M6.306 14.691l6.571 4.819C14.655 15.108 19.001 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C16.318 4 9.656 8.337 6.306 14.691z" fill="#FF3D00"/>
                    <path d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z" fill="#4CAF50"/>
                    <path d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002l6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z" fill="#1976D2"/>
                </svg>
                Sign in with Google
            </a>

            <div className="mt-6 pt-5 border-t border-slate-100 text-center">
                <p className="text-xs text-slate-500">
                    Don't have a student account yet?{' '}
                    <Link href="/register" className="font-bold text-blue-600 hover:text-blue-700 hover:underline">
                        Register here
                    </Link>
                </p>
            </div>
        </GuestLayout>
    );
}
