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
                <h1 className="text-2xl sm:text-3xl font-black text-[#F4FBFC] tracking-tight">
                    System Activity &amp; Audit Trail
                </h1>
                <p className="text-xs sm:text-sm text-[#A8E6E8]/70 mt-1">
                    Complete immutable log of all educational uploads, updates, deletions, and user authentications.
                </p>
            </div>

            {/* Filter Bar */}
            <div className="cyber-glass-card p-4 mb-6">
                <form onSubmit={handleSearch} className="flex flex-col sm:flex-row items-center gap-3">
                    <div className="relative flex-1 w-full">
                        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A8E6E8]/50" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search by action description, user name, or IP address..."
                            className="cyber-glass-input w-full pl-10 pr-4 py-2 text-xs rounded-xl"
                        />
                    </div>

                    <div className="grid grid-cols-2 sm:flex sm:items-center gap-2 w-full sm:w-auto">
                        <select
                            value={actionFilter}
                            onChange={(e) => {
                                setActionFilter(e.target.value);
                                router.get('/admin/activity-logs', { search, action: e.target.value });
                            }}
                            className="cyber-glass-input w-full sm:w-auto px-3 py-2 text-xs rounded-xl"
                        >
                            <option value="" className="bg-[#061923] text-[#F4FBFC]">All Actions</option>
                            <option value="created" className="bg-[#061923] text-[#F4FBFC]">Created</option>
                            <option value="updated" className="bg-[#061923] text-[#F4FBFC]">Updated</option>
                            <option value="deleted" className="bg-[#061923] text-[#F4FBFC]">Deleted</option>
                            <option value="download" className="bg-[#061923] text-[#F4FBFC]">Downloaded</option>
                            <option value="login" className="bg-[#061923] text-[#F4FBFC]">Login</option>
                            <option value="register" className="bg-[#061923] text-[#F4FBFC]">Register</option>
                        </select>

                        <button
                            type="submit"
                            className="cyber-glow-btn px-4 py-2 text-xs font-bold rounded-xl cursor-pointer"
                        >
                            Search
                        </button>
                    </div>
                </form>
            </div>

            {/* Logs List Table */}
            <div className="cyber-glass-card overflow-hidden mb-6 min-w-0">
                <div className="overflow-x-auto overscroll-x-contain touch-pan-x">
                    <table className="w-full min-w-[580px] text-left text-xs border-collapse">
                    <thead>
                        <tr className="cyber-table-header">
                            <th className="py-3.5 px-4">Action</th>
                            <th className="py-3.5 px-4">Description</th>
                            <th className="py-3.5 px-4">Responsible User</th>
                            <th className="py-3.5 px-4 hidden sm:table-cell">IP Address</th>
                            <th className="py-3.5 px-4 text-right">Timestamp</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[#A8E6E8]/10">
                        {logs.data && logs.data.length > 0 ? (
                            logs.data.map((log) => (
                                <tr key={log.id} className="cyber-table-row transition-colors">
                                    <td className="py-3.5 px-4">
                                        <span className={`inline-block px-2.5 py-0.5 text-[10px] font-bold uppercase rounded-md border ${
                                            log.action === 'created' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' :
                                            log.action === 'updated' ? 'bg-[#0B6E8A]/40 text-[#2EC4D6] border-[#2EC4D6]/30' :
                                            log.action === 'deleted' ? 'bg-rose-500/20 text-rose-300 border-rose-500/30' :
                                            log.action === 'download' ? 'bg-sky-500/20 text-sky-300 border-sky-500/30' :
                                            'bg-[#A8E6E8]/10 text-[#A8E6E8] border-[#A8E6E8]/20'
                                        }`}>
                                            {log.action}
                                        </span>
                                    </td>
                                    <td className="py-3.5 px-4 font-medium text-[#F4FBFC]">
                                        {log.description}
                                    </td>
                                    <td className="py-3.5 px-4 text-[#A8E6E8]">
                                        {log.user ? (
                                            <span className="font-semibold text-[#F4FBFC]">{log.user.name}</span>
                                        ) : (
                                            <span className="text-[#A8E6E8]/50">System Guest</span>
                                        )}
                                    </td>
                                    <td className="py-3.5 px-4 text-[#A8E6E8]/70 font-mono text-[11px] hidden sm:table-cell">
                                        {log.ip_address || '127.0.0.1'}
                                    </td>
                                    <td className="py-3.5 px-4 text-right text-[#A8E6E8]/70 font-mono text-[11px]">
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
                                <td colSpan={5} className="py-12 text-center text-[#A8E6E8]/50">
                                    No activity logs recorded yet.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
                </div>
            </div>

            <Pagination links={logs.links} />
        </AppLayout>
    );
}
