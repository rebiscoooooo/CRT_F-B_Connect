import React, { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';
import Modal from '@/Components/Modal';
import {
    Plus,
    Trash2,
    Copy,
    ChevronUp,
    ChevronDown,
    CheckCircle2,
    Sparkles,
    Layers,
    BookOpen,
    HelpCircle,
    Award,
    Clock,
    AlertCircle,
    Check,
    RotateCw,
    Sliders,
    ListFilter,
    ChevronLeft,
    ChevronRight,
} from 'lucide-react';

const DEFAULT_OPTIONS = [
    { key: 'A', text: '' },
    { key: 'B', text: '' },
    { key: 'C', text: '' },
    { key: 'D', text: '' },
];

function createBlankQuestion(order = 1) {
    return {
        id: `temp-${Date.now()}-${Math.random()}`,
        question_text: '',
        question_type: 'multiple_choice',
        options: [
            { key: 'A', text: '' },
            { key: 'B', text: '' },
            { key: 'C', text: '' },
            { key: 'D', text: '' },
        ],
        correct_answer: 'A',
        points: 1,
        order,
        explanation: '',
    };
}

export default function ManualAssessmentModal({
    isOpen,
    onClose,
    resource,
    initialAssessment = null,
}) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [passingPercentage, setPassingPercentage] = useState(75);
    const [timeLimitMinutes, setTimeLimitMinutes] = useState(15);
    const [isPublished, setIsPublished] = useState(true);
    const [questions, setQuestions] = useState([]);
    const [activeCardIndex, setActiveCardIndex] = useState(0);
    const [viewMode, setViewMode] = useState('list'); // 'list' | 'card'
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [clientErrors, setClientErrors] = useState({});
    const [showSettings, setShowSettings] = useState(false);

    // Initialize or reset when modal opens or initialAssessment changes
    useEffect(() => {
        if (isOpen) {
            if (initialAssessment) {
                setTitle(initialAssessment.title || `${resource?.title || 'Lesson'} — Knowledge Check Assessment`);
                setDescription(
                    initialAssessment.description ||
                    `Reviewer flashcard & comprehensive assessment for "${resource?.title || 'Lesson'}".`
                );
                setPassingPercentage(initialAssessment.passing_percentage ?? 75);
                setTimeLimitMinutes(initialAssessment.time_limit_minutes ?? 15);
                setIsPublished(initialAssessment.is_published ?? true);

                if (initialAssessment.questions && initialAssessment.questions.length > 0) {
                    setQuestions(
                        initialAssessment.questions.map((q, idx) => ({
                            id: q.id || `q-${idx}`,
                            question_text: q.question_text || '',
                            question_type: q.question_type || 'multiple_choice',
                            options: (q.options || []).map((opt) => ({
                                key: String(opt.key || '').toUpperCase(),
                                text: opt.text || '',
                            })),
                            correct_answer: String(q.correct_answer || 'A').toUpperCase(),
                            points: q.points ?? 1,
                            order: idx + 1,
                            explanation: q.explanation || '',
                        }))
                    );
                } else {
                    setQuestions([createBlankQuestion(1)]);
                }
            } else {
                setTitle(`${resource?.title || 'Lesson'} — Knowledge Check Assessment`);
                setDescription(`Reviewer flashcard & comprehensive assessment evaluating key competencies for "${resource?.title || 'Lesson'}".`);
                setPassingPercentage(75);
                setTimeLimitMinutes(15);
                setIsPublished(true);
                setQuestions([createBlankQuestion(1)]);
            }
            setActiveCardIndex(0);
            setClientErrors({});
        }
    }, [isOpen, initialAssessment, resource]);

    // Add a single question card
    const handleAddQuestion = () => {
        setQuestions((prev) => {
            const nextOrder = prev.length + 1;
            const updated = [...prev, createBlankQuestion(nextOrder)];
            setActiveCardIndex(updated.length - 1);
            return updated;
        });
    };

    // Quick preset to fill up to 10 questions
    const handlePreset10Questions = () => {
        setQuestions((prev) => {
            const needed = 10 - prev.length;
            if (needed <= 0) return prev;
            const additions = Array.from({ length: needed }, (_, i) =>
                createBlankQuestion(prev.length + i + 1)
            );
            return [...prev, ...additions];
        });
    };

    // Duplicate question card
    const handleDuplicateQuestion = (index) => {
        setQuestions((prev) => {
            const source = prev[index];
            const duplicate = {
                ...JSON.parse(JSON.stringify(source)),
                id: `temp-${Date.now()}-${Math.random()}`,
                order: index + 2,
            };
            const updated = [...prev];
            updated.splice(index + 1, 0, duplicate);
            return updated.map((q, idx) => ({ ...q, order: idx + 1 }));
        });
    };

    // Remove question card
    const handleRemoveQuestion = (index) => {
        if (questions.length <= 1) {
            alert('An assessment must have at least 1 question or reviewer card.');
            return;
        }
        setQuestions((prev) => {
            const updated = prev.filter((_, idx) => idx !== index);
            return updated.map((q, idx) => ({ ...q, order: idx + 1 }));
        });
        if (activeCardIndex >= questions.length - 1) {
            setActiveCardIndex(Math.max(0, questions.length - 2));
        }
    };

    // Move question up/down
    const handleMoveQuestion = (index, direction) => {
        const targetIndex = index + direction;
        if (targetIndex < 0 || targetIndex >= questions.length) return;

        setQuestions((prev) => {
            const updated = [...prev];
            const temp = updated[index];
            updated[index] = updated[targetIndex];
            updated[targetIndex] = temp;
            return updated.map((q, idx) => ({ ...q, order: idx + 1 }));
        });
        setActiveCardIndex(targetIndex);
    };

    // Update question field
    const handleUpdateQuestion = (index, field, value) => {
        setQuestions((prev) => {
            const updated = [...prev];
            updated[index] = { ...updated[index], [field]: value };
            return updated;
        });
        if (clientErrors[`q_${index}_${field}`]) {
            setClientErrors((prev) => {
                const next = { ...prev };
                delete next[`q_${index}_${field}`];
                return next;
            });
        }
    };

    // Update option text
    const handleUpdateOption = (qIndex, optIndex, text) => {
        setQuestions((prev) => {
            const updated = [...prev];
            const options = [...updated[qIndex].options];
            options[optIndex] = { ...options[optIndex], text };
            updated[qIndex] = { ...updated[qIndex], options };
            return updated;
        });
    };

    // Add option to question
    const handleAddOption = (qIndex) => {
        setQuestions((prev) => {
            const updated = [...prev];
            const currentOptions = updated[qIndex].options;
            const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
            const nextKey = letters[currentOptions.length] || `Opt${currentOptions.length + 1}`;
            updated[qIndex] = {
                ...updated[qIndex],
                options: [...currentOptions, { key: nextKey, text: '' }],
            };
            return updated;
        });
    };

    // Remove option from question
    const handleRemoveOption = (qIndex, optIndex) => {
        setQuestions((prev) => {
            const updated = [...prev];
            const currentOptions = updated[qIndex].options;
            if (currentOptions.length <= 2) {
                alert('A multiple-choice question requires at least 2 options.');
                return prev;
            }
            const removedKey = currentOptions[optIndex].key;
            const filtered = currentOptions.filter((_, idx) => idx !== optIndex);
            // Re-key options A, B, C...
            const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
            const reKeyed = filtered.map((opt, idx) => ({
                ...opt,
                key: letters[idx] || opt.key,
            }));
            let newCorrectAnswer = updated[qIndex].correct_answer;
            if (newCorrectAnswer === removedKey || !reKeyed.some((o) => o.key === newCorrectAnswer)) {
                newCorrectAnswer = reKeyed[0]?.key || 'A';
            }
            updated[qIndex] = {
                ...updated[qIndex],
                options: reKeyed,
                correct_answer: newCorrectAnswer,
            };
            return updated;
        });
    };

    // Set question type
    const handleSetQuestionType = (qIndex, type) => {
        setQuestions((prev) => {
            const updated = [...prev];
            if (type === 'true_false') {
                updated[qIndex] = {
                    ...updated[qIndex],
                    question_type: 'true_false',
                    options: [
                        { key: 'A', text: 'True' },
                        { key: 'B', text: 'False' },
                    ],
                    correct_answer: 'A',
                };
            } else {
                updated[qIndex] = {
                    ...updated[qIndex],
                    question_type: 'multiple_choice',
                    options: [
                        { key: 'A', text: '' },
                        { key: 'B', text: '' },
                        { key: 'C', text: '' },
                        { key: 'D', text: '' },
                    ],
                    correct_answer: 'A',
                };
            }
            return updated;
        });
    };

    // Validation before submission
    const validate = () => {
        const errors = {};
        if (!title.trim()) {
            errors.title = 'Assessment title is required.';
        }

        questions.forEach((q, idx) => {
            if (!q.question_text || !q.question_text.trim()) {
                errors[`q_${idx}_text`] = `Question #${idx + 1} is missing the question prompt.`;
            }
            if (!q.options || q.options.length < 2) {
                errors[`q_${idx}_options`] = `Question #${idx + 1} must have at least 2 options.`;
            } else {
                q.options.forEach((opt, optIdx) => {
                    if (!opt.text || !opt.text.trim()) {
                        errors[`q_${idx}_opt_${optIdx}`] = `Question #${idx + 1}, Option ${opt.key} is empty.`;
                    }
                });
            }
            if (!q.correct_answer) {
                errors[`q_${idx}_correct`] = `Question #${idx + 1} has no correct answer key designated.`;
            }
        });

        setClientErrors(errors);
        return Object.keys(errors).length === 0;
    };

    // Submit payload
    const handleSubmit = (e) => {
        if (e) e.preventDefault();
        if (!validate()) {
            const firstError = Object.values(clientErrors)[0];
            alert(firstError || 'Please fill in all question prompts, options, and designated answer keys.');
            return;
        }

        setIsSubmitting(true);

        const payload = {
            title,
            description,
            passing_percentage: Number(passingPercentage),
            time_limit_minutes: Number(timeLimitMinutes) || null,
            is_published: Boolean(isPublished),
            questions: questions.map((q, idx) => ({
                question_text: q.question_text.trim(),
                question_type: q.question_type || 'multiple_choice',
                options: q.options.map((opt) => ({
                    key: opt.key,
                    text: opt.text.trim(),
                })),
                correct_answer: q.correct_answer,
                points: Number(q.points) || 1,
                order: idx + 1,
                explanation: q.explanation ? q.explanation.trim() : null,
            })),
        };

        router.post(`/admin/resources/${resource.id}/assessment`, payload, {
            preserveScroll: true,
            onSuccess: () => {
                setIsSubmitting(false);
                onClose();
            },
            onError: (errs) => {
                setIsSubmitting(false);
                setClientErrors(errs);
            },
        });
    };

    const currentCard = questions[activeCardIndex] || questions[0];

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Manual Assessment & Reviewer Flashcard Builder"
            maxWidth="4xl"
        >
            <div className="space-y-6">
                {/* Introduction Banner */}
                <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
                    <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#0B6E8A]/25 border border-[#2EC4D6]/40 flex items-center justify-center shrink-0">
                            <Layers className="w-5 h-5 text-[#2EC4D6]" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h3 className="font-extrabold text-sm sm:text-base text-[#F4FBFC]">
                                    Manual Reviewer &amp; Question Builder
                                </h3>
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#0B6E8A]/30 text-[#2EC4D6] border border-[#2EC4D6]/40">
                                    {questions.length} / 10+ Items
                                </span>
                            </div>
                            <p className="text-xs text-slate-300 mt-0.5">
                                Manually author practice questions, multiple-choice answer keys, and reviewer study cards for "{resource?.title}".
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                        <button
                            type="button"
                            onClick={() => setShowSettings(!showSettings)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0A3D4F]/30 hover:bg-[#0B6E8A]/30 text-[#F4FBFC] text-xs font-bold border border-[#A8E6E8]/20 transition-colors cursor-pointer"
                        >
                            <Sliders className="w-3.5 h-3.5 text-[#2EC4D6]" />
                            {showSettings ? 'Hide Settings' : 'Quiz Settings'}
                        </button>

                        {questions.length < 10 && (
                            <button
                                type="button"
                                onClick={handlePreset10Questions}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl cyber-glow-btn text-[#F4FBFC] text-xs font-bold transition-all shadow-xs cursor-pointer"
                                title="Instantly fill up to 10 questions"
                            >
                                <Sparkles className="w-3.5 h-3.5" />
                                Preset 10 Questions
                            </button>
                        )}
                    </div>
                </div>

                {/* Collapsible Quiz Settings */}
                {showSettings && (
                    <div className="p-5 rounded-2xl bg-[#0A3D4F]/30 border border-[#A8E6E8]/20 space-y-4 text-xs transition-all">
                        <div className="flex items-center justify-between">
                            <h4 className="font-bold uppercase tracking-wider text-[#A8E6E8]/70 text-[11px] flex items-center gap-1.5">
                                <Sliders className="w-3.5 h-3.5 text-[#2EC4D6]" />
                                Global Assessment &amp; Reviewer Parameters
                            </h4>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="sm:col-span-2">
                                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#A8E6E8] mb-1">
                                    Assessment / Reviewer Title
                                </label>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="e.g. Knife Skills & Prep Hygiene Knowledge Check"
                                    className="cyber-glass-input w-full px-3.5 py-2 rounded-xl text-xs font-semibold"
                                />
                                {clientErrors.title && (
                                    <p className="text-[11px] text-rose-400 font-semibold mt-1">{clientErrors.title}</p>
                                )}
                            </div>

                            <div className="sm:col-span-2">
                                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#A8E6E8] mb-1">
                                    Reviewer Instructions / Objective (Optional)
                                </label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    rows={2}
                                    placeholder="Brief instructions or summary of what students will practice..."
                                    className="cyber-glass-input w-full px-3.5 py-2 rounded-xl text-xs"
                                />
                            </div>

                            <div>
                                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#A8E6E8] mb-1">
                                    Passing Percentage Requirement
                                </label>
                                <select
                                    value={passingPercentage}
                                    onChange={(e) => setPassingPercentage(Number(e.target.value))}
                                    className="cyber-glass-input w-full px-3.5 py-2 rounded-xl text-xs"
                                >
                                    <option value={60} className="bg-[#061923] text-[#F4FBFC]">60% (Minimum)</option>
                                    <option value={70} className="bg-[#061923] text-[#F4FBFC]">70%</option>
                                    <option value={75} className="bg-[#061923] text-[#F4FBFC]">75% (Standard)</option>
                                    <option value={80} className="bg-[#061923] text-[#F4FBFC]">80%</option>
                                    <option value={85} className="bg-[#061923] text-[#F4FBFC]">85%</option>
                                    <option value={90} className="bg-[#061923] text-[#F4FBFC]">90% (Strict)</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#A8E6E8] mb-1">
                                    Time Limit
                                </label>
                                <select
                                    value={timeLimitMinutes}
                                    onChange={(e) => setTimeLimitMinutes(Number(e.target.value))}
                                    className="cyber-glass-input w-full px-3.5 py-2 rounded-xl text-xs"
                                >
                                    <option value={0} className="bg-[#061923] text-[#F4FBFC]">No Time Limit (Free Practice)</option>
                                    <option value={10} className="bg-[#061923] text-[#F4FBFC]">10 Minutes</option>
                                    <option value={15} className="bg-[#061923] text-[#F4FBFC]">15 Minutes (Recommended)</option>
                                    <option value={20} className="bg-[#061923] text-[#F4FBFC]">20 Minutes</option>
                                    <option value={30} className="bg-[#061923] text-[#F4FBFC]">30 Minutes</option>
                                </select>
                            </div>

                            <div className="sm:col-span-2">
                                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#A8E6E8] mb-1">
                                    Visibility to Students
                                </label>
                                <div className="flex items-center gap-3">
                                    <label className="inline-flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="modal_is_published"
                                            checked={isPublished === true}
                                            onChange={() => setIsPublished(true)}
                                            className="text-[#2EC4D6]"
                                        />
                                        <span className="text-xs font-semibold text-[#F4FBFC]">Live / Published (Accessible to students)</span>
                                    </label>
                                    <label className="inline-flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="modal_is_published"
                                            checked={isPublished === false}
                                            onChange={() => setIsPublished(false)}
                                            className="text-[#2EC4D6]"
                                        />
                                        <span className="text-xs font-semibold text-[#A8E6E8]/80">Draft Mode (Admins only)</span>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* View Switcher & Question Cards Tabs */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#A8E6E8]/15 pb-3">
                    <div className="flex items-center gap-2 overflow-x-auto py-1 max-w-full">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-[#A8E6E8]/60 shrink-0">
                            Cards:
                        </span>
                        {questions.map((q, idx) => {
                            const isSelected = viewMode === 'card' && activeCardIndex === idx;
                            const hasError =
                                clientErrors[`q_${idx}_text`] ||
                                clientErrors[`q_${idx}_options`] ||
                                clientErrors[`q_${idx}_correct`];

                            return (
                                <button
                                    key={q.id || idx}
                                    type="button"
                                    onClick={() => {
                                        setActiveCardIndex(idx);
                                        if (viewMode === 'list') {
                                            // Scroll to question in list view
                                            const el = document.getElementById(`question-card-${idx}`);
                                            el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                        }
                                    }}
                                    className={`w-7 h-7 rounded-lg text-xs font-black transition-all flex items-center justify-center shrink-0 cursor-pointer relative ${
                                        isSelected
                                            ? 'cyber-glow-btn shadow-xs'
                                            : hasError
                                            ? 'bg-rose-500/20 text-rose-300 ring-1 ring-rose-400'
                                            : 'bg-[#0A3D4F]/40 text-[#A8E6E8] hover:bg-[#0B6E8A]/40 border border-[#A8E6E8]/20'
                                    }`}
                                    title={`Question #${idx + 1}`}
                                >
                                    {idx + 1}
                                    {hasError && (
                                        <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-rose-400" />
                                    )}
                                </button>
                            );
                        })}

                        <button
                            type="button"
                            onClick={handleAddQuestion}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-dashed border-[#2EC4D6]/50 text-[#2EC4D6] hover:bg-[#0B6E8A]/30 text-xs font-bold transition-colors shrink-0 cursor-pointer"
                        >
                            <Plus className="w-3.5 h-3.5" />
                            Add
                        </button>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                        <div className="inline-flex p-0.5 rounded-xl bg-[#061923]/60 border border-[#A8E6E8]/20 text-xs font-semibold">
                            <button
                                type="button"
                                onClick={() => setViewMode('list')}
                                className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                                    viewMode === 'list'
                                        ? 'bg-[#0B6E8A] text-[#F4FBFC] font-bold shadow-2xs'
                                        : 'text-[#A8E6E8]/70 hover:text-[#F4FBFC]'
                                }`}
                            >
                                All Cards (List)
                            </button>
                            <button
                                type="button"
                                onClick={() => setViewMode('card')}
                                className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                                    viewMode === 'card'
                                        ? 'bg-[#0B6E8A] text-[#F4FBFC] font-bold shadow-2xs'
                                        : 'text-[#A8E6E8]/70 hover:text-[#F4FBFC]'
                                }`}
                            >
                                Single Card Focus
                            </button>
                        </div>
                    </div>
                </div>

                {/* Question Cards Area */}
                {viewMode === 'card' ? (
                    /* SINGLE CARD FOCUS MODE */
                    <div className="space-y-4">
                        <QuestionCardEditor
                            q={currentCard}
                            index={activeCardIndex}
                            totalCount={questions.length}
                            clientErrors={clientErrors}
                            onUpdate={handleUpdateQuestion}
                            onUpdateOption={handleUpdateOption}
                            onAddOption={handleAddOption}
                            onRemoveOption={handleRemoveOption}
                            onSetType={handleSetQuestionType}
                            onDuplicate={handleDuplicateQuestion}
                            onRemove={handleRemoveQuestion}
                            onMove={handleMoveQuestion}
                        />

                        {/* Navigation Footer for Single Card */}
                        <div className="flex items-center justify-between pt-2">
                            <button
                                type="button"
                                disabled={activeCardIndex === 0}
                                onClick={() => setActiveCardIndex((prev) => Math.max(0, prev - 1))}
                                className="cyber-oauth-btn inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold disabled:opacity-40 cursor-pointer"
                            >
                                <ChevronLeft className="w-4 h-4" />
                                Previous Card
                            </button>

                            <span className="text-xs font-bold text-[#A8E6E8]/70">
                                Card {activeCardIndex + 1} of {questions.length}
                            </span>

                            <button
                                type="button"
                                disabled={activeCardIndex === questions.length - 1}
                                onClick={() => setActiveCardIndex((prev) => Math.min(questions.length - 1, prev + 1))}
                                className="cyber-oauth-btn inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold disabled:opacity-40 cursor-pointer"
                            >
                                Next Card
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                ) : (
                    /* ALL CARDS (LIST) VIEW */
                    <div className="space-y-5 max-h-[58vh] overflow-y-auto pr-1">
                        {questions.map((q, idx) => (
                            <div key={q.id || idx} id={`question-card-${idx}`}>
                                <QuestionCardEditor
                                    q={q}
                                    index={idx}
                                    totalCount={questions.length}
                                    clientErrors={clientErrors}
                                    onUpdate={handleUpdateQuestion}
                                    onUpdateOption={handleUpdateOption}
                                    onAddOption={handleAddOption}
                                    onRemoveOption={handleRemoveOption}
                                    onSetType={handleSetQuestionType}
                                    onDuplicate={handleDuplicateQuestion}
                                    onRemove={handleRemoveQuestion}
                                    onMove={handleMoveQuestion}
                                />
                            </div>
                        ))}

                        <div className="pt-2 flex justify-center">
                            <button
                                type="button"
                                onClick={handleAddQuestion}
                                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl border-2 border-dashed border-[#2EC4D6]/40 hover:border-[#2EC4D6] bg-[#0B6E8A]/20 hover:bg-[#0B6E8A]/35 text-[#2EC4D6] text-xs font-bold transition-all cursor-pointer"
                            >
                                <Plus className="w-4 h-4" />
                                Add Another Question Card (#{questions.length + 1})
                            </button>
                        </div>
                    </div>
                )}

                {/* Modal Action Bar */}
                <div className="pt-4 border-t border-[#A8E6E8]/15 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-2 text-xs text-[#A8E6E8]/80">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span>
                            Ready to save <strong className="text-[#F4FBFC]">{questions.length}</strong> {questions.length === 1 ? 'question' : 'questions'} (
                            {questions.reduce((acc, curr) => acc + (Number(curr.points) || 1), 0)} total points)
                        </span>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="cyber-oauth-btn px-4 py-2 text-xs font-semibold rounded-xl cursor-pointer"
                        >
                            Cancel
                        </button>

                        <button
                            type="button"
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            className="cyber-glow-btn inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold transition-all disabled:opacity-60 cursor-pointer"
                        >
                            <Layers className="w-4 h-4" />
                            {isSubmitting ? 'Saving Assessment...' : 'Save Assessment & Reviewer Cards'}
                        </button>
                    </div>
                </div>
            </div>
        </Modal>
    );
}

/**
 * Single Question Card Sub-Editor
 */
function QuestionCardEditor({
    q,
    index,
    totalCount,
    clientErrors,
    onUpdate,
    onUpdateOption,
    onAddOption,
    onRemoveOption,
    onSetType,
    onDuplicate,
    onRemove,
    onMove,
}) {
    const [testFlip, setTestFlip] = useState(false);

    const hasError =
        clientErrors[`q_${index}_text`] ||
        clientErrors[`q_${index}_options`] ||
        clientErrors[`q_${index}_correct`];

    const correctOption = q.options?.find(
        (opt) => String(opt.key).toUpperCase() === String(q.correct_answer).toUpperCase()
    );

    return (
        <div
            className={`p-5 rounded-2xl border transition-all ${
                hasError
                    ? 'border-rose-500/50 bg-rose-500/10'
                    : 'border-[#A8E6E8]/20 bg-[#061923]/40 shadow-md hover:border-[#2EC4D6]/40'
            }`}
        >
            {/* Card Header */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-[#A8E6E8]/15">
                <div className="flex items-center gap-2.5">
                    <span className="w-7 h-7 rounded-xl bg-[#0B6E8A] text-[#F4FBFC] border border-[#2EC4D6]/40 font-black text-xs flex items-center justify-center shrink-0 shadow-xs">
                        #{index + 1}
                    </span>
                    <div>
                        <h4 className="font-extrabold text-xs text-[#F4FBFC]">
                            Reviewer Card #{index + 1}
                        </h4>
                        <span className="text-[10px] text-[#A8E6E8]/60 font-medium">
                            {q.question_type === 'true_false' ? 'True / False Question' : 'Multiple Choice Question'}
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-1.5 flex-wrap">
                    {/* Type Toggle */}
                    <div className="inline-flex p-0.5 rounded-lg bg-[#061923]/60 border border-[#A8E6E8]/20 text-[10px] font-bold">
                        <button
                            type="button"
                            onClick={() => onSetType(index, 'multiple_choice')}
                            className={`px-2 py-0.5 rounded-md transition-colors cursor-pointer ${
                                q.question_type !== 'true_false'
                                    ? 'bg-[#0B6E8A] text-[#F4FBFC] shadow-2xs'
                                    : 'text-[#A8E6E8]/70 hover:text-[#F4FBFC]'
                            }`}
                        >
                            Multiple Choice
                        </button>
                        <button
                            type="button"
                            onClick={() => onSetType(index, 'true_false')}
                            className={`px-2 py-0.5 rounded-md transition-colors cursor-pointer ${
                                q.question_type === 'true_false'
                                    ? 'bg-[#0B6E8A] text-[#F4FBFC] shadow-2xs'
                                    : 'text-[#A8E6E8]/70 hover:text-[#F4FBFC]'
                            }`}
                        >
                            True / False
                        </button>
                    </div>

                    {/* Points */}
                    <div className="flex items-center gap-1 text-[11px] font-semibold text-[#A8E6E8] pl-1">
                        <span>Pts:</span>
                        <input
                            type="number"
                            min="1"
                            max="10"
                            value={q.points || 1}
                            onChange={(e) => onUpdate(index, 'points', Math.max(1, parseInt(e.target.value) || 1))}
                            className="cyber-glass-input w-12 px-1.5 py-0.5 rounded-lg text-center font-bold text-xs"
                        />
                    </div>

                    {/* Move Up/Down */}
                    <button
                        type="button"
                        disabled={index === 0}
                        onClick={() => onMove(index, -1)}
                        className="p-1 rounded-lg text-[#A8E6E8]/60 hover:text-[#2EC4D6] hover:bg-[#0B6E8A]/30 disabled:opacity-30 cursor-pointer"
                        title="Move Up"
                    >
                        <ChevronUp className="w-4 h-4" />
                    </button>
                    <button
                        type="button"
                        disabled={index === totalCount - 1}
                        onClick={() => onMove(index, 1)}
                        className="p-1 rounded-lg text-[#A8E6E8]/60 hover:text-[#2EC4D6] hover:bg-[#0B6E8A]/30 disabled:opacity-30 cursor-pointer"
                        title="Move Down"
                    >
                        <ChevronDown className="w-4 h-4" />
                    </button>

                    {/* Duplicate */}
                    <button
                        type="button"
                        onClick={() => onDuplicate(index)}
                        className="p-1 rounded-lg text-[#A8E6E8]/60 hover:text-[#2EC4D6] hover:bg-[#0B6E8A]/30 transition-colors cursor-pointer"
                        title="Duplicate Question"
                    >
                        <Copy className="w-4 h-4" />
                    </button>

                    {/* Delete */}
                    <button
                        type="button"
                        onClick={() => onRemove(index)}
                        className="p-1 rounded-lg text-[#A8E6E8]/60 hover:text-rose-400 hover:bg-rose-500/20 transition-colors cursor-pointer"
                        title="Delete Question"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Question Prompt (Front) */}
            <div className="space-y-3">
                <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#A8E6E8] mb-1 flex items-center justify-between">
                        <span>Card Front: Question / Flashcard Prompt</span>
                        <span className="text-[10px] text-[#A8E6E8]/50 font-normal">Required</span>
                    </label>
                    <textarea
                        value={q.question_text}
                        onChange={(e) => onUpdate(index, 'question_text', e.target.value)}
                        rows={2}
                        placeholder="Type the question or review prompt here (e.g. What is the standard milk frothing temperature for a cappuccino?)"
                        className="cyber-glass-input w-full px-3.5 py-2 rounded-xl text-xs font-semibold leading-relaxed"
                    />
                    {clientErrors[`q_${index}_text`] && (
                        <p className="text-[11px] text-rose-400 font-semibold mt-1">
                            {clientErrors[`q_${index}_text`]}
                        </p>
                    )}
                </div>

                {/* Card Back: Options & Correct Answer Key */}
                <div>
                    <div className="flex items-center justify-between mb-2">
                        <label className="text-[11px] font-bold uppercase tracking-wider text-[#A8E6E8] flex items-center gap-1.5">
                            <span>Card Back: Answer Choices &amp; Correct Answer Key</span>
                            <span className="text-[10px] font-normal text-emerald-300 bg-emerald-500/20 px-2 py-0.5 rounded-full border border-emerald-500/30">
                                Click radio to designate correct answer key
                            </span>
                        </label>

                        {q.question_type !== 'true_false' && (q.options?.length || 0) < 6 && (
                            <button
                                type="button"
                                onClick={() => onAddOption(index)}
                                className="inline-flex items-center gap-1 text-[11px] font-bold text-[#2EC4D6] hover:text-[#A8E6E8] cursor-pointer"
                            >
                                <Plus className="w-3 h-3" />
                                Add Choice
                            </button>
                        )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {q.options?.map((opt, optIdx) => {
                            const isCorrect = String(opt.key).toUpperCase() === String(q.correct_answer).toUpperCase();

                            return (
                                <div
                                    key={opt.key || optIdx}
                                    className={`p-2.5 rounded-xl border flex items-center gap-2 transition-all ${
                                        isCorrect
                                            ? 'border-emerald-500/50 bg-emerald-500/15 shadow-xs ring-1 ring-emerald-500/30'
                                            : 'border-[#A8E6E8]/20 bg-[#0A3D4F]/30 hover:bg-[#0A3D4F]/50'
                                    }`}
                                >
                                    {/* Designate correct radio button */}
                                    <button
                                        type="button"
                                        onClick={() => onUpdate(index, 'correct_answer', opt.key)}
                                        className={`w-6 h-6 rounded-lg text-[11px] font-black flex items-center justify-center shrink-0 transition-all cursor-pointer ${
                                            isCorrect
                                                ? 'bg-emerald-600 text-white shadow-2xs'
                                                : 'bg-[#061923]/60 border border-[#A8E6E8]/30 text-[#A8E6E8] hover:border-emerald-400 hover:text-emerald-300'
                                        }`}
                                        title={isCorrect ? 'Designated Correct Answer' : `Click to mark Option ${opt.key} as correct answer`}
                                    >
                                        {isCorrect ? <Check className="w-3.5 h-3.5" /> : opt.key}
                                    </button>

                                    {/* Option Text Input */}
                                    <input
                                        type="text"
                                        value={opt.text}
                                        onChange={(e) => onUpdateOption(index, optIdx, e.target.value)}
                                        placeholder={`Option ${opt.key} text...`}
                                        className="flex-1 bg-transparent border-0 text-xs text-[#F4FBFC] focus:outline-none placeholder:text-[#A8E6E8]/40 font-medium"
                                    />

                                    {/* Correct Pill */}
                                    {isCorrect && (
                                        <span className="text-[10px] font-bold text-emerald-300 uppercase tracking-wider shrink-0 bg-emerald-500/20 border border-emerald-500/30 px-1.5 py-0.5 rounded">
                                            Answer Key
                                        </span>
                                    )}

                                    {/* Delete Option (if > 2 and not True/False) */}
                                    {q.question_type !== 'true_false' && q.options.length > 2 && (
                                        <button
                                            type="button"
                                            onClick={() => onRemoveOption(index, optIdx)}
                                            className="text-[#A8E6E8]/50 hover:text-rose-400 p-1 rounded-md transition-colors cursor-pointer shrink-0"
                                            title="Delete option"
                                        >
                                            <Trash2 className="w-3 h-3" />
                                        </button>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Reviewer Pedagogical Explanation / Flashcard Back Notes */}
                <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#A8E6E8] mb-1 flex items-center justify-between">
                        <span className="flex items-center gap-1.5">
                            <BookOpen className="w-3.5 h-3.5 text-[#2EC4D6]" />
                            Reviewer Pedagogical Explanation (Back of Flashcard)
                        </span>
                        <span className="text-[10px] text-[#A8E6E8]/50 font-normal">Optional study rationale</span>
                    </label>
                    <textarea
                        value={q.explanation || ''}
                        onChange={(e) => onUpdate(index, 'explanation', e.target.value)}
                        rows={2}
                        placeholder="Pedagogical rationale explaining why the answer is correct (e.g. 60°C - 65°C preserves milk sweetness and emulsifies microfoam without scorching lactose)."
                        className="cyber-glass-input w-full px-3.5 py-2 rounded-xl text-xs leading-relaxed"
                    />
                </div>

                {/* Interactive Card Flip Preview */}
                <div className="pt-1">
                    <button
                        type="button"
                        onClick={() => setTestFlip(!testFlip)}
                        className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#2EC4D6] hover:text-[#A8E6E8] cursor-pointer"
                    >
                        <RotateCw className="w-3 h-3" />
                        {testFlip ? 'Close Flashcard Flip Preview' : 'Test Flashcard Flip Preview'}
                    </button>

                    {testFlip && (
                        <div className="mt-2 p-4 rounded-xl border border-[#2EC4D6]/40 bg-[#0B6E8A]/25 space-y-2 text-xs">
                            <div className="text-[10px] font-bold uppercase tracking-wider text-[#2EC4D6]">
                                Flashcard Back Preview
                            </div>
                            <div className="font-bold text-emerald-300 flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                                Correct Answer: Option {q.correct_answer} — {correctOption?.text || '(empty)'}
                            </div>
                            {q.explanation && (
                                <p className="text-[11px] text-[#A8E6E8]/80 italic">
                                    "{q.explanation}"
                                </p>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
