import React from 'react';

export default function StatCard({ title, value, subtitle, icon: Icon, color = 'blue' }) {
    const colorStyles = {
        blue: {
            bg: 'bg-blue-50 text-blue-600',
            border: 'border-blue-100',
            glow: 'group-hover:border-blue-300',
        },
        indigo: {
            bg: 'bg-indigo-50 text-indigo-600',
            border: 'border-indigo-100',
            glow: 'group-hover:border-indigo-300',
        },
        sky: {
            bg: 'bg-sky-50 text-sky-600',
            border: 'border-sky-100',
            glow: 'group-hover:border-sky-300',
        },
        emerald: {
            bg: 'bg-emerald-50 text-emerald-600',
            border: 'border-emerald-100',
            glow: 'group-hover:border-emerald-300',
        },
        amber: {
            bg: 'bg-amber-50 text-amber-600',
            border: 'border-amber-100',
            glow: 'group-hover:border-amber-300',
        },
        purple: {
            bg: 'bg-purple-50 text-purple-600',
            border: 'border-purple-100',
            glow: 'group-hover:border-purple-300',
        },
    }[color] || {
        bg: 'bg-blue-50 text-blue-600',
        border: 'border-blue-100',
        glow: 'group-hover:border-blue-300',
    };

    return (
        <div className={`group bg-white/95 backdrop-blur-sm p-6 rounded-2xl border ${colorStyles.border} ${colorStyles.glow} shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-200`}>
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{title}</p>
                    <h4 className="mt-2 text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">{value}</h4>
                    {subtitle && (
                        <p className="mt-1 text-xs text-slate-500 font-medium">{subtitle}</p>
                    )}
                </div>
                {Icon && (
                    <div className={`p-3.5 rounded-xl ${colorStyles.bg} transition-transform group-hover:scale-110 duration-200`}>
                        <Icon className="w-6 h-6" />
                    </div>
                )}
            </div>
        </div>
    );
}

