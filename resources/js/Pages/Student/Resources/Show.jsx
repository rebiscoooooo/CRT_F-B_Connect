import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import VideoPlayer from '@/Components/VideoPlayer';
import ImageViewer from '@/Components/ImageViewer';
import PdfViewer from '@/Components/PdfViewer';
import TextLessonViewer from '@/Components/TextLessonViewer';
import LessonAssessment from '@/Components/LessonAssessment';
import {
    ChevronRight,
    ArrowLeft,
    Download,
    Eye,
    Calendar,
    User,
    HardDrive,
    Share2,
    Check
} from 'lucide-react';

export default function StudentResourceShow({ resource, relatedResources = [], assessment = null, submission = null }) {
    const [copied, setCopied] = useState(false);

    const handleShare = () => {
        navigator.clipboard.writeText(window.location.href).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    return (
        <AppLayout title={resource.title}>
            <Head title={`${resource.title} — CRT F&B Connect`} />

            {/* Breadcrumb Navigation */}
            <nav className="flex items-center gap-2 text-xs font-semibold text-[#A8E6E8]/70 mb-6 flex-wrap">
                <Link href="/student/resources" className="hover:text-[#2EC4D6] transition-colors">
                    All Materials
                </Link>
                <ChevronRight className="w-3.5 h-3.5 text-[#A8E6E8]/40" />
                <Link href={`/student/resources/category/${resource.category?.slug}`} className="hover:text-[#2EC4D6] transition-colors">
                    {resource.category?.name}
                </Link>
                {resource.folder && (
                    <>
                        <ChevronRight className="w-3.5 h-3.5 text-[#A8E6E8]/40" />
                        <Link href={`/student/resources/folder/${resource.folder.id}`} className="hover:text-[#2EC4D6] transition-colors">
                            {resource.folder.name}
                        </Link>
                    </>
                )}
                <ChevronRight className="w-3.5 h-3.5 text-[#A8E6E8]/40" />
                <span className="text-[#F4FBFC] font-bold truncate max-w-xs">{resource.title}</span>
            </nav>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Main Viewer Area (8 cols) */}
                <div className="lg:col-span-8 space-y-6">
                    {/* Media Viewer Component */}
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
                            downloadUrl={`/student/resources/${resource.id}/download`}
                        />
                    )}

                    {resource.resource_type === 'pdf' && (
                        <PdfViewer
                            src={resource.file_url}
                            title={resource.title}
                            downloadUrl={`/student/resources/${resource.id}/download`}
                        />
                    )}

                    {resource.resource_type === 'text' && (
                        <TextLessonViewer
                            content={resource.content}
                            title={resource.title}
                            downloadUrl={`/student/resources/${resource.id}/download`}
                        />
                    )}

                    {resource.resource_type === 'other' && (
                        <div className="p-8 cyber-glass-card text-center">
                            <h3 className="text-lg font-bold text-[#F4FBFC] mb-2">{resource.title}</h3>
                            <p className="text-xs text-[#A8E6E8]/70 mb-6">{resource.description}</p>
                            <a
                                href={`/student/resources/${resource.id}/download`}
                                className="cyber-glow-btn inline-flex items-center gap-2 px-6 py-2.5 text-xs font-bold rounded-xl"
                            >
                                <Download className="w-4 h-4" />
                                Download File ({resource.formatted_file_size})
                            </a>
                        </div>
                    )}

                    {/* Resource Information Card */}
                    <div className="cyber-glass-card p-6 sm:p-8 space-y-4">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                            <span className={`px-2.5 py-1 text-[10px] font-bold uppercase rounded-md border ${
                                resource.resource_type === 'video' ? 'bg-[#0B6E8A]/80 text-[#F4FBFC] border-[#2EC4D6]/40' :
                                resource.resource_type === 'illustration' ? 'bg-sky-500/80 text-white border-sky-400/40' :
                                resource.resource_type === 'pdf' ? 'bg-emerald-600/80 text-white border-emerald-400/40' :
                                'bg-amber-600/80 text-white border-amber-400/40'
                            }`}>
                                {resource.resource_type}
                            </span>

                            <div className="flex items-center gap-2">
                                <button
                                    onClick={handleShare}
                                    className="cyber-oauth-btn inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg cursor-pointer"
                                >
                                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5 text-[#2EC4D6]" />}
                                    {copied ? 'Link Copied' : 'Share'}
                                </button>
                                <a
                                    href={`/student/resources/${resource.id}/download`}
                                    className="cyber-glow-btn inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-lg"
                                >
                                    <Download className="w-3.5 h-3.5" />
                                    Download Resource
                                </a>
                            </div>
                        </div>

                        <h1 className="text-xl sm:text-2xl font-black text-[#F4FBFC] leading-snug">
                            {resource.title}
                        </h1>

                        <p className="text-sm text-[#A8E6E8]/80 leading-relaxed whitespace-pre-line">
                            {resource.description || 'No additional description provided.'}
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

                            <span className="text-[11px]">
                                Instructor: <strong className="text-[#F4FBFC]">{resource.uploader?.name || 'Chef Instructor'}</strong>
                            </span>
                        </div>
                    </div>

                    {/* Lesson Assessment & Knowledge Check */}
                    {assessment && (
                        <LessonAssessment
                            resource={resource}
                            assessment={assessment}
                            initialSubmission={submission}
                        />
                    )}
                </div>

                {/* Sidebar (4 cols) */}
                <div className="lg:col-span-4 space-y-6">
                    {/* Material Details Card */}
                    <div className="cyber-glass-card p-6 space-y-3 text-xs">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-[#A8E6E8]/70 mb-2">
                            Lesson Information
                        </h3>

                        <div className="flex items-center justify-between py-1.5 border-b border-[#A8E6E8]/15">
                            <span className="text-[#A8E6E8]/70">Category:</span>
                            <span className="font-semibold text-[#F4FBFC]">{resource.category?.name}</span>
                        </div>
                        <div className="flex items-center justify-between py-1.5 border-b border-[#A8E6E8]/15">
                            <span className="text-[#A8E6E8]/70">Curriculum Folder:</span>
                            <span className="font-semibold text-[#F4FBFC]">{resource.folder?.name || 'Category Root'}</span>
                        </div>
                        <div className="flex items-center justify-between py-1.5 border-b border-[#A8E6E8]/15">
                            <span className="text-[#A8E6E8]/70">File Size:</span>
                            <span className="font-mono text-[#F4FBFC]">{resource.formatted_file_size}</span>
                        </div>
                        <div className="flex items-center justify-between py-1.5 border-b border-[#A8E6E8]/15">
                            <span className="text-[#A8E6E8]/70">Published Date:</span>
                            <span className="text-[#F4FBFC]">
                                {new Date(resource.created_at).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                            </span>
                        </div>
                    </div>

                    {/* Related Resources */}
                    {relatedResources.length > 0 && (
                        <div className="cyber-glass-card p-6">
                            <h3 className="text-xs font-bold uppercase tracking-wider text-[#A8E6E8]/70 mb-3">
                                More In {resource.category?.name}
                            </h3>
                            <div className="space-y-3">
                                {relatedResources.map((rel) => (
                                    <Link
                                        key={rel.id}
                                        href={`/student/resources/${rel.id}`}
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
        </AppLayout>
    );
}
