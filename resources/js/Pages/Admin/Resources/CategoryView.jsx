import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import Pagination from '@/Components/Pagination';
import Modal from '@/Components/Modal';
import {
    Folder,
    FolderPlus,
    Plus,
    Search,
    ChevronRight,
    ArrowLeft,
    Video,
    Image as ImageIcon,
    FileText,
    BookOpen,
    Eye,
    Download,
    Trash2,
    Edit3
} from 'lucide-react';

export default function CategoryView({ category, folders = [], resources = { data: [] }, filters = {} }) {
    const [search, setSearch] = useState(filters.search || '');
    const [isCreateFolderOpen, setIsCreateFolderOpen] = useState(false);
    const [folderForm, setFolderForm] = useState({ name: '', description: '', category_id: category.id });
    const [isSubmittingFolder, setIsSubmittingFolder] = useState(false);

    // Edit Folder Modal
    const [editingFolder, setEditingFolder] = useState(null);
    const [isEditFolderOpen, setIsEditFolderOpen] = useState(false);

    // Delete Folder Confirm
    const [deletingFolder, setDeletingFolder] = useState(null);
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(`/admin/resources/category/${category.slug}`, { search }, { preserveState: true });
    };

    const handleCreateFolder = (e) => {
        e.preventDefault();
        setIsSubmittingFolder(true);
        router.post('/admin/folders', folderForm, {
            onSuccess: () => {
                setIsCreateFolderOpen(false);
                setFolderForm({ name: '', description: '', category_id: category.id });
            },
            onFinish: () => setIsSubmittingFolder(false),
        });
    };

    const handleUpdateFolder = (e) => {
        e.preventDefault();
        if (!editingFolder) return;
        router.put(`/admin/folders/${editingFolder.id}`, {
            name: editingFolder.name,
            description: editingFolder.description,
        }, {
            onSuccess: () => setIsEditFolderOpen(false),
        });
    };

    const handleDeleteFolder = () => {
        if (!deletingFolder) return;
        router.delete(`/admin/folders/${deletingFolder.id}`, {
            onSuccess: () => setIsDeleteConfirmOpen(false),
        });
    };

    return (
        <AppLayout title={`${category.name} — Resources`}>
            <Head title={`${category.name} — CRT F&B Connect`} />

            {/* Breadcrumbs */}
            <nav className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-6">
                <Link href="/admin/resources" className="hover:text-blue-600 transition-colors">
                    Resources
                </Link>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-slate-900 font-bold">{category.name}</span>
            </nav>

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
                <div>
                    <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">{category.name}</h1>
                    <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">{category.description}</p>
                </div>

                <div className="flex items-center gap-2.5">
                    <button
                        onClick={() => setIsCreateFolderOpen(true)}
                        className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl shadow-2xs transition-all"
                    >
                        <FolderPlus className="w-4 h-4 text-blue-600" />
                        Create Folder
                    </button>
                    <Link
                        href="/admin/resources/create"
                        className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm transition-all"
                    >
                        <Plus className="w-4 h-4" />
                        Upload to {category.name}
                    </Link>
                </div>
            </div>

            {/* Folders in this Category */}
            <div className="mb-10">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                        <Folder className="w-5 h-5 text-blue-600" />
                        Dedicated Learning Folders ({folders.length})
                    </h3>
                </div>

                {folders.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {folders.map((folder) => (
                            <div
                                key={folder.id}
                                className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-blue-300 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between group"
                            >
                                <div>
                                    <div className="flex items-start justify-between gap-2 mb-2">
                                        <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 group-hover:scale-105 transition-transform">
                                            <Folder className="w-5 h-5" />
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <button
                                                onClick={() => {
                                                    setEditingFolder({ ...folder });
                                                    setIsEditFolderOpen(true);
                                                }}
                                                className="p-1 text-slate-400 hover:text-slate-600 rounded"
                                                title="Rename / Edit"
                                            >
                                                <Edit3 className="w-3.5 h-3.5" />
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setDeletingFolder(folder);
                                                    setIsDeleteConfirmOpen(true);
                                                }}
                                                className="p-1 text-slate-400 hover:text-rose-600 rounded"
                                                title="Delete Folder"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    </div>

                                    <Link
                                        href={`/admin/resources/folder/${folder.id}`}
                                        className="text-sm font-bold text-slate-900 hover:text-blue-600 transition-colors block"
                                    >
                                        {folder.name}
                                    </Link>
                                    <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                                        {folder.description || 'Curriculum unit module folder.'}
                                    </p>
                                </div>

                                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                                    <span className="font-semibold text-slate-500">
                                        {folder.resources_count} {folder.resources_count === 1 ? 'material' : 'materials'}
                                    </span>
                                    <Link
                                        href={`/admin/resources/folder/${folder.id}`}
                                        className="font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
                                    >
                                        Open Folder
                                        <ChevronRight className="w-3.5 h-3.5" />
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="p-6 bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-center text-xs text-slate-400">
                        No folders created yet in this category. You can create subfolders to categorize learning units.
                    </div>
                )}
            </div>

            {/* Direct Category Resources Section */}
            <div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                    <h3 className="text-base font-bold text-slate-900">
                        All Resources in {category.name}
                    </h3>

                    <form onSubmit={handleSearch} className="flex items-center gap-2">
                        <div className="relative">
                            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search this category..."
                                className="pl-9 pr-3 py-1.5 text-xs bg-white rounded-xl border border-slate-200 focus:outline-none focus:border-blue-600 w-48 sm:w-64"
                            />
                        </div>
                        <button type="submit" className="px-3 py-1.5 text-xs font-bold text-white bg-blue-600 rounded-xl">
                            Filter
                        </button>
                    </form>
                </div>

                {resources.data && resources.data.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                        {resources.data.map((res) => (
                            <div
                                key={res.id}
                                className="bg-white rounded-2xl border border-slate-200 shadow-2xs hover:shadow-md transition-all overflow-hidden flex flex-col group"
                            >
                                <div className="relative aspect-video bg-slate-900 flex items-center justify-center overflow-hidden">
                                    {res.thumbnail_url ? (
                                        <img src={res.thumbnail_url} alt={res.title} className="w-full h-full object-cover" />
                                    ) : res.resource_type === 'illustration' && res.file_url ? (
                                        <img src={res.file_url} alt={res.title} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="text-slate-400">
                                            {res.resource_type === 'video' ? <Video className="w-10 h-10 text-blue-500" /> :
                                             res.resource_type === 'pdf' ? <FileText className="w-10 h-10 text-emerald-500" /> :
                                             <BookOpen className="w-10 h-10 text-amber-500" />}
                                        </div>
                                    )}
                                    <span className="absolute top-2.5 left-2.5 px-2 py-0.5 text-[10px] font-bold uppercase rounded bg-blue-600 text-white">
                                        {res.resource_type}
                                    </span>
                                </div>

                                <div className="p-5 flex-1 flex flex-col justify-between">
                                    <div>
                                        <Link
                                            href={`/admin/resources/${res.id}`}
                                            className="text-sm font-bold text-slate-900 hover:text-blue-600 line-clamp-1"
                                        >
                                            {res.title}
                                        </Link>
                                        <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                                            {res.description || 'No description provided.'}
                                        </p>
                                    </div>
                                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400 font-medium">
                                        <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5" />{res.views_count}</span>
                                        <span className="flex items-center gap-1"><Download className="w-3.5 h-3.5" />{res.downloads_count}</span>
                                        <span className="font-mono text-[11px]">{res.formatted_file_size}</span>
                                    </div>
                                </div>

                                <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                                    <Link
                                        href={`/admin/resources/${res.id}`}
                                        className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1"
                                    >
                                        View Resource
                                        <ChevronRight className="w-3.5 h-3.5" />
                                    </Link>
                                    <Link
                                        href={`/admin/resources/${res.id}/edit`}
                                        className="text-xs text-slate-400 hover:text-slate-600"
                                    >
                                        <Edit3 className="w-3.5 h-3.5" />
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="p-12 bg-white rounded-2xl border border-slate-200 text-center text-xs text-slate-400">
                        No resources uploaded in this category yet.
                    </div>
                )}

                <Pagination links={resources.links} />
            </div>

            {/* Create Folder Modal */}
            <Modal
                isOpen={isCreateFolderOpen}
                onClose={() => setIsCreateFolderOpen(false)}
                title={`New Folder in ${category.name}`}
            >
                <form onSubmit={handleCreateFolder} className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                            Folder Name
                        </label>
                        <input
                            type="text"
                            value={folderForm.name}
                            onChange={(e) => setFolderForm({ ...folderForm, name: e.target.value })}
                            placeholder="e.g. Dining Room Operations & Safety"
                            className="w-full px-3.5 py-2 text-sm bg-white rounded-xl border border-slate-200 focus:border-blue-600 focus:outline-none"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                            Description
                        </label>
                        <textarea
                            value={folderForm.description}
                            onChange={(e) => setFolderForm({ ...folderForm, description: e.target.value })}
                            rows={3}
                            placeholder="Folder curriculum scope or description..."
                            className="w-full px-3.5 py-2 text-xs bg-white rounded-xl border border-slate-200 focus:border-blue-600 focus:outline-none"
                        />
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                        <button
                            type="button"
                            onClick={() => setIsCreateFolderOpen(false)}
                            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmittingFolder}
                            className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl"
                        >
                            {isSubmittingFolder ? 'Creating...' : 'Create Folder'}
                        </button>
                    </div>
                </form>
            </Modal>

            {/* Edit Folder Modal */}
            <Modal
                isOpen={isEditFolderOpen}
                onClose={() => setIsEditFolderOpen(false)}
                title="Edit Folder Details"
            >
                {editingFolder && (
                    <form onSubmit={handleUpdateFolder} className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                                Folder Name
                            </label>
                            <input
                                type="text"
                                value={editingFolder.name}
                                onChange={(e) => setEditingFolder({ ...editingFolder, name: e.target.value })}
                                className="w-full px-3.5 py-2 text-sm bg-white rounded-xl border border-slate-200 focus:border-blue-600 focus:outline-none"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                                Description
                            </label>
                            <textarea
                                value={editingFolder.description || ''}
                                onChange={(e) => setEditingFolder({ ...editingFolder, description: e.target.value })}
                                rows={3}
                                className="w-full px-3.5 py-2 text-xs bg-white rounded-xl border border-slate-200 focus:border-blue-600 focus:outline-none"
                            />
                        </div>

                        <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                            <button
                                type="button"
                                onClick={() => setIsEditFolderOpen(false)}
                                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl"
                            >
                                Save Changes
                            </button>
                        </div>
                    </form>
                )}
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal
                isOpen={isDeleteConfirmOpen}
                onClose={() => setIsDeleteConfirmOpen(false)}
                title="Confirm Folder Deletion"
            >
                <div className="space-y-4">
                    <p className="text-xs text-slate-600 leading-relaxed">
                        Are you sure you want to delete folder <strong className="text-slate-900">{deletingFolder?.name}</strong>? Any resources assigned to this folder will be unlinked but kept safely in the category library.
                    </p>
                    <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                        <button
                            type="button"
                            onClick={() => setIsDeleteConfirmOpen(false)}
                            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={handleDeleteFolder}
                            className="px-5 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl"
                        >
                            Yes, Delete Folder
                        </button>
                    </div>
                </div>
            </Modal>
        </AppLayout>
    );
}
