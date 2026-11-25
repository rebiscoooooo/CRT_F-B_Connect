import React from 'react';

export default function StatCard({ title, value, subtitle, icon: Icon, color = 'blue' }) {
    const colorStyles = {
        blue: {
            bg: 'bg-[#0B6E8A]/35 text-[#2EC4D6] border border-[#2EC4D6]/30 shadow-[0_0_15px_rgba(46,196,214,0.2)]',
            glow: 'group-hover:border-[#2EC4D6]/60',
        },
        indigo: {
            bg: 'bg-[#0A3D4F]/50 text-[#A8E6E8] border border-[#A8E6E8]/30 shadow-[0_0_15px_rgba(46,196,214,0.15)]',
            glow: 'group-hover:border-[#2EC4D6]/50',
        },
        sky: {
            bg: 'bg-[#0B6E8A]/40 text-[#2EC4D6] border border-[#2EC4D6]/35 shadow-[0_0_15px_rgba(46,196,214,0.2)]',
            glow: 'group-hover:border-[#2EC4D6]/60',
        },
        emerald: {
            bg: 'bg-[#2EC4D6]/20 text-[#2EC4D6] border border-[#2EC4D6]/30 shadow-[0_0_15px_rgba(46,196,214,0.2)]',
            glow: 'group-hover:border-[#2EC4D6]/60',
        },
        amber: {
            bg: 'bg-[#0B6E8A]/30 text-[#A8E6E8] border border-[#0B6E8A]/30 shadow-[0_0_15px_rgba(11,110,138,0.2)]',
            glow: 'group-hover:border-[#0B6E8A]/60',
        },
        purple: {
            bg: 'bg-[#0A3D4F]/40 text-[#A8E6E8] border border-[#A8E6E8]/30 shadow-[0_0_15px_rgba(10,61,79,0.2)]',
            glow: 'group-hover:border-[#A8E6E8]/60',
        },
    }[color] || {
        bg: 'bg-[#0B6E8A]/35 text-[#2EC4D6] border border-[#2EC4D6]/30',
        glow: 'group-hover:border-[#2EC4D6]/60',
    };

    return (
        <div className={`group cyber-glass-card cyber-glass-card-hover p-4 sm:p-6 rounded-2xl ${colorStyles.glow} transition-all duration-200 min-w-0`}>
            <div className="flex items-center justify-between gap-3">
                <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold text-[#A8E6E8] uppercase tracking-wider truncate">{title}</p>
                    <h4 className="mt-2 text-2xl sm:text-3xl font-extrabold text-[#F4FBFC] tracking-tight">{value}</h4>
                    {subtitle && (
                        <p className="mt-1 text-xs text-[#A8E6E8]/70 font-normal line-clamp-1">{subtitle}</p>
                    )}
                </div>
                {Icon && (
                    <div className={`p-3 sm:p-3.5 rounded-xl ${colorStyles.bg} transition-transform group-hover:scale-110 duration-200 shrink-0`}>
                        <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                )}
            </div>
        </div>
    );
}

