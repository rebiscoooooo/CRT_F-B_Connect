import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import Modal from '@/Components/Modal';
import {
    ClipboardCheck,
    Search,
    Filter,
    Award,
    AlertCircle,
    CheckCircle2,
    XCircle,
    User,
    Calendar,
    BookOpen,
    Eye,
    Trash2,
    Check,
    X,
    ChevronRight,
    TrendingUp,
    Users,
    FileDown,
} from 'lucide-react';

export default function AdminAssessmentsIndex({ submissions, statistics, resources = [], filters = {} }) {
    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status || '');
    const [resourceId, setResourceId] = useState(filters.resource_id || '');
    const [submissionToDelete, setSubmissionToDelete] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleFilter = (e) => {
        e && e.preventDefault();
        router.get('/admin/assessments', {
            search: search || undefined,
            status: status || undefined,
            resource_id: resourceId || undefined,
        }, {
            preserveState: true,
            replace: true,
        });
    };

    const handleReset = () => {
        setSearch('');
        setStatus('');
        setResourceId('');
        router.get('/admin/assessments');
    };

    const confirmDelete = () => {
        if (!submissionToDelete) return;
        setIsDeleting(true);
        router.delete(`/admin/assessments/${submissionToDelete.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                setSubmissionToDelete(null);
                setIsDeleting(false);
            },
            onError: () => setIsDeleting(false),
            onFinish: () => setIsDeleting(false),
        });
    };

    return (
        <AppLayout title="Student Assessments">
            <Head title="Student Assessments & Exam Results — CRT F&B Connect" />

            {/* Header Banner */}
            <div className="mb-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0B6E8A]/30 border border-[#A8E6E8]/20 text-[#A8E6E8] text-xs font-semibold uppercase tracking-wider mb-2">
                            <ClipboardCheck className="w-3.5 h-3.5 text-[#2EC4D6]" />
                            Academic Performance &amp; Evaluation
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-black text-[#F4FBFC] tracking-tight">
                            Student Assessments &amp; Results
                        </h1>
                        <p className="text-xs sm:text-sm text-[#A8E6E8]/70 mt-1">
                            Monitor student quiz submissions, passing rates, and knowledge check comprehension across all lessons.
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
                        <a
                            href={`/admin/assessments/export-pdf?${new URLSearchParams({
                                ...(search ? { search } : {}),
                                ...(status ? { status } : {}),
                                ...(resourceId ? { resource_id: resourceId } : {}),
                            }).toString()}`}
                            className="cyber-glow-btn inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer active:scale-95"
                            title="Export all student assessment results and records as a PDF document"
                        >
                            <FileDown className="w-4 h-4" />
                            <span>Export PDF</span>
                        </a>

                        <Link
                            href="/admin/resources"
                            className="cyber-oauth-btn inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-colors"
                        >
                            <BookOpen className="w-3.5 h-3.5 text-[#2EC4D6]" />
                            <span>Manage Lessons</span>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
                {/* Total Attempts */}
                <div className="cyber-glass-card cyber-glass-card-hover p-5 sm:p-6">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-[#A8E6E8]/70">Total Attempts</span>
                        <div className="w-9 h-9 rounded-xl bg-[#0B6E8A]/30 border border-[#A8E6E8]/20 text-[#2EC4D6] flex items-center justify-center">
                            <ClipboardCheck className="w-4 h-4" />
                        </div>
                    </div>
                    <div className="text-2xl sm:text-3xl font-black text-[#F4FBFC] mt-2">
                        {statistics.total_submissions}
                    </div>
                    <div className="text-[11px] text-[#A8E6E8]/60 mt-1 flex items-center gap-1 font-medium">
                        <Users className="w-3 h-3 text-[#2EC4D6]" />
                        Across {statistics.unique_students} active students
                    </div>
                </div>

                {/* Overall Pass Rate */}
                <div className="cyber-glass-card cyber-glass-card-hover p-5 sm:p-6">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-[#A8E6E8]/70">Passing Rate</span>
                        <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
                            <Award className="w-4 h-4" />
                        </div>
                    </div>
                    <div className="text-2xl sm:text-3xl font-black text-emerald-400 mt-2">
                        {statistics.pass_rate}%
                    </div>
                    <div className="text-[11px] text-[#A8E6E8]/60 mt-1 font-medium">
                        {statistics.passed_count} passed / {statistics.failed_count} did not pass
                    </div>
                </div>

                {/* Average Score */}
                <div className="cyber-glass-card cyber-glass-card-hover p-5 sm:p-6">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-[#A8E6E8]/70">Average Score</span>
                        <div className="w-9 h-9 rounded-xl bg-[#0B6E8A]/30 border border-[#A8E6E8]/20 text-[#2EC4D6] flex items-center justify-center">
                            <TrendingUp className="w-4 h-4" />
                        </div>
                    </div>
                    <div className="text-2xl sm:text-3xl font-black text-[#2EC4D6] mt-2">
                        {statistics.average_score}%
                    </div>
                    <div className="text-[11px] text-[#A8E6E8]/60 mt-1 font-medium">
                        Mean test performance
                    </div>
                </div>

                {/* Total Assessments Active */}
                <div className="cyber-glass-card cyber-glass-card-hover p-5 sm:p-6">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-[#A8E6E8]/70">Active Quizzes</span>
                        <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/30 text-amber-300 flex items-center justify-center">
                            <BookOpen className="w-4 h-4" />
                        </div>
                    </div>
                    <div className="text-2xl sm:text-3xl font-black text-[#F4FBFC] mt-2">
                        {statistics.total_assessments}
                    </div>
                    <div className="text-[11px] text-[#A8E6E8]/60 mt-1 font-medium">
                        Attached across curriculum units
                    </div>
                </div>
            </div>

            {/* Filter Bar */}
            <div className="cyber-glass-card p-5 mb-6">
                <form onSubmit={handleFilter} className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                    <div className="sm:col-span-5 relative">
                        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A8E6E8]/50" />
                        <input
                            type="text"
                            placeholder="Search by student name, ID, or lesson title..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="cyber-glass-input w-full pl-10 pr-4 py-2.5 text-xs rounded-xl"
                        />
                    </div>

                    <div className="sm:col-span-3">
                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className="cyber-glass-input w-full px-3.5 py-2.5 text-xs rounded-xl"
                        >
                            <option value="" className="bg-[#061923] text-[#F4FBFC]">All Statuses (Passed &amp; Failed)</option>
                            <option value="passed" className="bg-[#061923] text-[#F4FBFC]">Passed Only</option>
                            <option value="failed" className="bg-[#061923] text-[#F4FBFC]">Did Not Pass Only</option>
                        </select>
                    </div>

                    <div className="sm:col-span-3">
                        <select
                            value={resourceId}
                            onChange={(e) => setResourceId(e.target.value)}
                            className="cyber-glass-input w-full px-3.5 py-2.5 text-xs rounded-xl"
                        >
                            <option value="" className="bg-[#061923] text-[#F4FBFC]">All Lessons &amp; Resources</option>
                            {resources.map((res) => (
                                <option key={res.id} value={res.id} className="bg-[#061923] text-[#F4FBFC]">
                                    {res.title}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="sm:col-span-1 flex items-center gap-2">
                        <button
                            type="submit"
                            className="cyber-glow-btn w-full py-2.5 px-3 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                            title="Filter"
                        >
                            Filter
                        </button>
                    </div>
                </form>

                {(search || status || resourceId) && (
                    <div className="mt-3 pt-3 border-t border-[#A8E6E8]/15 flex items-center justify-between text-xs text-[#A8E6E8]/70">
                        <span>Active filters applied</span>
                        <button
                            type="button"
                            onClick={handleReset}
                            className="text-xs font-bold text-[#2EC4D6] hover:underline cursor-pointer"
                        >
                            Clear all filters
                        </button>
                    </div>
                )}
            </div>

            {/* Submissions Table */}
            <div className="cyber-glass-card overflow-hidden min-w-0">
                <div className="overflow-x-auto overscroll-x-contain touch-pan-x">
                    <table className="w-full min-w-[640px] text-left border-collapse">
                        <thead>
                            <tr className="cyber-table-header">
                                <th className="py-4 px-6">Student</th>
                                <th className="py-4 px-6">Lesson / Resource</th>
                                <th className="py-4 px-6">Score &amp; Grade</th>
                                <th className="py-4 px-6">Status</th>
                                <th className="py-4 px-6">Submitted At</th>
                                <th className="py-4 px-6 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#A8E6E8]/10 text-xs">
                            {submissions.data.length > 0 ? (
                                submissions.data.map((sub) => {
                                    const res = sub.assessment?.resource;
                                    const isPassed = sub.status === 'passed';

                                    return (
                                        <tr key={sub.id} className="cyber-table-row transition-colors group">
                                            {/* Student Info */}
                                            <td className="py-4 px-6">
                                                <div className="flex items-center gap-3">
                                                    <img
                                                        src={sub.user?.avatar_url}
                                                        alt={sub.user?.name}
                                                        className="w-9 h-9 rounded-xl object-cover ring-2 ring-[#2EC4D6]/30 shadow-md"
                                                    />
                                                    <div>
                                                        <p className="font-bold text-[#F4FBFC] group-hover:text-[#2EC4D6] transition-colors">
                                                            {sub.user?.name}
                                                        </p>
                                                        <p className="text-[11px] text-[#A8E6E8]/70 font-mono">
                                                            {sub.user?.student_number || sub.user?.email}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Resource Title & Category */}
                                            <td className="py-4 px-6 max-w-xs">
                                                <Link
                                                    href={`/admin/resources/${res?.id}`}
                                                    className="font-bold text-[#F4FBFC] hover:text-[#2EC4D6] line-clamp-1 transition-colors"
                                                >
                                                    {res?.title || sub.assessment?.title}
                                                </Link>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className="text-[10px] font-semibold text-[#A8E6E8]/70 uppercase">
                                                        {res?.category?.name || 'Curriculum'}
                                                    </span>
                                                    <span className={`px-2 py-0.5 rounded-md text-[9px] font-bold uppercase border ${
                                                        res?.resource_type === 'video' ? 'bg-blue-500/20 text-[#A8E6E8] border-[#2EC4D6]/30' :
                                                        res?.resource_type === 'pdf' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' :
                                                        res?.resource_type === 'illustration' ? 'bg-sky-500/20 text-sky-200 border-sky-500/30' :
                                                        'bg-amber-500/20 text-amber-300 border-amber-500/30'
                                                    }`}>
                                                        {res?.resource_type}
                                                    </span>
                                                </div>
                                            </td>

                                            {/* Score */}
                                            <td className="py-4 px-6">
                                                <div className="font-black text-[#F4FBFC] text-sm">
                                                    {sub.score} / {sub.total_points}
                                                </div>
                                                <span className="text-[11px] font-semibold text-[#A8E6E8]">
                                                    {Number(sub.percentage).toFixed(1)}%
                                                </span>
                                            </td>

                                            {/* Status Badge */}
                                            <td className="py-4 px-6">
                                                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                                                    isPassed
                                                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                                                        : 'bg-[#2EC4D6]/20 text-[#2EC4D6] border-[#2EC4D6]/40'
                                                }`}>
                                                    {isPassed ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                                                    {isPassed ? 'Passed' : 'Failed'}
                                                </span>
                                            </td>

                                            {/* Date Submitted */}
                                            <td className="py-4 px-6 text-[#A8E6E8]">
                                                <div className="font-medium text-[#F4FBFC]">
                                                    {new Date(sub.submitted_at || sub.created_at).toLocaleDateString([], {
                                                        month: 'short',
                                                        day: 'numeric',
                                                        year: 'numeric',
                                                    })}
                                                </div>
                                                <div className="text-[10px] text-[#A8E6E8]/60">
                                                    {new Date(sub.submitted_at || sub.created_at).toLocaleTimeString([], {
                                                        hour: '2-digit',
                                                        minute: '2-digit',
                                                    })}
                                                </div>
                                            </td>

                                            {/* Actions */}
                                            <td className="py-4 px-6 text-right">
                                                <div className="inline-flex items-center gap-2">
                                                    <Link
                                                        href={`/admin/assessments/${sub.id}`}
                                                        className="cyber-glow-btn inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-md"
                                                    >
                                                        <Eye className="w-3.5 h-3.5" />
                                                        View Attempt
                                                    </Link>

                                                    <button
                                                        onClick={() => setSubmissionToDelete(sub)}
                                                        className="p-1.5 rounded-lg text-[#A8E6E8] hover:text-[#2EC4D6] hover:bg-[#0B6E8A]/20 transition-colors cursor-pointer"
                                                        title="Delete attempt"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan="6" className="py-12 text-center">
                                        <div className="max-w-xs mx-auto text-center space-y-2">
                                            <ClipboardCheck className="w-10 h-10 text-[#A8E6E8]/40 mx-auto" />
                                            <p className="font-bold text-[#F4FBFC] text-sm">No Assessment Submissions Found</p>
                                            <p className="text-xs text-[#A8E6E8]/60">
                                                No student submissions matched your current filter criteria.
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {submissions.links && submissions.links.length > 3 && (
                    <div className="p-4 sm:p-6 border-t border-[#A8E6E8]/15 flex items-center justify-between">
                        <span className="text-xs text-[#A8E6E8]/70">
                            Showing {submissions.from || 0} to {submissions.to || 0} of {submissions.total} submissions
                        </span>

                        <div className="flex items-center gap-1">
                            {submissions.links.map((link, i) => (
                                <Link
                                    key={i}
                                    href={link.url || '#'}
                                    disabled={!link.url}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                    className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${
                                        link.active
                                            ? 'cyber-glow-btn'
                                            : !link.url
                                            ? 'text-[#A8E6E8]/20 cursor-not-allowed'
                                            : 'cyber-oauth-btn'
                                    }`}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Confirm Delete / Reset Modal */}
            <Modal
                isOpen={Boolean(submissionToDelete)}
                show={Boolean(submissionToDelete)}
                onClose={() => setSubmissionToDelete(null)}
                title="Remove Student Attempt"
            >
                <div className="space-y-4">
                    <div className="flex items-center gap-3 text-slate-400">
                        <div className="w-10 h-10 rounded-xl bg-slate-500/15 border border-slate-300/30 flex items-center justify-center">
                            <Trash2 className="w-5 h-5 text-slate-400" />
                        </div>
                        <div>
                            <h3 className="font-bold text-[#F4FBFC] text-base">Remove Student Attempt?</h3>
                            <p className="text-xs text-[#A8E6E8]/70">This will delete this submission record and allow the student to retake cleanly.</p>
                        </div>
                    </div>

                    {submissionToDelete && (
                        <div className="p-3.5 rounded-xl bg-[#061923]/60 border border-[#A8E6E8]/20 text-xs text-[#F4FBFC] space-y-1">
                            <p><strong className="text-[#A8E6E8]">Student:</strong> {submissionToDelete.user?.name} ({submissionToDelete.user?.student_number})</p>
                            <p><strong className="text-[#A8E6E8]">Score:</strong> {submissionToDelete.score} / {submissionToDelete.total_points} ({submissionToDelete.percentage}%)</p>
                            <p><strong className="text-[#A8E6E8]">Lesson:</strong> {submissionToDelete.assessment?.resource?.title}</p>
                        </div>
                    )}

                    <div className="pt-2 flex items-center justify-end gap-2 border-t border-[#A8E6E8]/15">
                        <button
                            type="button"
                            onClick={() => setSubmissionToDelete(null)}
                            className="cyber-oauth-btn px-4 py-2 text-xs font-bold rounded-xl cursor-pointer"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={confirmDelete}
                            disabled={isDeleting}
                            className="px-4 py-2 text-xs font-bold rounded-xl bg-rose-600 hover:bg-rose-500 text-white shadow-md disabled:opacity-50 cursor-pointer transition-colors"
                        >
                            {isDeleting ? 'Removing...' : 'Yes, Remove Attempt'}
                        </button>
                    </div>
                </div>
            </Modal>
        </AppLayout>
    );
}

