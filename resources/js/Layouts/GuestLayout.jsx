import React from 'react';
import { Link } from '@inertiajs/react';
import ApplicationLogo from '@/Components/ApplicationLogo';
import Toast from '../Components/Toast';
import { ArrowLeft } from 'lucide-react';

export default function GuestLayout({ children, variant = 'default', maxWidth = 'max-w-[440px]' }) {
    if (variant === 'glassmorphic') {
        return (
            <div className="min-h-screen relative overflow-hidden flex flex-col justify-center items-center py-8 sm:py-12 px-4 cyber-grid-container selection:bg-[#2EC4D6] selection:text-[#0A3D4F]">
                {/* Floating "Back to Menu" discreet navigation */}
                <Link
                    href="/"
                    className="absolute top-4 left-4 sm:top-6 sm:left-6 z-30 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium text-[#A8E6E8] hover:text-[#F4FBFC] bg-[#0A3D4F]/50 hover:bg-[#0B6E8A]/60 border border-[#A8E6E8]/25 backdrop-blur-md transition-all duration-200 group shadow-sm"
                    title="Return to Main Menu / Landing Page"
                >
                    <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
                    <span>Back to Menu</span>
                </Link>

                {/* Central Atmosphere Nebula Glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[620px] h-[620px] bg-[#0B6E8A]/25 rounded-full blur-[130px] pointer-events-none z-0" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[380px] h-[380px] bg-[#2EC4D6]/20 rounded-full blur-[90px] pointer-events-none z-0" />

                {/* Top-Left Organic Fluid Blob */}
                <div className="absolute -top-16 -left-16 sm:-top-24 sm:-left-24 w-[360px] sm:w-[580px] h-[360px] sm:h-[580px] pointer-events-none z-0">
                    <svg viewBox="0 0 600 600" className="w-full h-full filter blur-[12px] sm:blur-[22px] opacity-90">
                        <defs>
                            <radialGradient id="cyberBlobTL" cx="40%" cy="40%" r="65%">
                                <stop offset="0%" stopColor="#2EC4D6" stopOpacity="0.95" />
                                <stop offset="35%" stopColor="#0B6E8A" stopOpacity="0.85" />
                                <stop offset="70%" stopColor="#0A3D4F" stopOpacity="0.75" />
                                <stop offset="100%" stopColor="#061923" stopOpacity="0" />
                            </radialGradient>
                        </defs>
                        <path
                            d="M0,0 L360,0 C420,90 470,190 430,290 C390,390 310,480 190,510 C90,530 0,480 0,480 Z"
                            fill="url(#cyberBlobTL)"
                        />
                    </svg>
                </div>

                {/* Bottom-Left Organic Fluid Blob */}
                <div className="absolute -bottom-16 -left-16 sm:-bottom-28 sm:-left-28 w-[360px] sm:w-[560px] h-[360px] sm:h-[560px] pointer-events-none z-0">
                    <svg viewBox="0 0 600 600" className="w-full h-full filter blur-[12px] sm:blur-[22px] opacity-90">
                        <defs>
                            <radialGradient id="cyberBlobBL" cx="35%" cy="65%" r="65%">
                                <stop offset="0%" stopColor="#A8E6E8" stopOpacity="0.95" />
                                <stop offset="35%" stopColor="#2EC4D6" stopOpacity="0.9" />
                                <stop offset="70%" stopColor="#0B6E8A" stopOpacity="0.75" />
                                <stop offset="100%" stopColor="#0A3D4F" stopOpacity="0" />
                            </radialGradient>
                        </defs>
                        <path
                            d="M0,600 L0,180 C110,210 200,280 260,360 C330,460 310,540 280,600 Z"
                            fill="url(#cyberBlobBL)"
                        />
                    </svg>
                </div>

                {/* Top-Right Organic Fluid Blob */}
                <div className="absolute -top-16 -right-16 sm:-top-24 sm:-right-24 w-[360px] sm:w-[580px] h-[360px] sm:h-[580px] pointer-events-none z-0">
                    <svg viewBox="0 0 600 600" className="w-full h-full filter blur-[12px] sm:blur-[22px] opacity-90">
                        <defs>
                            <radialGradient id="cyberBlobTR" cx="65%" cy="35%" r="65%">
                                <stop offset="0%" stopColor="#2EC4D6" stopOpacity="0.95" />
                                <stop offset="35%" stopColor="#0B6E8A" stopOpacity="0.85" />
                                <stop offset="70%" stopColor="#0A3D4F" stopOpacity="0.75" />
                                <stop offset="100%" stopColor="#061923" stopOpacity="0" />
                            </radialGradient>
                        </defs>
                        <path
                            d="M600,0 L240,0 C260,110 330,210 410,280 C490,360 560,370 600,370 Z"
                            fill="url(#cyberBlobTR)"
                        />
                    </svg>
                </div>

                {/* Bottom-Right Organic Fluid Blob */}
                <div className="absolute -bottom-16 -right-16 sm:-bottom-28 sm:-right-28 w-[380px] sm:w-[600px] h-[380px] sm:h-[600px] pointer-events-none z-0">
                    <svg viewBox="0 0 600 600" className="w-full h-full filter blur-[12px] sm:blur-[22px] opacity-90">
                        <defs>
                            <radialGradient id="cyberBlobBR" cx="65%" cy="65%" r="65%">
                                <stop offset="0%" stopColor="#A8E6E8" stopOpacity="0.95" />
                                <stop offset="35%" stopColor="#2EC4D6" stopOpacity="0.9" />
                                <stop offset="70%" stopColor="#0B6E8A" stopOpacity="0.75" />
                                <stop offset="100%" stopColor="#0A3D4F" stopOpacity="0" />
                            </radialGradient>
                        </defs>
                        <path
                            d="M600,600 L220,600 C250,490 320,400 410,330 C490,260 560,270 600,290 Z"
                            fill="url(#cyberBlobBR)"
                        />
                    </svg>
                </div>

                {/* Left Geometric Constellation Network */}
                <svg
                    className="absolute left-1 sm:left-8 top-1/2 -translate-y-1/2 w-44 sm:w-64 h-72 sm:h-96 pointer-events-none z-0 opacity-80 hidden md:block"
                    viewBox="0 0 280 380"
                    fill="none"
                >
                    <defs>
                        <filter id="glowFilterL" x="-50%" y="-50%" width="200%" height="200%">
                            <feGaussianBlur stdDeviation="3.5" result="blur" />
                            <feMerge>
                                <feMergeNode in="blur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>
                    </defs>
                    <g stroke="rgba(46, 196, 214, 0.35)" strokeWidth="1">
                        <line x1="40" y1="90" x2="110" y2="60" />
                        <line x1="110" y1="60" x2="160" y2="120" />
                        <line x1="40" y1="90" x2="90" y2="170" />
                        <line x1="160" y1="120" x2="90" y2="170" />
                        <line x1="90" y1="170" x2="190" y2="200" />
                        <line x1="160" y1="120" x2="190" y2="200" />
                        <line x1="90" y1="170" x2="60" y2="260" />
                        <line x1="60" y1="260" x2="140" y2="290" />
                        <line x1="190" y1="200" x2="140" y2="290" />
                        <line x1="140" y1="290" x2="220" y2="330" />
                        <line x1="60" y1="260" x2="110" y2="350" />
                        <line x1="110" y1="350" x2="220" y2="330" />
                    </g>
                    <g filter="url(#glowFilterL)">
                        <circle cx="40" cy="90" r="3.5" fill="#A8E6E8" />
                        <circle cx="110" cy="60" r="2.5" fill="#2EC4D6" />
                        <circle cx="160" cy="120" r="3" fill="#F4FBFC" />
                        <circle cx="90" cy="170" r="4" fill="#2EC4D6" />
                        <circle cx="190" cy="200" r="3.5" fill="#A8E6E8" />
                        <circle cx="60" cy="260" r="3" fill="#2EC4D6" />
                        <circle cx="140" cy="290" r="3.5" fill="#A8E6E8" />
                        <circle cx="220" cy="330" r="2.5" fill="#2EC4D6" />
                        <circle cx="110" cy="350" r="3" fill="#F4FBFC" />
                    </g>
                </svg>

                {/* Right Geometric Constellation Network */}
                <svg
                    className="absolute right-1 sm:right-8 top-1/2 -translate-y-1/2 w-44 sm:w-64 h-72 sm:h-96 pointer-events-none z-0 opacity-80 hidden md:block"
                    viewBox="0 0 280 380"
                    fill="none"
                >
                    <defs>
                        <filter id="glowFilterR" x="-50%" y="-50%" width="200%" height="200%">
                            <feGaussianBlur stdDeviation="3.5" result="blur" />
                            <feMerge>
                                <feMergeNode in="blur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>
                    </defs>
                    <g stroke="rgba(46, 196, 214, 0.35)" strokeWidth="1">
                        <line x1="80" y1="50" x2="170" y2="80" />
                        <line x1="170" y1="80" x2="240" y2="40" />
                        <line x1="80" y1="50" x2="110" y2="140" />
                        <line x1="170" y1="80" x2="110" y2="140" />
                        <line x1="170" y1="80" x2="200" y2="160" />
                        <line x1="240" y1="40" x2="200" y2="160" />
                        <line x1="110" y1="140" x2="180" y2="230" />
                        <line x1="200" y1="160" x2="180" y2="230" />
                        <line x1="180" y1="230" x2="250" y2="260" />
                        <line x1="110" y1="140" x2="50" y2="210" />
                        <line x1="50" y1="210" x2="120" y2="300" />
                        <line x1="180" y1="230" x2="120" y2="300" />
                    </g>
                    <g filter="url(#glowFilterR)">
                        <circle cx="80" cy="50" r="3" fill="#2EC4D6" />
                        <circle cx="170" cy="80" r="4" fill="#A8E6E8" />
                        <circle cx="240" cy="40" r="2.5" fill="#F4FBFC" />
                        <circle cx="110" cy="140" r="3.5" fill="#2EC4D6" />
                        <circle cx="200" cy="160" r="3" fill="#A8E6E8" />
                        <circle cx="180" cy="230" r="4" fill="#2EC4D6" />
                        <circle cx="250" cy="260" r="2.5" fill="#F4FBFC" />
                        <circle cx="50" cy="210" r="3" fill="#2EC4D6" />
                        <circle cx="120" cy="300" r="3.5" fill="#A8E6E8" />
                    </g>
                </svg>

                {/* Central Frosted Glass Card Container */}
                <div className={`relative w-full ${maxWidth} z-10 my-auto`}>
                    <div className="cyber-glass-card rounded-[26px] sm:rounded-[28px] py-8 sm:py-9 px-6 sm:px-9 overflow-hidden">
                        {children}
                    </div>
                </div>

                <Toast />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Background Decorative Gradients */}
            <div className="absolute top-0 -left-40 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 -right-40 w-96 h-96 bg-sky-400/10 rounded-full blur-3xl pointer-events-none" />

            <div className="sm:mx-auto sm:w-full sm:max-w-md text-center z-10 px-4">
                <Link href="/" className="inline-flex flex-col items-center group">
                    <div className="w-20 h-20 rounded-full bg-white ring-4 ring-blue-500/20 shadow-xl shadow-blue-500/15 overflow-hidden flex items-center justify-center group-hover:scale-105 transition-transform">
                        <img
                            src="/images/logo-badge.png"
                            alt="CRT F&B Connect Logo"
                            className="w-full h-full object-cover"
                            onError={(e) => {
                                e.target.src = '/images/logo.png';
                            }}
                        />
                    </div>
                    <div className="mt-3 text-center">
                        <span className="text-xl font-black tracking-tight text-slate-900 block group-hover:text-blue-600 transition-colors">
                            CRT F&amp;B Connect
                        </span>
                        <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">
                            Digital LMS Platform
                        </span>
                    </div>
                </Link>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 z-10">
                <div className="bg-white/90 backdrop-blur-md py-8 px-6 sm:px-10 shadow-xl shadow-slate-200/50 rounded-3xl border border-slate-100">
                    {children}
                </div>
            </div>

            <div className="mt-8 text-center text-xs text-slate-400 z-10">
                <p>College of Research and Technology • Bachelor of Technical Vocational Teachers Education (BTVTE)</p>
            </div>

            <Toast />
        </div>
    );
}
