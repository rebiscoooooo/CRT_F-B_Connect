import React from 'react';
import { Link } from '@inertiajs/react';

export default function ApplicationLogo({
    size = 'md',
    showText = false,
    textClassName = '',
    subtitle = 'Digital LMS',
    href = null,
    className = '',
    imgClassName = '',
    alt = 'CRT F&B Connect Logo',
}) {
    const sizeClasses = {
        xs: 'w-7 h-7',
        sm: 'w-8 h-8',
        md: 'w-10 h-10',
        lg: 'w-14 h-14',
        xl: 'w-20 h-20',
        '2xl': 'w-28 h-28',
        '3xl': 'w-36 h-36',
    };

    const dimension = sizeClasses[size] || size;

    const logoElement = (
        <div className={`inline-flex items-center gap-3 ${className}`}>
            <div
                className={`relative flex-shrink-0 ${dimension} rounded-full bg-[#061923] ring-2 ring-[#2EC4D6]/30 shadow-sm shadow-[#2EC4D6]/10 overflow-hidden flex items-center justify-center`}
            >
                <img
                    src="/images/logo-badge.png"
                    alt={alt}
                    className={`w-full h-full object-cover object-center ${imgClassName}`}
                    onError={(e) => {
                        // Fallback to logo.png or logo.jpg if badge is unavailable
                        if (!e.target.dataset.triedFallback) {
                            e.target.dataset.triedFallback = 'true';
                            e.target.src = '/images/logo.png';
                        }
                    }}
                />
            </div>

            {showText && (
                <div className={`leading-tight text-left ${textClassName}`}>
                    <span className="font-extrabold text-[#F4FBFC] tracking-tight block text-sm sm:text-base">
                        CRT F&amp;B <span className="bg-gradient-to-r from-[#2EC4D6] to-[#A8E6E8] bg-clip-text text-transparent">Connect</span>
                    </span>
                    {subtitle && (
                        <span className="block text-[10px] font-semibold text-[#A8E6E8]/70 uppercase tracking-wider">
                            {subtitle}
                        </span>
                    )}
                </div>
            )}
        </div>
    );

    if (href) {
        return (
            <Link href={href} className="inline-flex items-center group transition-transform hover:opacity-95">
                {logoElement}
            </Link>
        );
    }

    return logoElement;
}

