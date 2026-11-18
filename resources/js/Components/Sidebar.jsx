import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import ApplicationLogo from './ApplicationLogo';
import PwaInstallButton from './PwaInstallButton';
import {
    LayoutDashboard,
    FolderKanban,
    Users,
    Activity,
    Settings,
    Video,
    Image,
    FileText,
    BookOpen,
    Folder,
    User,
    LogOut,
    GraduationCap,
    ClipboardCheck,
    ShieldCheck,
    X,
    ChevronRight,
    Sparkles,
} from 'lucide-react';

export default function Sidebar({ isOpen, onClose }) {
    const page = usePage();
    const user = page?.props?.auth?.user;
    const isAdmin = Boolean(user?.is_admin);
    const currentUrl = page?.url || (typeof window !== 'undefined' ? window.location.pathname : '') || '';

    const adminNav = [
        { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
        { name: 'Resource Management', href: '/admin/resources', icon: FolderKanban },
        { name: 'Student Management', href: '/admin/students', icon: Users },
        { name: 'Faculty & Admins', href: '/admin/teachers', icon: ShieldCheck },
        { name: 'Student Assessments', href: '/admin/assessments', icon: ClipboardCheck },
        { name: 'Activity Logs', href: '/admin/activity-logs', icon: Activity },
        { name: 'System Settings', href: '/admin/settings', icon: Settings },
    ];

    const studentNav = [
        { name: 'Student Dashboard', href: '/student/dashboard', icon: LayoutDashboard },
        { name: 'All Learning Materials', href: '/student/resources', icon: FolderKanban },
        { name: 'Video Lessons', href: '/student/resources/category/video-lessons', icon: Video },
        { name: 'Illustrations', href: '/student/resources/category/illustrations', icon: Image },
        { name: 'PDF Modules', href: '/student/resources/category/pdf-modules', icon: FileText },
        { name: 'Text Lessons', href: '/student/resources/category/text-lessons', icon: BookOpen },
        { name: 'Other Materials', href: '/student/resources/category/other-materials', icon: Folder },
    ];

    const currentNav = isAdmin ? adminNav : studentNav;

    const isActive = (href) => {
        if (!currentUrl || !href) return false;
        if (href === '/admin/resources' && currentUrl.startsWith('/admin/resources')) return true;
        if (href === '/admin/teachers' && currentUrl.startsWith('/admin/teachers')) return true;
        if (href === '/admin/assessments' && currentUrl.startsWith('/admin/assessments')) return true;
        if (href === '/student/resources' && currentUrl === '/student/resources') return true;
        return currentUrl === href || currentUrl.startsWith(href);
    };

    return (
        <>
            {/* Mobile backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs lg:hidden transition-opacity"
                    onClick={onClose}
                />
            )}

            {/* Sidebar drawer container */}
            <aside
                className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-white border-r border-slate-200/80 shadow-[4px_0_24px_rgba(15,23,42,0.02)] flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
            >
                {/* Brand Header */}
                <div className="h-16 flex items-center justify-between px-5 border-b border-slate-100 bg-gradient-to-b from-slate-50/50 to-transparent">
                    <ApplicationLogo
                        size="sm"
                        showText={true}
                        subtitle={isAdmin ? 'Admin Portal' : 'Student Portal'}
                        href={isAdmin ? '/admin/dashboard' : '/student/dashboard'}
                        className="group"
                    />
                    <button
                        onClick={onClose}
                        className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 lg:hidden transition-colors"
                        aria-label="Close menu"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Professional Inset User Card */}
                <div className="px-3.5 pt-3 pb-1">
                    <div className="p-3 rounded-2xl bg-gradient-to-br from-slate-50 via-blue-50/20 to-sky-50/30 border border-slate-200/70 shadow-2xs">
                        <div className="flex items-center gap-3">
                            <div className="relative shrink-0">
                                <img
                                    src={user?.avatar_url}
                                    alt={user?.name}
                                    className="w-10 h-10 rounded-xl object-cover ring-2 ring-white shadow-xs"
                                />
                                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full shadow-xs" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-xs font-bold text-slate-900 truncate leading-snug">
                                    {user?.name || 'User'}
                                </p>
                                <div className="mt-0.5">
                                    <span className={`inline-flex items-center px-2 py-0.5 text-[9px] font-bold rounded-md tracking-wider uppercase ${isAdmin
                                        ? 'bg-blue-100/80 text-blue-700 border border-blue-200/60'
                                        : 'bg-emerald-100/80 text-emerald-700 border border-emerald-200/60'
                                        }`}>
                                        {isAdmin ? 'Instructor / Admin' : 'Student'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Navigation links */}
                <div className="flex-1 overflow-y-auto px-3.5 py-3 space-y-1">
                    <div className="px-2 pt-1 pb-2 flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-slate-400">
                        <span>{isAdmin ? 'Administrative Portal' : 'Student Classroom'}</span>
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-200" />
                    </div>

                    {currentNav.map((item) => {
                        const Icon = item.icon;
                        const active = isActive(item.href);
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                onClick={() => onClose && onClose()}
                                className={`group relative flex items-center gap-3 px-2.5 py-2 rounded-xl text-xs font-semibold transition-all duration-150 ${active
                                    ? 'bg-blue-50/90 text-blue-700 font-bold border border-blue-200/70 shadow-2xs'
                                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70 border border-transparent'
                                    }`}
                            >
                                <div
                                    className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-all duration-150 ${active
                                        ? 'bg-blue-600 text-white shadow-xs shadow-blue-500/30'
                                        : 'bg-slate-100/80 text-slate-500 group-hover:bg-blue-50 group-hover:text-blue-600 group-hover:scale-105'
                                        }`}
                                >
                                    <Icon className="w-4 h-4" />
                                </div>
                                <span className="truncate flex-1">{item.name}</span>
                                {active && (
                                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0 shadow-xs" />
                                )}
                            </Link>
                        );
                    })}

                    <div className="pt-4 px-2 pb-2 flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-slate-400">
                        <span>Account</span>
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-200" />
                    </div>

                    <Link
                        href="/profile"
                        onClick={() => onClose && onClose()}
                        className={`group relative flex items-center gap-3 px-2.5 py-2 rounded-xl text-xs font-semibold transition-all duration-150 ${currentUrl.startsWith('/profile')
                            ? 'bg-blue-50/90 text-blue-700 font-bold border border-blue-200/70 shadow-2xs'
                            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70 border border-transparent'
                            }`}
                    >
                        <div
                            className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-all duration-150 ${currentUrl.startsWith('/profile')
                                ? 'bg-blue-600 text-white shadow-xs shadow-blue-500/30'
                                : 'bg-slate-100/80 text-slate-500 group-hover:bg-blue-50 group-hover:text-blue-600 group-hover:scale-105'
                                }`}
                        >
                            <User className="w-4 h-4" />
                        </div>
                        <span className="truncate flex-1">Profile &amp; Settings</span>
                        {currentUrl.startsWith('/profile') && (
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0 shadow-xs" />
                        )}
                    </Link>
                </div>

                {/* Footer Sign Out & PWA Install */}
                <div className="p-3.5 border-t border-slate-100 bg-slate-50/40 space-y-2">
                    <PwaInstallButton className="w-full justify-center" text="Install Application" />
                    <Link
                        href="/logout"
                        method="post"
                        as="button"
                        className="w-full group flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-rose-600 bg-white hover:bg-rose-50/70 border border-slate-200/70 hover:border-rose-200 shadow-2xs hover:shadow-xs transition-all duration-150"
                    >
                        <LogOut className="w-4 h-4 text-slate-400 group-hover:text-rose-500 group-hover:-translate-x-0.5 transition-all" />
                        <span>Sign Out</span>
                    </Link>
                    <p className="text-[10px] text-center text-slate-400 mt-2 font-medium">
                        CRT F&amp;B Connect • LMS
                    </p>
                </div>
            </aside>
        </>
    );
}
