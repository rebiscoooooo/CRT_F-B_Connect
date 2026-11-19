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
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                    Educational Resources Library
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                    Explore videos, diagrams, PDF modules, and classroom reading materials prepared for your program.
                </p>
            </div>

            {/* Category Filter Chips */}
            <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 scrollbar-none">
                <button
                    onClick={() => handleCategoryClick('')}
                    className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                        categoryFilter === ''
                            ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20'
                            : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
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
                            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
                                isSelected
                                    ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20'
                                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                            }`}
                        >
                            <span>{cat.name}</span>
                            <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'}`}>
                                {cat.resources_count}
                            </span>
                        </button>
                    );
                })}
            </div>

            {/* Search and Filters Bar */}
            <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200 shadow-2xs mb-8 min-w-0">
                <form onSubmit={handleSearch} className="flex flex-col md:flex-row items-stretch md:items-center gap-2.5 sm:gap-3">
                    <div className="relative flex-1 min-w-0 w-full">
                        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search learning materials by title, keyword, or lesson..."
                            className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:bg-white focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20 transition-all"
                        />
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-2 md:flex md:items-center gap-2 w-full md:w-auto">
                        <select
                            value={typeFilter}
                            onChange={(e) => {
                                setTypeFilter(e.target.value);
                                applyFilters({ search, category: categoryFilter, type: e.target.value, sort: sortBy });
                            }}
                            className="w-full md:w-auto px-3 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:bg-white focus:border-blue-600 focus:outline-none text-slate-700 font-medium cursor-pointer"
                        >
                            <option value="">All Formats</option>
                            <option value="video">Video Lessons</option>
                            <option value="illustration">Illustrations</option>
                            <option value="pdf">PDF Modules</option>
                            <option value="text">Text Lessons</option>
                            <option value="other">Other</option>
                        </select>

                        <select
                            value={sortBy}
                            onChange={(e) => {
                                setSortBy(e.target.value);
                                applyFilters({ search, category: categoryFilter, type: typeFilter, sort: e.target.value });
                            }}
                            className="w-full md:w-auto px-3 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:bg-white focus:border-blue-600 focus:outline-none text-slate-700 font-medium cursor-pointer"
                        >
                            <option value="latest">Latest First</option>
                            <option value="popular">Most Popular</option>
                            <option value="title">Alphabetical (A-Z)</option>
                        </select>

                        <button
                            type="submit"
                            className="col-span-2 md:col-span-1 px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-2xs cursor-pointer flex items-center justify-center gap-1.5 transition-colors"
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
                            className="bg-white rounded-2xl border border-slate-200 hover:border-blue-300 shadow-2xs hover:shadow-md transition-all overflow-hidden flex flex-col group"
                        >
                            <div className="relative aspect-video bg-slate-900 flex items-center justify-center overflow-hidden">
                                {res.thumbnail_url ? (
                                    <img src={res.thumbnail_url} alt={res.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                                ) : res.resource_type === 'illustration' && res.file_url ? (
                                    <img src={res.file_url} alt={res.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                                ) : (
                                    <div className="text-slate-400">
                                        {res.resource_type === 'video' ? <Video className="w-10 h-10 text-blue-500" /> :
                                         res.resource_type === 'pdf' ? <FileText className="w-10 h-10 text-emerald-500" /> :
                                         <BookOpen className="w-10 h-10 text-amber-500" />}
                                    </div>
                                )}
                                <span className={`absolute top-2.5 left-2.5 px-2 py-0.5 text-[10px] font-bold uppercase rounded shadow-xs ${
                                    res.resource_type === 'video' ? 'bg-blue-600 text-white' :
                                    res.resource_type === 'illustration' ? 'bg-sky-500 text-white' :
                                    res.resource_type === 'pdf' ? 'bg-emerald-600 text-white' :
                                    'bg-amber-600 text-white'
                                }`}>
                                    {res.resource_type}
                                </span>
                            </div>

                            <div className="p-5 flex-1 flex flex-col justify-between">
                                <div>
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 block mb-1">
                                        {res.category?.name} {res.folder ? `› ${res.folder.name}` : ''}
                                    </span>
                                    <Link
                                        href={`/student/resources/${res.id}`}
                                        className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1 block"
                                    >
                                        {res.title}
                                    </Link>
                                    <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                                        {res.description || 'Curriculum resource material.'}
                                    </p>
                                </div>

                                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                                    <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5" />{res.views_count} views</span>
                                    <span className="font-mono text-[11px]">{res.formatted_file_size}</span>
                                </div>
                            </div>

                            <div className="px-5 py-3 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between">
                                <Link
                                    href={`/student/resources/${res.id}`}
                                    className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 group-hover:translate-x-1 transition-transform"
                                >
                                    Access Resource
                                    <ArrowRight className="w-3.5 h-3.5" />
                                </Link>
                                <a
                                    href={`/student/resources/${res.id}/download`}
                                    className="p-1 text-slate-400 hover:text-blue-600 rounded transition-colors"
                                    title="Download"
                                >
                                    <Download className="w-4 h-4" />
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="p-16 bg-white rounded-2xl border border-slate-200 text-center text-xs text-slate-400">
                    <FolderKanban className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <h3 className="text-sm font-bold text-slate-800">No learning materials found</h3>
                    <p className="mt-1">Try searching with different keywords or choosing another category above.</p>
                </div>
            )}

            <Pagination links={resources.links} />
        </AppLayout>
    );
}
