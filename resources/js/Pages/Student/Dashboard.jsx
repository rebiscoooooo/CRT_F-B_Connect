import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import {
    GraduationCap,
    FolderKanban,
    Video,
    Image as ImageIcon,
    FileText,
    BookOpen,
    Folder,
    Eye,
    Download,
    ArrowRight,
    Sparkles,
    Megaphone,
    Compass,
    CheckCircle2
} from 'lucide-react';

export default function StudentDashboard({
    stats = {},
    categories = [],
    recentResources = [],
    featuredVideos = [],
    recentPdfs = [],
    announcement = '',
}) {
    const { auth } = usePage().props;
    const user = auth?.user;

    const categoryIcons = {
        'video-lessons': Video,
        'illustrations': ImageIcon,
        'pdf-modules': FileText,
        'text-lessons': BookOpen,
        'other-materials': Folder,
    };

    return (
        <AppLayout title="Student Dashboard">
            <Head title="Student Classroom — CRT F&B Connect" />

            {/* Welcome Banner */}
            <div className="relative rounded-3xl bg-gradient-to-r from-blue-700 via-blue-600 to-sky-500 text-white p-6 sm:p-10 shadow-lg shadow-blue-500/20 overflow-hidden mb-8">
                <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none" />

                {/* Decorative Brand Emblem on Banner */}
                <div className="hidden lg:flex absolute right-10 top-1/2 -translate-y-1/2 z-10">
                    <div className="w-32 h-32 xl:w-36 xl:h-36 rounded-full bg-white p-1 shadow-2xl ring-4 ring-white/30 flex items-center justify-center transform rotate-2 hover:rotate-0 transition-transform duration-300">
                        <img
                            src="/images/logo-badge.png"
                            alt="CRT F&B Connect"
                            className="w-full h-full object-cover"
                            onError={(e) => {
                                e.target.src = '/images/logo.png';
                            }}
                        />
                    </div>
                </div>

                <div className="relative z-10 max-w-2xl">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-[11px] font-bold uppercase tracking-wider mb-3">
                        <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                        Digital Classroom Portal
                    </span>

                    <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
                        Welcome back, {user?.first_name || user?.name}!
                    </h1>

                    <p className="mt-2 text-xs sm:text-sm text-blue-50 leading-relaxed">
                        Explore culinary masterclasses, review table cover schematics, and study TESDA NC II service modules at your own pace.
                    </p>

                    <div className="mt-6 flex flex-wrap items-center gap-3">
                        <Link
                            href="/student/resources"
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-blue-700 text-xs font-bold shadow-md hover:bg-blue-50 transition-all hover:scale-105"
                        >
                            Browse All Materials
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                        <Link
                            href="/student/resources/category/video-lessons"
                            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-800/40 hover:bg-blue-800/60 text-white text-xs font-bold backdrop-blur-sm transition-all"
                        >
                            <Video className="w-4 h-4" />
                            Watch Video Lessons
                        </Link>
                    </div>
                </div>
            </div>

            {/* Announcement Banner if present */}
            {announcement && (
                <div className="mb-8 p-4 sm:p-5 rounded-2xl bg-amber-50/80 border border-amber-200/80 flex items-start gap-3.5 text-amber-900 shadow-2xs">
                    <Megaphone className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-amber-800">
                            Instructor Notice &amp; Announcement
                        </h4>
                        <p className="text-xs mt-1 leading-relaxed text-amber-800/90 font-medium whitespace-pre-line">
                            {announcement}
                        </p>
                    </div>
                </div>
            )}

            {/* Student Quick Action Shortcuts */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-8">
                {[
                    { label: 'Browse All', href: '/student/resources', icon: FolderKanban, color: 'text-blue-600 bg-blue-50' },
                    { label: 'Video Lessons', href: '/student/resources/category/video-lessons', icon: Video, color: 'text-indigo-600 bg-indigo-50' },
                    { label: 'Illustrations', href: '/student/resources/category/illustrations', icon: ImageIcon, color: 'text-sky-600 bg-sky-50' },
                    { label: 'PDF Modules', href: '/student/resources/category/pdf-modules', icon: FileText, color: 'text-emerald-600 bg-emerald-50' },
                    { label: 'Text Lessons', href: '/student/resources/category/text-lessons', icon: BookOpen, color: 'text-amber-600 bg-amber-50' },
                ].map((item) => {
                    const Icon = item.icon;
                    return (
                        <Link
                            key={item.label}
                            href={item.href}
                            className="p-3.5 bg-white rounded-2xl border border-slate-200 hover:border-blue-300 hover:shadow-xs transition-all flex flex-col items-center text-center group last:col-span-2 sm:last:col-span-1"
                        >
                            <div className={`p-2.5 rounded-xl ${item.color} group-hover:scale-110 transition-transform mb-2`}>
                                <Icon className="w-5 h-5" />
                            </div>
                            <span className="text-xs font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
                                {item.label}
                            </span>
                        </Link>
                    );
                })}
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                <div className="p-4 bg-white rounded-2xl border border-slate-200 flex items-center justify-between">
                    <div>
                        <p className="text-[11px] font-semibold text-slate-500 uppercase">Available Materials</p>
                        <p className="text-2xl font-bold text-slate-900 mt-1">{stats.total_resources || 0}</p>
                    </div>
                    <div className="p-3 rounded-xl bg-blue-50 text-blue-600">
                        <FolderKanban className="w-5 h-5" />
                    </div>
                </div>
                <div className="p-4 bg-white rounded-2xl border border-slate-200 flex items-center justify-between">
                    <div>
                        <p className="text-[11px] font-semibold text-slate-500 uppercase">Video Masterclasses</p>
                        <p className="text-2xl font-bold text-indigo-600 mt-1">{stats.total_videos || 0}</p>
                    </div>
                    <div className="p-3 rounded-xl bg-indigo-50 text-indigo-600">
                        <Video className="w-5 h-5" />
                    </div>
                </div>
                <div className="p-4 bg-white rounded-2xl border border-slate-200 flex items-center justify-between">
                    <div>
                        <p className="text-[11px] font-semibold text-slate-500 uppercase">Visual Schematics</p>
                        <p className="text-2xl font-bold text-sky-600 mt-1">{stats.total_illustrations || 0}</p>
                    </div>
                    <div className="p-3 rounded-xl bg-sky-50 text-sky-600">
                        <ImageIcon className="w-5 h-5" />
                    </div>
                </div>
                <div className="p-4 bg-white rounded-2xl border border-slate-200 flex items-center justify-between">
                    <div>
                        <p className="text-[11px] font-semibold text-slate-500 uppercase">TESDA Modules</p>
                        <p className="text-2xl font-bold text-emerald-600 mt-1">{stats.total_pdfs || 0}</p>
                    </div>
                    <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600">
                        <FileText className="w-5 h-5" />
                    </div>
                </div>
            </div>

            {/* Featured Videos Section */}
            {featuredVideos.length > 0 && (
                <div className="mb-10">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                                <Video className="w-5 h-5 text-blue-600" />
                                Featured Video Lessons
                            </h3>
                            <p className="text-xs text-slate-500 mt-0.5">High-definition demonstrations by our instructors</p>
                        </div>
                        <Link
                            href="/student/resources/category/video-lessons"
                            className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
                        >
                            View All Videos
                            <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {featuredVideos.map((video) => (
                            <Link
                                key={video.id}
                                href={`/student/resources/${video.id}`}
                                className="bg-white rounded-2xl border border-slate-200 hover:border-blue-300 shadow-2xs hover:shadow-md transition-all overflow-hidden flex flex-col group"
                            >
                                <div className="relative aspect-video bg-slate-950 flex items-center justify-center overflow-hidden">
                                    {video.thumbnail_url ? (
                                        <img src={video.thumbnail_url} alt={video.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                                    ) : (
                                        <div className="w-12 h-12 rounded-full bg-blue-600/90 text-white flex items-center justify-center group-hover:scale-110 transition-transform">
                                            <Video className="w-6 h-6" />
                                        </div>
                                    )}
                                    <span className="absolute bottom-2.5 right-2.5 px-2 py-0.5 text-[10px] font-mono font-bold bg-slate-900/80 text-white rounded">
                                        VIDEO
                                    </span>
                                </div>
                                <div className="p-4 flex-1 flex flex-col justify-between">
                                    <div>
                                        <h4 className="text-xs font-bold text-slate-900 group-hover:text-blue-600 line-clamp-1 transition-colors">
                                            {video.title}
                                        </h4>
                                        <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                                            {video.description}
                                        </p>
                                    </div>
                                    <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                                        <span>{video.category?.name}</span>
                                        <span className="flex items-center gap-1 font-mono"><Eye className="w-3.5 h-3.5" />{video.views_count}</span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            )}

            {/* 2-Column Section: Category Library & Recent PDF Modules */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
                {/* Resource Categories Library */}
                <div className="lg:col-span-7 space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-base font-bold text-slate-900">Curriculum Categories</h3>
                        <Link href="/student/resources" className="text-xs font-semibold text-blue-600 hover:underline">
                            Browse Catalog
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {categories.map((cat) => {
                            const IconComponent = categoryIcons[cat.slug] || Folder;
                            return (
                                <Link
                                    key={cat.id}
                                    href={`/student/resources/category/${cat.slug}`}
                                    className="p-4 bg-white rounded-2xl border border-slate-200 hover:border-blue-300 shadow-2xs hover:shadow-xs transition-all flex items-start gap-3.5 group"
                                >
                                    <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 group-hover:scale-105 transition-transform flex-shrink-0">
                                        <IconComponent className="w-5 h-5" />
                                    </div>
                                    <div className="overflow-hidden">
                                        <h4 className="text-xs font-bold text-slate-900 group-hover:text-blue-600 truncate transition-colors">
                                            {cat.name}
                                        </h4>
                                        <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-2 leading-relaxed">
                                            {cat.description}
                                        </p>
                                        <span className="inline-block mt-2 text-[10px] font-bold text-blue-600">
                                            {cat.resources_count} materials available
                                        </span>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </div>

                {/* Recently Added PDF Modules */}
                <div className="lg:col-span-5 space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                            <FileText className="w-4 h-4 text-emerald-600" />
                            Latest PDF Modules
                        </h3>
                        <Link href="/student/resources/category/pdf-modules" className="text-xs font-semibold text-blue-600 hover:underline">
                            All Modules
                        </Link>
                    </div>

                    <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs divide-y divide-slate-100 overflow-hidden">
                        {recentPdfs.length > 0 ? (
                            recentPdfs.map((pdf) => (
                                <Link
                                    key={pdf.id}
                                    href={`/student/resources/${pdf.id}`}
                                    className="p-4 hover:bg-slate-50/80 transition-colors flex items-center justify-between gap-3 block group"
                                >
                                    <div className="flex items-center gap-3 overflow-hidden">
                                        <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600 flex-shrink-0">
                                            <FileText className="w-4 h-4" />
                                        </div>
                                        <div className="truncate">
                                            <h5 className="text-xs font-bold text-slate-900 group-hover:text-blue-600 truncate">
                                                {pdf.title}
                                            </h5>
                                            <p className="text-[10px] text-slate-400 mt-0.5">
                                                {pdf.formatted_file_size} • {new Date(pdf.created_at).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                                            </p>
                                        </div>
                                    </div>
                                    <span className="text-xs font-bold text-blue-600 group-hover:translate-x-1 transition-transform flex-shrink-0">
                                        Read ›
                                    </span>
                                </Link>
                            ))
                        ) : (
                            <div className="p-6 text-center text-xs text-slate-400">
                                No PDF modules added yet.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
