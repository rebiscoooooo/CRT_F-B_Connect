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
                    <h1 className="text-xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                        Educational Resources Management
                    </h1>
                    <p className="text-xs sm:text-sm text-slate-500 mt-1">
                        Organize curriculum folders, upload masterclass videos, PDF modules, and visual aids.
                    </p>
                </div>

                <div className="grid grid-cols-2 sm:flex sm:items-center gap-2 sm:gap-2.5 w-full sm:w-auto shrink-0">
                    <button
                        onClick={() => setIsFolderModalOpen(true)}
                        className="inline-flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2.5 text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl shadow-2xs transition-all text-center cursor-pointer"
                    >
                        <FolderPlus className="w-4 h-4 text-blue-600 shrink-0" />
                        <span>New Folder</span>
                    </button>
                    <Link
                        href="/admin/resources/create"
                        className="inline-flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm shadow-blue-500/20 hover:shadow-md transition-all text-center"
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
                                    ? 'bg-blue-50/70 border-blue-400 shadow-sm'
                                    : 'bg-white border-slate-200 hover:border-blue-300 hover:shadow-sm'
                            }`}
                            onClick={() => handleCategoryChange(isSelected ? '' : cat.slug)}
                        >
                            <div>
                                <div className="flex items-center justify-between mb-3">
                                    <div className={`p-2.5 rounded-xl ${isSelected ? 'bg-blue-600 text-white' : 'bg-blue-50 text-blue-600'} group-hover:scale-105 transition-transform`}>
                                        <IconComponent className="w-5 h-5" />
                                    </div>
                                    <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                                        {cat.resources_count}
                                    </span>
                                </div>
                                <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                                    {cat.name}
                                </h3>
                                <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                                    {cat.description}
                                </p>
                            </div>

                            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                                <Link
                                    href={`/admin/resources/category/${cat.slug}`}
                                    onClick={(e) => e.stopPropagation()}
                                    className="text-[11px] font-bold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1"
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
            <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200 shadow-2xs mb-6 min-w-0">
                <form onSubmit={handleSearch} className="flex flex-col lg:flex-row items-stretch lg:items-center gap-2.5 sm:gap-3">
                    <div className="relative flex-1 min-w-0 w-full">
                        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search resources by title, description, or keyword..."
                            className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:bg-white focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20 transition-all"
                        />
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:flex lg:items-center gap-2 w-full lg:w-auto">
                        {/* Type filter */}
                        <select
                            value={typeFilter}
                            onChange={(e) => handleTypeChange(e.target.value)}
                            className="w-full lg:w-auto px-3 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:bg-white focus:border-blue-600 focus:outline-none text-slate-700 font-medium cursor-pointer"
                        >
                            <option value="">All Types</option>
                            <option value="video">Video Lessons</option>
                            <option value="illustration">Illustrations</option>
                            <option value="pdf">PDF Modules</option>
                            <option value="text">Text Lessons</option>
                            <option value="other">Other Materials</option>
                        </select>

                        {/* Visibility filter */}
                        <select
                            value={visibilityFilter}
                            onChange={(e) => {
                                setVisibilityFilter(e.target.value);
                                applyFilters({ search, category: categoryFilter, type: typeFilter, visibility: e.target.value, sort: sortBy });
                            }}
                            className="w-full lg:w-auto px-3 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:bg-white focus:border-blue-600 focus:outline-none text-slate-700 font-medium cursor-pointer"
                        >
                            <option value="">All Statuses</option>
                            <option value="published">Published</option>
                            <option value="draft">Draft</option>
                            <option value="archived">Archived</option>
                        </select>

                        {/* Sort */}
                        <select
                            value={sortBy}
                            onChange={(e) => {
                                setSortBy(e.target.value);
                                applyFilters({ search, category: categoryFilter, type: typeFilter, visibility: visibilityFilter, sort: e.target.value });
                            }}
                            className="col-span-2 sm:col-span-1 lg:w-auto px-3 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:bg-white focus:border-blue-600 focus:outline-none text-slate-700 font-medium cursor-pointer"
                        >
                            <option value="latest">Latest First</option>
                            <option value="oldest">Oldest First</option>
                            <option value="title">Alphabetical (A-Z)</option>
                            <option value="views">Most Viewed</option>
                            <option value="downloads">Most Downloaded</option>
                        </select>

                        <button
                            type="submit"
                            className="col-span-2 lg:col-span-1 px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-2xs transition-colors cursor-pointer flex items-center justify-center gap-1.5"
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
                            className="bg-white rounded-2xl border border-slate-200 hover:border-blue-300 shadow-2xs hover:shadow-md transition-all overflow-hidden flex flex-col group"
                        >
                            {/* Card Media Preview Header */}
                            <div className="relative aspect-video bg-slate-900 overflow-hidden flex items-center justify-center">
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
                                    <div className="text-slate-500 flex flex-col items-center">
                                        {res.resource_type === 'video' ? <Video className="w-10 h-10 text-blue-500" /> :
                                         res.resource_type === 'pdf' ? <FileText className="w-10 h-10 text-emerald-500" /> :
                                         res.resource_type === 'text' ? <BookOpen className="w-10 h-10 text-amber-500" /> :
                                         <Folder className="w-10 h-10 text-slate-400" />}
                                    </div>
                                )}

                                <span className={`absolute top-2.5 left-2.5 px-2.5 py-0.5 text-[10px] font-bold uppercase rounded-md shadow-xs ${
                                    res.resource_type === 'video' ? 'bg-blue-600 text-white' :
                                    res.resource_type === 'illustration' ? 'bg-sky-500 text-white' :
                                    res.resource_type === 'pdf' ? 'bg-emerald-600 text-white' :
                                    'bg-amber-600 text-white'
                                }`}>
                                    {res.resource_type}
                                </span>

                                <span className={`absolute top-2.5 right-2.5 px-2 py-0.5 text-[10px] font-bold rounded-md uppercase tracking-wider backdrop-blur-md ${
                                    res.visibility === 'published' ? 'bg-emerald-500/90 text-white' : 'bg-slate-700/90 text-white'
                                }`}>
                                    {res.visibility}
                                </span>
                            </div>

                            {/* Content */}
                            <div className="p-5 flex-1 flex flex-col justify-between">
                                <div>
                                    <div className="text-[11px] font-semibold text-blue-600 uppercase tracking-wider mb-1 truncate">
                                        {res.category?.name} {res.folder ? `› ${res.folder.name}` : ''}
                                    </div>
                                    <Link
                                        href={`/admin/resources/${res.id}`}
                                        className="text-sm font-bold text-slate-900 hover:text-blue-600 transition-colors line-clamp-1 block"
                                    >
                                        {res.title}
                                    </Link>
                                    <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                                        {res.description || 'No description provided.'}
                                    </p>
                                </div>

                                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400 font-medium">
                                    <span className="flex items-center gap-1">
                                        <Eye className="w-3.5 h-3.5" />
                                        {res.views_count}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Download className="w-3.5 h-3.5" />
                                        {res.downloads_count}
                                    </span>
                                    <span className="text-[11px] font-mono">
                                        {res.formatted_file_size}
                                    </span>
                                </div>
                            </div>

                            {/* Action Bar */}
                            <div className="px-5 py-3 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between">
                                <Link
                                    href={`/admin/resources/${res.id}`}
                                    className="text-xs font-bold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1"
                                >
                                    View Details
                                    <ArrowRight className="w-3.5 h-3.5" />
                                </Link>
                                <div className="flex items-center gap-1">
                                    <Link
                                        href={`/admin/resources/${res.id}/edit`}
                                        className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 rounded"
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
                <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center my-6">
                    <FolderKanban className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <h3 className="text-base font-bold text-slate-800">No resources found</h3>
                    <p className="text-xs text-slate-500 mt-1">
                        Try adjusting your search filters or upload a new educational material.
                    </p>
                    <div className="mt-5">
                        <Link
                            href="/admin/resources/create"
                            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-blue-600 rounded-xl hover:bg-blue-700"
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
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                            Resource Category
                        </label>
                        <select
                            value={folderForm.category_id}
                            onChange={(e) => setFolderForm({ ...folderForm, category_id: e.target.value })}
                            className="w-full px-3.5 py-2 text-xs bg-white rounded-xl border border-slate-200 focus:border-blue-600 focus:outline-none"
                            required
                        >
                            {categories.map((c) => (
                                <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                            Folder Name
                        </label>
                        <input
                            type="text"
                            value={folderForm.name}
                            onChange={(e) => setFolderForm({ ...folderForm, name: e.target.value })}
                            placeholder="e.g. Fine Dining Table Setting Masterclass"
                            className="w-full px-3.5 py-2 text-sm bg-white rounded-xl border border-slate-200 focus:border-blue-600 focus:outline-none"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                            Description <span className="text-slate-400 font-normal text-[10px]">(Optional)</span>
                        </label>
                        <textarea
                            value={folderForm.description}
                            onChange={(e) => setFolderForm({ ...folderForm, description: e.target.value })}
                            rows={3}
                            placeholder="Briefly describe the contents or learning objective of this folder..."
                            className="w-full px-3.5 py-2 text-xs bg-white rounded-xl border border-slate-200 focus:border-blue-600 focus:outline-none"
                        />
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                        <button
                            type="button"
                            onClick={() => setIsFolderModalOpen(false)}
                            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isCreatingFolder}
                            className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm"
                        >
                            {isCreatingFolder ? 'Creating...' : 'Create Folder'}
                        </button>
                    </div>
                </form>
            </Modal>
        </AppLayout>
    );
}
