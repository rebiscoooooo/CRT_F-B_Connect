import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import Pagination from '@/Components/Pagination';
import { Activity, Search, Filter } from 'lucide-react';

export default function ActivityLogIndex({ logs = { data: [] }, filters = {} }) {
    const [search, setSearch] = useState(filters.search || '');
    const [actionFilter, setActionFilter] = useState(filters.action || '');

    const handleSearch = (e) => {
        e.preventDefault();
        router.get('/admin/activity-logs', { search, action: actionFilter }, { preserveState: true });
    };

    return (
        <AppLayout title="System Activity Logs">
            <Head title="Audit Activity Logs — CRT F&B Connect" />

            {/* Header */}
            <div className="mb-8">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                    System Activity &amp; Audit Trail
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                    Complete immutable log of all educational uploads, updates, deletions, and user authentications.
                </p>
            </div>

            {/* Filter Bar */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs mb-6">
                <form onSubmit={handleSearch} className="flex flex-col sm:flex-row items-center gap-3">
                    <div className="relative flex-1 w-full">
                        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search by action description, user name, or IP address..."
                            className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:bg-white focus:border-blue-600 focus:outline-none"
                        />
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto">
                        <select
                            value={actionFilter}
                            onChange={(e) => {
                                setActionFilter(e.target.value);
                                router.get('/admin/activity-logs', { search, action: e.target.value });
                            }}
                            className="px-3 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:bg-white focus:border-blue-600 focus:outline-none text-slate-700"
                        >
                            <option value="">All Actions</option>
                            <option value="created">Created</option>
                            <option value="updated">Updated</option>
                            <option value="deleted">Deleted</option>
                            <option value="download">Downloaded</option>
                            <option value="login">Login</option>
                            <option value="register">Register</option>
                        </select>

                        <button
                            type="submit"
                            className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl"
                        >
                            Search
                        </button>
                    </div>
                </form>
            </div>

            {/* Logs List Table */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden mb-6">
                <table className="w-full text-left text-xs border-collapse">
                    <thead>
                        <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
                            <th className="py-3.5 px-4">Action</th>
                            <th className="py-3.5 px-4">Description</th>
                            <th className="py-3.5 px-4">Responsible User</th>
                            <th className="py-3.5 px-4 hidden sm:table-cell">IP Address</th>
                            <th className="py-3.5 px-4 text-right">Timestamp</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {logs.data && logs.data.length > 0 ? (
                            logs.data.map((log) => (
                                <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                                    <td className="py-3.5 px-4">
                                        <span className={`inline-block px-2.5 py-0.5 text-[10px] font-bold uppercase rounded-md ${
                                            log.action === 'created' ? 'bg-emerald-50 text-emerald-700' :
                                            log.action === 'updated' ? 'bg-blue-50 text-blue-700' :
                                            log.action === 'deleted' ? 'bg-rose-50 text-rose-700' :
                                            log.action === 'download' ? 'bg-sky-50 text-sky-700' :
                                            'bg-slate-100 text-slate-700'
                                        }`}>
                                            {log.action}
                                        </span>
                                    </td>
                                    <td className="py-3.5 px-4 font-medium text-slate-800">
                                        {log.description}
                                    </td>
                                    <td className="py-3.5 px-4 text-slate-600">
                                        {log.user ? (
                                            <span className="font-semibold text-slate-900">{log.user.name}</span>
                                        ) : (
                                            <span className="text-slate-400">System Guest</span>
                                        )}
                                    </td>
                                    <td className="py-3.5 px-4 text-slate-500 font-mono text-[11px] hidden sm:table-cell">
                                        {log.ip_address || '127.0.0.1'}
                                    </td>
                                    <td className="py-3.5 px-4 text-right text-slate-400 font-mono text-[11px]">
                                        {new Date(log.created_at).toLocaleString([], {
                                            month: 'short',
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit',
                                            second: '2-digit',
                                        })}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={5} className="py-12 text-center text-slate-400">
                                    No activity logs recorded yet.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <Pagination links={logs.links} />
        </AppLayout>
    );
}
