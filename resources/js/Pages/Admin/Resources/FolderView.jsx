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

export default function FolderView({ folder, subfolders = [], resources = { data: [] }, filters = {} }) {
    const [search, setSearch] = useState(filters.search || '');
    const [isCreateSubfolderOpen, setIsCreateSubfolderOpen] = useState(false);
    const [subfolderForm, setSubfolderForm] = useState({
        name: '',
        description: '',
        category_id: folder.category_id,
        parent_id: folder.id,
    });
    const [isSubmittingSubfolder, setIsSubmittingSubfolder] = useState(false);

    // Edit Folder
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [editForm, setEditForm] = useState({ name: folder.name, description: folder.description || '' });

    // Delete Folder
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(`/admin/resources/folder/${folder.id}`, { search }, { preserveState: true });
    };

    const handleCreateSubfolder = (e) => {
        e.preventDefault();
        setIsSubmittingSubfolder(true);
        router.post('/admin/folders', subfolderForm, {
            onSuccess: () => {
                setIsCreateSubfolderOpen(false);
                setSubfolderForm({ name: '', description: '', category_id: folder.category_id, parent_id: folder.id });
            },
            onFinish: () => setIsSubmittingSubfolder(false),
        });
    };

    const handleUpdateFolder = (e) => {
        e.preventDefault();
        router.put(`/admin/folders/${folder.id}`, editForm, {
            onSuccess: () => setIsEditOpen(false),
        });
    };

    const handleDeleteFolder = () => {
        router.delete(`/admin/folders/${folder.id}`);
    };

    return (
        <AppLayout title={`${folder.name} — Folder`}>
            <Head title={`${folder.name} — CRT F&B Connect`} />

            {/* Breadcrumb Navigation Flow */}
            <nav className="flex items-center gap-2 text-xs font-semibold text-[#A8E6E8]/70 mb-6 flex-wrap">
                <Link href="/admin/resources" className="hover:text-[#2EC4D6] transition-colors">
                    Resources
                </Link>
                <ChevronRight className="w-3.5 h-3.5 text-[#A8E6E8]/40" />
                <Link href={`/admin/resources/category/${folder.category?.slug}`} className="hover:text-[#2EC4D6] transition-colors">
                    {folder.category?.name}
                </Link>
                {folder.parent && (
                    <>
                        <ChevronRight className="w-3.5 h-3.5 text-[#A8E6E8]/40" />
                        <Link href={`/admin/resources/folder/${folder.parent.id}`} className="hover:text-[#2EC4D6] transition-colors">
                            {folder.parent.name}
                        </Link>
                    </>
                )}
                <ChevronRight className="w-3.5 h-3.5 text-[#A8E6E8]/40" />
                <span className="text-[#F4FBFC] font-bold">{folder.name}</span>
            </nav>

            {/* Folder Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 cyber-glass-card p-6">
                <div>
                    <div className="flex items-center gap-2 text-xs font-bold uppercase text-[#2EC4D6] mb-1">
                        <Folder className="w-4 h-4" />
                        <span>Curriculum Folder</span>
                    </div>
                    <h1 className="text-2xl font-black text-[#F4FBFC] tracking-tight">{folder.name}</h1>
                    <p className="text-xs sm:text-sm text-[#A8E6E8]/70 mt-1 max-w-2xl">
                        {folder.description || 'No description provided for this folder.'}
                    </p>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                    <button
                        onClick={() => setIsEditOpen(true)}
                        className="cyber-oauth-btn inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl cursor-pointer"
                    >
                        <Edit3 className="w-3.5 h-3.5 text-[#2EC4D6]" />
                        Edit Folder
                    </button>
                    <button
                        onClick={() => setIsDeleteOpen(true)}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-rose-300 bg-rose-500/15 border border-rose-500/30 hover:bg-rose-500/25 rounded-xl transition-colors cursor-pointer"
                    >
                        <Trash2 className="w-3.5 h-3.5" />
                        Delete
                    </button>
                    <Link
                        href={`/admin/resources/create?folder_id=${folder.id}&category_id=${folder.category_id}`}
                        className="cyber-glow-btn inline-flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl cursor-pointer"
                    >
                        <Plus className="w-4 h-4" />
                        Add Resource Here
                    </Link>
                </div>
            </div>

            {/* Nested Subfolders if any */}
            {subfolders.length > 0 && (
                <div className="mb-8">
                    <h3 className="text-sm font-bold text-[#F4FBFC] mb-3 flex items-center gap-2">
                        <FolderPlus className="w-4 h-4 text-[#2EC4D6]" />
                        Subfolders ({subfolders.length})
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {subfolders.map((sub) => (
                            <Link
                                key={sub.id}
                                href={`/admin/resources/folder/${sub.id}`}
                                className="p-4 cyber-glass-card cyber-glass-card-hover flex items-center justify-between"
                            >
                                <div className="flex items-center gap-2.5 overflow-hidden">
                                    <Folder className="w-4 h-4 text-[#2EC4D6] flex-shrink-0" />
                                    <span className="text-xs font-bold text-[#F4FBFC] truncate">{sub.name}</span>
                                </div>
                                <span className="text-[11px] font-semibold text-[#A8E6E8]/70">{sub.resources_count}</span>
                            </Link>
                        ))}
                    </div>
                </div>
            )}

            {/* Resources List in this Folder */}
            <div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                    <h3 className="text-base font-bold text-[#F4FBFC]">
                        Resources in this Folder ({resources.total || resources.data?.length || 0})
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
                            <div
                                key={res.id}
                                className="cyber-glass-card cyber-glass-card-hover overflow-hidden flex flex-col group"
                            >
                                <div className="relative aspect-video bg-[#061923] flex items-center justify-center overflow-hidden border-b border-[#A8E6E8]/15">
                                    {res.thumbnail_url ? (
                                        <img src={res.thumbnail_url} alt={res.title} className="w-full h-full object-cover" />
                                    ) : res.resource_type === 'illustration' && res.file_url ? (
                                        <img src={res.file_url} alt={res.title} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="text-[#A8E6E8]/40">
                                            {res.resource_type === 'video' ? <Video className="w-10 h-10 text-[#2EC4D6]" /> :
                                             res.resource_type === 'pdf' ? <FileText className="w-10 h-10 text-emerald-400" /> :
                                             <BookOpen className="w-10 h-10 text-amber-400" />}
                                        </div>
                                    )}
                                    <span className="absolute top-2.5 left-2.5 px-2 py-0.5 text-[10px] font-bold uppercase rounded bg-[#0B6E8A]/90 text-white border border-[#2EC4D6]/40">
                                        {res.resource_type}
                                    </span>
                                </div>

                                <div className="p-5 flex-1 flex flex-col justify-between">
                                    <div>
                                        <Link
                                            href={`/admin/resources/${res.id}`}
                                            className="text-sm font-bold text-[#F4FBFC] hover:text-[#2EC4D6] transition-colors line-clamp-1"
                                        >
                                            {res.title}
                                        </Link>
                                        <p className="text-xs text-[#A8E6E8]/70 mt-1 line-clamp-2 leading-relaxed">
                                            {res.description || 'No description provided.'}
                                        </p>
                                    </div>
                                    <div className="mt-4 pt-3 border-t border-[#A8E6E8]/15 flex items-center justify-between text-xs text-[#A8E6E8]/70 font-medium">
                                        <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5 text-[#2EC4D6]" />{res.views_count}</span>
                                        <span className="flex items-center gap-1"><Download className="w-3.5 h-3.5 text-[#2EC4D6]" />{res.downloads_count}</span>
                                        <span className="font-mono text-[11px] text-[#A8E6E8]">{res.formatted_file_size}</span>
                                    </div>
                                </div>

                                <div className="px-5 py-3 bg-[#061923]/60 border-t border-[#A8E6E8]/15 flex items-center justify-between">
                                    <Link
                                        href={`/admin/resources/${res.id}`}
                                        className="text-xs font-bold text-[#2EC4D6] hover:text-[#A8E6E8] flex items-center gap-1 transition-colors"
                                    >
                                        View Resource
                                        <ChevronRight className="w-3.5 h-3.5" />
                                    </Link>
                                    <Link
                                        href={`/admin/resources/${res.id}/edit`}
                                        className="text-xs text-[#A8E6E8]/60 hover:text-[#2EC4D6] transition-colors"
                                    >
                                        <Edit3 className="w-3.5 h-3.5" />
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="p-12 cyber-glass-card text-center text-xs text-[#A8E6E8]/60">
                        No resources in this folder yet.
                    </div>
                )}

                <Pagination links={resources.links} />
            </div>

            {/* Edit Folder Modal */}
            <Modal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} title="Edit Folder">
                <form onSubmit={handleUpdateFolder} className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-[#A8E6E8] uppercase tracking-wider mb-1">
                            Folder Name
                        </label>
                        <input
                            type="text"
                            value={editForm.name}
                            onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                            className="cyber-glass-input w-full px-3.5 py-2 text-sm rounded-xl"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-[#A8E6E8] uppercase tracking-wider mb-1">
                            Description
                        </label>
                        <textarea
                            value={editForm.description}
                            onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                            rows={3}
                            className="cyber-glass-input w-full px-3.5 py-2 text-xs rounded-xl"
                        />
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#A8E6E8]/15">
                        <button
                            type="button"
                            onClick={() => setIsEditOpen(false)}
                            className="cyber-oauth-btn px-4 py-2 text-xs font-semibold rounded-xl"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="cyber-glow-btn px-5 py-2 text-xs font-bold rounded-xl cursor-pointer"
                        >
                            Save Changes
                        </button>
                    </div>
                </form>
            </Modal>

            {/* Delete Modal */}
            <Modal isOpen={isDeleteOpen} onClose={() => setIsDeleteOpen(false)} title="Delete Folder">
                <div className="space-y-4">
                    <p className="text-xs text-[#F4FBFC] leading-relaxed">
                        Are you sure you want to delete <strong className="text-[#2EC4D6]">{folder.name}</strong>? Unlinked resources will be kept safely in the parent category.
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
                            onClick={handleDeleteFolder}
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
