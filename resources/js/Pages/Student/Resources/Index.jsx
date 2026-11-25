import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import Pagination from '@/Components/Pagination';
import {
    FolderKanban,
    Search,
    Video,
    Image as ImageIcon,
    FileText,
    BookOpen,
    Folder,
    Eye,
    Download,
    ArrowRight
} from 'lucide-react';

export default function StudentResourceIndex({ categories = [], resources = { data: [] }, filters = {} }) {
    const [search, setSearch] = useState(filters.search || '');
    const [categoryFilter, setCategoryFilter] = useState(filters.category || '');
    const [typeFilter, setTypeFilter] = useState(filters.type || '');
    const [sortBy, setSortBy] = useState(filters.sort || 'latest');

    const handleSearch = (e) => {
        e.preventDefault();
        applyFilters({ search, category: categoryFilter, type: typeFilter, sort: sortBy });
    };

    const applyFilters = (newFilters) => {
        router.get('/student/resources', newFilters, {
            preserveState: true,
            replace: true,
        });
    };

    const handleCategoryClick = (slug) => {
        const nextSlug = categoryFilter === slug ? '' : slug;
        setCategoryFilter(nextSlug);
        applyFilters({ search, category: nextSlug, type: typeFilter, sort: sortBy });
    };

    const categoryIcons = {
        'video-lessons': Video,
        'illustrations': ImageIcon,
        'pdf-modules': FileText,
        'text-lessons': BookOpen,
        'other-materials': Folder,
    };

    return (
        <AppLayout title="Learning Materials">
            <Head title="Learning Resources Library — CRT F&B Connect" />

            {/* Header */}
            <div className="mb-8">
                <h1 className="text-2xl sm:text-3xl font-black text-[#F4FBFC] tracking-tight">
                    Educational Resources Library
                </h1>
                <p className="text-xs sm:text-sm text-[#A8E6E8]/70 mt-1">
                    Explore videos, diagrams, PDF modules, and classroom reading materials prepared for your program.
                </p>
            </div>

            {/* Category Filter Chips */}
            <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 scrollbar-none">
                <button
                    onClick={() => handleCategoryClick('')}
                    className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                        categoryFilter === ''
                            ? 'cyber-glow-btn'
                            : 'cyber-oauth-btn'
                    }`}
                >
                    All Categories
                </button>
                {categories.map((cat) => {
                    const isSelected = categoryFilter === cat.slug;
                    return (
                        <button
                            key={cat.id}
                            onClick={() => handleCategoryClick(cat.slug)}
                            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
                                isSelected
                                    ? 'cyber-glow-btn'
                                    : 'cyber-oauth-btn'
                            }`}
                        >
                            <span>{cat.name}</span>
                            <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isSelected ? 'bg-[#061923]/30 text-[#F4FBFC]' : 'bg-[#0B6E8A]/40 text-[#A8E6E8]'}`}>
                                {cat.resources_count}
                            </span>
                        </button>
                    );
                })}
            </div>

            {/* Search and Filters Bar */}
            <div className="cyber-glass-card p-3.5 sm:p-4 mb-8 min-w-0">
                <form onSubmit={handleSearch} className="flex flex-col md:flex-row items-stretch md:items-center gap-2.5 sm:gap-3">
                    <div className="relative flex-1 min-w-0 w-full">
                        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A8E6E8]/50 pointer-events-none" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search learning materials by title, keyword, or lesson..."
                            className="cyber-glass-input w-full pl-10 pr-4 py-2 text-xs rounded-xl"
                        />
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-2 md:flex md:items-center gap-2 w-full md:w-auto">
                        <select
                            value={typeFilter}
                            onChange={(e) => {
                                setTypeFilter(e.target.value);
                                applyFilters({ search, category: categoryFilter, type: e.target.value, sort: sortBy });
                            }}
                            className="cyber-glass-input w-full md:w-auto px-3 py-2 text-xs rounded-xl cursor-pointer"
                        >
                            <option value="" className="bg-[#061923] text-[#F4FBFC]">All Formats</option>
                            <option value="video" className="bg-[#061923] text-[#F4FBFC]">Video Lessons</option>
                            <option value="illustration" className="bg-[#061923] text-[#F4FBFC]">Illustrations</option>
                            <option value="pdf" className="bg-[#061923] text-[#F4FBFC]">PDF Modules</option>
                            <option value="text" className="bg-[#061923] text-[#F4FBFC]">Text Lessons</option>
                            <option value="other" className="bg-[#061923] text-[#F4FBFC]">Other</option>
                        </select>

                        <select
                            value={sortBy}
                            onChange={(e) => {
                                setSortBy(e.target.value);
                                applyFilters({ search, category: categoryFilter, type: typeFilter, sort: e.target.value });
                            }}
                            className="cyber-glass-input w-full md:w-auto px-3 py-2 text-xs rounded-xl cursor-pointer"
                        >
                            <option value="latest" className="bg-[#061923] text-[#F4FBFC]">Latest First</option>
                            <option value="popular" className="bg-[#061923] text-[#F4FBFC]">Most Popular</option>
                            <option value="title" className="bg-[#061923] text-[#F4FBFC]">Alphabetical (A-Z)</option>
                        </select>

                        <button
                            type="submit"
                            className="cyber-glow-btn col-span-2 md:col-span-1 px-4 py-2 text-xs font-bold rounded-xl cursor-pointer flex items-center justify-center gap-1.5"
                        >
                            <Search className="w-3.5 h-3.5 sm:hidden" />
                            <span>Search</span>
                        </button>
                    </div>
                </form>
            </div>

            {/* Resources Grid */}
            {resources.data && resources.data.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                    {resources.data.map((res) => (
                        <div
                            key={res.id}
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
                                <span className={`absolute top-2.5 left-2.5 px-2 py-0.5 text-[10px] font-bold uppercase rounded shadow-md border ${
                                    res.resource_type === 'video' ? 'bg-[#0B6E8A]/90 text-[#F4FBFC] border-[#2EC4D6]/40' :
                                    res.resource_type === 'illustration' ? 'bg-sky-500/90 text-white border-sky-400/40' :
                                    res.resource_type === 'pdf' ? 'bg-emerald-600/90 text-white border-emerald-400/40' :
                                    'bg-amber-600/90 text-white border-amber-400/40'
                                }`}>
                                    {res.resource_type}
                                </span>
                            </div>

                            <div className="p-5 flex-1 flex flex-col justify-between">
                                <div>
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#2EC4D6] block mb-1">
                                        {res.category?.name} {res.folder ? `› ${res.folder.name}` : ''}
                                    </span>
                                    <Link
                                        href={`/student/resources/${res.id}`}
                                        className="text-sm font-bold text-[#F4FBFC] group-hover:text-[#2EC4D6] transition-colors line-clamp-1 block"
                                    >
                                        {res.title}
                                    </Link>
                                    <p className="text-xs text-[#A8E6E8]/70 mt-1 line-clamp-2 leading-relaxed">
                                        {res.description || 'Curriculum resource material.'}
                                    </p>
                                </div>

                                <div className="mt-4 pt-3 border-t border-[#A8E6E8]/15 flex items-center justify-between text-xs text-[#A8E6E8]/70">
                                    <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5 text-[#2EC4D6]" />{res.views_count} views</span>
                                    <span className="font-mono text-[11px] text-[#A8E6E8]">{res.formatted_file_size}</span>
                                </div>
                            </div>

                            <div className="px-5 py-3 bg-[#061923]/60 border-t border-[#A8E6E8]/15 flex items-center justify-between">
                                <Link
                                    href={`/student/resources/${res.id}`}
                                    className="text-xs font-bold text-[#2EC4D6] hover:text-[#A8E6E8] flex items-center gap-1 group-hover:translate-x-1 transition-transform"
                                >
                                    Access Resource
                                    <ArrowRight className="w-3.5 h-3.5" />
                                </Link>
                                <a
                                    href={`/student/resources/${res.id}/download`}
                                    className="p-1 text-[#A8E6E8]/60 hover:text-[#2EC4D6] rounded transition-colors"
                                    title="Download"
                                >
                                    <Download className="w-4 h-4" />
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="p-16 cyber-glass-card text-center text-xs text-[#A8E6E8]/60">
                    <FolderKanban className="w-12 h-12 text-[#A8E6E8]/30 mx-auto mb-3" />
                    <h3 className="text-sm font-bold text-[#F4FBFC]">No learning materials found</h3>
                    <p className="mt-1">Try searching with different keywords or choosing another category above.</p>
                </div>
            )}

            <Pagination links={resources.links} />
        </AppLayout>
    );
}
