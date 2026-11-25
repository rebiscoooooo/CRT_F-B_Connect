import React, { useState, useRef, useEffect } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { Bell, Menu, X, User as UserIcon, LogOut, ChevronDown, CheckCheck, ExternalLink } from 'lucide-react';
import ApplicationLogo from './ApplicationLogo';
import PwaInstallButton from './PwaInstallButton';
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
        <header className="sticky top-0 z-30 h-16 bg-[#061923]/90 backdrop-blur-md border-b border-[#A8E6E8]/15 px-4 sm:px-6 flex items-center justify-between">
            {/* Left: Mobile hamburger & Logo/Title */}
            <div className="flex items-center gap-3">
                <button
                    onClick={onToggleSidebar}
                    className="p-2 rounded-xl text-[#A8E6E8] hover:text-[#F4FBFC] hover:bg-[#0B6E8A]/30 transition-colors lg:hidden"
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
                <PwaInstallButton className="hidden md:inline-flex" />

                {/* Notifications Dropdown */}
                <div className="relative" ref={notifRef}>
                    <button
                        onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                        className="relative p-2 rounded-xl text-[#A8E6E8] hover:text-[#F4FBFC] hover:bg-[#0B6E8A]/30 transition-colors"
                        aria-label="View notifications"
                    >
                        <Bell className="w-5 h-5" />
                        {unreadCount > 0 && (
                            <span className="absolute top-1.5 right-1.5 min-w-[18px] h-[18px] px-1 flex items-center justify-center text-[10px] font-bold text-[#061923] bg-[#2EC4D6] rounded-full ring-2 ring-[#061923] animate-pulse">
                                {unreadCount > 9 ? '9+' : unreadCount}
                            </span>
                        )}
                    </button>

                    {isNotificationOpen && (
                        <>
                            {/* Mobile overlay backdrop */}
                            <div
                                className="fixed inset-0 z-40 bg-[#061923]/60 backdrop-blur-sm sm:hidden"
                                onClick={() => setIsNotificationOpen(false)}
                            />

                            <div className="fixed sm:absolute left-3 right-3 sm:left-auto sm:right-0 top-18 sm:top-full mt-1 sm:mt-2 w-auto sm:w-96 max-w-[calc(100vw-1.5rem)] sm:max-w-md cyber-glass-card rounded-2xl shadow-2xl border border-[#A8E6E8]/20 py-3 z-50 animate-in fade-in zoom-in-95 duration-150">
                                <div className="flex items-center justify-between px-4 pb-2 border-b border-[#A8E6E8]/15">
                                    <div className="flex items-center gap-2">
                                        <h4 className="text-sm font-bold text-[#F4FBFC]">Notifications</h4>
                                        {unreadCount > 0 && (
                                            <span className="px-2 py-0.5 text-[10px] font-semibold bg-[#2EC4D6]/20 text-[#2EC4D6] border border-[#2EC4D6]/30 rounded-full">
                                                {unreadCount} new
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {unreadCount > 0 && (
                                            <Link
                                                href="/notifications/read-all"
                                                method="post"
                                                as="button"
                                                onClick={() => setIsNotificationOpen(false)}
                                                className="text-xs font-semibold text-[#2EC4D6] hover:text-[#A8E6E8] flex items-center gap-1 cursor-pointer transition-colors"
                                            >
                                                <CheckCheck className="w-3.5 h-3.5" />
                                                Mark all read
                                            </Link>
                                        )}
                                        <button
                                            type="button"
                                            onClick={() => setIsNotificationOpen(false)}
                                            className="p-1 text-[#A8E6E8]/60 hover:text-[#F4FBFC] rounded-lg sm:hidden transition-colors"
                                            aria-label="Close notifications"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>

                                <div className="max-h-[60vh] sm:max-h-72 overflow-y-auto divide-y divide-[#A8E6E8]/10 overscroll-contain">
                                    {recentNotifications.length > 0 ? (
                                        recentNotifications.map((notif) => (
                                            <div
                                                key={notif.id}
                                                className={`p-3 text-xs transition-colors hover:bg-[#0B6E8A]/20 ${
                                                    !notif.read_at ? 'bg-[#2EC4D6]/10' : ''
                                                }`}
                                            >
                                                <div className="flex items-start justify-between gap-2">
                                                    <p className="font-semibold text-[#F4FBFC]">{notif.title}</p>
                                                    {!notif.read_at && (
                                                        <span className="w-2 h-2 rounded-full bg-[#2EC4D6] flex-shrink-0 mt-1 shadow-[0_0_6px_#2EC4D6]" />
                                                    )}
                                                </div>
                                                <p className="text-[#A8E6E8]/70 mt-1 leading-relaxed line-clamp-2">{notif.message}</p>
                                                <div className="flex items-center justify-between mt-2 pt-1">
                                                    <span className="text-[10px] text-[#A8E6E8]/50">
                                                        {new Date(notif.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </span>
                                                    {!notif.read_at && (
                                                        <Link
                                                            href={`/notifications/${notif.id}/read`}
                                                            method="post"
                                                            as="button"
                                                            className="text-[10px] font-semibold text-[#2EC4D6] hover:underline"
                                                        >
                                                            Mark as read
                                                        </Link>
                                                    )}
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="p-6 text-center text-xs text-[#A8E6E8]/50">
                                            No notifications yet.
                                        </div>
                                    )}
                                </div>

                                <div className="pt-2 px-4 border-t border-[#A8E6E8]/15 text-center">
                                    <Link
                                        href="/notifications"
                                        onClick={() => setIsNotificationOpen(false)}
                                        className="text-xs font-semibold text-[#2EC4D6] hover:text-[#A8E6E8] hover:underline inline-flex items-center gap-1 transition-colors"
                                    >
                                        View all notifications
                                        <ExternalLink className="w-3 h-3" />
                                    </Link>
                                </div>
                            </div>
                        </>
                    )}
                </div>

                {/* Profile Menu Dropdown */}
                {user ? (
                    <div className="relative" ref={profileRef}>
                        <button
                            onClick={() => setIsProfileOpen(!isProfileOpen)}
                            className="flex items-center gap-2 p-1 rounded-xl hover:bg-[#0B6E8A]/30 transition-colors"
                        >
                            <img
                                src={user.avatar_url}
                                alt={user.name}
                                className="w-8 h-8 rounded-lg object-cover ring-1 ring-[#2EC4D6]/40"
                            />
                            <div className="hidden md:block text-left text-xs">
                                <p className="font-bold text-[#F4FBFC] leading-tight truncate max-w-[120px]">{user.name}</p>
                                <p className="text-[10px] text-[#2EC4D6] font-semibold uppercase">{user.role}</p>
                            </div>
                            <ChevronDown className="w-3.5 h-3.5 text-[#A8E6E8]/60 hidden sm:block" />
                        </button>

                        {isProfileOpen && (
                            <div className="absolute right-0 mt-2 w-56 cyber-glass-card rounded-2xl shadow-xl border border-[#A8E6E8]/20 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                                <div className="px-4 py-2 border-b border-[#A8E6E8]/15">
                                    <p className="text-xs font-bold text-[#F4FBFC] truncate">{user.name}</p>
                                    <p className="text-[11px] text-[#A8E6E8]/70 truncate">{user.email}</p>
                                    {user.student_number && (
                                        <p className="text-[10px] text-[#2EC4D6] font-mono mt-0.5">ID: {user.student_number}</p>
                                    )}
                                </div>

                                <div className="py-1">
                                    <Link
                                        href="/profile"
                                        onClick={() => setIsProfileOpen(false)}
                                        className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-[#A8E6E8] hover:bg-[#0B6E8A]/30 hover:text-[#F4FBFC] transition-colors"
                                    >
                                        <UserIcon className="w-4 h-4 text-[#A8E6E8]/60" />
                                        Profile Settings
                                    </Link>
                                    {user.is_admin ? (
                                        <Link
                                            href="/admin/settings"
                                            onClick={() => setIsProfileOpen(false)}
                                            className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-[#A8E6E8] hover:bg-[#0B6E8A]/30 hover:text-[#F4FBFC] transition-colors"
                                        >
                                            System Settings
                                        </Link>
                                    ) : null}
                                </div>

                                <div className="pt-1 border-t border-[#A8E6E8]/15">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setIsProfileOpen(false);
                                            secureLogout();
                                        }}
                                        className="w-full flex items-center gap-2 px-4 py-2 text-xs font-medium text-rose-400 hover:bg-rose-500/15 hover:text-rose-300 transition-colors text-left"
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
                            className="px-4 py-2 text-xs font-semibold text-[#A8E6E8] hover:text-[#F4FBFC] cyber-oauth-btn border border-[#A8E6E8]/20 rounded-xl transition-colors"
                        >
                            Log in
                        </Link>
                        <Link
                            href="/register"
                            className="px-4 py-2 text-xs font-semibold text-[#F4FBFC] cyber-glow-btn rounded-xl shadow-sm transition-colors"
                        >
                            Register
                        </Link>
                    </div>
                )}
            </div>
        </header>
    );
}

