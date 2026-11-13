import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import ApplicationLogo from './ApplicationLogo';
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
                    className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs lg:hidden transition-opacity"
                    onClick={onClose}
                />
            )}

            {/* Sidebar drawer container */}
            <aside
                className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-white border-r border-slate-200/90 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
                    isOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
            >
                {/* Brand Header */}
                <div className="h-16 flex items-center justify-between px-6 border-b border-slate-100">
                    <ApplicationLogo
                        size="sm"
                        showText={true}
                        subtitle="CONNECT"
                        href={isAdmin ? '/admin/dashboard' : '/student/dashboard'}
                        className="group"
                    />
                    <button
                        onClick={onClose}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 lg:hidden"
                        aria-label="Close menu"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* User Role Tag */}
                <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
                    <div className="flex items-center gap-3">
                        <img
                            src={user?.avatar_url}
                            alt={user?.name}
                            className="w-10 h-10 rounded-xl object-cover ring-2 ring-blue-500/20"
                        />
                        <div className="overflow-hidden">
                            <p className="text-xs font-bold text-slate-900 truncate">{user?.name}</p>
                            <span className={`inline-block px-2 py-0.5 mt-0.5 text-[9px] font-bold rounded-full uppercase tracking-wider ${
                                isAdmin ? 'bg-blue-100 text-blue-800' : 'bg-emerald-100 text-emerald-800'
                            }`}>
                                {isAdmin ? 'Instructor / Admin' : 'Student'}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Navigation links */}
                <div className="flex-1 overflow-y-auto px-4 py-4 space-y-1">
                    <div className="px-2 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        {isAdmin ? 'Administrative Portal' : 'Student Classroom'}
                    </div>

                    {currentNav.map((item) => {
                        const Icon = item.icon;
                        const active = isActive(item.href);
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                onClick={() => onClose && onClose()}
                                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                                    active
                                        ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20'
                                        : 'text-slate-600 hover:text-blue-600 hover:bg-blue-50/50'
                                }`}
                            >
                                <Icon className={`w-4 h-4 ${active ? 'text-white' : 'text-slate-400 group-hover:text-blue-600'}`} />
                                <span className="truncate">{item.name}</span>
                            </Link>
                        );
                    })}

                    <div className="pt-4 px-2 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Account
                    </div>

                    <Link
                        href="/profile"
                        onClick={() => onClose && onClose()}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                            currentUrl.startsWith('/profile')
                                ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20'
                                : 'text-slate-600 hover:text-blue-600 hover:bg-blue-50/50'
                        }`}
                    >
                        <User className={`w-4 h-4 ${currentUrl.startsWith('/profile') ? 'text-white' : 'text-slate-400'}`} />
                        <span>Profile &amp; Settings</span>
                    </Link>
                </div>

                {/* Footer Sign Out */}
                <div className="p-4 border-t border-slate-100">
                    <Link
                        href="/logout"
                        method="post"
                        as="button"
                        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-100 transition-colors"
                    >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                    </Link>
                </div>
            </aside>
        </>
    );
}

