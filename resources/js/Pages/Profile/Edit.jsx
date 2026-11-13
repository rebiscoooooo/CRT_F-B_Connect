import React, { useState } from 'react';
import { Head, useForm, usePage } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import {
    User,
    Mail,
    Phone,
    Lock,
    Camera,
    Save,
    Check,
    Shield,
    GraduationCap,
    Calendar
} from 'lucide-react';

export default function ProfileEdit({ user }) {
    // 1. Personal Information Form
    const {
        data: infoData,
        setData: setInfoData,
        put: putInfo,
        processing: processingInfo,
        errors: infoErrors,
    } = useForm({
        first_name: user.first_name || '',
        middle_name: user.middle_name || '',
        last_name: user.last_name || '',
        email: user.email || '',
        contact_number: user.contact_number || '',
    });

    const handleInfoSubmit = (e) => {
        e.preventDefault();
        putInfo('/profile');
    };

    // 2. Avatar Form
    const {
        data: avatarData,
        setData: setAvatarData,
        post: postAvatar,
        processing: processingAvatar,
        errors: avatarErrors,
    } = useForm({
        avatar: null,
    });

    const [avatarPreview, setAvatarPreview] = useState(user.avatar_url);

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setAvatarData('avatar', file);
            setAvatarPreview(URL.createObjectURL(file));
        }
    };

    const handleAvatarSubmit = (e) => {
        e.preventDefault();
        postAvatar('/profile/avatar', {
            forceFormData: true,
        });
    };

    // 3. Password Form
    const {
        data: passData,
        setData: setPassData,
        put: putPass,
        processing: processingPass,
        errors: passErrors,
        reset: resetPass,
    } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const handlePassSubmit = (e) => {
        e.preventDefault();
        putPass('/profile/password', {
            onSuccess: () => resetPass(),
        });
    };

    return (
        <AppLayout title="Profile Settings">
            <Head title="Profile & Account Settings — CRT F&B Connect" />

            <div className="max-w-4xl mx-auto space-y-8">
                {/* Header Profile Summary Card */}
                <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-2xs flex flex-col sm:flex-row items-center sm:items-start gap-6 relative overflow-hidden">
                    <div className="relative group">
                        <img
                            src={avatarPreview}
                            alt={user.name}
                            className="w-24 h-24 rounded-2xl object-cover ring-4 ring-blue-500/20 shadow-md"
                        />
                    </div>

                    <div className="text-center sm:text-left flex-1">
                        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                            <h1 className="text-2xl font-black text-slate-900">{user.name}</h1>
                            <span className={`px-2.5 py-0.5 text-[10px] font-bold uppercase rounded-full ${
                                user.role === 'admin' ? 'bg-blue-100 text-blue-800' : 'bg-emerald-100 text-emerald-800'
                            }`}>
                                {user.role}
                            </span>
                        </div>

                        <div className="mt-2 flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-slate-500 font-medium">
                            <span className="flex items-center gap-1.5 font-mono">
                                <Mail className="w-3.5 h-3.5 text-slate-400" />
                                {user.email}
                            </span>
                            {user.student_number && (
                                <span className="flex items-center gap-1.5 font-mono text-blue-600 font-bold">
                                    <GraduationCap className="w-3.5 h-3.5" />
                                    ID: {user.student_number}
                                </span>
                            )}
                            <span className="flex items-center gap-1.5">
                                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                                Member since {user.created_at}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Avatar Upload Card */}
                <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-2xs">
                    <h3 className="text-base font-bold text-slate-900 mb-1 flex items-center gap-2">
                        <Camera className="w-4 h-4 text-blue-600" />
                        Update Profile Picture
                    </h3>
                    <p className="text-xs text-slate-500 mb-5">
                        Upload a clear JPG, PNG, or WebP photo (up to 5MB).
                    </p>

                    <form onSubmit={handleAvatarSubmit} className="flex flex-col sm:flex-row items-center gap-4">
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleAvatarChange}
                            className="block w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                            required
                        />
                        <button
                            type="submit"
                            disabled={processingAvatar || !avatarData.avatar}
                            className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-xl shadow-xs transition-colors whitespace-nowrap"
                        >
                            {processingAvatar ? 'Uploading...' : 'Save Photo'}
                        </button>
                    </form>
                    {avatarErrors.avatar && <p className="text-xs text-rose-600 mt-2">{avatarErrors.avatar}</p>}
                </div>

                {/* Personal Information Form Card */}
                <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-2xs">
                    <h3 className="text-base font-bold text-slate-900 mb-1 flex items-center gap-2">
                        <User className="w-4 h-4 text-blue-600" />
                        Personal Information
                    </h3>
                    <p className="text-xs text-slate-500 mb-6">
                        Update your registered name, contact number, and email.
                    </p>

                    <form onSubmit={handleInfoSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                                    First Name
                                </label>
                                <input
                                    type="text"
                                    value={infoData.first_name}
                                    onChange={(e) => setInfoData('first_name', e.target.value)}
                                    className="w-full px-3.5 py-2 text-xs bg-white rounded-xl border border-slate-200 focus:border-blue-600 focus:outline-none"
                                    required
                                />
                                {infoErrors.first_name && <p className="text-xs text-rose-600 mt-1">{infoErrors.first_name}</p>}
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                                    Last Name
                                </label>
                                <input
                                    type="text"
                                    value={infoData.last_name}
                                    onChange={(e) => setInfoData('last_name', e.target.value)}
                                    className="w-full px-3.5 py-2 text-xs bg-white rounded-xl border border-slate-200 focus:border-blue-600 focus:outline-none"
                                    required
                                />
                                {infoErrors.last_name && <p className="text-xs text-rose-600 mt-1">{infoErrors.last_name}</p>}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                                    Middle Name
                                </label>
                                <input
                                    type="text"
                                    value={infoData.middle_name}
                                    onChange={(e) => setInfoData('middle_name', e.target.value)}
                                    className="w-full px-3.5 py-2 text-xs bg-white rounded-xl border border-slate-200 focus:border-blue-600 focus:outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                                    Contact Number
                                </label>
                                <input
                                    type="text"
                                    value={infoData.contact_number}
                                    onChange={(e) => setInfoData('contact_number', e.target.value)}
                                    className="w-full px-3.5 py-2 text-xs bg-white rounded-xl border border-slate-200 focus:border-blue-600 focus:outline-none"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                                Email Address
                            </label>
                            <input
                                type="email"
                                value={infoData.email}
                                onChange={(e) => setInfoData('email', e.target.value)}
                                className="w-full px-3.5 py-2 text-xs bg-white rounded-xl border border-slate-200 focus:border-blue-600 focus:outline-none"
                                required
                            />
                            {infoErrors.email && <p className="text-xs text-rose-600 mt-1">{infoErrors.email}</p>}
                        </div>

                        <div className="flex items-center justify-end pt-4 border-t border-slate-100">
                            <button
                                type="submit"
                                disabled={processingInfo}
                                className="inline-flex items-center gap-2 px-6 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm transition-colors"
                            >
                                <Save className="w-4 h-4" />
                                {processingInfo ? 'Saving...' : 'Save Profile'}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Password Change Form Card */}
                <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-2xs">
                    <h3 className="text-base font-bold text-slate-900 mb-1 flex items-center gap-2">
                        <Lock className="w-4 h-4 text-blue-600" />
                        Change Password
                    </h3>
                    <p className="text-xs text-slate-500 mb-6">
                        Ensure your account remains secure with a strong password.
                    </p>

                    <form onSubmit={handlePassSubmit} className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                                Current Password
                            </label>
                            <input
                                type="password"
                                value={passData.current_password}
                                onChange={(e) => setPassData('current_password', e.target.value)}
                                placeholder="••••••••"
                                className="w-full px-3.5 py-2 text-xs bg-white rounded-xl border border-slate-200 focus:border-blue-600 focus:outline-none"
                                required
                            />
                            {passErrors.current_password && (
                                <p className="text-xs text-rose-600 mt-1">{passErrors.current_password}</p>
                            )}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                                    New Password
                                </label>
                                <input
                                    type="password"
                                    value={passData.password}
                                    onChange={(e) => setPassData('password', e.target.value)}
                                    placeholder="Min. 8 characters"
                                    className="w-full px-3.5 py-2 text-xs bg-white rounded-xl border border-slate-200 focus:border-blue-600 focus:outline-none"
                                    required
                                />
                                {passErrors.password && (
                                    <p className="text-xs text-rose-600 mt-1">{passErrors.password}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                                    Confirm New Password
                                </label>
                                <input
                                    type="password"
                                    value={passData.password_confirmation}
                                    onChange={(e) => setPassData('password_confirmation', e.target.value)}
                                    placeholder="Repeat new password"
                                    className="w-full px-3.5 py-2 text-xs bg-white rounded-xl border border-slate-200 focus:border-blue-600 focus:outline-none"
                                    required
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-end pt-4 border-t border-slate-100">
                            <button
                                type="submit"
                                disabled={processingPass}
                                className="inline-flex items-center gap-2 px-6 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm transition-colors"
                            >
                                <Lock className="w-4 h-4" />
                                {processingPass ? 'Updating...' : 'Update Password'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
