import React, { useState } from 'react';
import { useForm, Link, Head } from '@inertiajs/react';
import GuestLayout from '@/Layouts/GuestLayout';
import { Eye, EyeOff, LogIn, Lock, Mail, ShieldAlert } from 'lucide-react';

export default function Login() {
    const [showPassword, setShowPassword] = useState(false);

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

            <div className="mb-6 text-center">
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">Welcome Back</h2>
                <p className="text-xs text-slate-500 mt-1">Sign in to your classroom learning account</p>
            </div>

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
