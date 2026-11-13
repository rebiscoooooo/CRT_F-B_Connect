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
                        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                            System Notifications
                        </h1>
                        <p className="text-xs sm:text-sm text-slate-500 mt-1">
                            Updates regarding new curriculum uploads, classroom notices, and account activity.
                        </p>
                    </div>

                    <Link
                        href="/notifications/read-all"
                        method="post"
                        as="button"
                        className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors"
                    >
                        <CheckCheck className="w-4 h-4" />
                        Mark All as Read
                    </Link>
                </div>

                <div className="bg-white rounded-3xl border border-slate-200 shadow-2xs divide-y divide-slate-100 overflow-hidden mb-6">
                    {notifications.data && notifications.data.length > 0 ? (
                        notifications.data.map((item) => (
                            <div
                                key={item.id}
                                className={`p-6 transition-colors flex items-start justify-between gap-4 ${
                                    !item.read_at ? 'bg-blue-50/30' : 'hover:bg-slate-50/80'
                                }`}
                            >
                                <div className="flex items-start gap-4">
                                    <div className={`p-2.5 rounded-2xl flex-shrink-0 mt-0.5 ${
                                        !item.read_at ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500'
                                    }`}>
                                        <Bell className="w-5 h-5" />
                                    </div>
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <h4 className="text-sm font-bold text-slate-900">{item.title}</h4>
                                            {!item.read_at && (
                                                <span className="w-2 h-2 rounded-full bg-blue-600" />
                                            )}
                                        </div>
                                        <p className="text-xs text-slate-600 leading-relaxed max-w-xl">
                                            {item.message}
                                        </p>
                                        <div className="pt-2 flex items-center gap-4 text-[11px] text-slate-400">
                                            <span className="flex items-center gap-1">
                                                <Calendar className="w-3.5 h-3.5" />
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
                                                    className="font-bold text-blue-600 hover:underline inline-flex items-center gap-1"
                                                >
                                                    Open Link <ExternalLink className="w-3 h-3" />
                                                </Link>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {!item.read_at && (
                                    <Link
                                        href={`/notifications/${item.id}/read`}
                                        method="post"
                                        as="button"
                                        className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline whitespace-nowrap"
                                    >
                                        Mark read
                                    </Link>
                                )}
                            </div>
                        ))
                    ) : (
                        <div className="p-16 text-center text-xs text-slate-400">
                            <Bell className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                            <p className="text-sm font-bold text-slate-700">No notifications found</p>
                            <p className="mt-1">You're completely caught up with all updates.</p>
                        </div>
                    )}
                </div>

                <Pagination links={notifications.links} />
            </div>
        </AppLayout>
    );
}
