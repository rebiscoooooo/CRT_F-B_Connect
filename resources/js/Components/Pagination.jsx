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
                            className="px-3.5 py-2 text-xs font-medium text-[#A8E6E8]/40 bg-[#0A3D4F]/20 border border-[#A8E6E8]/10 rounded-lg cursor-not-allowed select-none"
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    );
                }

                return (
                    <Link
                        key={index}
                        href={link.url}
                        preserveScroll
                        className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-all border ${
                            link.active
                                ? 'cyber-glow-btn text-[#F4FBFC] border-[#2EC4D6]/60 shadow-[0_0_12px_rgba(46,196,214,0.3)]'
                                : 'bg-[#0A3D4F]/30 text-[#A8E6E8] hover:bg-[#0B6E8A]/30 hover:text-[#F4FBFC] border-[#A8E6E8]/20 hover:border-[#2EC4D6]/40'
                        }`}
                        dangerouslySetInnerHTML={{ __html: link.label }}
                    />
                );
            })}
        </div>
    );
}

