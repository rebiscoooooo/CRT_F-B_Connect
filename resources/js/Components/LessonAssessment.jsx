import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import ReviewerFlashcards from '@/Components/ReviewerFlashcards';
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
    Layers,
} from 'lucide-react';

export default function LessonAssessment({ resource, assessment, initialSubmission }) {
    const [submission, setSubmission] = useState(initialSubmission);
    const [isRetaking, setIsRetaking] = useState(false);
    const [answers, setAnswers] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [activeMode, setActiveMode] = useState('quiz'); // 'quiz' | 'flashcards'

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
        <div className="cyber-glass-card rounded-3xl border border-[#A8E6E8]/20 shadow-sm overflow-hidden transition-all duration-300">
            {/* Assessment Header */}
            <div className="p-6 sm:p-8 bg-gradient-to-r from-[#0A3D4F] via-[#0B6E8A] to-[#2EC4D6] text-[#F4FBFC] relative overflow-hidden">
                <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-48 h-48 bg-[#2EC4D6]/20 rounded-full blur-2xl pointer-events-none" />
                
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0B6E8A]/25 text-[#2EC4D6] text-xs font-semibold uppercase tracking-wider mb-2 backdrop-blur-xs border border-[#2EC4D6]/40">
                            <Sparkles className="w-3.5 h-3.5 text-[#2EC4D6]" />
                            Lesson Knowledge Check
                        </div>
                        <h2 className="text-xl sm:text-2xl font-black text-[#F4FBFC] tracking-tight">
                            {assessment.title}
                        </h2>
                        {assessment.description && (
                            <p className="text-xs sm:text-sm text-[#A8E6E8]/80 mt-1.5 max-w-2xl leading-relaxed">
                                {assessment.description}
                            </p>
                        )}
                    </div>

                    <div className="flex flex-wrap items-center gap-2 text-xs font-medium">
                        <span className="px-3 py-1.5 rounded-xl bg-[#0A3D4F]/30 backdrop-blur-xs border border-[#A8E6E8]/20 text-[#F4FBFC] flex items-center gap-1.5">
                            <HelpCircle className="w-3.5 h-3.5 text-[#2EC4D6]" />
                            {totalQuestions} Questions
                        </span>
                        <span className="px-3 py-1.5 rounded-xl bg-[#0A3D4F]/30 backdrop-blur-xs border border-[#A8E6E8]/20 text-[#F4FBFC] flex items-center gap-1.5">
                            <Award className="w-3.5 h-3.5 text-[#2EC4D6]" />
                            Pass: {assessment.passing_percentage}%
                        </span>
                        {assessment.time_limit_minutes && (
                            <span className="px-3 py-1.5 rounded-xl bg-[#0A3D4F]/30 backdrop-blur-xs border border-[#A8E6E8]/20 text-[#F4FBFC] flex items-center gap-1.5">
                                <Clock className="w-3.5 h-3.5 text-[#2EC4D6]" />
                                {assessment.time_limit_minutes} Mins
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {/* Reviewer / Exam Mode Switcher Tabs */}
            <div className="bg-[#0A3D4F]/30 border-b border-[#A8E6E8]/20 px-6 sm:px-8 py-3 flex items-center justify-between gap-3 flex-wrap">
                <div className="inline-flex p-1 rounded-xl bg-[#0B6E8A]/20 border border-[#2EC4D6]/40 text-xs font-bold">
                    <button
                        type="button"
                        onClick={() => setActiveMode('flashcards')}
                        className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg transition-all cursor-pointer ${
                            activeMode === 'flashcards'
                                ? 'cyber-glow-btn text-[#F4FBFC] shadow-xs font-extrabold'
                                : 'text-[#A8E6E8]/70 hover:text-[#F4FBFC]'
                        }`}
                    >
                        <Layers className="w-3.5 h-3.5 text-[#2EC4D6]" />
                        Reviewer Flashcards (Practice)
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveMode('quiz')}
                        className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg transition-all cursor-pointer ${
                            activeMode === 'quiz'
                                ? 'cyber-glow-btn text-[#F4FBFC] shadow-xs font-extrabold'
                                : 'text-[#A8E6E8]/70 hover:text-[#F4FBFC]'
                        }`}
                    >
                        <BookOpen className="w-3.5 h-3.5 text-[#2EC4D6]" />
                        {hasSubmitted ? 'Quiz Results & Review' : 'Take Knowledge Quiz'}
                    </button>
                </div>

                <span className="text-[11px] font-semibold text-[#A8E6E8]/70">
                    {activeMode === 'flashcards'
                        ? 'Practice and flip cards freely before testing your score.'
                        : hasSubmitted
                        ? 'Graded assessment submission.'
                        : 'Answer all questions to submit for grading.'}
                </span>
            </div>

            {/* Body: Flashcards Reviewer or Quiz form */}
            <div className="p-6 sm:p-8">
                {activeMode === 'flashcards' ? (
                    <div className="max-w-3xl mx-auto space-y-6">
                        <ReviewerFlashcards questions={questions} title={assessment.title} />

                        <div className="p-4 rounded-2xl bg-[#0B6E8A]/20 border border-[#2EC4D6]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div className="text-xs text-[#F4FBFC]">
                                <strong className="font-bold">Finished reviewing the flashcards?</strong>
                                <p className="text-[#2EC4D6] text-[11px]">Take the official lesson assessment to record your grade.</p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setActiveMode('quiz')}
                                className="cyber-glow-btn inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-xs shrink-0 cursor-pointer"
                            >
                                <BookOpen className="w-3.5 h-3.5" />
                                {hasSubmitted ? 'View Graded Results' : 'Take Knowledge Quiz Now'}
                            </button>
                        </div>
                    </div>
                ) : hasSubmitted ? (
                    /* SUBMISSION RESULT VIEW */
                    <div className="space-y-6">
                        <div className={`p-6 sm:p-7 rounded-2xl border ${
                            submission.status === 'passed'
                                ? 'bg-emerald-500/15 border-emerald-500/30 text-[#F4FBFC]'
                                : 'bg-amber-500/15 border-amber-500/30 text-[#F4FBFC]'
                        }`}>
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div className="flex items-start gap-4">
                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border ${
                                        submission.status === 'passed'
                                            ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300 shadow-md shadow-emerald-500/20'
                                            : 'bg-amber-500/20 border-amber-500/40 text-amber-300 shadow-md shadow-amber-500/20'
                                    }`}>
                                        {submission.status === 'passed' ? (
                                            <Award className="w-6 h-6" />
                                        ) : (
                                            <AlertCircle className="w-6 h-6" />
                                        )}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span className={`px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider rounded-md border ${
                                                submission.status === 'passed'
                                                    ? 'bg-emerald-500/25 text-emerald-300 border-emerald-500/40'
                                                    : 'bg-amber-500/25 text-amber-300 border-amber-500/40'
                                            }`}>
                                                {submission.status === 'passed' ? 'Passed' : 'Did Not Pass'}
                                            </span>
                                            <span className="text-xs text-[#A8E6E8]/70 font-medium">
                                                Completed on {new Date(submission.submitted_at || submission.created_at).toLocaleString([], {
                                                    month: 'short',
                                                    day: 'numeric',
                                                    year: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                })}
                                            </span>
                                        </div>
                                        <h3 className="text-lg font-bold mt-1 text-[#F4FBFC]">
                                            Your Score: <span className="font-black text-xl text-[#2EC4D6]">{submission.score} / {submission.total_points}</span> ({Number(submission.percentage).toFixed(1)}%)
                                        </h3>
                                        <p className="text-xs text-[#A8E6E8]/80 mt-1 max-w-xl">
                                            {submission.feedback || (submission.status === 'passed'
                                                ? 'Great job! You have demonstrated good comprehension of this lesson.'
                                                : `You need at least ${assessment.passing_percentage}% to pass. Review the materials above and retake the quiz.`
                                            )}
                                        </p>
                                    </div>
                                </div>

                                <button
                                    onClick={handleStartRetake}
                                    className="cyber-oauth-btn inline-flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-bold rounded-xl shadow-xs transition-colors shrink-0 cursor-pointer"
                                >
                                    <RotateCcw className="w-3.5 h-3.5 text-[#2EC4D6]" />
                                    Retake Assessment
                                </button>
                            </div>
                        </div>

                        {/* Question Breakdown & Explanations */}
                        <div className="space-y-4 pt-2">
                            <h4 className="text-xs font-bold uppercase tracking-wider text-[#A8E6E8]/70">
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
                                            className="p-5 rounded-2xl border border-[#A8E6E8]/20 bg-[#061923]/40 space-y-3"
                                        >
                                            <div className="flex items-start justify-between gap-3">
                                                <div className="flex items-start gap-2.5">
                                                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 border ${
                                                        isCorrect ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' : 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                                                    }`}>
                                                        {idx + 1}
                                                    </span>
                                                    <div>
                                                        <p className="text-xs sm:text-sm font-bold text-[#F4FBFC] leading-snug">
                                                            {q.question_text}
                                                        </p>
                                                        <span className="text-[10px] text-[#A8E6E8]/60 font-medium">
                                                            Worth {q.points} {q.points === 1 ? 'point' : 'points'}
                                                        </span>
                                                    </div>
                                                </div>

                                                <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold border ${
                                                    isCorrect
                                                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                                                        : 'bg-rose-500/20 text-rose-300 border-rose-500/30'
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

                                                    let cardStyle = 'border-[#A8E6E8]/20 bg-[#0A3D4F]/30 text-[#A8E6E8]';
                                                    if (isSelected && isThisCorrect) {
                                                        cardStyle = 'border-emerald-500/60 bg-emerald-500/20 text-emerald-200 font-semibold ring-1 ring-emerald-500/40';
                                                    } else if (isSelected && !isThisCorrect) {
                                                        cardStyle = 'border-rose-500/60 bg-rose-500/20 text-rose-200 font-semibold ring-1 ring-rose-500/40';
                                                    } else if (isThisCorrect) {
                                                        cardStyle = 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300 font-semibold';
                                                    }

                                                    return (
                                                        <div
                                                            key={opt.key}
                                                            className={`p-3 rounded-xl border text-xs flex items-center justify-between gap-2 ${cardStyle}`}
                                                        >
                                                            <div className="flex items-center gap-2">
                                                                <span className="w-5 h-5 rounded-md bg-[#061923]/50 border border-[#A8E6E8]/20 flex items-center justify-center font-bold text-[10px] text-[#2EC4D6]">
                                                                    {opt.key}
                                                                </span>
                                                                <span>{opt.text}</span>
                                                            </div>
                                                            {isSelected && (
                                                                <span className="text-[10px] font-bold uppercase tracking-wider text-[#A8E6E8]/80">
                                                                    Your answer
                                                                </span>
                                                            )}
                                                            {!isSelected && isThisCorrect && (
                                                                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                                                                    Correct answer
                                                                </span>
                                                            )}
                                                        </div>
                                                    );
                                                })}
                                            </div>

                                            {/* Explanation */}
                                            {q.explanation && (
                                                <div className="p-3 rounded-xl bg-[#0B6E8A]/25 border border-[#A8E6E8]/25 text-[11px] text-[#A8E6E8] leading-relaxed flex items-start gap-2">
                                                    <BookOpen className="w-3.5 h-3.5 text-[#2EC4D6] shrink-0 mt-0.5" />
                                                    <div>
                                                        <strong className="font-bold text-[#F4FBFC]">Explanation: </strong>
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
                            <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#0B6E8A]/30 border border-[#2EC4D6]/40 text-xs text-[#F4FBFC] font-medium">
                                <span>You are retaking this assessment. Your previous best score will be retained in history.</span>
                                <button
                                    type="button"
                                    onClick={handleCancelRetake}
                                    className="text-xs font-bold text-[#2EC4D6] hover:underline cursor-pointer"
                                >
                                    Cancel
                                </button>
                            </div>
                        )}

                        {errorMessage && (
                            <div className="p-4 rounded-xl bg-rose-500/15 border border-rose-500/30 text-xs font-semibold text-rose-200 flex items-center gap-2">
                                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                                {errorMessage}
                            </div>
                        )}

                        {/* Progress Bar */}
                        <div className="space-y-1.5">
                            <div className="flex items-center justify-between text-xs text-[#A8E6E8]/80 font-semibold">
                                <span>Progress: {answeredCount} of {totalQuestions} answered</span>
                                <span className="text-[#2EC4D6]">{Math.round((answeredCount / totalQuestions) * 100)}%</span>
                            </div>
                            <div className="w-full h-2 rounded-full bg-[#061923]/60 border border-[#A8E6E8]/15 overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-[#0B6E8A] to-[#2EC4D6] rounded-full transition-all duration-300"
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
                                                ? 'border-[#2EC4D6]/50 bg-[#0B6E8A]/20 shadow-md'
                                                : 'border-[#A8E6E8]/20 bg-[#061923]/40'
                                        }`}
                                    >
                                        <div className="flex items-start justify-between gap-4 mb-4">
                                            <div className="flex items-start gap-3">
                                                <span className="w-7 h-7 rounded-xl bg-[#0B6E8A]/40 border border-[#2EC4D6]/30 text-[#2EC4D6] flex items-center justify-center text-xs font-black shrink-0">
                                                    {idx + 1}
                                                </span>
                                                <div>
                                                    <h3 className="text-sm sm:text-base font-bold text-[#F4FBFC] leading-snug">
                                                        {q.question_text}
                                                    </h3>
                                                    <span className="text-[11px] text-[#A8E6E8]/60 font-medium">
                                                        Multiple Choice • {q.points} {q.points === 1 ? 'Point' : 'Points'}
                                                    </span>
                                                </div>
                                            </div>

                                            {selectedKey && (
                                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#2EC4D6]/20 text-[#2EC4D6] border border-[#2EC4D6]/30">
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
                                                                ? 'border-[#2EC4D6] bg-[#0B6E8A]/30 text-[#2EC4D6] font-bold shadow-xs ring-2 ring-[#2EC4D6]/40'
                                                                : 'border-[#A8E6E8]/20 bg-[#061923]/30 text-[#F4FBFC] hover:border-[#2EC4D6]/40 hover:bg-[#0B6E8A]/20'
                                                        }`}
                                                    >
                                                        <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-black shrink-0 transition-colors ${
                                                            isSelected
                                                                ? 'cyber-glow-btn text-[#F4FBFC]'
                                                                : 'bg-[#0A3D4F]/30 text-[#A8E6E8]/70 hover:border-[#2EC4D6]/40'
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
                        <div className="pt-4 border-t border-[#A8E6E8]/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <p className="text-xs text-[#A8E6E8]/70">
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
                                        ? 'cyber-glow-btn text-[#F4FBFC] cursor-pointer shadow-[0_0_24px_rgba(46,196,214,0.6)] hover:shadow-[0_0_34px_rgba(46,196,214,0.85)]'
                                        : 'bg-[#0A3D4F]/30 text-[#A8E6E8]/40 cursor-not-allowed shadow-none'
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

