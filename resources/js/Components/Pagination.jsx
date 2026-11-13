import React from 'react';
import { Link } from '@inertiajs/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Pagination({ links = [] }) {
    if (!links || links.length <= 3) return null;

    return (
        <div className="flex flex-wrap items-center justify-center gap-1.5 py-4">
            {links.map((link, index) => {
                if (link.url === null) {
                    return (
                        <span
                            key={index}
                            className="px-3.5 py-2 text-xs font-medium text-slate-400 bg-white border border-slate-200 rounded-lg cursor-not-allowed select-none"
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    );
                }

                return (
                    <Link
                        key={index}
                        href={link.url}
                        preserveScroll
                        className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors border ${
                            link.active
                                ? 'bg-blue-600 text-white border-blue-600 shadow-sm shadow-blue-500/20'
                                : 'bg-white text-slate-700 hover:bg-slate-50 border-slate-200 hover:border-slate-300'
                        }`}
                        dangerouslySetInnerHTML={{ __html: link.label }}
                    />
                );
            })}
        </div>
    );
}

