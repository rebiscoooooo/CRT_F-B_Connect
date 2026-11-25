import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import VideoPlayer from '@/Components/VideoPlayer';
import ImageViewer from '@/Components/ImageViewer';
import PdfViewer from '@/Components/PdfViewer';
import TextLessonViewer from '@/Components/TextLessonViewer';
import Modal from '@/Components/Modal';
import ManualAssessmentModal from '@/Components/ManualAssessmentModal';
import ReviewerFlashcards from '@/Components/ReviewerFlashcards';
import {
    ChevronRight,
    ArrowLeft,
    Download,
    Eye,
    Edit3,
    Trash2,
    FolderInput,
    Globe,
    Lock,
    Calendar,
    User,
    HardDrive,
    Share2,
    Check,
    X,
    ClipboardCheck,
    Award,
    HelpCircle,
    Megaphone,
    Mail,
    Sparkles,
    RefreshCw,
    ChevronDown,
    ChevronUp,
    CheckCircle2,
    Clock,
    Layers,
    BookOpen,
} from 'lucide-react';

export default function ResourceShow({ resource, relatedResources = [], folders = [], assessment = null, studentCount = 0 }) {
    const [isMoveOpen, setIsMoveOpen] = useState(false);
    const [targetFolderId, setTargetFolderId] = useState(resource.folder_id || '');
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [copied, setCopied] = useState(false);
    const [isAnnounceOpen, setIsAnnounceOpen] = useState(false);
    const [announceMessage, setAnnounceMessage] = useState('');
    const [isAnnouncing, setIsAnnouncing] = useState(false);

    // Smart Assessment Quiz & Manual Reviewer State
    const [isSmartGenerateOpen, setIsSmartGenerateOpen] = useState(false);
    const [isManualModalOpen, setIsManualModalOpen] = useState(false);
    const [isDeleteAssessmentOpen, setIsDeleteAssessmentOpen] = useState(false);
    const [assessmentViewTab, setAssessmentViewTab] = useState('list'); // 'list' | 'flashcards'
    const [isGenerating, setIsGenerating] = useState(false);
    const [showQuestionsPreview, setShowQuestionsPreview] = useState(false);
    const [genPassingPercentage, setGenPassingPercentage] = useState(assessment?.passing_percentage || 75);
    const [genTimeLimit, setGenTimeLimit] = useState(assessment?.time_limit_minutes ?? 15);
    const [genPublished, setGenPublished] = useState(assessment?.is_published ?? true);

    const handleSmartGenerate = (e) => {
        if (e) e.preventDefault();
        setIsGenerating(true);
        router.post(`/admin/resources/${resource.id}/assessment/smart-generate`, {
            passing_percentage: genPassingPercentage,
            time_limit_minutes: genTimeLimit,
            is_published: genPublished,
        }, {
            preserveScroll: true,
            onSuccess: () => {
                setIsSmartGenerateOpen(false);
                setShowQuestionsPreview(true);
            },
            onFinish: () => setIsGenerating(false),
        });
    };

    const handleToggleAssessmentStatus = () => {
        router.post(`/admin/resources/${resource.id}/assessment/toggle-status`, {}, {
            preserveScroll: true,
        });
    };

    const handleDeleteAssessment = () => {
        router.delete(`/admin/resources/${resource.id}/assessment`, {
            preserveScroll: true,
            onSuccess: () => setIsDeleteAssessmentOpen(false),
        });
    };

    const handleMove = (e) => {
        e.preventDefault();
        router.post(`/admin/resources/${resource.id}/move`, { folder_id: targetFolderId }, {
            onSuccess: () => setIsMoveOpen(false),
        });
    };

    const handleVisibilityToggle = (newVisibility) => {
        router.post(`/admin/resources/${resource.id}/visibility`, { visibility: newVisibility });
    };

    const handleDelete = () => {
        router.delete(`/admin/resources/${resource.id}`);
    };

    const handleBroadcastAnnouncement = (e) => {
        e.preventDefault();
        setIsAnnouncing(true);
        router.post(`/admin/resources/${resource.id}/announce`, {
            announcement_message: announceMessage,
        }, {
            onSuccess: () => {
                setIsAnnounceOpen(false);
                setAnnounceMessage('');
            },
            onFinish: () => setIsAnnouncing(false),
        });
    };

    const handleShare = () => {
        navigator.clipboard.writeText(window.location.href).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    return (
        <AppLayout title={resource.title}>
            <Head title={`${resource.title} — CRT F&B Connect`} />

            {/* Breadcrumb Navigation Flow */}
            <nav className="flex items-center gap-2 text-xs font-semibold text-[#A8E6E8]/70 mb-6 flex-wrap">
                <Link href="/admin/resources" className="hover:text-[#2EC4D6] transition-colors">
                    Resources
                </Link>
                <ChevronRight className="w-3.5 h-3.5 text-[#A8E6E8]/40" />
                <Link href={`/admin/resources/category/${resource.category?.slug}`} className="hover:text-[#2EC4D6] transition-colors">
                    {resource.category?.name}
                </Link>
                {resource.folder && (
                    <>
                        <ChevronRight className="w-3.5 h-3.5 text-[#A8E6E8]/40" />
                        <Link href={`/admin/resources/folder/${resource.folder.id}`} className="hover:text-[#2EC4D6] transition-colors">
                            {resource.folder.name}
                        </Link>
                    </>
                )}
                <ChevronRight className="w-3.5 h-3.5 text-[#A8E6E8]/40" />
                <span className="text-[#F4FBFC] font-bold truncate max-w-xs">{resource.title}</span>
            </nav>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Main Content & Viewer (Left 8 cols) */}
                <div className="lg:col-span-8 space-y-6">
                    {/* Media Viewer depending on Resource Type */}
                    {resource.resource_type === 'video' && (
                        <VideoPlayer
                            src={resource.file_url}
                            title={resource.title}
                            poster={resource.thumbnail_url}
                        />
                    )}

                    {resource.resource_type === 'illustration' && (
                        <ImageViewer
                            src={resource.file_url}
                            title={resource.title}
                            downloadUrl={`/admin/resources/${resource.id}/download`}
                        />
                    )}

                    {resource.resource_type === 'pdf' && (
                        <PdfViewer
                            src={resource.file_url}
                            title={resource.title}
                            downloadUrl={`/admin/resources/${resource.id}/download`}
                        />
                    )}

                    {resource.resource_type === 'text' && (
                        <TextLessonViewer
                            content={resource.content}
                            title={resource.title}
                            downloadUrl={`/admin/resources/${resource.id}/download`}
                        />
                    )}

                    {resource.resource_type === 'other' && (
                        <div className="p-8 cyber-glass-card text-center">
                            <h3 className="text-lg font-bold text-[#F4FBFC] mb-2">{resource.title}</h3>
                            <p className="text-xs text-[#A8E6E8]/70 mb-6">{resource.description}</p>
                            <a
                                href={`/admin/resources/${resource.id}/download`}
                                className="cyber-glow-btn inline-flex items-center gap-2 px-6 py-2.5 text-xs font-bold rounded-xl"
                            >
                                <Download className="w-4 h-4" />
                                Download File ({resource.formatted_file_size})
                            </a>
                        </div>
                    )}

                    {/* Resource Details Header */}
                    <div className="cyber-glass-card p-6 sm:p-8 space-y-4">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                            <div className="flex items-center gap-2">
                                <span className={`px-2.5 py-1 text-[10px] font-bold uppercase rounded-md border ${
                                    resource.resource_type === 'video' ? 'bg-[#0B6E8A]/80 text-[#F4FBFC] border-[#2EC4D6]/40' :
                                    resource.resource_type === 'illustration' ? 'bg-sky-500/80 text-white border-sky-400/40' :
                                    resource.resource_type === 'pdf' ? 'bg-emerald-600/80 text-white border-emerald-400/40' :
                                    'bg-amber-600/80 text-white border-amber-400/40'
                                }`}>
                                    {resource.resource_type}
                                </span>

                                <span className={`px-2.5 py-1 text-[10px] font-bold uppercase rounded-md border ${
                                    resource.visibility === 'published'
                                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                                        : 'bg-[#A8E6E8]/10 text-[#A8E6E8]/70 border-[#A8E6E8]/20'
                                }`}>
                                    {resource.visibility}
                                </span>
                            </div>

                            <div className="flex items-center gap-2">
                                <button
                                    onClick={handleShare}
                                    className="cyber-oauth-btn inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg cursor-pointer"
                                >
                                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5 text-[#2EC4D6]" />}
                                    {copied ? 'Link Copied' : 'Share'}
                                </button>
                                <a
                                    href={`/admin/resources/${resource.id}/download`}
                                    className="cyber-glow-btn inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-lg"
                                >
                                    <Download className="w-3.5 h-3.5" />
                                    Download
                                </a>
                            </div>
                        </div>

                        <h1 className="text-xl sm:text-2xl font-black text-[#F4FBFC] leading-snug">
                            {resource.title}
                        </h1>

                        <p className="text-sm text-[#A8E6E8]/80 leading-relaxed whitespace-pre-line">
                            {resource.description || 'No description entered for this resource.'}
                        </p>

                        <div className="pt-4 border-t border-[#A8E6E8]/15 flex flex-wrap items-center justify-between gap-4 text-xs text-[#A8E6E8]/70">
                            <div className="flex items-center gap-4">
                                <span className="flex items-center gap-1.5">
                                    <Eye className="w-4 h-4 text-[#2EC4D6]" />
                                    <strong className="text-[#F4FBFC]">{resource.views_count}</strong> views
                                </span>
                                <span className="flex items-center gap-1.5">
                                    <Download className="w-4 h-4 text-[#2EC4D6]" />
                                    <strong className="text-[#F4FBFC]">{resource.downloads_count}</strong> downloads
                                </span>
                            </div>

                            <div className="flex items-center gap-2">
                                <span className="text-[#A8E6E8]/60">Uploaded by:</span>
                                <span className="font-semibold text-[#F4FBFC]">{resource.uploader?.name || 'Administrator'}</span>
                            </div>
                        </div>
                    </div>

                    {/* Lesson Assessment & Student Submissions */}
                    <div className="cyber-glass-card overflow-hidden">
                        {/* Header bar */}
                        <div className="p-6 bg-[#061923]/50 border-b border-[#A8E6E8]/15 flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-2xl bg-[#0B6E8A]/40 border border-[#2EC4D6]/40 text-[#2EC4D6] flex items-center justify-center font-bold shadow-md">
                                    <Sparkles className="w-5 h-5" />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <h3 className="text-base font-bold text-[#F4FBFC]">
                                            Lesson Assessment Quiz
                                        </h3>
                                        {assessment && (
                                            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                                                assessment.is_published
                                                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                                                    : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                                            }`}>
                                                {assessment.is_published ? '● Live for Students' : '○ Draft Mode'}
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-xs text-[#A8E6E8]/70 mt-0.5">
                                        {assessment
                                            ? `${assessment.title} • ${assessment.questions?.length || 0} Questions (Passing: ${assessment.passing_percentage}%)`
                                            : 'No assessment attached yet. Generate a 10-question smart quiz below.'}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 flex-wrap">
                                <button
                                    onClick={() => setIsSmartGenerateOpen(true)}
                                    disabled={isGenerating}
                                    className="cyber-glow-btn inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold disabled:opacity-50 cursor-pointer"
                                    title="Generate or regenerate questions using Smart AI"
                                >
                                    <Sparkles className="w-3.5 h-3.5" />
                                    {assessment ? 'Regenerate (AI)' : 'Smart Generate (AI)'}
                                </button>

                                <button
                                    onClick={() => setIsManualModalOpen(true)}
                                    className="cyber-oauth-btn inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold cursor-pointer"
                                    title="Manually input questions, answer keys, or reviewer flashcards"
                                >
                                    <Layers className="w-3.5 h-3.5 text-amber-400" />
                                    {assessment ? 'Edit Questions Manually' : 'Manual Input / Flashcards'}
                                </button>

                                {assessment && (
                                    <>
                                        <button
                                            onClick={handleToggleAssessmentStatus}
                                            className="cyber-oauth-btn px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer"
                                            title="Toggle whether students can see and take this quiz"
                                        >
                                            {assessment.is_published ? 'Switch to Draft' : 'Publish Quiz'}
                                        </button>

                                        <Link
                                            href={`/admin/assessments?resource_id=${resource.id}`}
                                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#0B6E8A]/40 border border-[#2EC4D6]/30 text-[#2EC4D6] hover:bg-[#0B6E8A]/60 text-xs font-bold transition-colors"
                                        >
                                            Submissions ({assessment.submissions?.length || 0})
                                        </Link>

                                        <button
                                            onClick={() => setIsDeleteAssessmentOpen(true)}
                                            className="p-1.5 rounded-xl text-[#A8E6E8]/60 hover:text-rose-400 hover:bg-rose-500/20 transition-colors cursor-pointer"
                                            title="Remove or reset this quiz"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>

                        {assessment ? (
                            <div className="p-6 space-y-6">
                                {/* Quiz Summary Meta Pills */}
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                    <div className="p-3 rounded-2xl bg-[#061923]/50 border border-[#A8E6E8]/15 text-center">
                                        <span className="block text-[10px] font-bold uppercase tracking-wider text-[#A8E6E8]/60">Questions</span>
                                        <span className="text-base font-black text-[#F4FBFC]">{assessment.questions?.length || 0} Items</span>
                                    </div>
                                    <div className="p-3 rounded-2xl bg-[#061923]/50 border border-[#A8E6E8]/15 text-center">
                                        <span className="block text-[10px] font-bold uppercase tracking-wider text-[#A8E6E8]/60">Total Points</span>
                                        <span className="text-base font-black text-[#F4FBFC]">{assessment.total_points || assessment.questions?.length || 10} Pts</span>
                                    </div>
                                    <div className="p-3 rounded-2xl bg-[#061923]/50 border border-[#A8E6E8]/15 text-center">
                                        <span className="block text-[10px] font-bold uppercase tracking-wider text-[#A8E6E8]/60">Passing Score</span>
                                        <span className="text-base font-black text-emerald-400">{assessment.passing_percentage}%</span>
                                    </div>
                                    <div className="p-3 rounded-2xl bg-[#061923]/50 border border-[#A8E6E8]/15 text-center">
                                        <span className="block text-[10px] font-bold uppercase tracking-wider text-[#A8E6E8]/60">Time Limit</span>
                                        <span className="text-base font-black text-[#F4FBFC]">
                                            {assessment.time_limit_minutes ? `${assessment.time_limit_minutes} Mins` : 'Unlimited'}
                                        </span>
                                    </div>
                                </div>

                                {/* Collapsible 10 Questions Preview Accordion */}
                                <div className="rounded-2xl border border-[#A8E6E8]/20 bg-[#061923]/40 overflow-hidden">
                                    <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#061923]/60 border-b border-[#A8E6E8]/15">
                                        <button
                                            type="button"
                                            onClick={() => setShowQuestionsPreview(!showQuestionsPreview)}
                                            className="flex items-center gap-2 text-left cursor-pointer group"
                                        >
                                            <ClipboardCheck className="w-4 h-4 text-[#2EC4D6] group-hover:scale-110 transition-transform" />
                                            <span className="text-xs font-bold text-[#F4FBFC] uppercase tracking-wider">
                                                Review All {assessment.questions?.length || 0} Questions &amp; Answer Keys
                                            </span>
                                            <span className="text-xs text-[#A8E6E8]/60">
                                                {showQuestionsPreview ? <ChevronUp className="w-4 h-4 inline" /> : <ChevronDown className="w-4 h-4 inline" />}
                                            </span>
                                        </button>

                                        <div className="flex items-center gap-2 flex-wrap">
                                            {showQuestionsPreview && (
                                                <div className="inline-flex p-0.5 rounded-lg bg-[#061923] border border-[#A8E6E8]/20 text-[11px] font-bold">
                                                    <button
                                                        type="button"
                                                        onClick={() => setAssessmentViewTab('list')}
                                                        className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                                                            assessmentViewTab === 'list'
                                                                ? 'bg-[#0B6E8A] text-[#F4FBFC] shadow-2xs font-extrabold'
                                                                : 'text-[#A8E6E8]/70 hover:text-[#F4FBFC]'
                                                        }`}
                                                    >
                                                        List View
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => setAssessmentViewTab('flashcards')}
                                                        className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                                                            assessmentViewTab === 'flashcards'
                                                                ? 'bg-[#0B6E8A] text-[#2EC4D6] shadow-2xs font-extrabold'
                                                                : 'text-[#A8E6E8]/70 hover:text-[#F4FBFC]'
                                                        }`}
                                                    >
                                                        Flashcard Preview
                                                    </button>
                                                </div>
                                            )}

                                            <button
                                                type="button"
                                                onClick={() => setIsManualModalOpen(true)}
                                                className="cyber-oauth-btn inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold cursor-pointer"
                                            >
                                                <Edit3 className="w-3.5 h-3.5 text-amber-400" />
                                                Edit Cards
                                            </button>
                                        </div>
                                    </div>

                                    {showQuestionsPreview && (
                                        <div className="p-4 sm:p-6 bg-[#061923]/30 space-y-5">
                                            {assessmentViewTab === 'flashcards' ? (
                                                <div className="max-w-2xl mx-auto py-2">
                                                    <ReviewerFlashcards
                                                        questions={assessment.questions}
                                                        title={assessment.title}
                                                    />
                                                </div>
                                            ) : (
                                                assessment.questions?.map((q, idx) => (
                                                    <div key={q.id || idx} className="p-4 rounded-2xl border border-[#A8E6E8]/20 bg-[#0A3D4F]/40 space-y-3">
                                                        <div className="flex items-start justify-between gap-3">
                                                            <div className="flex items-start gap-2.5">
                                                                <span className="w-6 h-6 rounded-lg bg-[#0B6E8A]/40 border border-[#2EC4D6]/30 text-[#2EC4D6] font-black text-xs flex items-center justify-center shrink-0">
                                                                    {q.order || idx + 1}
                                                                </span>
                                                                <h4 className="font-bold text-[#F4FBFC] text-xs sm:text-sm leading-snug">
                                                                    {q.question_text}
                                                                </h4>
                                                            </div>
                                                            <span className="text-[11px] font-semibold text-[#A8E6E8]/60 shrink-0">
                                                                {q.points || 1} pt
                                                            </span>
                                                        </div>

                                                        {/* Options Grid */}
                                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                                                            {q.options?.map((opt) => {
                                                                const isCorrect = String(opt.key).toUpperCase() === String(q.correct_answer).toUpperCase();
                                                                return (
                                                                    <div
                                                                        key={opt.key}
                                                                        className={`p-2.5 rounded-xl border text-xs flex items-start gap-2 transition-all ${
                                                                            isCorrect
                                                                                ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-200 font-bold ring-1 ring-emerald-500/30'
                                                                                : 'bg-[#061923]/50 border-[#A8E6E8]/15 text-[#A8E6E8]'
                                                                        }`}
                                                                    >
                                                                        <span className={`w-5 h-5 rounded-md text-[11px] font-bold flex items-center justify-center shrink-0 ${
                                                                            isCorrect ? 'bg-emerald-600 text-white' : 'bg-[#0B6E8A]/40 text-[#A8E6E8]'
                                                                        }`}>
                                                                            {opt.key}
                                                                        </span>
                                                                        <span className="leading-snug">{opt.text}</span>
                                                                        {isCorrect && (
                                                                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 ml-auto mt-0.5" />
                                                                        )}
                                                                    </div>
                                                                );
                                                            })}
                                                        </div>

                                                        {/* Pedagogical Explanation */}
                                                        {q.explanation && (
                                                            <div className="p-2.5 rounded-xl bg-[#0B6E8A]/25 border border-[#A8E6E8]/25 text-[11px] text-[#A8E6E8] flex items-start gap-2">
                                                                <Sparkles className="w-3.5 h-3.5 text-[#2EC4D6] shrink-0 mt-0.5" />
                                                                <div>
                                                                    <strong className="font-bold text-[#F4FBFC]">Pedagogical Rationale: </strong>
                                                                    {q.explanation}
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* Student Submissions Section */}
                                <div className="space-y-3 pt-2">
                                    <div className="flex items-center justify-between">
                                        <h4 className="text-xs font-bold uppercase tracking-wider text-[#A8E6E8]/70">
                                            Student Attempts on this Lesson ({assessment.submissions?.length || 0})
                                        </h4>
                                    </div>

                                    {assessment.submissions && assessment.submissions.length > 0 ? (
                                        <div className="divide-y divide-[#A8E6E8]/10 rounded-2xl border border-[#A8E6E8]/15 overflow-hidden bg-[#061923]/30">
                                            {assessment.submissions.map((sub) => {
                                                const isPassed = sub.status === 'passed';
                                                return (
                                                    <div key={sub.id} className="p-3.5 flex items-center justify-between gap-4 hover:bg-[#0B6E8A]/20 transition-colors">
                                                        <div className="flex items-center gap-3">
                                                            <img
                                                                src={sub.user?.avatar_url}
                                                                alt={sub.user?.name}
                                                                className="w-8 h-8 rounded-lg object-cover ring-1 ring-[#2EC4D6]/30"
                                                            />
                                                            <div>
                                                                <p className="text-xs font-bold text-[#F4FBFC]">{sub.user?.name}</p>
                                                                <p className="text-[10px] text-[#A8E6E8]/60 font-mono">{sub.user?.student_number}</p>
                                                            </div>
                                                        </div>

                                                        <div className="flex items-center gap-3">
                                                            <div className="text-right">
                                                                <div className="text-xs font-black text-[#F4FBFC]">
                                                                    {sub.score} / {sub.total_points} ({Number(sub.percentage).toFixed(0)}%)
                                                                </div>
                                                                <span className="text-[10px] text-[#A8E6E8]/60">
                                                                    {new Date(sub.submitted_at || sub.created_at).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                                                                </span>
                                                            </div>

                                                            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase border ${
                                                                isPassed ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' : 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                                                            }`}>
                                                                {isPassed ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                                                                {isPassed ? 'Passed' : 'Failed'}
                                                            </span>

                                                            <Link
                                                                href={`/admin/assessments/${sub.id}`}
                                                                className="cyber-oauth-btn p-1.5 rounded-lg text-xs font-bold"
                                                                title="Inspect answers"
                                                            >
                                                                View
                                                            </Link>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    ) : (
                                        <div className="py-8 text-center text-xs text-[#A8E6E8]/50 bg-[#061923]/30 rounded-2xl border border-[#A8E6E8]/15">
                                            No student submissions recorded yet for this lesson.
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="p-8 sm:p-12 text-center space-y-5">
                                <div className="w-14 h-14 rounded-3xl bg-[#0B6E8A]/30 border border-[#2EC4D6]/30 text-[#2EC4D6] flex items-center justify-center mx-auto shadow-md">
                                    <Sparkles className="w-7 h-7" />
                                </div>
                                <div className="max-w-md mx-auto space-y-1">
                                    <h4 className="text-base font-bold text-[#F4FBFC]">
                                        No Assessment Attached to this Lesson Yet
                                    </h4>
                                    <p className="text-xs text-[#A8E6E8]/70">
                                        Choose how you want to create questions for students to practice on: synthesize automatically with AI, or manually input custom questions and answer keys just like reviewer flashcards.
                                    </p>
                                </div>
                                <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
                                    <button
                                        onClick={() => setIsSmartGenerateOpen(true)}
                                        className="cyber-glow-btn inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold cursor-pointer"
                                    >
                                        <Sparkles className="w-4 h-4" />
                                        Smart Generate 10 Questions (AI)
                                    </button>
                                    <button
                                        onClick={() => setIsManualModalOpen(true)}
                                        className="cyber-oauth-btn inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold cursor-pointer"
                                    >
                                        <Layers className="w-4 h-4 text-amber-400" />
                                        Manual Input (Reviewer Cards / Q&amp;A)
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Sidebar Details & Admin Controls (Right 4 cols) */}
                <div className="lg:col-span-4 space-y-6">
                    {/* Admin Actions Panel */}
                    <div className="cyber-glass-card p-6 space-y-3">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-[#A8E6E8]/70 mb-3">
                            Administrative Controls
                        </h3>

                        <Link
                            href={`/admin/resources/${resource.id}/edit`}
                            className="cyber-glow-btn w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all"
                        >
                            <Edit3 className="w-4 h-4" />
                            Edit Resource Details
                        </Link>

                        <button
                            onClick={() => setIsAnnounceOpen(true)}
                            className="cyber-oauth-btn w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer"
                        >
                            <Megaphone className="w-4 h-4 text-[#2EC4D6]" />
                            Broadcast Email Announcement
                        </button>

                        <button
                            onClick={() => setIsMoveOpen(true)}
                            className="cyber-oauth-btn w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer"
                        >
                            <FolderInput className="w-4 h-4 text-[#2EC4D6]" />
                            Move to Another Folder
                        </button>

                        <div className="pt-2 border-t border-[#A8E6E8]/15 flex items-center justify-between gap-2">
                            <span className="text-xs text-[#A8E6E8]/70 font-medium">Visibility:</span>
                            <div className="flex items-center gap-1">
                                {['published', 'draft', 'archived'].map((status) => (
                                    <button
                                        key={status}
                                        onClick={() => handleVisibilityToggle(status)}
                                        className={`px-2.5 py-1 text-[11px] font-bold rounded-lg capitalize transition-colors cursor-pointer ${
                                            resource.visibility === status
                                                ? 'bg-[#2EC4D6] text-[#061923]'
                                                : 'text-[#A8E6E8]/70 hover:bg-[#0B6E8A]/30 hover:text-[#F4FBFC]'
                                        }`}
                                    >
                                        {status}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="pt-2">
                            <button
                                onClick={() => setIsDeleteOpen(true)}
                                className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-rose-300 bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 transition-colors cursor-pointer"
                            >
                                <Trash2 className="w-4 h-4" />
                                Delete Resource
                            </button>
                        </div>
                    </div>

                    {/* Metadata Card */}
                    <div className="cyber-glass-card p-6 space-y-3 text-xs">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-[#A8E6E8]/70 mb-2">
                            Resource Information
                        </h3>

                        <div className="flex items-center justify-between py-1.5 border-b border-[#A8E6E8]/15">
                            <span className="text-[#A8E6E8]/70">Category:</span>
                            <span className="font-semibold text-[#F4FBFC]">{resource.category?.name}</span>
                        </div>
                        <div className="flex items-center justify-between py-1.5 border-b border-[#A8E6E8]/15">
                            <span className="text-[#A8E6E8]/70">Folder:</span>
                            <span className="font-semibold text-[#F4FBFC]">{resource.folder?.name || 'Category Root'}</span>
                        </div>
                        <div className="flex items-center justify-between py-1.5 border-b border-[#A8E6E8]/15">
                            <span className="text-[#A8E6E8]/70">File Size:</span>
                            <span className="font-mono text-[#F4FBFC]">{resource.formatted_file_size}</span>
                        </div>
                        <div className="flex items-center justify-between py-1.5 border-b border-[#A8E6E8]/15">
                            <span className="text-[#A8E6E8]/70">MIME Type:</span>
                            <span className="font-mono text-[#F4FBFC]">{resource.mime_type || '—'}</span>
                        </div>
                        <div className="flex items-center justify-between py-1.5 border-b border-[#A8E6E8]/15">
                            <span className="text-[#A8E6E8]/70">Published:</span>
                            <span className="text-[#F4FBFC]">
                                {new Date(resource.created_at).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                            </span>
                        </div>
                    </div>

                    {/* Related Resources */}
                    {relatedResources.length > 0 && (
                        <div className="cyber-glass-card p-6">
                            <h3 className="text-xs font-bold uppercase tracking-wider text-[#A8E6E8]/70 mb-3">
                                More from {resource.category?.name}
                            </h3>
                            <div className="space-y-3">
                                {relatedResources.map((rel) => (
                                    <Link
                                        key={rel.id}
                                        href={`/admin/resources/${rel.id}`}
                                        className="block p-3 rounded-xl bg-[#061923]/50 hover:bg-[#0B6E8A]/30 border border-[#A8E6E8]/15 hover:border-[#2EC4D6]/40 transition-all group"
                                    >
                                        <p className="text-xs font-bold text-[#F4FBFC] group-hover:text-[#2EC4D6] line-clamp-1">
                                            {rel.title}
                                        </p>
                                        <p className="text-[10px] text-[#A8E6E8]/60 mt-1 uppercase font-semibold">
                                            {rel.resource_type} • {rel.views_count} views
                                        </p>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Move Folder Modal */}
            <Modal isOpen={isMoveOpen} onClose={() => setIsMoveOpen(false)} title="Move Resource to Folder">
                <form onSubmit={handleMove} className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-[#A8E6E8] uppercase tracking-wider mb-1">
                            Destination Folder
                        </label>
                        <select
                            value={targetFolderId}
                            onChange={(e) => setTargetFolderId(e.target.value)}
                            className="cyber-glass-input w-full px-3.5 py-2.5 text-xs rounded-xl"
                        >
                            <option value="" className="bg-[#061923] text-[#F4FBFC]">Category Root (No Folder)</option>
                            {folders.map((f) => (
                                <option key={f.id} value={f.id} className="bg-[#061923] text-[#F4FBFC]">{f.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#A8E6E8]/15">
                        <button
                            type="button"
                            onClick={() => setIsMoveOpen(false)}
                            className="cyber-oauth-btn px-4 py-2 text-xs font-semibold rounded-xl"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="cyber-glow-btn px-5 py-2 text-xs font-bold rounded-xl cursor-pointer"
                        >
                            Confirm Move
                        </button>
                    </div>
                </form>
            </Modal>

            {/* Delete Modal */}
            <Modal isOpen={isDeleteOpen} onClose={() => setIsDeleteOpen(false)} title="Delete Resource">
                <div className="space-y-4">
                    <p className="text-xs text-[#F4FBFC] leading-relaxed">
                        Are you sure you want to delete <strong className="text-[#2EC4D6]">{resource.title}</strong>? This action cannot be undone.
                    </p>
                    <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#A8E6E8]/15">
                        <button
                            type="button"
                            onClick={() => setIsDeleteOpen(false)}
                            className="cyber-oauth-btn px-4 py-2 text-xs font-semibold rounded-xl"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={handleDelete}
                            className="px-5 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 rounded-xl transition-colors cursor-pointer"
                        >
                            Delete
                        </button>
                    </div>
                </div>
            </Modal>

            {/* Broadcast Email Announcement Modal */}
            <Modal isOpen={isAnnounceOpen} onClose={() => setIsAnnounceOpen(false)} title="Broadcast Email Announcement">
                <form onSubmit={handleBroadcastAnnouncement} className="space-y-4">
                    <div className="p-4 rounded-xl bg-[#0B6E8A]/30 border border-[#A8E6E8]/25 flex items-start gap-3 text-xs text-[#A8E6E8]">
                        <Megaphone className="w-5 h-5 text-[#2EC4D6] shrink-0 mt-0.5" />
                        <div>
                            <p className="font-bold text-[#F4FBFC]">Send Announcement to All Students</p>
                            <p className="mt-0.5">
                                This will send an official email announcement and notification alert for <strong className="text-[#2EC4D6]">"{resource.title}"</strong> to all <strong className="text-[#F4FBFC]">{studentCount} active registered students</strong>.
                            </p>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-[#A8E6E8] uppercase tracking-wider mb-1.5">
                            Custom Announcement Note / Instructions (Optional)
                        </label>
                        <textarea
                            value={announceMessage}
                            onChange={(e) => setAnnounceMessage(e.target.value)}
                            rows={4}
                            placeholder="e.g. Students are required to review this masterclass and complete the assessment before laboratory hours."
                            className="cyber-glass-input w-full px-3.5 py-2.5 text-xs rounded-xl"
                        />
                        <p className="text-[10px] text-[#A8E6E8]/70 mt-1">
                            This custom note will be highlighted in the email alongside the lesson preview and direct link.
                        </p>
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#A8E6E8]/15">
                        <button
                            type="button"
                            onClick={() => setIsAnnounceOpen(false)}
                            className="cyber-oauth-btn px-4 py-2 text-xs font-semibold rounded-xl"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isAnnouncing}
                            className="cyber-glow-btn inline-flex items-center gap-2 px-5 py-2 text-xs font-bold rounded-xl disabled:opacity-60 cursor-pointer"
                        >
                            <Mail className="w-3.5 h-3.5" />
                            {isAnnouncing ? 'Sending to Students...' : 'Send Email Announcement'}
                        </button>
                    </div>
                </form>
            </Modal>

            {/* Smart Assessment Quiz Generator Modal */}
            <Modal isOpen={isSmartGenerateOpen} onClose={() => setIsSmartGenerateOpen(false)} title="Smart Assessment Quiz Generator">
                <form onSubmit={handleSmartGenerate} className="space-y-4">
                    <div className="p-4 rounded-xl bg-[#0B6E8A]/30 border border-[#A8E6E8]/25 flex items-start gap-3 text-xs text-[#A8E6E8]">
                        <Sparkles className="w-5 h-5 text-[#2EC4D6] shrink-0 mt-0.5" />
                        <div>
                            <p className="font-bold text-[#F4FBFC]">Synthesize 10-Question Smart Assessment</p>
                            <p className="mt-0.5">
                                The Smart Assessment Engine will generate 10 rigorous, curriculum-aligned multiple-choice questions tailored to <strong className="text-[#2EC4D6]">"{resource.title}"</strong> ({resource.resource_type}), complete with answer keys, realistic distractors, and pedagogical rationales.
                            </p>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <div>
                            <label className="block text-xs font-bold text-[#A8E6E8] uppercase tracking-wider mb-1">
                                Passing Requirement
                            </label>
                            <select
                                value={genPassingPercentage}
                                onChange={(e) => setGenPassingPercentage(Number(e.target.value))}
                                className="cyber-glass-input w-full px-3.5 py-2.5 text-xs rounded-xl"
                            >
                                <option value={60} className="bg-[#061923] text-[#F4FBFC]">60% (6 / 10 Points)</option>
                                <option value={70} className="bg-[#061923] text-[#F4FBFC]">70% (7 / 10 Points)</option>
                                <option value={75} className="bg-[#061923] text-[#F4FBFC]">75% (7.5 / 10 Points — Standard)</option>
                                <option value={80} className="bg-[#061923] text-[#F4FBFC]">80% (8 / 10 Points)</option>
                                <option value={85} className="bg-[#061923] text-[#F4FBFC]">85% (8.5 / 10 Points)</option>
                                <option value={90} className="bg-[#061923] text-[#F4FBFC]">90% (9 / 10 Points)</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-[#A8E6E8] uppercase tracking-wider mb-1">
                                Time Limit
                            </label>
                            <select
                                value={genTimeLimit}
                                onChange={(e) => setGenTimeLimit(Number(e.target.value))}
                                className="cyber-glass-input w-full px-3.5 py-2.5 text-xs rounded-xl"
                            >
                                <option value={0} className="bg-[#061923] text-[#F4FBFC]">No Time Limit</option>
                                <option value={10} className="bg-[#061923] text-[#F4FBFC]">10 Minutes</option>
                                <option value={15} className="bg-[#061923] text-[#F4FBFC]">15 Minutes (Recommended)</option>
                                <option value={20} className="bg-[#061923] text-[#F4FBFC]">20 Minutes</option>
                                <option value={30} className="bg-[#061923] text-[#F4FBFC]">30 Minutes</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-[#A8E6E8] uppercase tracking-wider mb-1">
                                Quiz Availability
                            </label>
                            <select
                                value={genPublished ? '1' : '0'}
                                onChange={(e) => setGenPublished(e.target.value === '1')}
                                className="cyber-glass-input w-full px-3.5 py-2.5 text-xs rounded-xl"
                            >
                                <option value="1" className="bg-[#061923] text-[#F4FBFC]">Publish Immediately (Live for Students)</option>
                                <option value="0" className="bg-[#061923] text-[#F4FBFC]">Draft (Admin review before publishing)</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#A8E6E8]/15">
                        <button
                            type="button"
                            onClick={() => setIsSmartGenerateOpen(false)}
                            className="cyber-oauth-btn px-4 py-2 text-xs font-semibold rounded-xl cursor-pointer"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isGenerating}
                            className="cyber-glow-btn inline-flex items-center gap-2 px-5 py-2 text-xs font-bold rounded-xl disabled:opacity-60 cursor-pointer"
                        >
                            <Sparkles className="w-3.5 h-3.5" />
                            {isGenerating ? 'Synthesizing 10 Questions...' : 'Generate 10-Question Quiz Now'}
                        </button>
                    </div>
                </form>
            </Modal>

            {/* Manual Assessment & Reviewer Flashcard Modal */}
            <ManualAssessmentModal
                isOpen={isManualModalOpen}
                onClose={() => setIsManualModalOpen(false)}
                resource={resource}
                initialAssessment={assessment}
            />

            {/* Delete Assessment Confirmation Modal */}
            <Modal isOpen={isDeleteAssessmentOpen} onClose={() => setIsDeleteAssessmentOpen(false)} title="Reset Lesson Assessment">
                <div className="space-y-4">
                    <p className="text-xs text-[#F4FBFC] leading-relaxed">
                        Are you sure you want to delete and reset the assessment for <strong className="text-[#2EC4D6]">{resource.title}</strong>? All questions, answer keys, and student submission attempts associated with this lesson will be permanently removed.
                    </p>
                    <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#A8E6E8]/15">
                        <button
                            type="button"
                            onClick={() => setIsDeleteAssessmentOpen(false)}
                            className="cyber-oauth-btn px-4 py-2 text-xs font-semibold rounded-xl"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={handleDeleteAssessment}
                            className="px-5 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 rounded-xl transition-colors cursor-pointer"
                        >
                            Delete Assessment
                        </button>
                    </div>
                </div>
            </Modal>
        </AppLayout>
    );
}
