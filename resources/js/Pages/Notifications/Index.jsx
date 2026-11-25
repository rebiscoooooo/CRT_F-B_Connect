import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import Pagination from '@/Components/Pagination';
import { Bell, CheckCheck, ExternalLink, Calendar, Info } from 'lucide-react';

export default function NotificationIndex({ notifications = { data: [] } }) {
    return (
        <AppLayout title="Notifications">
            <Head title="System Notifications — CRT F&B Connect" />

            <div className="max-w-4xl mx-auto">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-black text-[#F4FBFC] tracking-tight">
                            System Notifications
                        </h1>
                        <p className="text-xs sm:text-sm text-[#A8E6E8]/70 mt-1">
                            Updates regarding new curriculum uploads, classroom notices, and account activity.
                        </p>
                    </div>

                    <Link
                        href="/notifications/read-all"
                        method="post"
                        as="button"
                        className="cyber-oauth-btn inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-xl transition-colors cursor-pointer"
                    >
                        <CheckCheck className="w-4 h-4 text-[#2EC4D6]" />
                        Mark All as Read
                    </Link>
                </div>

                <div className="cyber-glass-card divide-y divide-[#A8E6E8]/10 overflow-hidden mb-6">
                    {notifications.data && notifications.data.length > 0 ? (
                        notifications.data.map((item) => (
                            <div
                                key={item.id}
                                className={`p-4 sm:p-6 transition-colors flex flex-col sm:flex-row sm:items-start justify-between gap-3 sm:gap-4 ${
                                    !item.read_at ? 'bg-[#0B6E8A]/20' : 'hover:bg-[#0B6E8A]/10'
                                }`}
                            >
                                <div className="flex items-start gap-3 sm:gap-4 min-w-0">
                                    <div className={`p-2.5 rounded-2xl flex-shrink-0 mt-0.5 border ${
                                        !item.read_at
                                            ? 'bg-[#2EC4D6] text-[#061923] border-[#2EC4D6] shadow-md shadow-[#2EC4D6]/20'
                                            : 'bg-[#061923]/50 text-[#A8E6E8]/60 border-[#A8E6E8]/20'
                                    }`}>
                                        <Bell className="w-5 h-5" />
                                    </div>
                                    <div className="space-y-1 min-w-0 flex-1">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <h4 className="text-sm font-bold text-[#F4FBFC] break-words">{item.title}</h4>
                                            {!item.read_at && (
                                                <span className="w-2 h-2 rounded-full bg-[#2EC4D6] flex-shrink-0 animate-pulse" />
                                            )}
                                        </div>
                                        <p className="text-xs text-[#A8E6E8]/80 leading-relaxed max-w-xl break-words">
                                            {item.message}
                                        </p>
                                        <div className="pt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-[#A8E6E8]/60">
                                            <span className="flex items-center gap-1">
                                                <Calendar className="w-3.5 h-3.5 text-[#2EC4D6]" />
                                                {new Date(item.created_at).toLocaleString([], {
                                                    month: 'short',
                                                    day: 'numeric',
                                                    year: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                })}
                                            </span>
                                            {item.link && (
                                                <Link
                                                    href={item.link}
                                                    className="font-bold text-[#2EC4D6] hover:underline inline-flex items-center gap-1"
                                                >
                                                    Open Link <ExternalLink className="w-3 h-3" />
                                                </Link>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {!item.read_at && (
                                    <div className="self-end sm:self-start flex-shrink-0">
                                        <Link
                                            href={`/notifications/${item.id}/read`}
                                            method="post"
                                            as="button"
                                            className="cyber-oauth-btn text-xs font-semibold hover:text-[#2EC4D6] whitespace-nowrap px-3 py-1 rounded-lg cursor-pointer"
                                        >
                                            Mark read
                                        </Link>
                                    </div>
                                )}
                            </div>
                        ))
                    ) : (
                        <div className="p-16 text-center text-xs text-[#A8E6E8]/60">
                            <Bell className="w-12 h-12 text-[#A8E6E8]/30 mx-auto mb-3" />
                            <p className="text-sm font-bold text-[#F4FBFC]">No notifications found</p>
                            <p className="mt-1">You're completely caught up with all updates.</p>
                        </div>
                    )}
                </div>

                <Pagination links={notifications.links} />
            </div>
        </AppLayout>
    );
}
