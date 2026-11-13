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

export default function StudentCategoryView({ category, folders = [], resources = { data: [] }, filters = {} }) {
    const [search, setSearch] = useState(filters.search || '');

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(`/student/resources/category/${category.slug}`, { search }, { preserveState: true });
    };

    return (
        <AppLayout title={category.name}>
            <Head title={`${category.name} — CRT F&B Connect`} />

            {/* Breadcrumb Navigation */}
            <nav className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-6 flex-wrap">
                <Link href="/student/resources" className="hover:text-blue-600 transition-colors">
                    All Materials
                </Link>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-slate-900 font-bold">{category.name}</span>
            </nav>

            {/* Category Banner */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-2xs mb-8">
                <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                    Category Overview
                </span>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-3">
                    {category.name}
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 mt-2 max-w-2xl leading-relaxed">
                    {category.description}
                </p>
            </div>

            {/* Folders in this Category */}
            {folders.length > 0 && (
                <div className="mb-10">
                    <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
                        <Folder className="w-5 h-5 text-blue-600" />
                        Learning Unit Folders ({folders.length})
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {folders.map((folder) => (
                            <Link
                                key={folder.id}
                                href={`/student/resources/folder/${folder.id}`}
                                className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-blue-300 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between group"
                            >
                                <div>
                                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                                        <Folder className="w-5 h-5" />
                                    </div>
                                    <h4 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                                        {folder.name}
                                    </h4>
                                    <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                                        {folder.description || 'Curriculum unit module folder.'}
                                    </p>
                                </div>

                                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                                    <span className="font-semibold text-slate-500">
                                        {folder.resources_count} {folder.resources_count === 1 ? 'material' : 'materials'}
                                    </span>
                                    <span className="font-bold text-blue-600 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                                        Open Folder
                                        <ChevronRight className="w-3.5 h-3.5" />
                                    </span>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            )}

            {/* Category Resources */}
            <div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                    <h3 className="text-base font-bold text-slate-900">
                        Available Resources in {category.name}
                    </h3>

                    <form onSubmit={handleSearch} className="flex items-center gap-2">
                        <div className="relative">
                            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search in this category..."
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
                            <Link
                                key={res.id}
                                href={`/student/resources/${res.id}`}
                                className="bg-white rounded-2xl border border-slate-200 shadow-2xs hover:shadow-md transition-all overflow-hidden flex flex-col group"
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
                                    <span className="absolute top-2.5 left-2.5 px-2 py-0.5 text-[10px] font-bold uppercase rounded bg-blue-600 text-white shadow-xs">
                                        {res.resource_type}
                                    </span>
                                </div>

                                <div className="p-5 flex-1 flex flex-col justify-between">
                                    <div>
                                        <h4 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 line-clamp-1 transition-colors">
                                            {res.title}
                                        </h4>
                                        <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                                            {res.description || 'Curriculum resource material.'}
                                        </p>
                                    </div>
                                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400 font-medium">
                                        <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5" />{res.views_count} views</span>
                                        <span className="font-mono text-[11px]">{res.formatted_file_size}</span>
                                    </div>
                                </div>

                                <div className="px-5 py-3 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between">
                                    <span className="text-xs font-bold text-blue-600 group-hover:translate-x-1 transition-transform flex items-center gap-1">
                                        Access Resource
                                        <ChevronRight className="w-3.5 h-3.5" />
                                    </span>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="p-12 bg-white rounded-2xl border border-slate-200 text-center text-xs text-slate-400">
                        No materials published in this category yet.
                    </div>
                )}

                <Pagination links={resources.links} />
            </div>
        </AppLayout>
    );
}
