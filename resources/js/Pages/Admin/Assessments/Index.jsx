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
} from 'lucide-react';

export default function AdminAssessmentsIndex({ submissions, statistics, resources = [], filters = {} }) {
    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status || '');
    const [resourceId, setResourceId] = useState(filters.resource_id || '');
    const [submissionToDelete, setSubmissionToDelete] = useState(null);

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
        router.delete(`/admin/assessments/${submissionToDelete.id}`, {
            onSuccess: () => setSubmissionToDelete(null),
        });
    };

    return (
        <AppLayout title="Student Assessments">
            <Head title="Student Assessments & Exam Results — CRT F&B Connect" />

            {/* Header Banner */}
            <div className="mb-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold uppercase tracking-wider mb-2">
                            <ClipboardCheck className="w-3.5 h-3.5 text-blue-600" />
                            Academic Performance &amp; Evaluation
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                            Student Assessments &amp; Results
                        </h1>
                        <p className="text-xs sm:text-sm text-slate-500 mt-1">
                            Monitor student quiz submissions, passing rates, and knowledge check comprehension across all lessons.
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <Link
                            href="/admin/resources"
                            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 shadow-2xs transition-colors"
                        >
                            <BookOpen className="w-3.5 h-3.5 text-blue-600" />
                            Manage Lesson Materials
                        </Link>
                    </div>
                </div>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
                {/* Total Attempts */}
                <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-2xs">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Attempts</span>
                        <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                            <ClipboardCheck className="w-4 h-4" />
                        </div>
                    </div>
                    <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
                        {statistics.total_submissions}
                    </div>
                    <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1 font-medium">
                        <Users className="w-3 h-3 text-slate-400" />
                        Across {statistics.unique_students} active students
                    </div>
                </div>

                {/* Overall Pass Rate */}
                <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-2xs">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Passing Rate</span>
                        <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                            <Award className="w-4 h-4" />
                        </div>
                    </div>
                    <div className="text-2xl sm:text-3xl font-black text-emerald-600 mt-2">
                        {statistics.pass_rate}%
                    </div>
                    <div className="text-[11px] text-slate-500 mt-1 font-medium">
                        {statistics.passed_count} passed / {statistics.failed_count} did not pass
                    </div>
                </div>

                {/* Average Score */}
                <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-2xs">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Average Score</span>
                        <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                            <TrendingUp className="w-4 h-4" />
                        </div>
                    </div>
                    <div className="text-2xl sm:text-3xl font-black text-indigo-600 mt-2">
                        {statistics.average_score}%
                    </div>
                    <div className="text-[11px] text-slate-500 mt-1 font-medium">
                        Mean test performance
                    </div>
                </div>

                {/* Total Assessments Active */}
                <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-2xs">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Active Quizzes</span>
                        <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                            <BookOpen className="w-4 h-4" />
                        </div>
                    </div>
                    <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
                        {statistics.total_assessments}
                    </div>
                    <div className="text-[11px] text-slate-500 mt-1 font-medium">
                        Attached across curriculum units
                    </div>
                </div>
            </div>

            {/* Filter Bar */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs mb-6">
                <form onSubmit={handleFilter} className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                    <div className="sm:col-span-5 relative">
                        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search by student name, ID, or lesson title..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                        />
                    </div>

                    <div className="sm:col-span-3">
                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-700"
                        >
                            <option value="">All Statuses (Passed &amp; Failed)</option>
                            <option value="passed">Passed Only</option>
                            <option value="failed">Did Not Pass Only</option>
                        </select>
                    </div>

                    <div className="sm:col-span-3">
                        <select
                            value={resourceId}
                            onChange={(e) => setResourceId(e.target.value)}
                            className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-700"
                        >
                            <option value="">All Lessons &amp; Resources</option>
                            {resources.map((res) => (
                                <option key={res.id} value={res.id}>
                                    {res.title}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="sm:col-span-1 flex items-center gap-2">
                        <button
                            type="submit"
                            className="w-full py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors shadow-xs"
                            title="Filter"
                        >
                            Filter
                        </button>
                    </div>
                </form>

                {(search || status || resourceId) && (
                    <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                        <span>Active filters applied</span>
                        <button
                            type="button"
                            onClick={handleReset}
                            className="text-xs font-bold text-blue-600 hover:underline"
                        >
                            Clear all filters
                        </button>
                    </div>
                )}
            </div>

            {/* Submissions Table */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-2xs overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/75 border-b border-slate-200 text-[11px] font-black uppercase tracking-wider text-slate-500">
                                <th className="py-4 px-6">Student</th>
                                <th className="py-4 px-6">Lesson / Resource</th>
                                <th className="py-4 px-6">Score &amp; Grade</th>
                                <th className="py-4 px-6">Status</th>
                                <th className="py-4 px-6">Submitted At</th>
                                <th className="py-4 px-6 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-xs">
                            {submissions.data.length > 0 ? (
                                submissions.data.map((sub) => {
                                    const res = sub.assessment?.resource;
                                    const isPassed = sub.status === 'passed';

                                    return (
                                        <tr key={sub.id} className="hover:bg-blue-50/30 transition-colors group">
                                            {/* Student Info */}
                                            <td className="py-4 px-6">
                                                <div className="flex items-center gap-3">
                                                    <img
                                                        src={sub.user?.avatar_url}
                                                        alt={sub.user?.name}
                                                        className="w-9 h-9 rounded-xl object-cover ring-2 ring-slate-100"
                                                    />
                                                    <div>
                                                        <p className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                                                            {sub.user?.name}
                                                        </p>
                                                        <p className="text-[11px] text-slate-400 font-mono">
                                                            {sub.user?.student_number || sub.user?.email}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Resource Title & Category */}
                                            <td className="py-4 px-6 max-w-xs">
                                                <Link
                                                    href={`/admin/resources/${res?.id}`}
                                                    className="font-bold text-slate-800 hover:text-blue-600 line-clamp-1 transition-colors"
                                                >
                                                    {res?.title || sub.assessment?.title}
                                                </Link>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className="text-[10px] font-semibold text-slate-400 uppercase">
                                                        {res?.category?.name || 'Curriculum'}
                                                    </span>
                                                    <span className={`px-2 py-0.5 rounded-md text-[9px] font-bold uppercase ${
                                                        res?.resource_type === 'video' ? 'bg-blue-100 text-blue-700' :
                                                        res?.resource_type === 'pdf' ? 'bg-emerald-100 text-emerald-700' :
                                                        res?.resource_type === 'illustration' ? 'bg-sky-100 text-sky-700' :
                                                        'bg-amber-100 text-amber-700'
                                                    }`}>
                                                        {res?.resource_type}
                                                    </span>
                                                </div>
                                            </td>

                                            {/* Score */}
                                            <td className="py-4 px-6">
                                                <div className="font-black text-slate-900 text-sm">
                                                    {sub.score} / {sub.total_points}
                                                </div>
                                                <span className="text-[11px] font-semibold text-slate-500">
                                                    {Number(sub.percentage).toFixed(1)}%
                                                </span>
                                            </td>

                                            {/* Status Badge */}
                                            <td className="py-4 px-6">
                                                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                                                    isPassed
                                                        ? 'bg-emerald-100 text-emerald-800'
                                                        : 'bg-rose-100 text-rose-800'
                                                }`}>
                                                    {isPassed ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                                                    {isPassed ? 'Passed' : 'Failed'}
                                                </span>
                                            </td>

                                            {/* Date Submitted */}
                                            <td className="py-4 px-6 text-slate-500">
                                                <div className="font-medium text-slate-700">
                                                    {new Date(sub.submitted_at || sub.created_at).toLocaleDateString([], {
                                                        month: 'short',
                                                        day: 'numeric',
                                                        year: 'numeric',
                                                    })}
                                                </div>
                                                <div className="text-[10px] text-slate-400">
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
                                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white text-xs font-bold transition-all shadow-2xs"
                                                    >
                                                        <Eye className="w-3.5 h-3.5" />
                                                        View Attempt
                                                    </Link>

                                                    <button
                                                        onClick={() => setSubmissionToDelete(sub)}
                                                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
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
                                            <ClipboardCheck className="w-10 h-10 text-slate-300 mx-auto" />
                                            <p className="font-bold text-slate-800 text-sm">No Assessment Submissions Found</p>
                                            <p className="text-xs text-slate-400">
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
                    <div className="p-4 sm:p-6 border-t border-slate-100 flex items-center justify-between">
                        <span className="text-xs text-slate-500">
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
                                            ? 'bg-blue-600 text-white'
                                            : !link.url
                                            ? 'text-slate-300 cursor-not-allowed'
                                            : 'text-slate-600 hover:bg-slate-100'
                                    }`}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Confirm Delete / Reset Modal */}
            <Modal show={Boolean(submissionToDelete)} onClose={() => setSubmissionToDelete(null)}>
                <div className="p-6 space-y-4">
                    <div className="flex items-center gap-3 text-rose-600">
                        <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center">
                            <Trash2 className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-900 text-base">Remove Student Attempt?</h3>
                            <p className="text-xs text-slate-500">This will delete this submission record and allow the student to retake cleanly.</p>
                        </div>
                    </div>

                    {submissionToDelete && (
                        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-1">
                            <p><strong>Student:</strong> {submissionToDelete.user?.name} ({submissionToDelete.user?.student_number})</p>
                            <p><strong>Score:</strong> {submissionToDelete.score} / {submissionToDelete.total_points} ({submissionToDelete.percentage}%)</p>
                            <p><strong>Lesson:</strong> {submissionToDelete.assessment?.resource?.title}</p>
                        </div>
                    )}

                    <div className="pt-2 flex items-center justify-end gap-2">
                        <button
                            type="button"
                            onClick={() => setSubmissionToDelete(null)}
                            className="px-4 py-2 text-xs font-bold rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={confirmDelete}
                            className="px-4 py-2 text-xs font-bold rounded-xl bg-rose-600 hover:bg-rose-700 text-white shadow-xs"
                        >
                            Yes, Remove Attempt
                        </button>
                    </div>
                </div>
            </Modal>
        </AppLayout>
    );
}

