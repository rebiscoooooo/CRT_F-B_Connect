import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import StatCard from '@/Components/StatCard';
import {
    Users,
    FolderKanban,
    Video,
    Image as ImageIcon,
    FileText,
    BookOpen,
    Folder,
    Upload,
    UserPlus,
    Activity,
    ArrowRight,
    TrendingUp,
    Clock,
    Eye,
    Download,
    CheckCircle2,
    ClipboardCheck,
    ShieldCheck,
} from 'lucide-react';
import {
    ResponsiveContainer,
    AreaChart,
    Area,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend
} from 'recharts';

export default function Dashboard({ stats = {}, recentResources = [], recentStudents = [], recentActivities = [], chartData = {} }) {
    const COLORS = ['#2563EB', '#38BDF8', '#818CF8', '#10B981', '#F59E0B', '#A855F7'];

    return (
        <AppLayout title="Administrator Dashboard">
            <Head title="Admin Dashboard — CRT F&B Connect" />

            {/* Header with Quick Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-full bg-white ring-2 ring-blue-500/20 shadow-xs overflow-hidden flex items-center justify-center flex-shrink-0">
                        <img
                            src="/images/logo-badge.png"
                            alt="CRT F&B Connect"
                            className="w-full h-full object-cover"
                            onError={(e) => {
                                e.target.src = '/images/logo.png';
                            }}
                        />
                    </div>
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                            Administrator &amp; Instructor Overview
                        </h1>
                        <p className="text-xs sm:text-sm text-slate-500 mt-1">
                            Live analytics, curriculum resources, and student enrollment records.
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2.5">
                    <Link
                        href="/admin/resources/create"
                        className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm shadow-blue-500/20 hover:shadow-md transition-all"
                    >
                        <Upload className="w-4 h-4" />
                        Upload Resource
                    </Link>
                    <Link
                        href="/admin/students"
                        className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl shadow-2xs hover:shadow-xs transition-all"
                    >
                        <UserPlus className="w-4 h-4" />
                        Manage Students
                    </Link>
                    <Link
                        href="/admin/teachers"
                        className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl shadow-2xs hover:shadow-xs transition-all"
                    >
                        <ShieldCheck className="w-4 h-4 text-sky-600" />
                        Faculty &amp; Admins
                    </Link>
                    <Link
                        href="/admin/assessments"
                        className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl shadow-2xs hover:shadow-xs transition-all"
                    >
                        <ClipboardCheck className="w-4 h-4 text-blue-600" />
                        Student Assessments
                    </Link>
                </div>
            </div>

            {/* Primary KPI Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
                <StatCard
                    title="Total Registered Students"
                    value={stats.total_students}
                    subtitle={`${stats.active_students} active accounts`}
                    icon={Users}
                    color="blue"
                />
                <StatCard
                    title="Total Learning Materials"
                    value={stats.total_resources}
                    subtitle={`${stats.total_categories} categories • ${stats.total_folders} folders`}
                    icon={FolderKanban}
                    color="sky"
                />
                <StatCard
                    title="Video Lessons"
                    value={stats.total_videos}
                    subtitle="Culinary &amp; service masterclasses"
                    icon={Video}
                    color="indigo"
                />
                <StatCard
                    title="PDF Modules"
                    value={stats.total_pdfs}
                    subtitle="TESDA NC II &amp; HACCP syllabi"
                    icon={FileText}
                    color="emerald"
                />
            </div>

            {/* Secondary stats row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                <div className="p-4 bg-white rounded-xl border border-slate-200 flex items-center justify-between">
                    <div>
                        <p className="text-[11px] font-semibold text-slate-500 uppercase">Illustrations</p>
                        <p className="text-xl font-bold text-slate-900 mt-1">{stats.total_illustrations}</p>
                    </div>
                    <div className="p-2.5 rounded-lg bg-sky-50 text-sky-600">
                        <ImageIcon className="w-5 h-5" />
                    </div>
                </div>
                <div className="p-4 bg-white rounded-xl border border-slate-200 flex items-center justify-between">
                    <div>
                        <p className="text-[11px] font-semibold text-slate-500 uppercase">Text Lessons</p>
                        <p className="text-xl font-bold text-slate-900 mt-1">{stats.total_texts}</p>
                    </div>
                    <div className="p-2.5 rounded-lg bg-amber-50 text-amber-600">
                        <BookOpen className="w-5 h-5" />
                    </div>
                </div>
                <div className="p-4 bg-white rounded-xl border border-slate-200 flex items-center justify-between">
                    <div>
                        <p className="text-[11px] font-semibold text-slate-500 uppercase">Other Materials</p>
                        <p className="text-xl font-bold text-slate-900 mt-1">{stats.total_others}</p>
                    </div>
                    <div className="p-2.5 rounded-lg bg-purple-50 text-purple-600">
                        <Folder className="w-5 h-5" />
                    </div>
                </div>
                <div className="p-4 bg-white rounded-xl border border-slate-200 flex items-center justify-between">
                    <div>
                        <p className="text-[11px] font-semibold text-slate-500 uppercase">Resource Folders</p>
                        <p className="text-xl font-bold text-slate-900 mt-1">{stats.total_folders}</p>
                    </div>
                    <div className="p-2.5 rounded-lg bg-blue-50 text-blue-600">
                        <FolderKanban className="w-5 h-5" />
                    </div>
                </div>
            </div>

            {/* Interactive Analytics Section (Recharts) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
                {/* Registration Trends Chart (Area) */}
                <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-base font-bold text-slate-900">Student Enrollment Trend</h3>
                            <p className="text-xs text-slate-500 mt-0.5">Monthly registration distribution</p>
                        </div>
                        <span className="p-2 rounded-lg bg-blue-50 text-blue-600">
                            <TrendingUp className="w-4 h-4" />
                        </span>
                    </div>

                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData.registrationTrends || []}>
                                <defs>
                                    <linearGradient id="studentGrad" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#2563EB" stopOpacity={0.4} />
                                        <stop offset="95%" stopColor="#2563EB" stopOpacity={0.0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                                <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} />
                                <YAxis stroke="#94a3b8" fontSize={11} allowDecimals={false} />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#0F172A',
                                        borderRadius: '0.75rem',
                                        border: 'none',
                                        color: '#fff',
                                        fontSize: '12px',
                                    }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="students"
                                    stroke="#2563EB"
                                    strokeWidth={2.5}
                                    fillOpacity={1}
                                    fill="url(#studentGrad)"
                                    name="Enrolled Students"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Resource Category Distribution (Pie / Donut) */}
                <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs flex flex-col justify-between">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h3 className="text-base font-bold text-slate-900">Resource Distribution</h3>
                            <p className="text-xs text-slate-500 mt-0.5">Materials by category</p>
                        </div>
                    </div>

                    <div className="h-56 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={chartData.categoryDistribution || []}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={50}
                                    outerRadius={80}
                                    paddingAngle={4}
                                    dataKey="count"
                                    nameKey="name"
                                >
                                    {(chartData.categoryDistribution || []).map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#0F172A',
                                        borderRadius: '0.75rem',
                                        border: 'none',
                                        color: '#fff',
                                        fontSize: '12px',
                                    }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-xs">
                        {(chartData.categoryDistribution || []).map((cat, i) => (
                            <div key={cat.name} className="flex items-center gap-2">
                                <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                                <span className="truncate text-slate-600">{cat.name}: <strong className="text-slate-900">{cat.count}</strong></span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Upload Activity by Resource Type (Bar Chart) */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs mb-8">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h3 className="text-base font-bold text-slate-900">Materials Volume by Media Type</h3>
                        <p className="text-xs text-slate-500 mt-0.5">Inventory of educational formats available</p>
                    </div>
                </div>

                <div className="h-60 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData.resourceTypes || []}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                            <XAxis dataKey="type" stroke="#94a3b8" fontSize={11} />
                            <YAxis stroke="#94a3b8" fontSize={11} allowDecimals={false} />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: '#0F172A',
                                    borderRadius: '0.75rem',
                                    border: 'none',
                                    color: '#fff',
                                    fontSize: '12px',
                                }}
                            />
                            <Bar dataKey="count" fill="#2563EB" radius={[6, 6, 0, 0]} name="Materials Count" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Bottom 2-Column Section: Recent Uploads & Recent Students */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Recent Resources */}
                <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
                    <div className="flex items-center justify-between p-6 border-b border-slate-100">
                        <div>
                            <h3 className="text-base font-bold text-slate-900">Recently Uploaded Resources</h3>
                            <p className="text-xs text-slate-500 mt-0.5">Latest materials published to the catalog</p>
                        </div>
                        <Link
                            href="/admin/resources"
                            className="text-xs font-bold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1"
                        >
                            View All
                            <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                    </div>

                    <div className="divide-y divide-slate-100">
                        {recentResources.length > 0 ? (
                            recentResources.map((res) => (
                                <div key={res.id} className="p-4 hover:bg-slate-50/80 transition-colors flex items-center justify-between gap-4">
                                    <div className="flex items-center gap-3 overflow-hidden">
                                        <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 flex-shrink-0">
                                            {res.resource_type === 'video' ? <Video className="w-4 h-4" /> :
                                             res.resource_type === 'illustration' ? <ImageIcon className="w-4 h-4" /> :
                                             res.resource_type === 'pdf' ? <FileText className="w-4 h-4" /> :
                                             <BookOpen className="w-4 h-4" />}
                                        </div>
                                        <div className="truncate">
                                            <Link
                                                href={`/admin/resources/${res.id}`}
                                                className="text-xs font-bold text-slate-900 hover:text-blue-600 truncate block"
                                            >
                                                {res.title}
                                            </Link>
                                            <p className="text-[11px] text-slate-500 mt-0.5 truncate">
                                                {res.category?.name} {res.folder ? `› ${res.folder.name}` : ''}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 text-right flex-shrink-0">
                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                                            res.visibility === 'published' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'
                                        }`}>
                                            {res.visibility}
                                        </span>
                                        <span className="text-[11px] text-slate-400 font-mono hidden sm:block">
                                            {new Date(res.created_at).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                                        </span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="p-8 text-center text-xs text-slate-400">
                                No resources uploaded yet.
                            </div>
                        )}
                    </div>
                </div>

                {/* Recent Students & Activities */}
                <div className="lg:col-span-5 space-y-6">
                    {/* Recent Students */}
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
                        <div className="flex items-center justify-between p-6 border-b border-slate-100">
                            <div>
                                <h3 className="text-base font-bold text-slate-900">Recent Students</h3>
                                <p className="text-xs text-slate-500 mt-0.5">Newly enrolled learners</p>
                            </div>
                            <Link
                                href="/admin/students"
                                className="text-xs font-bold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1"
                            >
                                All Students
                                <ArrowRight className="w-3.5 h-3.5" />
                            </Link>
                        </div>

                        <div className="divide-y divide-slate-100">
                            {recentStudents.length > 0 ? (
                                recentStudents.map((st) => (
                                    <div key={st.id} className="p-4 hover:bg-slate-50/80 transition-colors flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <img
                                                src={st.avatar_url}
                                                alt={st.name}
                                                className="w-8 h-8 rounded-lg object-cover ring-1 ring-slate-200"
                                            />
                                            <div>
                                                <p className="text-xs font-bold text-slate-900">{st.name}</p>
                                                <p className="text-[11px] text-slate-500 font-mono">{st.student_number || st.email}</p>
                                            </div>
                                        </div>
                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                            st.status === 'active' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'
                                        }`}>
                                            {st.status}
                                        </span>
                                    </div>
                                ))
                            ) : (
                                <div className="p-6 text-center text-xs text-slate-400">
                                    No students registered yet.
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Recent Activity Log Snapshot */}
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-base font-bold text-slate-900">System Activity</h3>
                            <Link
                                href="/admin/activity-logs"
                                className="text-xs font-semibold text-blue-600 hover:underline"
                            >
                                Full Log
                            </Link>
                        </div>
                        <div className="space-y-3">
                            {recentActivities.slice(0, 4).map((act) => (
                                <div key={act.id} className="flex items-start gap-2.5 text-xs">
                                    <Activity className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                                    <div className="flex-1">
                                        <p className="text-slate-800 font-medium leading-snug">{act.description}</p>
                                        <span className="text-[10px] text-slate-400">
                                            {new Date(act.created_at).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
