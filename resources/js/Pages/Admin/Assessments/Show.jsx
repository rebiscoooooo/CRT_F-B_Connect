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
                    className="inline-flex items-center gap-2 text-xs font-bold text-[#A8E6E8] hover:text-[#2EC4D6] transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to All Student Assessments
                </Link>

                <button
                    onClick={() => setIsDeleteModalOpen(true)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#2EC4D6]/40 text-[#2EC4D6] hover:bg-[#0B6E8A]/20 text-xs font-bold transition-colors cursor-pointer"
                >
                    <Trash2 className="w-3.5 h-3.5" />
                    Delete Attempt Record
                </button>
            </div>

            {/* Top Cards Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
                {/* Score & Result Hero Card (7 cols) */}
                <div className={`lg:col-span-7 p-6 sm:p-8 rounded-3xl border shadow-xl relative overflow-hidden cyber-glass-card ${
                    isPassed
                        ? 'border-emerald-500/30'
                        : 'border-rose-500/30'
                }`}>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-start gap-4">
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-lg border ${
                                isPassed
                                    ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-400 shadow-emerald-500/20'
                                    : 'bg-rose-500/20 border-rose-500/30 text-rose-400 shadow-rose-500/20'
                            }`}>
                                {isPassed ? <Award className="w-7 h-7" /> : <AlertCircle className="w-7 h-7" />}
                            </div>

                            <div>
                                <span className={`inline-block px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider mb-1 border ${
                                    isPassed
                                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                                        : 'bg-[#2EC4D6]/20 text-[#2EC4D6] border-[#2EC4D6]/40'
                                }`}>
                                    {isPassed ? 'Exam Passed' : 'Did Not Pass'}
                                </span>
                                <h2 className="text-2xl sm:text-3xl font-black text-[#F4FBFC] leading-tight">
                                    {submission.score} / {submission.total_points} Points ({Number(submission.percentage).toFixed(1)}%)
                                </h2>
                                <p className="text-xs text-[#A8E6E8]/70 mt-1">
                                    Passing threshold requirement: <strong className="text-[#F4FBFC]">{assessment?.passing_percentage}%</strong>
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Feedback block */}
                    {submission.feedback && (
                        <div className="mt-5 p-4 rounded-2xl bg-[#061923]/60 border border-[#A8E6E8]/20 text-xs text-[#F4FBFC] leading-relaxed shadow-md">
                            <span className="font-bold text-[#2EC4D6] block mb-0.5">Automated Evaluation:</span>
                            {submission.feedback}
                        </div>
                    )}

                    <div className="mt-4 pt-4 border-t border-[#A8E6E8]/15 flex items-center justify-between text-xs text-[#A8E6E8]/70">
                        <span className="flex items-center gap-1.5">
                            <Clock className="w-4 h-4 text-[#2EC4D6]" />
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
                <div className="lg:col-span-5 cyber-glass-card p-6 space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-[#A8E6E8]/15">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-[#A8E6E8]/70">
                            Student Profile
                        </h3>
                        <Link
                            href={`/admin/students/${user?.id}`}
                            className="text-xs font-bold text-[#2EC4D6] hover:underline flex items-center gap-1"
                        >
                            View Student Dossier <ExternalLink className="w-3 h-3" />
                        </Link>
                    </div>

                    <div className="flex items-center gap-3.5">
                        <img
                            src={user?.avatar_url}
                            alt={user?.name}
                            className="w-12 h-12 rounded-2xl object-cover ring-2 ring-[#2EC4D6]/30 shadow-md"
                        />
                        <div>
                            <p className="text-base font-bold text-[#F4FBFC]">{user?.name}</p>
                            <p className="text-xs font-mono font-semibold text-[#2EC4D6]">
                                {user?.student_number || 'No Student ID'}
                            </p>
                        </div>
                    </div>

                    <div className="space-y-2 text-xs text-[#F4FBFC] pt-2">
                        <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4 text-[#2EC4D6] shrink-0" />
                            <span className="truncate">{user?.email}</span>
                        </div>
                        {user?.contact_number && (
                            <div className="flex items-center gap-2">
                                <Phone className="w-4 h-4 text-[#2EC4D6] shrink-0" />
                                <span className="text-[#A8E6E8] font-mono">{user?.contact_number}</span>
                            </div>
                        )}
                        <div className="flex items-center gap-2">
                            <BookOpen className="w-4 h-4 text-[#2EC4D6] shrink-0" />
                            <span className="truncate">Lesson: <strong className="text-[#2EC4D6]">{resource?.title}</strong></span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Questions Inspection Section */}
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-lg font-bold text-[#F4FBFC]">
                            Question Breakdown &amp; Student Responses
                        </h3>
                        <p className="text-xs text-[#A8E6E8]/70">
                            Review individual question answers, point values, and correct rationale.
                        </p>
                    </div>

                    <span className="text-xs font-bold px-3 py-1.5 rounded-xl bg-[#0B6E8A]/30 border border-[#A8E6E8]/20 text-[#A8E6E8]">
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
                                className="cyber-glass-card p-6 space-y-4"
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex items-start gap-3">
                                        <span className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-black shrink-0 border ${
                                            isCorrect
                                                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                                                : 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                                        }`}>
                                            {idx + 1}
                                        </span>
                                        <div>
                                            <h4 className="text-sm sm:text-base font-bold text-[#F4FBFC] leading-snug">
                                                {q.question_text}
                                            </h4>
                                            <span className="text-[11px] text-[#A8E6E8]/60 font-medium">
                                                Worth {q.points} {q.points === 1 ? 'point' : 'points'}
                                            </span>
                                        </div>
                                    </div>

                                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider shrink-0 border ${
                                        isCorrect
                                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                                            : 'bg-rose-500/20 text-rose-300 border-rose-500/30'
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

                                        let style = 'border-[#A8E6E8]/20 bg-[#061923]/40 text-[#F4FBFC]';
                                        if (isSelected && isThisCorrect) {
                                            style = 'border-emerald-500/60 bg-emerald-500/20 text-emerald-200 font-bold ring-2 ring-emerald-500/30';
                                        } else if (isSelected && !isThisCorrect) {
                                            style = 'border-rose-500/60 bg-rose-500/20 text-rose-200 font-bold ring-2 ring-rose-500/30';
                                        } else if (isThisCorrect) {
                                            style = 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300 font-semibold';
                                        }

                                        return (
                                            <div
                                                key={opt.key}
                                                className={`p-3.5 rounded-xl border text-xs flex items-center justify-between gap-3 ${style}`}
                                            >
                                                <div className="flex items-center gap-2.5">
                                                    <span className="w-5 h-5 rounded-md bg-[#0B6E8A]/40 border border-[#A8E6E8]/20 flex items-center justify-center font-bold text-[10px] text-[#2EC4D6]">
                                                        {opt.key}
                                                    </span>
                                                    <span>{opt.text}</span>
                                                </div>

                                                <div className="flex items-center gap-1.5 shrink-0">
                                                    {isSelected && (
                                                        <span className="px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider bg-[#0B6E8A]/50 text-[#F4FBFC] border border-[#A8E6E8]/30">
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
                                    <div className="p-3.5 rounded-xl bg-[#0B6E8A]/25 border border-[#A8E6E8]/25 text-xs text-[#A8E6E8] flex items-start gap-2">
                                        <BookOpen className="w-4 h-4 text-[#2EC4D6] shrink-0 mt-0.5" />
                                        <div>
                                            <span className="font-bold text-[#F4FBFC]">Pedagogical Explanation: </span>
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
                    <div className="flex items-center gap-3 text-rose-400">
                        <div className="w-10 h-10 rounded-xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center">
                            <Trash2 className="w-5 h-5 text-rose-400" />
                        </div>
                        <div>
                            <h3 className="font-bold text-[#F4FBFC] text-base">Remove This Attempt Record?</h3>
                            <p className="text-xs text-[#A8E6E8]/70">This action will delete this submission record and allow the student to retake cleanly.</p>
                        </div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-[#061923]/60 border border-[#A8E6E8]/20 text-xs text-[#F4FBFC] space-y-1">
                        <p><strong className="text-[#A8E6E8]">Student:</strong> {user?.name} ({user?.student_number || 'N/A'})</p>
                        <p><strong className="text-[#A8E6E8]">Score:</strong> {submission.score} / {submission.total_points} ({Number(submission.percentage).toFixed(1)}%)</p>
                        <p><strong className="text-[#A8E6E8]">Lesson:</strong> {resource?.title}</p>
                    </div>

                    <div className="pt-2 flex items-center justify-end gap-2 border-t border-[#A8E6E8]/15">
                        <button
                            type="button"
                            onClick={() => setIsDeleteModalOpen(false)}
                            className="cyber-oauth-btn px-4 py-2 text-xs font-bold rounded-xl cursor-pointer"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={handleDelete}
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
