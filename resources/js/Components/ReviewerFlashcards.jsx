import React, { useState, useEffect } from 'react';
import {
    RotateCw,
    ChevronLeft,
    ChevronRight,
    Shuffle,
    CheckCircle2,
    BookOpen,
    Sparkles,
    Check,
    X,
    HelpCircle,
    Eye,
} from 'lucide-react';

export default function ReviewerFlashcards({ questions = [], title = 'Flashcard Reviewer' }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [deck, setDeck] = useState([]);
    const [masteredIds, setMasteredIds] = useState(new Set());
    const [showAllOptions, setShowAllOptions] = useState(true);

    useEffect(() => {
        if (questions && questions.length > 0) {
            setDeck(questions.map((q, idx) => ({ ...q, originalIndex: idx + 1 })));
            setCurrentIndex(0);
            setIsFlipped(false);
            setMasteredIds(new Set());
        }
    }, [questions]);

    if (!deck || deck.length === 0) {
        return (
            <div className="p-8 text-center text-xs text-slate-400 bg-slate-50 rounded-2xl border border-slate-200">
                No flashcard questions available to review.
            </div>
        );
    }

    const currentCard = deck[currentIndex];
    const totalCards = deck.length;
    const isMastered = currentCard?.id ? masteredIds.has(currentCard.id) : masteredIds.has(currentIndex);

    const handleFlip = () => {
        setIsFlipped((prev) => !prev);
    };

    const handleNext = () => {
        setIsFlipped(false);
        setCurrentIndex((prev) => (prev + 1) % totalCards);
    };

    const handlePrev = () => {
        setIsFlipped(false);
        setCurrentIndex((prev) => (prev - 1 + totalCards) % totalCards);
    };

    const handleShuffle = () => {
        setIsFlipped(false);
        const shuffled = [...deck].sort(() => Math.random() - 0.5);
        setDeck(shuffled);
        setCurrentIndex(0);
    };

    const handleToggleMastered = () => {
        const id = currentCard?.id ?? currentIndex;
        setMasteredIds((prev) => {
            const next = new Set(prev);
            if (next.has(id)) {
                next.delete(id);
            } else {
                next.add(id);
            }
            return next;
        });
    };

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e) => {
            // Ignore if user is typing in an input/textarea
            if (['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)) return;

            if (e.code === 'Space') {
                e.preventDefault();
                handleFlip();
            } else if (e.code === 'ArrowRight') {
                e.preventDefault();
                handleNext();
            } else if (e.code === 'ArrowLeft') {
                e.preventDefault();
                handlePrev();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [currentIndex, deck.length]);

    const correctOption = currentCard?.options?.find(
        (opt) => String(opt.key).toUpperCase() === String(currentCard?.correct_answer).toUpperCase()
    );

    return (
        <div className="space-y-4">
            {/* Top Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-700 uppercase tracking-wider text-[11px]">
                        Card {currentIndex + 1} of {totalCards}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-100">
                        {masteredIds.size} / {totalCards} Mastered
                    </span>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={handleShuffle}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 font-semibold text-xs transition-colors cursor-pointer"
                        title="Shuffle card order"
                    >
                        <Shuffle className="w-3.5 h-3.5" />
                        Shuffle
                    </button>
                    <button
                        type="button"
                        onClick={() => setShowAllOptions(!showAllOptions)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border font-semibold text-xs transition-colors cursor-pointer ${
                            showAllOptions
                                ? 'bg-indigo-50 border-indigo-200 text-indigo-700'
                                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                        title="Toggle distractors on back"
                    >
                        <Eye className="w-3.5 h-3.5" />
                        {showAllOptions ? 'Choices Visible' : 'Answer Only'}
                    </button>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                    className="h-full bg-gradient-to-r from-indigo-500 to-blue-600 rounded-full transition-all duration-300"
                    style={{ width: `${((currentIndex + 1) / totalCards) * 100}%` }}
                />
            </div>

            {/* Flashcard Body Container */}
            <div
                onClick={handleFlip}
                className="relative min-h-[300px] sm:min-h-[340px] rounded-3xl border-2 cursor-pointer select-none transition-all duration-300 transform active:scale-[0.99] shadow-sm hover:shadow-md flex flex-col justify-between p-6 sm:p-8 overflow-hidden bg-white border-slate-200 hover:border-indigo-300"
                style={{
                    perspective: '1000px',
                }}
            >
                {/* Header inside Card */}
                <div className="flex items-center justify-between gap-3 relative z-10">
                    <div className="flex items-center gap-2">
                        <span className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-black shrink-0 ${
                            isFlipped ? 'bg-emerald-100 text-emerald-800' : 'bg-indigo-100 text-indigo-800'
                        }`}>
                            #{currentCard.originalIndex || currentIndex + 1}
                        </span>
                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                            {isFlipped ? 'Answer Key & Reviewer Rationale' : 'Question / Concept Prompt'}
                        </span>
                    </div>

                    <div className="flex items-center gap-2">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                            isFlipped
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                                : 'bg-slate-100 text-slate-600'
                        }`}>
                            <RotateCw className="w-3 h-3" />
                            {isFlipped ? 'Back (Answer)' : 'Front (Question)'}
                        </span>
                    </div>
                </div>

                {/* Main Card Content */}
                <div className="my-6 relative z-10">
                    {!isFlipped ? (
                        /* FRONT: Question Prompt */
                        <div className="space-y-4">
                            <h3 className="text-base sm:text-lg md:text-xl font-bold text-slate-900 leading-snug">
                                {currentCard.question_text}
                            </h3>

                            {/* Multiple Choice Preview Pills */}
                            {currentCard.options && currentCard.options.length > 0 && (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                                    {currentCard.options.map((opt) => (
                                        <div
                                            key={opt.key}
                                            className="p-3 rounded-xl border border-slate-200 bg-slate-50/70 text-xs text-slate-700 flex items-start gap-2.5"
                                        >
                                            <span className="w-5 h-5 rounded-md bg-white border border-slate-200 text-slate-600 font-black text-[10px] flex items-center justify-center shrink-0">
                                                {opt.key}
                                            </span>
                                            <span className="leading-snug">{opt.text}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ) : (
                        /* BACK: Answer Key & Rationale */
                        <div className="space-y-4">
                            {/* Correct Answer Key Banner */}
                            <div className="p-4 rounded-2xl bg-emerald-50 border-2 border-emerald-300 text-emerald-950 space-y-1 shadow-xs">
                                <div className="flex items-center gap-2 text-emerald-800 font-black text-xs uppercase tracking-wider">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                    Correct Answer Key
                                </div>
                                <div className="flex items-center gap-2 text-sm sm:text-base font-extrabold text-emerald-950 pt-1">
                                    <span className="w-6 h-6 rounded-lg bg-emerald-600 text-white flex items-center justify-center text-xs font-black shrink-0">
                                        {currentCard.correct_answer}
                                    </span>
                                    <span>
                                        {correctOption ? correctOption.text : currentCard.correct_answer}
                                    </span>
                                </div>
                            </div>

                            {/* Optional: Options with Correct one Highlighted */}
                            {showAllOptions && currentCard.options && currentCard.options.length > 0 && (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                    {currentCard.options.map((opt) => {
                                        const isCorrect = String(opt.key).toUpperCase() === String(currentCard.correct_answer).toUpperCase();
                                        return (
                                            <div
                                                key={opt.key}
                                                className={`p-2.5 rounded-xl border text-xs flex items-start gap-2 transition-all ${
                                                    isCorrect
                                                        ? 'bg-emerald-100/70 border-emerald-400 font-bold text-emerald-950 ring-1 ring-emerald-400'
                                                        : 'bg-slate-50 border-slate-200 text-slate-500 opacity-60'
                                                }`}
                                            >
                                                <span className={`w-5 h-5 rounded-md text-[10px] font-bold flex items-center justify-center shrink-0 ${
                                                    isCorrect ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'
                                                }`}>
                                                    {opt.key}
                                                </span>
                                                <span className="leading-snug">{opt.text}</span>
                                                {isCorrect && (
                                                    <Check className="w-3.5 h-3.5 text-emerald-700 ml-auto shrink-0 mt-0.5" />
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            )}

                            {/* Pedagogical Explanation */}
                            {currentCard.explanation && (
                                <div className="p-3.5 rounded-2xl bg-indigo-50/70 border border-indigo-100 text-xs text-indigo-950 flex items-start gap-2.5 leading-relaxed">
                                    <BookOpen className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                                    <div>
                                        <strong className="font-bold text-indigo-900">Pedagogical Reviewer Note: </strong>
                                        <span>{currentCard.explanation}</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Footer inside Card */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 relative z-10">
                    <span className="flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                        Click anywhere or press <kbd className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 font-mono text-[10px]">Space</kbd> to flip
                    </span>
                    <span className="hidden sm:inline font-mono">
                        Keys: <kbd className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 font-mono text-[10px]">←</kbd> Prev &nbsp;|&nbsp; <kbd className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 font-mono text-[10px]">→</kbd> Next
                    </span>
                </div>
            </div>

            {/* Flashcard Bottom Controls */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                <button
                    type="button"
                    onClick={handleToggleMastered}
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        isMastered
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                >
                    <CheckCircle2 className={`w-4 h-4 ${isMastered ? 'text-emerald-600' : 'text-slate-400'}`} />
                    {isMastered ? 'Mastered / Understood' : 'Mark as Mastered'}
                </button>

                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={handlePrev}
                        className="inline-flex items-center justify-center p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 font-bold transition-colors shadow-2xs cursor-pointer"
                        title="Previous Card (Left Arrow)"
                    >
                        <ChevronLeft className="w-4 h-4" />
                    </button>

                    <button
                        type="button"
                        onClick={handleFlip}
                        className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs transition-all cursor-pointer"
                    >
                        <RotateCw className="w-3.5 h-3.5" />
                        {isFlipped ? 'Show Question' : 'Reveal Answer Key'}
                    </button>

                    <button
                        type="button"
                        onClick={handleNext}
                        className="inline-flex items-center justify-center p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 font-bold transition-colors shadow-2xs cursor-pointer"
                        title="Next Card (Right Arrow)"
                    >
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}
