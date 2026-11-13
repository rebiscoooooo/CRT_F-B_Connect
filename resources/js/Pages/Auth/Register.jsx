import React, { useState } from 'react';
import { useForm, Link, Head } from '@inertiajs/react';
import GuestLayout from '@/Layouts/GuestLayout';
import { Eye, EyeOff, UserPlus, ShieldAlert, GraduationCap } from 'lucide-react';

export default function Register({ allowRegistration = true }) {
    const [showPassword, setShowPassword] = useState(false);

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
            <GuestLayout>
                <Head title="Registration Closed — CRT F&B Connect" />
                <div className="text-center py-6">
                    <GraduationCap className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                    <h3 className="text-lg font-bold text-slate-800">Registration Currently Closed</h3>
                    <p className="text-xs text-slate-500 mt-2">
                        Online student registration is disabled by administration. Please contact your CRT F&amp;B instructor.
                    </p>
                    <div className="mt-6">
                        <Link
                            href="/login"
                            className="inline-block px-5 py-2.5 bg-blue-600 text-white font-bold text-xs rounded-xl shadow-sm"
                        >
                            Return to Login
                        </Link>
                    </div>
                </div>
            </GuestLayout>
        );
    }

    return (
        <GuestLayout>
            <Head title="Student Registration — CRT F&B Connect" />

            <div className="mb-6 text-center">
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">Create Student Account</h2>
                <p className="text-xs text-slate-500 mt-1">Register your details to access classroom materials</p>
            </div>

            <form onSubmit={submit} className="space-y-3.5">
                {/* Student Number */}
                <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Student ID Number <span className="text-rose-500">*</span>
                    </label>
                    <input
                        type="text"
                        value={data.student_number}
                        onChange={(e) => setData('student_number', e.target.value)}
                        placeholder="e.g. 2024-CRT-0210"
                        className={`w-full px-3.5 py-2 text-sm bg-white rounded-xl border ${
                            errors.student_number ? 'border-rose-400' : 'border-slate-200 focus:border-blue-600'
                        } focus:outline-none focus:ring-2 focus:ring-blue-600/20 transition-all`}
                        required
                    />
                    {errors.student_number && (
                        <p className="mt-1 text-xs text-rose-600 font-medium">{errors.student_number}</p>
                    )}
                </div>

                {/* Name Fields: First, Middle, Last */}
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
                        <input
                            type="text"
                            value={data.contact_number}
                            onChange={(e) => setData('contact_number', e.target.value)}
                            placeholder="+63 917 000 0000"
                            className="w-full px-3.5 py-2 text-sm bg-white rounded-xl border border-slate-200 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20 transition-all"
                        />
                    </div>
                </div>

                {/* Email Address */}
                <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Email Address <span className="text-rose-500">*</span>
                    </label>
                    <input
                        type="email"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        placeholder="student@crt.edu.ph"
                        className={`w-full px-3.5 py-2 text-sm bg-white rounded-xl border ${
                            errors.email ? 'border-rose-400' : 'border-slate-200 focus:border-blue-600'
                        } focus:outline-none focus:ring-2 focus:ring-blue-600/20 transition-all`}
                        required
                    />
                    {errors.email && (
                        <p className="mt-1 text-xs text-rose-600 font-medium">{errors.email}</p>
                    )}
                </div>

                {/* Passwords */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                            Password <span className="text-rose-500">*</span>
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                placeholder="Min. 8 characters"
                                className={`w-full px-3.5 py-2 text-sm bg-white rounded-xl border ${
                                    errors.password ? 'border-rose-400' : 'border-slate-200 focus:border-blue-600'
                                } focus:outline-none focus:ring-2 focus:ring-blue-600/20 transition-all`}
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                            >
                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
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
                        <input
                            type={showPassword ? 'text' : 'password'}
                            value={data.password_confirmation}
                            onChange={(e) => setData('password_confirmation', e.target.value)}
                            placeholder="Repeat password"
                            className="w-full px-3.5 py-2 text-sm bg-white rounded-xl border border-slate-200 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20 transition-all"
                            required
                        />
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
                            I agree to the <span className="font-semibold text-blue-600">Terms of Use</span> and student conduct policies of the CRT Food &amp; Beverage LMS.
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
                    <UserPlus className="w-4 h-4" />
                    {processing ? 'Registering Account...' : 'Complete Registration'}
                </button>
            </form>

            <div className="mt-6 pt-5 border-t border-slate-100 text-center">
                <p className="text-xs text-slate-500">
                    Already registered?{' '}
                    <Link href="/login" className="font-bold text-blue-600 hover:text-blue-700 hover:underline">
                        Sign in here
                    </Link>
                </p>
            </div>
        </GuestLayout>
    );
}
