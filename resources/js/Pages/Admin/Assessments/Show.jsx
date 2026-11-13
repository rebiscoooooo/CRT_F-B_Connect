import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import Modal from '@/Components/Modal';
import {
    ArrowLeft,
    ClipboardCheck,
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
    Clock,
    FileText,
    ExternalLink,
    Mail,
    Phone,
} from 'lucide-react';

export default function AdminAssessmentShow({ submission }) {
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const user = submission.user;
    const assessment = submission.assessment;
    const resource = assessment?.resource;
    const questions = assessment?.questions || [];
    const isPassed = submission.status === 'passed';

    const handleDelete = () => {
        setIsDeleting(true);
        router.delete(`/admin/assessments/${submission.id}`, {
            onFinish: () => {
                setIsDeleting(false);
                setIsDeleteModalOpen(false);
            },
        });
    };

    return (
        <AppLayout title={`Assessment Attempt — ${user?.name}`}>
            <Head title={`Assessment Attempt: ${user?.name} — CRT F&B Connect`} />

            {/* Back Navigation */}
            <div className="mb-6 flex items-center justify-between">
                <Link
                    href="/admin/assessments"
                    className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-blue-600 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to All Student Assessments
                </Link>

                <button
                    onClick={() => setIsDeleteModalOpen(true)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-bold transition-colors"
                >
                    <Trash2 className="w-3.5 h-3.5" />
                    Delete Attempt Record
                </button>
            </div>

            {/* Top Cards Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
                {/* Score & Result Hero Card (7 cols) */}
                <div className={`lg:col-span-7 p-6 sm:p-8 rounded-3xl border shadow-2xs relative overflow-hidden ${
                    isPassed
                        ? 'bg-gradient-to-br from-emerald-50 via-teal-50/60 to-white border-emerald-200'
                        : 'bg-gradient-to-br from-rose-50 via-amber-50/60 to-white border-rose-200'
                }`}>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-start gap-4">
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-md ${
                                isPassed
                                    ? 'bg-emerald-600 text-white shadow-emerald-500/20'
                                    : 'bg-rose-600 text-white shadow-rose-500/20'
                            }`}>
                                {isPassed ? <Award className="w-7 h-7" /> : <AlertCircle className="w-7 h-7" />}
                            </div>

                            <div>
                                <span className={`inline-block px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider mb-1 ${
                                    isPassed
                                        ? 'bg-emerald-100 text-emerald-800'
                                        : 'bg-rose-100 text-rose-800'
                                }`}>
                                    {isPassed ? 'Exam Passed' : 'Did Not Pass'}
                                </span>
                                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
                                    {submission.score} / {submission.total_points} Points ({Number(submission.percentage).toFixed(1)}%)
                                </h2>
                                <p className="text-xs text-slate-500 mt-1">
                                    Passing threshold requirement: <strong>{assessment?.passing_percentage}%</strong>
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Feedback block */}
                    {submission.feedback && (
                        <div className="mt-5 p-4 rounded-2xl bg-white/80 border border-slate-200/80 text-xs text-slate-700 leading-relaxed shadow-2xs">
                            <span className="font-bold text-slate-900 block mb-0.5">Automated Evaluation:</span>
                            {submission.feedback}
                        </div>
                    )}

                    <div className="mt-4 pt-4 border-t border-slate-200/60 flex items-center justify-between text-xs text-slate-500">
                        <span className="flex items-center gap-1.5">
                            <Clock className="w-4 h-4 text-slate-400" />
                            Submitted: {new Date(submission.submitted_at || submission.created_at).toLocaleString([], {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                            })}
                        </span>
                    </div>
                </div>

                {/* Student Info Card (5 cols) */}
                <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                            Student Profile
                        </h3>
                        <Link
                            href={`/admin/students/${user?.id}`}
                            className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1"
                        >
                            View Student Dossier <ExternalLink className="w-3 h-3" />
                        </Link>
                    </div>

                    <div className="flex items-center gap-3.5">
                        <img
                            src={user?.avatar_url}
                            alt={user?.name}
                            className="w-12 h-12 rounded-2xl object-cover ring-2 ring-blue-500/20"
                        />
                        <div>
                            <p className="text-base font-bold text-slate-900">{user?.name}</p>
                            <p className="text-xs font-mono font-semibold text-blue-600">
                                {user?.student_number || 'No Student ID'}
                            </p>
                        </div>
                    </div>

                    <div className="space-y-2 text-xs text-slate-600 pt-2">
                        <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                            <span className="truncate">{user?.email}</span>
                        </div>
                        {user?.contact_number && (
                            <div className="flex items-center gap-2">
                                <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                                <span>{user?.contact_number}</span>
                            </div>
                        )}
                        <div className="flex items-center gap-2">
                            <BookOpen className="w-4 h-4 text-slate-400 shrink-0" />
                            <span className="truncate">Lesson: <strong>{resource?.title}</strong></span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Questions Inspection Section */}
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-lg font-bold text-slate-900">
                            Question Breakdown &amp; Student Responses
                        </h3>
                        <p className="text-xs text-slate-500">
                            Review individual question answers, point values, and correct rationale.
                        </p>
                    </div>

                    <span className="text-xs font-bold px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700">
                        {questions.length} Total Questions
                    </span>
                </div>

                <div className="space-y-4">
                    {questions.map((q, idx) => {
                        const studentAnswer = submission.answers?.[q.id] || submission.answers?.[String(q.id)];
                        const isCorrect = studentAnswer && q.correct_answer && (
                            String(studentAnswer).trim().toLowerCase() === String(q.correct_answer).trim().toLowerCase()
                        );

                        return (
                            <div
                                key={q.id}
                                className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-4"
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex items-start gap-3">
                                        <span className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-black shrink-0 ${
                                            isCorrect
                                                ? 'bg-emerald-100 text-emerald-800'
                                                : 'bg-rose-100 text-rose-800'
                                        }`}>
                                            {idx + 1}
                                        </span>
                                        <div>
                                            <h4 className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                                                {q.question_text}
                                            </h4>
                                            <span className="text-[11px] text-slate-400 font-medium">
                                                Worth {q.points} {q.points === 1 ? 'point' : 'points'}
                                            </span>
                                        </div>
                                    </div>

                                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider shrink-0 ${
                                        isCorrect
                                            ? 'bg-emerald-100 text-emerald-800'
                                            : 'bg-rose-100 text-rose-800'
                                    }`}>
                                        {isCorrect ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                                        {isCorrect ? `+${q.points} Correct` : '0 Pts Incorrect'}
                                    </span>
                                </div>

                                {/* Options grid */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                                    {(q.options || []).map((opt) => {
                                        const isSelected = studentAnswer === opt.key;
                                        const isThisCorrect = q.correct_answer === opt.key;

                                        let style = 'border-slate-200 bg-slate-50/50 text-slate-700';
                                        if (isSelected && isThisCorrect) {
                                            style = 'border-emerald-500 bg-emerald-50/80 text-emerald-950 font-bold ring-2 ring-emerald-500/20';
                                        } else if (isSelected && !isThisCorrect) {
                                            style = 'border-rose-400 bg-rose-50 text-rose-950 font-bold ring-2 ring-rose-400/20';
                                        } else if (isThisCorrect) {
                                            style = 'border-emerald-400 bg-emerald-50/40 text-emerald-900 font-semibold';
                                        }

                                        return (
                                            <div
                                                key={opt.key}
                                                className={`p-3.5 rounded-xl border text-xs flex items-center justify-between gap-3 ${style}`}
                                            >
                                                <div className="flex items-center gap-2.5">
                                                    <span className="w-5 h-5 rounded-md bg-black/5 flex items-center justify-center font-bold text-[10px]">
                                                        {opt.key}
                                                    </span>
                                                    <span>{opt.text}</span>
                                                </div>

                                                <div className="flex items-center gap-1.5 shrink-0">
                                                    {isSelected && (
                                                        <span className="px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider bg-slate-200 text-slate-800">
                                                            Student choice
                                                        </span>
                                                    )}
                                                    {isThisCorrect && (
                                                        <span className="px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider bg-emerald-600 text-white">
                                                            Correct
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* Explanation */}
                                {q.explanation && (
                                    <div className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-100 text-xs text-blue-900 flex items-start gap-2">
                                        <BookOpen className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                                        <div>
                                            <span className="font-bold">Pedagogical Explanation: </span>
                                            {q.explanation}
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Confirm Delete Attempt Modal */}
            <Modal
                isOpen={isDeleteModalOpen}
                show={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                title="Remove Student Attempt Record"
            >
                <div className="space-y-4">
                    <div className="flex items-center gap-3 text-rose-600">
                        <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center">
                            <Trash2 className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-900 text-base">Remove This Attempt Record?</h3>
                            <p className="text-xs text-slate-500">This action will delete this submission record and allow the student to retake cleanly.</p>
                        </div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-1">
                        <p><strong>Student:</strong> {user?.name} ({user?.student_number || 'N/A'})</p>
                        <p><strong>Score:</strong> {submission.score} / {submission.total_points} ({Number(submission.percentage).toFixed(1)}%)</p>
                        <p><strong>Lesson:</strong> {resource?.title}</p>
                    </div>

                    <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                        <button
                            type="button"
                            onClick={() => setIsDeleteModalOpen(false)}
                            className="px-4 py-2 text-xs font-bold rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 cursor-pointer"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={handleDelete}
                            disabled={isDeleting}
                            className="px-4 py-2 text-xs font-bold rounded-xl bg-rose-600 hover:bg-rose-700 text-white shadow-xs disabled:opacity-50 cursor-pointer"
                        >
                            {isDeleting ? 'Removing...' : 'Yes, Remove Attempt'}
                        </button>
                    </div>
                </div>
            </Modal>
        </AppLayout>
    );
}
