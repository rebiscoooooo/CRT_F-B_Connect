import React, { useState, useRef, useEffect } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { Bell, Menu, X, User as UserIcon, LogOut, ChevronDown, CheckCheck, ExternalLink } from 'lucide-react';
import ApplicationLogo from './ApplicationLogo';
import { secureLogout } from '../utils/auth';

export default function Navbar({ onToggleSidebar }) {
    const { auth, notifications, appName } = usePage().props;
    const user = auth?.user;

    const [isNotificationOpen, setIsNotificationOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    const notifRef = useRef(null);
    const profileRef = useRef(null);

    // Close dropdowns on click outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (notifRef.current && !notifRef.current.contains(event.target)) {
                setIsNotificationOpen(false);
            }
            if (profileRef.current && !profileRef.current.contains(event.target)) {
                setIsProfileOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const unreadCount = notifications?.unread_count || 0;
    const recentNotifications = notifications?.recent || [];

    return (
        <header className="sticky top-0 z-30 h-16 bg-white/80 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 flex items-center justify-between">
            {/* Left: Mobile hamburger & Logo/Title */}
            <div className="flex items-center gap-3">
                <button
                    onClick={onToggleSidebar}
                    className="p-2 rounded-xl text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-colors lg:hidden"
                    aria-label="Toggle navigation menu"
                >
                    <Menu className="w-5 h-5" />
                </button>

                <ApplicationLogo
                    size="md"
                    showText={true}
                    subtitle="Digital LMS"
                    href={user?.is_admin ? '/admin/dashboard' : (user ? '/student/dashboard' : '/')}
                    className="group"
                    imgClassName="group-hover:scale-105 transition-transform"
                />
            </div>

            {/* Right: Notifications & User profile */}
            <div className="flex items-center gap-2 sm:gap-3">
                {/* Notifications Dropdown */}
                <div className="relative" ref={notifRef}>
                    <button
                        onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                        className="relative p-2 rounded-xl text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                        aria-label="View notifications"
                    >
                        <Bell className="w-5 h-5" />
                        {unreadCount > 0 && (
                            <span className="absolute top-1.5 right-1.5 min-w-[18px] h-[18px] px-1 flex items-center justify-center text-[10px] font-bold text-white bg-blue-600 rounded-full ring-2 ring-white animate-pulse">
                                {unreadCount > 9 ? '9+' : unreadCount}
                            </span>
                        )}
                    </button>

                    {isNotificationOpen && (
                        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-slate-100 py-3 z-50 animate-in fade-in zoom-in-95 duration-150">
                            <div className="flex items-center justify-between px-4 pb-2 border-b border-slate-100">
                                <div className="flex items-center gap-2">
                                    <h4 className="text-sm font-bold text-slate-900">Notifications</h4>
                                    {unreadCount > 0 && (
                                        <span className="px-2 py-0.5 text-[10px] font-semibold bg-blue-50 text-blue-600 rounded-full">
                                            {unreadCount} new
                                        </span>
                                    )}
                                </div>
                                {unreadCount > 0 && (
                                    <Link
                                        href="/notifications/read-all"
                                        method="post"
                                        as="button"
                                        onClick={() => setIsNotificationOpen(false)}
                                        className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
                                    >
                                        <CheckCheck className="w-3.5 h-3.5" />
                                        Mark all read
                                    </Link>
                                )}
                            </div>

                            <div className="max-h-72 overflow-y-auto divide-y divide-slate-50">
                                {recentNotifications.length > 0 ? (
                                    recentNotifications.map((notif) => (
                                        <div
                                            key={notif.id}
                                            className={`p-3 text-xs transition-colors hover:bg-slate-50/80 ${!notif.read_at ? 'bg-blue-50/40' : ''
                                                }`}
                                        >
                                            <div className="flex items-start justify-between gap-2">
                                                <p className="font-semibold text-slate-800">{notif.title}</p>
                                                {!notif.read_at && (
                                                    <span className="w-2 h-2 rounded-full bg-blue-600 flex-shrink-0 mt-1" />
                                                )}
                                            </div>
                                            <p className="text-slate-500 mt-1 leading-relaxed line-clamp-2">{notif.message}</p>
                                            <div className="flex items-center justify-between mt-2 pt-1">
                                                <span className="text-[10px] text-slate-400">
                                                    {new Date(notif.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                                {!notif.read_at && (
                                                    <Link
                                                        href={`/notifications/${notif.id}/read`}
                                                        method="post"
                                                        as="button"
                                                        className="text-[10px] font-semibold text-blue-600 hover:underline"
                                                    >
                                                        Mark as read
                                                    </Link>
                                                )}
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="p-6 text-center text-xs text-slate-400">
                                        No notifications yet.
                                    </div>
                                )}
                            </div>

                            <div className="pt-2 px-4 border-t border-slate-100 text-center">
                                <Link
                                    href="/notifications"
                                    onClick={() => setIsNotificationOpen(false)}
                                    className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline inline-flex items-center gap-1"
                                >
                                    View all notifications
                                    <ExternalLink className="w-3 h-3" />
                                </Link>
                            </div>
                        </div>
                    )}
                </div>

                {/* Profile Menu Dropdown */}
                {user ? (
                    <div className="relative" ref={profileRef}>
                        <button
                            onClick={() => setIsProfileOpen(!isProfileOpen)}
                            className="flex items-center gap-2 p-1 rounded-xl hover:bg-slate-100 transition-colors"
                        >
                            <img
                                src={user.avatar_url}
                                alt={user.name}
                                className="w-8 h-8 rounded-lg object-cover ring-1 ring-slate-200"
                            />
                            <div className="hidden md:block text-left text-xs">
                                <p className="font-bold text-slate-800 leading-tight truncate max-w-[120px]">{user.name}</p>
                                <p className="text-[10px] text-blue-600 font-semibold uppercase">{user.role}</p>
                            </div>
                            <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
                        </button>

                        {isProfileOpen && (
                            <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                                <div className="px-4 py-2 border-b border-slate-100">
                                    <p className="text-xs font-bold text-slate-900 truncate">{user.name}</p>
                                    <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                                    {user.student_number && (
                                        <p className="text-[10px] text-blue-600 font-mono mt-0.5">ID: {user.student_number}</p>
                                    )}
                                </div>

                                <div className="py-1">
                                    <Link
                                        href="/profile"
                                        onClick={() => setIsProfileOpen(false)}
                                        className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition-colors"
                                    >
                                        <UserIcon className="w-4 h-4 text-slate-400" />
                                        Profile Settings
                                    </Link>
                                    {user.is_admin ? (
                                        <Link
                                            href="/admin/settings"
                                            onClick={() => setIsProfileOpen(false)}
                                            className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition-colors"
                                        >
                                            System Settings
                                        </Link>
                                    ) : null}
                                </div>

                                <div className="pt-1 border-t border-slate-100">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setIsProfileOpen(false);
                                            secureLogout();
                                        }}
                                        className="w-full flex items-center gap-2 px-4 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 transition-colors text-left"
                                    >
                                        <LogOut className="w-4 h-4" />
                                        Sign out
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="flex items-center gap-2">
                        <Link
                            href="/login"
                            className="px-4 py-2 text-xs font-semibold text-slate-700 hover:text-blue-600 transition-colors"
                        >
                            Log in
                        </Link>
                        <Link
                            href="/register"
                            className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm transition-colors"
                        >
                            Register
                        </Link>
                    </div>
                )}
            </div>
        </header>
    );
}

