import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import {
    Upload,
    ArrowLeft,
    Video,
    Image as ImageIcon,
    FileText,
    BookOpen,
    Folder,
    Link as LinkIcon,
    AlertCircle,
    CheckCircle2,
    Sparkles,
    Info,
    X,
    FileCheck,
    Megaphone,
    Mail,
    Bell,
} from 'lucide-react';

const RESOURCE_TYPE_CONFIG = {
    video: {
        id: 'video',
        title: 'Video Lesson',
        icon: Video,
        color: 'text-[#2EC4D6] bg-[#0B6E8A]/30',
        activeRing: 'border-[#2EC4D6] bg-[#0B6E8A]/40 ring-2 ring-[#2EC4D6]/30',
        badge: 'MP4, WebM, QuickTime, or Streaming URL',
        targetSlug: 'video-lessons',
        accept: 'video/mp4,video/webm,video/quicktime,video/x-matroska,.mp4,.webm,.mov,.mkv',
        fileLabel: 'Upload Video File (MP4, WebM, QuickTime up to 1GB)',
        allowStreamingUrl: true,
        allowFileUpload: true,
        allowTextContent: false,
        showThumbnail: true,
        hint: 'Upload video demonstrations or provide a direct video/streaming URL.',
        validateFile: (file) => {
            const isVideo = file.type.startsWith('video/') || /\.(mp4|mov|webm|mkv|avi)$/i.test(file.name);
            return isVideo ? null : 'Invalid file type. Please select a video file (.mp4, .webm, .mov, .mkv).';
        },
    },
    illustration: {
        id: 'illustration',
        title: 'Illustration',
        icon: ImageIcon,
        color: 'text-sky-300 bg-sky-500/20',
        activeRing: 'border-sky-400 bg-sky-500/25 ring-2 ring-sky-400/30',
        badge: 'Images Only (JPG, PNG, WebP, SVG)',
        targetSlug: 'illustrations',
        accept: 'image/png,image/jpeg,image/webp,image/svg+xml,.png,.jpg,.jpeg,.webp,.svg',
        fileLabel: 'Upload Illustration / Visual Graphic (PNG, JPG, WebP, SVG up to 1GB)',
        allowStreamingUrl: false,
        allowFileUpload: true,
        allowTextContent: false,
        showThumbnail: false, // The illustration itself serves as the visual preview
        hint: 'Upload banquet table cover schematics, napkin diagrams, bar layouts, or plating photos.',
        validateFile: (file) => {
            const isImage = file.type.startsWith('image/') || /\.(png|jpg|jpeg|webp|svg|gif)$/i.test(file.name);
            return isImage ? null : 'Invalid file type. Please select an image file (.png, .jpg, .webp, .svg).';
        },
    },
    pdf: {
        id: 'pdf',
        title: 'PDF Module',
        icon: FileText,
        color: 'text-emerald-400 bg-emerald-500/20',
        activeRing: 'border-emerald-400 bg-emerald-500/25 ring-2 ring-emerald-400/30',
        badge: 'PDF Documents Only',
        targetSlug: 'pdf-modules',
        accept: 'application/pdf,.pdf',
        fileLabel: 'Upload PDF Document Module (PDF up to 1GB)',
        allowStreamingUrl: false,
        allowFileUpload: true,
        allowTextContent: false,
        showThumbnail: true,
        hint: 'Upload official TESDA NC II manuals, assessment rubrics, modules, and handouts.',
        validateFile: (file) => {
            const isPdf = file.type === 'application/pdf' || /\.pdf$/i.test(file.name);
            return isPdf ? null : 'Invalid file type. Please select a PDF document (.pdf).';
        },
    },
    text: {
        id: 'text',
        title: 'Text Lesson',
        icon: BookOpen,
        color: 'text-amber-300 bg-amber-500/20',
        activeRing: 'border-amber-400 bg-amber-500/25 ring-2 ring-amber-400/30',
        badge: 'Formatted Lecture Text',
        targetSlug: 'text-lessons',
        accept: '.txt,.md,.pdf,.doc,.docx',
        fileLabel: 'Supplementary Handout Attachment (Optional .txt, .md, .pdf)',
        allowStreamingUrl: false,
        allowFileUpload: true,
        allowTextContent: true,
        showThumbnail: true,
        hint: 'Write or paste instructional articles, service standards, and food safety procedures.',
        validateFile: (file) => {
            const isDoc = /\.(txt|md|pdf|doc|docx)$/i.test(file.name);
            return isDoc ? null : 'Please select a text or document file (.txt, .md, .pdf, .docx).';
        },
    },
    other: {
        id: 'other',
        title: 'Other',
        icon: Folder,
        color: 'text-purple-300 bg-purple-500/20',
        activeRing: 'border-purple-400 bg-purple-500/25 ring-2 ring-purple-400/30',
        badge: 'Archives, Slides & General Files',
        targetSlug: 'other-materials',
        accept: '*/*',
        fileLabel: 'Upload Educational Attachment (All formats up to 1GB)',
        allowStreamingUrl: true,
        allowFileUpload: true,
        allowTextContent: false,
        showThumbnail: true,
        hint: 'Upload presentations, spreadsheet calculations, archive ZIPs, or external academic links.',
        validateFile: () => null,
    },
};

export default function ResourceCreate({ categories = [], folders = [], studentCount = 0 }) {
    const urlParams = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
    const initialCategory = urlParams.get('category_id') || (categories[0]?.id || '');
    const initialFolder = urlParams.get('folder_id') || '';

    // Infer initial resource type from initialCategory if present
    const matchedInitialCat = categories.find((c) => String(c.id) === String(initialCategory));
    const initialType = Object.values(RESOURCE_TYPE_CONFIG).find((cfg) => cfg.targetSlug === matchedInitialCat?.slug)?.id || 'video';

    const { data, setData, post, processing, errors, progress, clearErrors } = useForm({
        title: '',
        description: '',
        category_id: initialCategory,
        folder_id: initialFolder,
        resource_type: initialType,
        visibility: 'published',
        content: '',
        external_url: '',
        file: null,
        thumbnail: null,
        send_announcement: false,
        announcement_message: '',
        generate_smart_assessment: true,
        passing_percentage: 75,
        time_limit_minutes: 15,
        assessment_published: true,
    });

    const [filePreview, setFilePreview] = useState(null);
    const [fileValidationError, setFileValidationError] = useState(null);

    const activeConfig = RESOURCE_TYPE_CONFIG[data.resource_type] || RESOURCE_TYPE_CONFIG.video;

    // Filter destination folders by current category
    const availableFolders = folders.filter((f) => String(f.category_id) === String(data.category_id));

    // Handle clicking a Resource Type button (Auto-hides irrelevant fields and auto-selects matching category)
    const handleResourceTypeChange = (newType) => {
        clearErrors();
        setFileValidationError(null);
        setFilePreview(null);

        const config = RESOURCE_TYPE_CONFIG[newType];
        const matchingCategory = categories.find((c) => c.slug === config?.targetSlug);

        setData((prev) => ({
            ...prev,
            resource_type: newType,
            category_id: matchingCategory ? matchingCategory.id : prev.category_id,
            folder_id: '', // reset folder selection when category changes
            file: null,
            external_url: config?.allowStreamingUrl ? prev.external_url : '',
            content: config?.allowTextContent ? prev.content : '',
        }));

        // Reset the file input element on the DOM
        const fileInput = document.getElementById('resource-file-input');
        if (fileInput) fileInput.value = '';
    };

    // Handle manual category change in the dropdown (Auto-selects matching resource type)
    const handleCategoryChange = (catId) => {
        const selectedCat = categories.find((c) => String(c.id) === String(catId));
        const matchingType = Object.values(RESOURCE_TYPE_CONFIG).find((cfg) => cfg.targetSlug === selectedCat?.slug)?.id;

        setData((prev) => ({
            ...prev,
            category_id: catId,
            folder_id: '',
            resource_type: matchingType || prev.resource_type,
            file: matchingType && matchingType !== prev.resource_type ? null : prev.file,
        }));

        if (matchingType && matchingType !== data.resource_type) {
            setFilePreview(null);
            setFileValidationError(null);
            const fileInput = document.getElementById('resource-file-input');
            if (fileInput) fileInput.value = '';
        }
    };

    // File change handler with strict format filtering and live preview
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) {
            setData('file', null);
            setFilePreview(null);
            setFileValidationError(null);
            return;
        }

        // Validate selected file against current resource type rules
        if (activeConfig.validateFile) {
            const err = activeConfig.validateFile(file);
            if (err) {
                setFileValidationError(err);
                setData('file', null);
                e.target.value = '';
                return;
            }
        }

        setFileValidationError(null);
        setData('file', file);

        if (file.type.startsWith('image/')) {
            setFilePreview(URL.createObjectURL(file));
        } else {
            setFilePreview(null);
        }
    };

    const submit = (e) => {
        e.preventDefault();
        post('/admin/resources', {
            forceFormData: true,
        });
    };

    return (
        <AppLayout title="Add New Resource">
            <Head title="Upload Learning Resource — CRT F&B Connect" />

            <div className="max-w-4xl mx-auto">
                {/* Back button */}
                <div className="mb-6">
                    <Link
                        href="/admin/resources"
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-[#A8E6E8] hover:text-[#2EC4D6] transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Resource Management
                    </Link>
                </div>

                <div className="cyber-glass-card overflow-hidden">
                    {/* Header */}
                    <div className="p-6 sm:p-8 border-b border-[#A8E6E8]/15 bg-[#061923]/40">
                        <div className="flex items-center gap-2 mb-1">
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#0B6E8A]/40 border border-[#A8E6E8]/25 text-[#2EC4D6]">
                                <Sparkles className="w-3 h-3 text-[#2EC4D6]" />
                                Smart Upload Wizard
                            </span>
                        </div>
                        <h1 className="text-2xl font-black text-[#F4FBFC] tracking-tight">Upload Learning Resource</h1>
                        <p className="text-xs sm:text-sm text-[#A8E6E8]/70 mt-1">
                            Select a resource type below. The upload form automatically adjusts to accept only relevant files.
                        </p>
                    </div>

                    <form onSubmit={submit} className="p-6 sm:p-8 space-y-6">
                        {/* Title */}
                        <div>
                            <label className="block text-xs font-bold text-[#A8E6E8] uppercase tracking-wider mb-1.5">
                                Resource Title <span className="text-rose-400">*</span>
                            </label>
                            <input
                                type="text"
                                value={data.title}
                                onChange={(e) => setData('title', e.target.value)}
                                placeholder="e.g. Masterclass: Contemporary French Table Service & Gueridon"
                                className={`cyber-glass-input w-full px-4 py-2.5 text-sm rounded-xl ${
                                    errors.title ? 'border-rose-400' : ''
                                }`}
                                required
                            />
                            {errors.title && <p className="text-xs text-rose-400 mt-1">{errors.title}</p>}
                        </div>

                        {/* Resource Type Selection with Auto-Hide Behavior */}
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <label className="block text-xs font-bold text-[#A8E6E8] uppercase tracking-wider">
                                    Resource Type <span className="text-rose-400">*</span>
                                </label>
                                <span className="text-[11px] font-semibold text-[#2EC4D6]">
                                    {activeConfig.badge}
                                </span>
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                                {Object.values(RESOURCE_TYPE_CONFIG).map((type) => {
                                    const Icon = type.icon;
                                    const isSelected = data.resource_type === type.id;
                                    return (
                                        <button
                                            key={type.id}
                                            type="button"
                                            onClick={() => handleResourceTypeChange(type.id)}
                                            className={`p-3.5 rounded-2xl border text-center transition-all flex flex-col items-center gap-2 cursor-pointer ${
                                                isSelected
                                                    ? type.activeRing
                                                    : 'border-[#A8E6E8]/20 bg-[#061923]/40 hover:bg-[#0B6E8A]/25 text-[#A8E6E8]'
                                            }`}
                                        >
                                            <div className={`p-2.5 rounded-xl ${type.color} transition-transform ${isSelected ? 'scale-110' : ''}`}>
                                                <Icon className="w-5 h-5" />
                                            </div>
                                            <span className="text-xs font-bold text-[#F4FBFC]">{type.title}</span>
                                        </button>
                                    );
                                })}
                            </div>

                            <p className="text-[11px] text-[#A8E6E8]/70 mt-2 flex items-center gap-1.5">
                                <Info className="w-3.5 h-3.5 text-[#2EC4D6] flex-shrink-0" />
                                {activeConfig.hint}
                            </p>
                        </div>

                        {/* Category and Folder (Auto-synced with Resource Type) */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-[#A8E6E8] uppercase tracking-wider mb-1.5">
                                    Target Category <span className="text-rose-400">*</span>
                                </label>
                                <select
                                    value={data.category_id}
                                    onChange={(e) => handleCategoryChange(e.target.value)}
                                    className="cyber-glass-input w-full px-3.5 py-2.5 text-xs rounded-xl"
                                    required
                                >
                                    {categories.map((c) => (
                                        <option key={c.id} value={c.id} className="bg-[#061923] text-[#F4FBFC]">{c.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-[#A8E6E8] uppercase tracking-wider mb-1.5">
                                    Destination Folder <span className="text-[#A8E6E8]/50 font-normal text-[10px]">(Optional)</span>
                                </label>
                                <select
                                    value={data.folder_id}
                                    onChange={(e) => setData('folder_id', e.target.value)}
                                    className="cyber-glass-input w-full px-3.5 py-2.5 text-xs rounded-xl"
                                >
                                    <option value="" className="bg-[#061923] text-[#F4FBFC]">No Folder (Root of Category)</option>
                                    {availableFolders.map((f) => (
                                        <option key={f.id} value={f.id} className="bg-[#061923] text-[#F4FBFC]">{f.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-xs font-bold text-[#A8E6E8] uppercase tracking-wider mb-1.5">
                                Description &amp; Learning Objectives
                            </label>
                            <textarea
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                rows={3}
                                placeholder="Summary of the topic, skills demonstrated, or instructions for students..."
                                className="cyber-glass-input w-full px-4 py-2.5 text-xs rounded-xl"
                            />
                        </div>

                        {/* DYNAMIC CONTENT SOURCE: AUTO-HIDES IRRELEVANT FIELDS */}
                        <div className="p-5 sm:p-6 bg-[#061923]/50 rounded-2xl border border-[#A8E6E8]/20 space-y-4">
                            <div className="flex items-center justify-between pb-2 border-b border-[#A8E6E8]/15">
                                <h4 className="text-xs font-bold uppercase tracking-wider text-[#F4FBFC] flex items-center gap-2">
                                    <activeConfig.icon className="w-4 h-4 text-[#2EC4D6]" />
                                    <span>
                                        {data.resource_type === 'video' && 'Video Lesson Media Source'}
                                        {data.resource_type === 'illustration' && 'Illustration Image File'}
                                        {data.resource_type === 'pdf' && 'PDF Module File'}
                                        {data.resource_type === 'text' && 'Text Lesson Content'}
                                        {data.resource_type === 'other' && 'Learning Material Attachment'}
                                    </span>
                                </h4>
                                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#0B6E8A]/40 border border-[#A8E6E8]/20 text-[#A8E6E8]">
                                    {activeConfig.badge}
                                </span>
                            </div>

                            {/* 1. File Upload Field (Tailored to active resource type) */}
                            {activeConfig.allowFileUpload && (
                                <div>
                                    <label className="block text-xs font-semibold text-[#A8E6E8] mb-1.5">
                                        {activeConfig.fileLabel}
                                    </label>
                                    <input
                                        id="resource-file-input"
                                        type="file"
                                        accept={activeConfig.accept}
                                        onChange={handleFileChange}
                                        className="cyber-glass-input block w-full text-xs text-[#A8E6E8] file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-[#2EC4D6] file:text-[#061923] hover:file:bg-[#A8E6E8] cursor-pointer p-2 rounded-xl"
                                    />

                                    {/* Client-side format validation alert */}
                                    {fileValidationError && (
                                        <div className="mt-2 p-2.5 rounded-xl bg-rose-500/15 border border-rose-500/30 flex items-center gap-2 text-xs text-rose-300">
                                            <AlertCircle className="w-4 h-4 flex-shrink-0" />
                                            <span>{fileValidationError}</span>
                                        </div>
                                    )}

                                    {/* Server-side validation error */}
                                    {errors.file && <p className="text-xs text-rose-400 mt-1">{errors.file}</p>}

                                    {/* Image / Illustration Live Preview */}
                                    {filePreview && (
                                        <div className="mt-3 p-3 bg-[#061923]/60 rounded-xl border border-[#A8E6E8]/20">
                                            <p className="text-[10px] font-bold uppercase tracking-wider text-[#A8E6E8] mb-2">
                                                Visual Preview
                                            </p>
                                            <div className="max-h-64 overflow-hidden rounded-lg border border-[#A8E6E8]/15 flex items-center justify-center bg-black/30">
                                                <img
                                                    src={filePreview}
                                                    alt="Preview"
                                                    className="max-h-64 w-auto object-contain rounded-lg"
                                                />
                                            </div>
                                        </div>
                                    )}

                                    {/* File details tag when selected */}
                                    {data.file && !filePreview && (
                                        <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 bg-[#0B6E8A]/30 rounded-lg border border-[#A8E6E8]/25 text-xs text-[#F4FBFC] font-medium">
                                            <FileCheck className="w-4 h-4 text-emerald-400" />
                                            <span>Selected: {data.file.name}</span>
                                            <span className="text-[#A8E6E8]/70">({(data.file.size / (1024 * 1024)).toFixed(2)} MB)</span>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* 2. External Streaming URL (ONLY SHOWN FOR VIDEO AND OTHER, AUTO-HIDDEN FOR PDF/ILLUSTRATION/TEXT) */}
                            {activeConfig.allowStreamingUrl && (
                                <div className="pt-2 border-t border-[#A8E6E8]/15">
                                    <label className="block text-xs font-semibold text-[#A8E6E8] mb-1">
                                        Or External Streaming URL (YouTube, Vimeo, Google Drive, or Direct Video Link)
                                    </label>
                                    <div className="relative">
                                        <LinkIcon className="w-4 h-4 text-[#A8E6E8]/50 absolute left-3.5 top-1/2 -translate-y-1/2" />
                                        <input
                                            type="url"
                                            value={data.external_url}
                                            onChange={(e) => setData('external_url', e.target.value)}
                                            placeholder="https://youtube.com/watch?v=... or https://commondatastorage.googleapis.com/..."
                                            className="cyber-glass-input w-full pl-10 pr-4 py-2.5 text-xs rounded-xl"
                                        />
                                    </div>
                                    {errors.external_url && <p className="text-xs text-rose-400 mt-1">{errors.external_url}</p>}
                                </div>
                            )}

                            {/* 3. Text Content (ONLY SHOWN FOR TEXT LESSONS, AUTO-HIDDEN FOR VIDEO/PDF/ILLUSTRATION/OTHER) */}
                            {activeConfig.allowTextContent && (
                                <div>
                                    <div className="flex items-center justify-between mb-1">
                                        <label className="block text-xs font-semibold text-[#A8E6E8]">
                                            Text Lesson Content (Markdown Supported) <span className="text-rose-400">*</span>
                                        </label>
                                        <span className="text-[10px] text-[#A8E6E8]/60">
                                            Supports headers (#), bold (**text**), lists (- item)
                                        </span>
                                    </div>
                                    <textarea
                                        value={data.content}
                                        onChange={(e) => setData('content', e.target.value)}
                                        rows={10}
                                        placeholder="# Chapter 1: Standard Banquet Table Service&#10;&#10;Explain the dining etiquette, setup requirements, and service standards..."
                                        className="cyber-glass-input w-full px-4 py-3 text-xs font-mono rounded-xl"
                                        required={!data.file}
                                    />
                                    {errors.content && <p className="text-xs text-rose-400 mt-1">{errors.content}</p>}
                                </div>
                            )}
                        </div>

                        {/* Thumbnail & Visibility (Thumbnail is AUTO-HIDDEN for Illustrations because the illustration is already the image!) */}
                        <div className={`grid gap-4 ${activeConfig.showThumbnail ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1'}`}>
                            {activeConfig.showThumbnail && (
                                <div>
                                    <label className="block text-xs font-bold text-[#A8E6E8] uppercase tracking-wider mb-1.5">
                                        Thumbnail Image <span className="text-[#A8E6E8]/50 font-normal text-[10px]">(Optional Cover)</span>
                                    </label>
                                    <input
                                        type="file"
                                        accept="image/png,image/jpeg,image/webp,image/svg+xml"
                                        onChange={(e) => setData('thumbnail', e.target.files[0])}
                                        className="cyber-glass-input block w-full text-xs text-[#A8E6E8] file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-[#0B6E8A] file:text-[#F4FBFC] hover:file:bg-[#2EC4D6] hover:file:text-[#061923] cursor-pointer p-2 rounded-xl"
                                    />
                                    {errors.thumbnail && <p className="text-xs text-rose-400 mt-1">{errors.thumbnail}</p>}
                                </div>
                            )}

                            <div>
                                <label className="block text-xs font-bold text-[#A8E6E8] uppercase tracking-wider mb-1.5">
                                    Visibility Status
                                </label>
                                <select
                                    value={data.visibility}
                                    onChange={(e) => setData('visibility', e.target.value)}
                                    className="cyber-glass-input w-full px-3.5 py-2.5 text-xs rounded-xl"
                                >
                                    <option value="published" className="bg-[#061923] text-[#F4FBFC]">Published (Visible to Students)</option>
                                    <option value="draft" className="bg-[#061923] text-[#F4FBFC]">Draft (Hidden from Students)</option>
                                    <option value="archived" className="bg-[#061923] text-[#F4FBFC]">Archived</option>
                                </select>
                            </div>
                        </div>

                        {/* Smart AI Assessment Quiz Block */}
                        <div className={`p-5 rounded-2xl border transition-all ${
                            data.generate_smart_assessment
                                ? 'bg-[#0B6E8A]/30 border-[#2EC4D6]/50 ring-2 ring-[#2EC4D6]/20'
                                : 'bg-[#061923]/40 border-[#A8E6E8]/15'
                        }`}>
                            <div className="flex items-start justify-between gap-4">
                                <label className="flex items-start gap-3 cursor-pointer select-none">
                                    <input
                                        type="checkbox"
                                        checked={data.generate_smart_assessment}
                                        onChange={(e) => setData('generate_smart_assessment', e.target.checked)}
                                        className="mt-0.5 w-4 h-4 rounded text-[#2EC4D6] focus:ring-[#2EC4D6] border-[#A8E6E8]/30 bg-[#061923] cursor-pointer"
                                    />
                                    <div>
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <span className="text-xs font-bold text-[#F4FBFC]">
                                                Smart AI Assessment Generator
                                            </span>
                                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#2EC4D6]/20 text-[#2EC4D6] border border-[#2EC4D6]/30">
                                                <Sparkles className="w-3 h-3" />
                                                Auto 10 Questions
                                            </span>
                                        </div>
                                        <p className="text-[11px] text-[#A8E6E8]/70 mt-0.5">
                                            Automatically synthesizes a comprehensive 10-question multiple-choice quiz based on this uploaded material, complete with answer keys and pedagogical explanations. (Leave unchecked if you prefer to manually author custom questions &amp; reviewer flashcards).
                                        </p>
                                    </div>
                                </label>

                                <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                                    data.generate_smart_assessment ? 'bg-[#2EC4D6] text-[#061923]' : 'bg-[#061923]/60 text-[#A8E6E8]/50 border border-[#A8E6E8]/20'
                                }`}>
                                    <Sparkles className="w-4 h-4" />
                                </div>
                            </div>

                            {data.generate_smart_assessment && (
                                <div className="mt-4 pt-4 border-t border-[#A8E6E8]/15 grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-[11px] font-bold text-[#A8E6E8] uppercase tracking-wider mb-1">
                                            Passing Requirement
                                        </label>
                                        <select
                                            value={data.passing_percentage}
                                            onChange={(e) => setData('passing_percentage', Number(e.target.value))}
                                            className="cyber-glass-input w-full px-3 py-2 text-xs rounded-xl"
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
                                        <label className="block text-[11px] font-bold text-[#A8E6E8] uppercase tracking-wider mb-1">
                                            Time Limit
                                        </label>
                                        <select
                                            value={data.time_limit_minutes}
                                            onChange={(e) => setData('time_limit_minutes', Number(e.target.value))}
                                            className="cyber-glass-input w-full px-3 py-2 text-xs rounded-xl"
                                        >
                                            <option value={0} className="bg-[#061923] text-[#F4FBFC]">No Time Limit</option>
                                            <option value={10} className="bg-[#061923] text-[#F4FBFC]">10 Minutes</option>
                                            <option value={15} className="bg-[#061923] text-[#F4FBFC]">15 Minutes (Recommended)</option>
                                            <option value={20} className="bg-[#061923] text-[#F4FBFC]">20 Minutes</option>
                                            <option value={30} className="bg-[#061923] text-[#F4FBFC]">30 Minutes</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-[11px] font-bold text-[#A8E6E8] uppercase tracking-wider mb-1">
                                            Quiz Availability
                                        </label>
                                        <select
                                            value={data.assessment_published ? '1' : '0'}
                                            onChange={(e) => setData('assessment_published', e.target.value === '1')}
                                            className="cyber-glass-input w-full px-3 py-2 text-xs rounded-xl"
                                        >
                                            <option value="1" className="bg-[#061923] text-[#F4FBFC]">Publish Immediately (Live)</option>
                                            <option value="0" className="bg-[#061923] text-[#F4FBFC]">Draft (Review Before Publishing)</option>
                                        </select>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Student Email Announcement Notification Block */}
                        <div className={`p-5 rounded-2xl border transition-all ${
                            data.send_announcement
                                ? 'bg-[#0B6E8A]/30 border-[#2EC4D6]/50 ring-2 ring-[#2EC4D6]/20'
                                : 'bg-[#061923]/40 border-[#A8E6E8]/15'
                        }`}>
                            <div className="flex items-start justify-between gap-4">
                                <label className="flex items-start gap-3 cursor-pointer select-none">
                                    <input
                                        type="checkbox"
                                        checked={data.send_announcement}
                                        onChange={(e) => setData('send_announcement', e.target.checked)}
                                        className="mt-0.5 w-4 h-4 rounded text-[#2EC4D6] focus:ring-[#2EC4D6] border-[#A8E6E8]/30 bg-[#061923] cursor-pointer"
                                    />
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs font-bold text-[#F4FBFC]">
                                                Broadcast Email Announcement to All Registered Students
                                            </span>
                                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#2EC4D6]/20 text-[#2EC4D6] border border-[#2EC4D6]/30">
                                                {studentCount} Students
                                            </span>
                                        </div>
                                        <p className="text-[11px] text-[#A8E6E8]/70 mt-0.5">
                                            Automatically sends an official academic email announcement and in-portal alert to all active student inboxes.
                                        </p>
                                    </div>
                                </label>

                                <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                                    data.send_announcement ? 'bg-[#2EC4D6] text-[#061923]' : 'bg-[#061923]/60 text-[#A8E6E8]/50 border border-[#A8E6E8]/20'
                                }`}>
                                    <Megaphone className="w-4 h-4" />
                                </div>
                            </div>

                            {data.send_announcement && (
                                <div className="mt-4 pt-4 border-t border-[#A8E6E8]/15 space-y-2">
                                    <label className="block text-xs font-bold text-[#A8E6E8] uppercase tracking-wider">
                                        Custom Announcement Note / Instructor Instructions (Optional)
                                    </label>
                                    <textarea
                                        value={data.announcement_message}
                                        onChange={(e) => setData('announcement_message', e.target.value)}
                                        rows={3}
                                        placeholder="e.g. Please review this video masterclass and take the assessment before our culinary lab on Monday. Bring your complete chef uniform."
                                        className="cyber-glass-input w-full px-3.5 py-2.5 text-xs rounded-xl"
                                    />
                                    <p className="text-[10px] text-[#A8E6E8]/70">
                                        ℹ️ This custom note will appear prominently highlighted in the student's email notification alongside the direct lesson access link.
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Upload Progress Bar */}
                        {progress && (
                            <div className="p-3 bg-[#0B6E8A]/30 rounded-2xl border border-[#2EC4D6]/30">
                                <div className="flex items-center justify-between text-xs font-bold text-[#F4FBFC] mb-1.5">
                                    <span>Uploading Media ({progress.percentage}%)</span>
                                    <span className="text-[#2EC4D6]">{progress.percentage}%</span>
                                </div>
                                <div className="w-full bg-[#061923]/80 rounded-full h-2.5 overflow-hidden border border-[#A8E6E8]/20">
                                    <div
                                        className="bg-gradient-to-r from-[#0B6E8A] to-[#2EC4D6] h-2.5 rounded-full transition-all duration-300"
                                        style={{ width: `${progress.percentage}%` }}
                                    />
                                </div>
                            </div>
                        )}

                        {/* Submit Button */}
                        <div className="flex items-center justify-end gap-3 pt-6 border-t border-[#A8E6E8]/15">
                            <Link
                                href="/admin/resources"
                                className="cyber-oauth-btn px-5 py-2.5 text-xs font-semibold rounded-xl transition-colors"
                            >
                                Cancel
                            </Link>
                            <button
                                type="submit"
                                disabled={processing || Boolean(fileValidationError)}
                                className="cyber-glow-btn inline-flex items-center gap-2 px-6 py-2.5 text-xs font-bold rounded-xl disabled:opacity-60 transition-all cursor-pointer"
                            >
                                <Upload className="w-4 h-4" />
                                {processing ? 'Uploading Resource...' : 'Publish Resource'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
