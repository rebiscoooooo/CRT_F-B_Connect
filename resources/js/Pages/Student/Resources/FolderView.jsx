import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import Pagination from '@/Components/Pagination';
import {
    Folder,
    Search,
    ChevronRight,
    ArrowLeft,
    Video,
    Image as ImageIcon,
    FileText,
    BookOpen,
    Eye,
    Download
} from 'lucide-react';

export default function StudentFolderView({ folder, subfolders = [], resources = { data: [] }, filters = {} }) {
    const [search, setSearch] = useState(filters.search || '');

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(`/student/resources/folder/${folder.id}`, { search }, { preserveState: true });
    };

    return (
        <AppLayout title={folder.name}>
            <Head title={`${folder.name} — CRT F&B Connect`} />

            {/* Breadcrumb Navigation Flow */}
            <nav className="flex items-center gap-2 text-xs font-semibold text-[#A8E6E8]/70 mb-6 flex-wrap">
                <Link href="/student/resources" className="hover:text-[#2EC4D6] transition-colors">
                    All Materials
                </Link>
                <ChevronRight className="w-3.5 h-3.5 text-[#A8E6E8]/40" />
                <Link href={`/student/resources/category/${folder.category?.slug}`} className="hover:text-[#2EC4D6] transition-colors">
                    {folder.category?.name}
                </Link>
                <ChevronRight className="w-3.5 h-3.5 text-[#A8E6E8]/40" />
                <span className="text-[#F4FBFC] font-bold">{folder.name}</span>
            </nav>

            {/* Folder Header */}
            <div className="cyber-glass-card p-6 sm:p-8 mb-8">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#2EC4D6] bg-[#0B6E8A]/40 px-3 py-1 rounded-full border border-[#2EC4D6]/30">
                    Curriculum Folder
                </span>
                <h1 className="text-2xl sm:text-3xl font-black text-[#F4FBFC] tracking-tight mt-3">
                    {folder.name}
                </h1>
                <p className="text-xs sm:text-sm text-[#A8E6E8]/70 mt-2 max-w-2xl leading-relaxed">
                    {folder.description || 'Instructional materials organized for this course unit.'}
                </p>
            </div>

            {/* Nested Subfolders if any */}
            {subfolders.length > 0 && (
                <div className="mb-8">
                    <h3 className="text-sm font-bold text-[#F4FBFC] mb-3 flex items-center gap-2">
                        <Folder className="w-4 h-4 text-[#2EC4D6]" />
                        Subfolders ({subfolders.length})
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {subfolders.map((sub) => (
                            <Link
                                key={sub.id}
                                href={`/student/resources/folder/${sub.id}`}
                                className="p-4 cyber-glass-card cyber-glass-card-hover flex items-center justify-between group"
                            >
                                <div className="flex items-center gap-2.5 overflow-hidden">
                                    <Folder className="w-4 h-4 text-[#2EC4D6] flex-shrink-0" />
                                    <span className="text-xs font-bold text-[#F4FBFC] group-hover:text-[#2EC4D6] truncate">{sub.name}</span>
                                </div>
                                <span className="text-[11px] font-semibold text-[#A8E6E8]/70">{sub.resources_count}</span>
                            </Link>
                        ))}
                    </div>
                </div>
            )}

            {/* Resources list in folder */}
            <div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                    <h3 className="text-base font-bold text-[#F4FBFC]">
                        Materials in this Unit ({resources.total || resources.data?.length || 0})
                    </h3>

                    <form onSubmit={handleSearch} className="flex items-center gap-2">
                        <div className="relative">
                            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#A8E6E8]/50" />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search in this folder..."
                                className="cyber-glass-input pl-9 pr-3 py-1.5 text-xs rounded-xl w-48 sm:w-64"
                            />
                        </div>
                        <button type="submit" className="cyber-glow-btn px-3 py-1.5 text-xs font-bold rounded-xl cursor-pointer">
                            Filter
                        </button>
                    </form>
                </div>

                {resources.data && resources.data.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                        {resources.data.map((res) => (
                            <Link
                                key={res.id}
                                href={`/student/resources/${res.id}`}
                                className="cyber-glass-card cyber-glass-card-hover overflow-hidden flex flex-col group"
                            >
                                <div className="relative aspect-video bg-[#061923] flex items-center justify-center overflow-hidden border-b border-[#A8E6E8]/15">
                                    {res.thumbnail_url ? (
                                        <img src={res.thumbnail_url} alt={res.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                                    ) : res.resource_type === 'illustration' && res.file_url ? (
                                        <img src={res.file_url} alt={res.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                                    ) : (
                                        <div className="text-[#A8E6E8]/40">
                                            {res.resource_type === 'video' ? <Video className="w-10 h-10 text-[#2EC4D6]" /> :
                                             res.resource_type === 'pdf' ? <FileText className="w-10 h-10 text-emerald-400" /> :
                                             <BookOpen className="w-10 h-10 text-amber-400" />}
                                        </div>
                                    )}
                                    <span className="absolute top-2.5 left-2.5 px-2 py-0.5 text-[10px] font-bold uppercase rounded bg-[#0B6E8A]/90 text-white border border-[#2EC4D6]/40 shadow-xs">
                                        {res.resource_type}
                                    </span>
                                </div>

                                <div className="p-5 flex-1 flex flex-col justify-between">
                                    <div>
                                        <h4 className="text-sm font-bold text-[#F4FBFC] group-hover:text-[#2EC4D6] line-clamp-1 transition-colors">
                                            {res.title}
                                        </h4>
                                        <p className="text-xs text-[#A8E6E8]/70 mt-1 line-clamp-2 leading-relaxed">
                                            {res.description || 'Instructional resource.'}
                                        </p>
                                    </div>
                                    <div className="mt-4 pt-3 border-t border-[#A8E6E8]/15 flex items-center justify-between text-xs text-[#A8E6E8]/70 font-medium">
                                        <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5 text-[#2EC4D6]" />{res.views_count} views</span>
                                        <span className="font-mono text-[11px] text-[#A8E6E8]">{res.formatted_file_size}</span>
                                    </div>
                                </div>

                                <div className="px-5 py-3 bg-[#061923]/60 border-t border-[#A8E6E8]/15 flex items-center justify-between">
                                    <span className="text-xs font-bold text-[#2EC4D6] group-hover:translate-x-1 transition-transform flex items-center gap-1">
                                        Access Resource
                                        <ChevronRight className="w-3.5 h-3.5" />
                                    </span>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="p-12 cyber-glass-card text-center text-xs text-[#A8E6E8]/60">
                        No resources in this folder yet.
                    </div>
                )}

                <Pagination links={resources.links} />
            </div>
        </AppLayout>
    );
}
