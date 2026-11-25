import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import Pagination from '@/Components/Pagination';
import Modal from '@/Components/Modal';
import {
    FolderKanban,
    Search,
    Filter,
    Plus,
    Video,
    Image as ImageIcon,
    FileText,
    BookOpen,
    Folder,
    FolderPlus,
    Eye,
    Download,
    ArrowRight,
    MoreVertical,
    SlidersHorizontal,
    Trash2,
    Edit3
} from 'lucide-react';

export default function ResourceIndex({ categories = [], resources = { data: [] }, filters = {}, folders = [] }) {
    const [search, setSearch] = useState(filters.search || '');
    const [categoryFilter, setCategoryFilter] = useState(filters.category || '');
    const [typeFilter, setTypeFilter] = useState(filters.type || '');
    const [visibilityFilter, setVisibilityFilter] = useState(filters.visibility || '');
    const [sortBy, setSortBy] = useState(filters.sort || 'latest');

    // Create Folder Modal State
    const [isFolderModalOpen, setIsFolderModalOpen] = useState(false);
    const [folderForm, setFolderForm] = useState({
        name: '',
        description: '',
        category_id: categories[0]?.id || '',
    });
    const [isCreatingFolder, setIsCreatingFolder] = useState(false);

    const handleSearch = (e) => {
        e.preventDefault();
        applyFilters({ search, category: categoryFilter, type: typeFilter, visibility: visibilityFilter, sort: sortBy });
    };

    const applyFilters = (newFilters) => {
        router.get('/admin/resources', newFilters, {
            preserveState: true,
            replace: true,
        });
    };

    const handleCategoryChange = (slug) => {
        setCategoryFilter(slug);
        applyFilters({ search, category: slug, type: typeFilter, visibility: visibilityFilter, sort: sortBy });
    };

    const handleTypeChange = (type) => {
        setTypeFilter(type);
        applyFilters({ search, category: categoryFilter, type, visibility: visibilityFilter, sort: sortBy });
    };

    const handleCreateFolder = (e) => {
        e.preventDefault();
        setIsCreatingFolder(true);
        router.post('/admin/folders', folderForm, {
            onSuccess: () => {
                setIsFolderModalOpen(false);
                setFolderForm({ name: '', description: '', category_id: categories[0]?.id || '' });
            },
            onFinish: () => setIsCreatingFolder(false),
        });
    };

    const categoryIcons = {
        'video-lessons': Video,
        'illustrations': ImageIcon,
        'pdf-modules': FileText,
        'text-lessons': BookOpen,
        'other-materials': Folder,
    };

    return (
        <AppLayout title="Resource Management">
            <Head title="Resources — CRT F&B Connect" />

            {/* Top Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8 min-w-0">
                <div className="min-w-0">
                    <h1 className="text-xl sm:text-3xl font-black text-[#F4FBFC] tracking-tight">
                        Educational Resources Management
                    </h1>
                    <p className="text-xs sm:text-sm text-[#A8E6E8]/70 mt-1">
                        Organize curriculum folders, upload masterclass videos, PDF modules, and visual aids.
                    </p>
                </div>

                <div className="grid grid-cols-2 sm:flex sm:items-center gap-2 sm:gap-2.5 w-full sm:w-auto shrink-0">
                    <button
                        onClick={() => setIsFolderModalOpen(true)}
                        className="cyber-oauth-btn inline-flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2.5 text-xs font-bold rounded-xl text-center cursor-pointer"
                    >
                        <FolderPlus className="w-4 h-4 text-[#2EC4D6] shrink-0" />
                        <span>New Folder</span>
                    </button>
                    <Link
                        href="/admin/resources/create"
                        className="cyber-glow-btn inline-flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2.5 text-xs font-bold rounded-xl text-center cursor-pointer"
                    >
                        <Plus className="w-4 h-4 shrink-0" />
                        <span>Add Resource</span>
                    </Link>
                </div>
            </div>

            {/* Category Cards Carousel / Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
                {categories.map((cat) => {
                    const IconComponent = categoryIcons[cat.slug] || Folder;
                    const isSelected = categoryFilter === cat.slug;
                    return (
                        <div
                            key={cat.id}
                            className={`p-5 rounded-2xl border transition-all cursor-pointer relative group flex flex-col justify-between ${
                                isSelected
                                    ? 'bg-[#0B6E8A]/40 border-[#2EC4D6] shadow-lg shadow-[#2EC4D6]/20 ring-1 ring-[#2EC4D6]/40 text-[#F4FBFC]'
                                    : 'cyber-glass-card cyber-glass-card-hover'
                            }`}
                            onClick={() => handleCategoryChange(isSelected ? '' : cat.slug)}
                        >
                            <div>
                                <div className="flex items-center justify-between mb-3">
                                    <div className={`p-2.5 rounded-xl border ${
                                        isSelected
                                            ? 'bg-[#2EC4D6] text-[#061923] border-[#2EC4D6]'
                                            : 'bg-[#0B6E8A]/30 text-[#2EC4D6] border-[#A8E6E8]/20'
                                    } group-hover:scale-105 transition-transform`}>
                                        <IconComponent className="w-5 h-5" />
                                    </div>
                                    <span className="text-xs font-bold text-[#A8E6E8] bg-[#0B6E8A]/40 border border-[#A8E6E8]/20 px-2 py-0.5 rounded-full">
                                        {cat.resources_count}
                                    </span>
                                </div>
                                <h3 className="text-sm font-bold text-[#F4FBFC] group-hover:text-[#2EC4D6] transition-colors">
                                    {cat.name}
                                </h3>
                                <p className="text-[11px] text-[#A8E6E8]/70 mt-1 line-clamp-2 leading-relaxed">
                                    {cat.description}
                                </p>
                            </div>

                            <div className="mt-4 pt-3 border-t border-[#A8E6E8]/15 flex items-center justify-between">
                                <Link
                                    href={`/admin/resources/category/${cat.slug}`}
                                    onClick={(e) => e.stopPropagation()}
                                    className="text-[11px] font-bold text-[#2EC4D6] hover:text-[#A8E6E8] inline-flex items-center gap-1 transition-colors"
                                >
                                    Browse Folders ({cat.folders_count})
                                    <ArrowRight className="w-3 h-3" />
                                </Link>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Search and Filters Bar */}
            <div className="cyber-glass-card p-3.5 sm:p-4 mb-6 min-w-0">
                <form onSubmit={handleSearch} className="flex flex-col lg:flex-row items-stretch lg:items-center gap-2.5 sm:gap-3">
                    <div className="relative flex-1 min-w-0 w-full">
                        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A8E6E8]/50 pointer-events-none" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search resources by title, description, or keyword..."
                            className="cyber-glass-input w-full pl-10 pr-4 py-2 text-xs rounded-xl"
                        />
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:flex lg:items-center gap-2 w-full lg:w-auto">
                        {/* Type filter */}
                        <select
                            value={typeFilter}
                            onChange={(e) => handleTypeChange(e.target.value)}
                            className="cyber-glass-input w-full lg:w-auto px-3 py-2 text-xs rounded-xl cursor-pointer"
                        >
                            <option value="" className="bg-[#061923] text-[#F4FBFC]">All Types</option>
                            <option value="video" className="bg-[#061923] text-[#F4FBFC]">Video Lessons</option>
                            <option value="illustration" className="bg-[#061923] text-[#F4FBFC]">Illustrations</option>
                            <option value="pdf" className="bg-[#061923] text-[#F4FBFC]">PDF Modules</option>
                            <option value="text" className="bg-[#061923] text-[#F4FBFC]">Text Lessons</option>
                            <option value="other" className="bg-[#061923] text-[#F4FBFC]">Other Materials</option>
                        </select>

                        {/* Visibility filter */}
                        <select
                            value={visibilityFilter}
                            onChange={(e) => {
                                setVisibilityFilter(e.target.value);
                                applyFilters({ search, category: categoryFilter, type: typeFilter, visibility: e.target.value, sort: sortBy });
                            }}
                            className="cyber-glass-input w-full lg:w-auto px-3 py-2 text-xs rounded-xl cursor-pointer"
                        >
                            <option value="" className="bg-[#061923] text-[#F4FBFC]">All Statuses</option>
                            <option value="published" className="bg-[#061923] text-[#F4FBFC]">Published</option>
                            <option value="draft" className="bg-[#061923] text-[#F4FBFC]">Draft</option>
                            <option value="archived" className="bg-[#061923] text-[#F4FBFC]">Archived</option>
                        </select>

                        {/* Sort */}
                        <select
                            value={sortBy}
                            onChange={(e) => {
                                setSortBy(e.target.value);
                                applyFilters({ search, category: categoryFilter, type: typeFilter, visibility: visibilityFilter, sort: e.target.value });
                            }}
                            className="cyber-glass-input col-span-2 sm:col-span-1 lg:w-auto px-3 py-2 text-xs rounded-xl cursor-pointer"
                        >
                            <option value="latest" className="bg-[#061923] text-[#F4FBFC]">Latest First</option>
                            <option value="oldest" className="bg-[#061923] text-[#F4FBFC]">Oldest First</option>
                            <option value="title" className="bg-[#061923] text-[#F4FBFC]">Alphabetical (A-Z)</option>
                            <option value="views" className="bg-[#061923] text-[#F4FBFC]">Most Viewed</option>
                            <option value="downloads" className="bg-[#061923] text-[#F4FBFC]">Most Downloaded</option>
                        </select>

                        <button
                            type="submit"
                            className="cyber-glow-btn col-span-2 lg:col-span-1 px-4 py-2 text-xs font-bold rounded-xl cursor-pointer flex items-center justify-center gap-1.5"
                        >
                            <Search className="w-3.5 h-3.5 sm:hidden" />
                            <span>Filter</span>
                        </button>
                    </div>
                </form>
            </div>

            {/* Resources Grid / Cards */}
            {resources.data && resources.data.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                    {resources.data.map((res) => (
                        <div
                            key={res.id}
                            className="cyber-glass-card cyber-glass-card-hover overflow-hidden flex flex-col group"
                        >
                            {/* Card Media Preview Header */}
                            <div className="relative aspect-video bg-[#061923] overflow-hidden flex items-center justify-center border-b border-[#A8E6E8]/15">
                                {res.thumbnail_url ? (
                                    <img
                                        src={res.thumbnail_url}
                                        alt={res.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                ) : res.resource_type === 'illustration' && res.file_url ? (
                                    <img
                                        src={res.file_url}
                                        alt={res.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                ) : (
                                    <div className="text-[#A8E6E8]/40 flex flex-col items-center">
                                        {res.resource_type === 'video' ? <Video className="w-10 h-10 text-[#2EC4D6]" /> :
                                         res.resource_type === 'pdf' ? <FileText className="w-10 h-10 text-emerald-400" /> :
                                         res.resource_type === 'text' ? <BookOpen className="w-10 h-10 text-amber-400" /> :
                                         <Folder className="w-10 h-10 text-[#A8E6E8]/50" />}
                                    </div>
                                )}

                                <span className={`absolute top-2.5 left-2.5 px-2.5 py-0.5 text-[10px] font-bold uppercase rounded-md shadow-md border ${
                                    res.resource_type === 'video' ? 'bg-[#0B6E8A]/90 text-[#F4FBFC] border-[#2EC4D6]/40' :
                                    res.resource_type === 'illustration' ? 'bg-sky-500/90 text-white border-sky-400/40' :
                                    res.resource_type === 'pdf' ? 'bg-emerald-600/90 text-white border-emerald-400/40' :
                                    'bg-amber-600/90 text-white border-amber-400/40'
                                }`}>
                                    {res.resource_type}
                                </span>

                                <span className={`absolute top-2.5 right-2.5 px-2 py-0.5 text-[10px] font-bold rounded-md uppercase tracking-wider backdrop-blur-md border ${
                                    res.visibility === 'published'
                                        ? 'bg-emerald-500/25 text-emerald-300 border-emerald-500/30'
                                        : 'bg-[#061923]/80 text-[#A8E6E8]/70 border-[#A8E6E8]/20'
                                }`}>
                                    {res.visibility}
                                </span>
                            </div>

                            {/* Content */}
                            <div className="p-5 flex-1 flex flex-col justify-between">
                                <div>
                                    <div className="text-[11px] font-semibold text-[#2EC4D6] uppercase tracking-wider mb-1 truncate">
                                        {res.category?.name} {res.folder ? `› ${res.folder.name}` : ''}
                                    </div>
                                    <Link
                                        href={`/admin/resources/${res.id}`}
                                        className="text-sm font-bold text-[#F4FBFC] hover:text-[#2EC4D6] transition-colors line-clamp-1 block"
                                    >
                                        {res.title}
                                    </Link>
                                    <p className="text-xs text-[#A8E6E8]/70 mt-1 line-clamp-2 leading-relaxed">
                                        {res.description || 'No description provided.'}
                                    </p>
                                </div>

                                <div className="mt-4 pt-3 border-t border-[#A8E6E8]/15 flex items-center justify-between text-xs text-[#A8E6E8]/70 font-medium">
                                    <span className="flex items-center gap-1">
                                        <Eye className="w-3.5 h-3.5 text-[#2EC4D6]" />
                                        {res.views_count}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Download className="w-3.5 h-3.5 text-[#2EC4D6]" />
                                        {res.downloads_count}
                                    </span>
                                    <span className="text-[11px] font-mono text-[#A8E6E8]">
                                        {res.formatted_file_size}
                                    </span>
                                </div>
                            </div>

                            {/* Action Bar */}
                            <div className="px-5 py-3 bg-[#061923]/60 border-t border-[#A8E6E8]/15 flex items-center justify-between">
                                <Link
                                    href={`/admin/resources/${res.id}`}
                                    className="text-xs font-bold text-[#2EC4D6] hover:text-[#A8E6E8] inline-flex items-center gap-1 transition-colors"
                                >
                                    View Details
                                    <ArrowRight className="w-3.5 h-3.5" />
                                </Link>
                                <div className="flex items-center gap-1">
                                    <Link
                                        href={`/admin/resources/${res.id}/edit`}
                                        className="p-1 text-[#A8E6E8] hover:text-[#2EC4D6] hover:bg-[#0B6E8A]/30 rounded transition-colors"
                                        title="Edit"
                                    >
                                        <Edit3 className="w-3.5 h-3.5" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="cyber-glass-card p-12 text-center my-6">
                    <FolderKanban className="w-12 h-12 text-[#A8E6E8]/30 mx-auto mb-3" />
                    <h3 className="text-base font-bold text-[#F4FBFC]">No resources found</h3>
                    <p className="text-xs text-[#A8E6E8]/70 mt-1">
                        Try adjusting your search filters or upload a new educational material.
                    </p>
                    <div className="mt-5">
                        <Link
                            href="/admin/resources/create"
                            className="cyber-glow-btn inline-flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl"
                        >
                            <Plus className="w-4 h-4" />
                            Upload First Resource
                        </Link>
                    </div>
                </div>
            )}

            {/* Pagination */}
            <Pagination links={resources.links} />

            {/* Modal: Create Folder */}
            <Modal
                isOpen={isFolderModalOpen}
                onClose={() => setIsFolderModalOpen(false)}
                title="Create Educational Resource Folder"
            >
                <form onSubmit={handleCreateFolder} className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-[#A8E6E8] uppercase tracking-wider mb-1">
                            Resource Category
                        </label>
                        <select
                            value={folderForm.category_id}
                            onChange={(e) => setFolderForm({ ...folderForm, category_id: e.target.value })}
                            className="cyber-glass-input w-full px-3.5 py-2 text-xs rounded-xl"
                            required
                        >
                            {categories.map((c) => (
                                <option key={c.id} value={c.id} className="bg-[#061923] text-[#F4FBFC]">{c.name}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-[#A8E6E8] uppercase tracking-wider mb-1">
                            Folder Name
                        </label>
                        <input
                            type="text"
                            value={folderForm.name}
                            onChange={(e) => setFolderForm({ ...folderForm, name: e.target.value })}
                            placeholder="e.g. Fine Dining Table Setting Masterclass"
                            className="cyber-glass-input w-full px-3.5 py-2 text-sm rounded-xl"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-[#A8E6E8] uppercase tracking-wider mb-1">
                            Description <span className="text-[#A8E6E8]/50 font-normal text-[10px]">(Optional)</span>
                        </label>
                        <textarea
                            value={folderForm.description}
                            onChange={(e) => setFolderForm({ ...folderForm, description: e.target.value })}
                            rows={3}
                            placeholder="Briefly describe the contents or learning objective of this folder..."
                            className="cyber-glass-input w-full px-3.5 py-2 text-xs rounded-xl"
                        />
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#A8E6E8]/15">
                        <button
                            type="button"
                            onClick={() => setIsFolderModalOpen(false)}
                            className="cyber-oauth-btn px-4 py-2 text-xs font-semibold rounded-xl"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isCreatingFolder}
                            className="cyber-glow-btn px-5 py-2 text-xs font-bold rounded-xl"
                        >
                            {isCreatingFolder ? 'Creating...' : 'Create Folder'}
                        </button>
                    </div>
                </form>
            </Modal>
        </AppLayout>
    );
}
