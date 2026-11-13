import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import {
    CheckCircle2,
    XCircle,
    HelpCircle,
    Award,
    RotateCcw,
    Send,
    AlertCircle,
    Clock,
    BookOpen,
    Check,
    X,
    ChevronDown,
    Sparkles,
} from 'lucide-react';

export default function LessonAssessment({ resource, assessment, initialSubmission }) {
    const [submission, setSubmission] = useState(initialSubmission);
    const [isRetaking, setIsRetaking] = useState(false);
    const [answers, setAnswers] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    if (!assessment || !assessment.questions || assessment.questions.length === 0) {
        return null;
    }

    const questions = assessment.questions;
    const hasSubmitted = Boolean(submission) && !isRetaking;
    const answeredCount = Object.keys(answers).length;
    const totalQuestions = questions.length;
    const allAnswered = answeredCount === totalQuestions;

    const handleSelectOption = (questionId, optionKey) => {
        setAnswers((prev) => ({
            ...prev,
            [questionId]: optionKey,
        }));
        setErrorMessage('');
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!allAnswered) {
            setErrorMessage(`Please answer all ${totalQuestions} questions before submitting.`);
            return;
        }

        setIsSubmitting(true);
        setErrorMessage('');

        router.post(
            `/student/resources/${resource.id}/assessment`,
            { answers },
            {
                preserveScroll: true,
                onSuccess: (page) => {
                    setIsSubmitting(false);
                    setIsRetaking(false);
                    if (page.props?.flash_submission?.submission) {
                        setSubmission(page.props.flash_submission.submission);
                    }
                },
                onError: (errors) => {
                    setIsSubmitting(false);
                    setErrorMessage(Object.values(errors)[0] || 'Failed to submit assessment. Please try again.');
                },
            }
        );
    };

    const handleStartRetake = () => {
        setIsRetaking(true);
        setAnswers({});
        setErrorMessage('');
    };

    const handleCancelRetake = () => {
        setIsRetaking(false);
        setAnswers({});
        setErrorMessage('');
    };

    return (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden transition-all duration-300">
            {/* Assessment Header */}
            <div className="p-6 sm:p-8 bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 text-white relative overflow-hidden">
                <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-48 h-48 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />
                
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-200 text-xs font-semibold uppercase tracking-wider mb-2 backdrop-blur-xs">
                            <Sparkles className="w-3.5 h-3.5 text-blue-300" />
                            Lesson Knowledge Check
                        </div>
                        <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                            {assessment.title}
                        </h2>
                        {assessment.description && (
                            <p className="text-xs sm:text-sm text-blue-100/90 mt-1.5 max-w-2xl leading-relaxed">
                                {assessment.description}
                            </p>
                        )}
                    </div>

                    <div className="flex flex-wrap items-center gap-2 text-xs font-medium">
                        <span className="px-3 py-1.5 rounded-xl bg-white/10 backdrop-blur-xs border border-white/10 text-white flex items-center gap-1.5">
                            <HelpCircle className="w-3.5 h-3.5 text-blue-300" />
                            {totalQuestions} Questions
                        </span>
                        <span className="px-3 py-1.5 rounded-xl bg-white/10 backdrop-blur-xs border border-white/10 text-white flex items-center gap-1.5">
                            <Award className="w-3.5 h-3.5 text-amber-300" />
                            Pass: {assessment.passing_percentage}%
                        </span>
                        {assessment.time_limit_minutes && (
                            <span className="px-3 py-1.5 rounded-xl bg-white/10 backdrop-blur-xs border border-white/10 text-white flex items-center gap-1.5">
                                <Clock className="w-3.5 h-3.5 text-sky-300" />
                                {assessment.time_limit_minutes} Mins
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {/* Body: Result view or Quiz form */}
            <div className="p-6 sm:p-8">
                {hasSubmitted ? (
                    /* SUBMISSION RESULT VIEW */
                    <div className="space-y-6">
                        <div className={`p-6 sm:p-7 rounded-2xl border ${
                            submission.status === 'passed'
                                ? 'bg-emerald-50/80 border-emerald-200 text-emerald-950'
                                : 'bg-amber-50/80 border-amber-200 text-amber-950'
                        }`}>
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div className="flex items-start gap-4">
                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                                        submission.status === 'passed'
                                            ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/20'
                                            : 'bg-amber-600 text-white shadow-md shadow-amber-500/20'
                                    }`}>
                                        {submission.status === 'passed' ? (
                                            <Award className="w-6 h-6" />
                                        ) : (
                                            <AlertCircle className="w-6 h-6" />
                                        )}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span className={`px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider rounded-md ${
                                                submission.status === 'passed'
                                                    ? 'bg-emerald-600 text-white'
                                                    : 'bg-amber-600 text-white'
                                            }`}>
                                                {submission.status === 'passed' ? 'Passed' : 'Did Not Pass'}
                                            </span>
                                            <span className="text-xs text-slate-500 font-medium">
                                                Completed on {new Date(submission.submitted_at || submission.created_at).toLocaleString([], {
                                                    month: 'short',
                                                    day: 'numeric',
                                                    year: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                })}
                                            </span>
                                        </div>
                                        <h3 className="text-lg font-bold mt-1">
                                            Your Score: <span className="font-black text-xl">{submission.score} / {submission.total_points}</span> ({Number(submission.percentage).toFixed(1)}%)
                                        </h3>
                                        <p className="text-xs text-slate-600 mt-1 max-w-xl">
                                            {submission.feedback || (submission.status === 'passed'
                                                ? 'Great job! You have demonstrated good comprehension of this lesson.'
                                                : `You need at least ${assessment.passing_percentage}% to pass. Review the materials above and retake the quiz.`
                                            )}
                                        </p>
                                    </div>
                                </div>

                                <button
                                    onClick={handleStartRetake}
                                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-bold rounded-xl bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 hover:text-blue-600 shadow-xs transition-colors shrink-0"
                                >
                                    <RotateCcw className="w-3.5 h-3.5" />
                                    Retake Assessment
                                </button>
                            </div>
                        </div>

                        {/* Question Breakdown & Explanations */}
                        <div className="space-y-4 pt-2">
                            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                                Assessment Review &amp; Explanations
                            </h4>

                            <div className="space-y-4">
                                {questions.map((q, idx) => {
                                    const studentAnswer = submission.answers?.[q.id] || submission.answers?.[String(q.id)];
                                    const isCorrect = studentAnswer && q.correct_answer && (
                                        String(studentAnswer).trim().toLowerCase() === String(q.correct_answer).trim().toLowerCase()
                                    );

                                    return (
                                        <div
                                            key={q.id}
                                            className="p-5 rounded-2xl border border-slate-200/90 bg-slate-50/50 space-y-3"
                                        >
                                            <div className="flex items-start justify-between gap-3">
                                                <div className="flex items-start gap-2.5">
                                                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${
                                                        isCorrect ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                                                    }`}>
                                                        {idx + 1}
                                                    </span>
                                                    <div>
                                                        <p className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">
                                                            {q.question_text}
                                                        </p>
                                                        <span className="text-[10px] text-slate-400 font-medium">
                                                            Worth {q.points} {q.points === 1 ? 'point' : 'points'}
                                                        </span>
                                                    </div>
                                                </div>

                                                <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold ${
                                                    isCorrect
                                                        ? 'bg-emerald-100 text-emerald-800'
                                                        : 'bg-rose-100 text-rose-800'
                                                }`}>
                                                    {isCorrect ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                                                    {isCorrect ? 'Correct' : 'Incorrect'}
                                                </span>
                                            </div>

                                            {/* Options */}
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                                                {(q.options || []).map((opt) => {
                                                    const isSelected = studentAnswer === opt.key;
                                                    const isThisCorrect = q.correct_answer === opt.key;

                                                    let cardStyle = 'border-slate-200 bg-white text-slate-700';
                                                    if (isSelected && isThisCorrect) {
                                                        cardStyle = 'border-emerald-500 bg-emerald-50 text-emerald-950 font-semibold ring-1 ring-emerald-500';
                                                    } else if (isSelected && !isThisCorrect) {
                                                        cardStyle = 'border-rose-400 bg-rose-50 text-rose-950 font-semibold ring-1 ring-rose-400';
                                                    } else if (isThisCorrect) {
                                                        cardStyle = 'border-emerald-400 bg-emerald-50/50 text-emerald-900 font-semibold';
                                                    }

                                                    return (
                                                        <div
                                                            key={opt.key}
                                                            className={`p-3 rounded-xl border text-xs flex items-center justify-between gap-2 ${cardStyle}`}
                                                        >
                                                            <div className="flex items-center gap-2">
                                                                <span className="w-5 h-5 rounded-md bg-black/5 flex items-center justify-center font-bold text-[10px]">
                                                                    {opt.key}
                                                                </span>
                                                                <span>{opt.text}</span>
                                                            </div>
                                                            {isSelected && (
                                                                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                                                                    Your answer
                                                                </span>
                                                            )}
                                                            {!isSelected && isThisCorrect && (
                                                                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">
                                                                    Correct answer
                                                                </span>
                                                            )}
                                                        </div>
                                                    );
                                                })}
                                            </div>

                                            {/* Explanation */}
                                            {q.explanation && (
                                                <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-100 text-[11px] text-blue-900 leading-relaxed flex items-start gap-2">
                                                    <BookOpen className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                                                    <div>
                                                        <strong className="font-bold">Explanation: </strong>
                                                        {q.explanation}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                ) : (
                    /* QUIZ QUESTIONNAIRE FORM */
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {isRetaking && (
                            <div className="flex items-center justify-between p-3.5 rounded-xl bg-blue-50 border border-blue-200 text-xs text-blue-900 font-medium">
                                <span>You are retaking this assessment. Your previous best score will be retained in history.</span>
                                <button
                                    type="button"
                                    onClick={handleCancelRetake}
                                    className="text-xs font-bold text-blue-700 hover:underline"
                                >
                                    Cancel
                                </button>
                            </div>
                        )}

                        {errorMessage && (
                            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-800 flex items-center gap-2">
                                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                                {errorMessage}
                            </div>
                        )}

                        {/* Progress Bar */}
                        <div className="space-y-1.5">
                            <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
                                <span>Progress: {answeredCount} of {totalQuestions} answered</span>
                                <span>{Math.round((answeredCount / totalQuestions) * 100)}%</span>
                            </div>
                            <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                                <div
                                    className="h-full bg-blue-600 rounded-full transition-all duration-300"
                                    style={{ width: `${(answeredCount / totalQuestions) * 100}%` }}
                                />
                            </div>
                        </div>

                        {/* Questions List */}
                        <div className="space-y-6">
                            {questions.map((q, idx) => {
                                const selectedKey = answers[q.id];

                                return (
                                    <div
                                        key={q.id}
                                        className={`p-6 rounded-2xl border transition-all ${
                                            selectedKey
                                                ? 'border-blue-300 bg-white shadow-2xs'
                                                : 'border-slate-200 bg-slate-50/50'
                                        }`}
                                    >
                                        <div className="flex items-start justify-between gap-4 mb-4">
                                            <div className="flex items-start gap-3">
                                                <span className="w-7 h-7 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center text-xs font-black shrink-0">
                                                    {idx + 1}
                                                </span>
                                                <div>
                                                    <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                                                        {q.question_text}
                                                    </h3>
                                                    <span className="text-[11px] text-slate-400 font-medium">
                                                        Multiple Choice • {q.points} {q.points === 1 ? 'Point' : 'Points'}
                                                    </span>
                                                </div>
                                            </div>

                                            {selectedKey && (
                                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-100 text-blue-700">
                                                    <Check className="w-3 h-3" /> Answered
                                                </span>
                                            )}
                                        </div>

                                        {/* Options Selection */}
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            {(q.options || []).map((opt) => {
                                                const isSelected = selectedKey === opt.key;

                                                return (
                                                    <button
                                                        key={opt.key}
                                                        type="button"
                                                        onClick={() => handleSelectOption(q.id, opt.key)}
                                                        className={`p-3.5 rounded-xl border text-left text-xs transition-all flex items-center gap-3 ${
                                                            isSelected
                                                                ? 'border-blue-600 bg-blue-50/80 text-blue-950 font-bold shadow-xs ring-2 ring-blue-500/30'
                                                                : 'border-slate-200 bg-white text-slate-700 hover:border-blue-300 hover:bg-slate-50'
                                                        }`}
                                                    >
                                                        <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-black shrink-0 transition-colors ${
                                                            isSelected
                                                                ? 'bg-blue-600 text-white'
                                                                : 'bg-slate-100 text-slate-600'
                                                        }`}>
                                                            {opt.key}
                                                        </span>
                                                        <span className="leading-snug">{opt.text}</span>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Submit Action Bar */}
                        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <p className="text-xs text-slate-500">
                                {allAnswered
                                    ? 'All questions answered! Click submit when you are ready.'
                                    : `Please answer ${totalQuestions - answeredCount} more ${totalQuestions - answeredCount === 1 ? 'question' : 'questions'} to submit.`
                                }
                            </p>

                            <button
                                type="submit"
                                disabled={!allAnswered || isSubmitting}
                                className={`inline-flex items-center justify-center gap-2 px-8 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-md ${
                                    allAnswered && !isSubmitting
                                        ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/25 cursor-pointer hover:shadow-lg'
                                        : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                                }`}
                            >
                                <Send className="w-4 h-4" />
                                {isSubmitting ? 'Grading Answers...' : 'Submit Assessment'}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}

