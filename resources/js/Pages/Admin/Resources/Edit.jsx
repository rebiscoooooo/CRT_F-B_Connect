import React, { useState } from 'react';
import { Head, Link, useForm, router } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import Modal from '@/Components/Modal';
import {
    Save,
    ArrowLeft,
    Trash2,
    Video,
    Image as ImageIcon,
    FileText,
    BookOpen,
    Folder,
    Link as LinkIcon
} from 'lucide-react';

export default function ResourceEdit({ resource, categories = [], folders = [] }) {
    const { data, setData, post, processing, errors } = useForm({
        _method: 'PUT',
        title: resource.title || '',
        description: resource.description || '',
        category_id: resource.category_id || '',
        folder_id: resource.folder_id || '',
        resource_type: resource.resource_type || 'video',
        visibility: resource.visibility || 'published',
        content: resource.content || '',
        external_url: resource.external_url || '',
        file: null,
        thumbnail: null,
    });

    const [isDeleteOpen, setIsDeleteOpen] = useState(false);

    const availableFolders = folders.filter((f) => String(f.category_id) === String(data.category_id));

    const submit = (e) => {
        e.preventDefault();
        // Inertia file uploads with PUT require POST with _method=PUT
        post(`/admin/resources/${resource.id}`, {
            forceFormData: true,
        });
    };

    const handleDelete = () => {
        router.delete(`/admin/resources/${resource.id}`);
    };

    return (
        <AppLayout title={`Edit ${resource.title}`}>
            <Head title={`Edit ${resource.title} — CRT F&B Connect`} />

            <div className="max-w-4xl mx-auto">
                <div className="flex items-center justify-between mb-6">
                    <Link
                        href={`/admin/resources/${resource.id}`}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-[#A8E6E8] hover:text-[#2EC4D6] transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Resource View
                    </Link>

                    <button
                        type="button"
                        onClick={() => setIsDeleteOpen(true)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-300 bg-rose-500/15 border border-rose-500/30 hover:bg-rose-500/25 rounded-xl transition-colors cursor-pointer"
                    >
                        <Trash2 className="w-3.5 h-3.5" />
                        Delete Resource
                    </button>
                </div>

                <div className="cyber-glass-card overflow-hidden">
                    <div className="p-6 sm:p-8 border-b border-[#A8E6E8]/15 bg-[#061923]/40">
                        <h1 className="text-2xl font-black text-[#F4FBFC] tracking-tight">Edit Resource Information</h1>
                        <p className="text-xs sm:text-sm text-[#A8E6E8]/70 mt-1">
                            Modify curriculum metadata, replace file attachments, or change student visibility.
                        </p>
                    </div>

                    <form onSubmit={submit} className="p-6 sm:p-8 space-y-6">
                        {/* Title */}
                        <div>
                            <label className="block text-xs font-bold text-[#A8E6E8] uppercase tracking-wider mb-1.5">
                                Resource Title
                            </label>
                            <input
                                type="text"
                                value={data.title}
                                onChange={(e) => setData('title', e.target.value)}
                                className="cyber-glass-input w-full px-4 py-2.5 text-sm rounded-xl"
                                required
                            />
                            {errors.title && <p className="text-xs text-rose-400 mt-1">{errors.title}</p>}
                        </div>

                        {/* Category and Folder */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-[#A8E6E8] uppercase tracking-wider mb-1.5">
                                    Category
                                </label>
                                <select
                                    value={data.category_id}
                                    onChange={(e) => setData('category_id', e.target.value)}
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
                                    Folder
                                </label>
                                <select
                                    value={data.folder_id}
                                    onChange={(e) => setData('folder_id', e.target.value)}
                                    className="cyber-glass-input w-full px-3.5 py-2.5 text-xs rounded-xl"
                                >
                                    <option value="" className="bg-[#061923] text-[#F4FBFC]">No Folder (Category Root)</option>
                                    {availableFolders.map((f) => (
                                        <option key={f.id} value={f.id} className="bg-[#061923] text-[#F4FBFC]">{f.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-xs font-bold text-[#A8E6E8] uppercase tracking-wider mb-1.5">
                                Description
                            </label>
                            <textarea
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                rows={3}
                                className="cyber-glass-input w-full px-4 py-2.5 text-xs rounded-xl"
                            />
                        </div>

                        {/* Dynamic Replace File / URL with Auto-Hide */}
                        <div className="p-5 sm:p-6 bg-[#061923]/50 rounded-2xl border border-[#A8E6E8]/20 space-y-4">
                            <div className="flex items-center justify-between pb-2 border-b border-[#A8E6E8]/15">
                                <h4 className="text-xs font-bold uppercase tracking-wider text-[#F4FBFC]">
                                    Media &amp; Content Source ({resource.resource_type.toUpperCase()})
                                </h4>
                                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#0B6E8A]/40 border border-[#A8E6E8]/20 text-[#A8E6E8]">
                                    {resource.resource_type === 'video' && 'Video / Stream'}
                                    {resource.resource_type === 'illustration' && 'Images Only'}
                                    {resource.resource_type === 'pdf' && 'PDF Documents Only'}
                                    {resource.resource_type === 'text' && 'Lecture Text'}
                                    {resource.resource_type === 'other' && 'General Attachments'}
                                </span>
                            </div>

                            {/* File Upload (Available for video, illustration, pdf, other, optional for text) */}
                            <div>
                                <label className="block text-xs font-semibold text-[#A8E6E8] mb-1">
                                    {resource.resource_type === 'video' && 'Replace Video File (MP4, WebM, QuickTime up to 1GB)'}
                                    {resource.resource_type === 'illustration' && 'Replace Illustration Image (PNG, JPG, WebP, SVG up to 1GB)'}
                                    {resource.resource_type === 'pdf' && 'Replace PDF Module (PDF Document up to 1GB)'}
                                    {resource.resource_type === 'text' && 'Optional Supplementary Attachment (.txt, .md, .pdf)'}
                                    {resource.resource_type === 'other' && 'Replace File Attachment (Up to 1GB)'}
                                </label>
                                <input
                                    type="file"
                                    accept={
                                        resource.resource_type === 'video' ? 'video/mp4,video/webm,video/quicktime,.mp4,.webm,.mov' :
                                        resource.resource_type === 'illustration' ? 'image/png,image/jpeg,image/webp,image/svg+xml,.png,.jpg,.jpeg,.webp,.svg' :
                                        resource.resource_type === 'pdf' ? 'application/pdf,.pdf' :
                                        resource.resource_type === 'text' ? '.txt,.md,.pdf,.doc,.docx' : '*/*'
                                    }
                                    onChange={(e) => setData('file', e.target.files[0])}
                                    className="cyber-glass-input block w-full text-xs text-[#A8E6E8] file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-[#2EC4D6] file:text-[#061923] hover:file:bg-[#A8E6E8] cursor-pointer p-2 rounded-xl"
                                />
                                {resource.file_path && (
                                    <p className="text-[11px] text-[#A8E6E8]/70 mt-1.5">
                                        Current file: <span className="font-mono text-[#F4FBFC]">{resource.file_path}</span> ({resource.formatted_file_size})
                                    </p>
                                )}
                                {errors.file && <p className="text-xs text-rose-400 mt-1">{errors.file}</p>}
                            </div>

                            {/* External URL: Auto-hidden for PDF, Illustration, and Text */}
                            {(resource.resource_type === 'video' || resource.resource_type === 'other') && (
                                <div className="pt-2 border-t border-[#A8E6E8]/15">
                                    <label className="block text-xs font-semibold text-[#A8E6E8] mb-1">
                                        Streaming URL (YouTube / Video URL)
                                    </label>
                                    <input
                                        type="url"
                                        value={data.external_url}
                                        onChange={(e) => setData('external_url', e.target.value)}
                                        placeholder="https://youtube.com/watch?v=..."
                                        className="cyber-glass-input w-full px-3.5 py-2.5 text-xs rounded-xl"
                                    />
                                    {errors.external_url && <p className="text-xs text-rose-400 mt-1">{errors.external_url}</p>}
                                </div>
                            )}

                            {/* Lesson Content: Auto-hidden for Video, Illustration, PDF, and Other */}
                            {resource.resource_type === 'text' && (
                                <div>
                                    <label className="block text-xs font-semibold text-[#A8E6E8] mb-1">
                                        Lesson Content (Markdown Supported)
                                    </label>
                                    <textarea
                                        value={data.content}
                                        onChange={(e) => setData('content', e.target.value)}
                                        rows={10}
                                        placeholder="Instructional lesson content..."
                                        className="cyber-glass-input w-full px-4 py-3 text-xs font-mono rounded-xl"
                                    />
                                    {errors.content && <p className="text-xs text-rose-400 mt-1">{errors.content}</p>}
                                </div>
                            )}
                        </div>

                        {/* Visibility */}
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

                        <div className="flex items-center justify-end gap-3 pt-6 border-t border-[#A8E6E8]/15">
                            <Link
                                href={`/admin/resources/${resource.id}`}
                                className="cyber-oauth-btn px-5 py-2.5 text-xs font-semibold rounded-xl"
                            >
                                Cancel
                            </Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className="cyber-glow-btn inline-flex items-center gap-2 px-6 py-2.5 text-xs font-bold rounded-xl cursor-pointer"
                            >
                                <Save className="w-4 h-4" />
                                {processing ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Delete Modal */}
            <Modal isOpen={isDeleteOpen} onClose={() => setIsDeleteOpen(false)} title="Confirm Resource Deletion">
                <div className="space-y-4">
                    <p className="text-xs text-[#F4FBFC] leading-relaxed">
                        Are you sure you want to permanently delete <strong className="text-[#2EC4D6]">{resource.title}</strong>? All associated files will be removed from server storage.
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
                            Confirm Delete
                        </button>
                    </div>
                </div>
            </Modal>
        </AppLayout>
    );
}
