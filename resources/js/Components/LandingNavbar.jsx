import React, { useState, useEffect, useRef } from 'react';
import { Link, usePage } from '@inertiajs/react';
import ApplicationLogo from '@/Components/ApplicationLogo';
import PwaInstallButton from '@/Components/PwaInstallButton';
import {
    LogIn,
    UserPlus,
    Menu,
    X,
    ArrowRight,
    ChevronRight,
    Sparkles
} from 'lucide-react';

export default function LandingNavbar() {
    const { auth } = usePage().props;
    const user = auth?.user;
    const dashboardUrl = user?.is_admin
        ? '/admin/dashboard'
        : (user?.status === 'pending' ? '/approval-pending' : '/student/dashboard');

    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [activeSection, setActiveSection] = useState('');
    const navRef = useRef(null);

    const navLinks = [
        { name: 'About', href: '#about' },
        { name: 'Vision & Mission', href: '#mission-vision' },
        { name: 'Features', href: '#features' },
        { name: 'Resources Preview', href: '#preview' },
        { name: 'Benefits', href: '#benefits' },
    ];

    // Scroll listener for elevation and active section highlighting
    useEffect(() => {
        const handleScroll = () => {
            const scrollPos = window.scrollY;
            setIsScrolled(scrollPos > 15);

            // Determine active section
            const sections = navLinks.map(link => link.href.substring(1));
            let current = '';

            for (const sectionId of sections) {
                const el = document.getElementById(sectionId);
                if (el) {
                    const rect = el.getBoundingClientRect();
                    // If section is in the upper part of the viewport
                    if (rect.top <= 140 && rect.bottom >= 140) {
                        current = sectionId;
                        break;
                    }
                }
            }
            setActiveSection(current);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close mobile menu on click outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (navRef.current && !navRef.current.contains(event.target)) {
                setMobileMenuOpen(false);
            }
        };

        if (mobileMenuOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [mobileMenuOpen]);

    const scrollToSection = (e, href) => {
        e.preventDefault();
        setMobileMenuOpen(false);
        const targetId = href.substring(1);
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
            targetElement.scrollIntoView({ behavior: 'smooth' });
            window.history.pushState(null, '', href);
        }
    };

    return (
        <header className="sticky top-0 z-50 w-full px-3 sm:px-6 lg:px-8 pt-3 sm:pt-4 pb-2 transition-all duration-300">
            <div ref={navRef} className="max-w-7xl mx-auto">
                <nav
                    className={`rounded-2xl sm:rounded-3xl transition-all duration-300 cyber-glass-card ${isScrolled
                            ? 'bg-[#061923]/90 shadow-[0_14px_38px_0_rgba(4,18,26,0.6)] border border-[#A8E6E8]/25'
                            : 'bg-[#061923]/75 shadow-[0_8px_32px_0_rgba(4,18,26,0.4)] border border-[#A8E6E8]/18'
                        }`}
                >
                    <div className="px-3 sm:px-6 h-16 sm:h-20 flex items-center justify-between gap-2 sm:gap-4">
                        {/* Brand Logo & Name */}
                        <a
                            href="#"
                            onClick={(e) => {
                                e.preventDefault();
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            className="flex items-center gap-2 sm:gap-3 group transition-transform shrink-0 min-w-0"
                        >
                            <div className="relative shrink-0">
                                <ApplicationLogo
                                    size="md"
                                    className="group-hover:scale-105 transition-transform duration-300"
                                />
                                <div className="absolute -inset-1 rounded-full bg-[#2EC4D6]/20 blur-sm -z-10 group-hover:bg-[#2EC4D6]/35 transition-colors" />
                            </div>
                            <div className="flex flex-col min-w-0">
                                <span className="text-sm sm:text-xl font-black tracking-tight text-[#F4FBFC] leading-tight truncate">
                                    CRT F&amp;B <span className="bg-gradient-to-r from-[#2EC4D6] to-[#A8E6E8] bg-clip-text text-transparent">Connect</span>
                                </span>
                                <span className="hidden sm:block text-[10px] sm:text-[11px] font-bold text-[#A8E6E8]/70 uppercase tracking-wider">
                                    College of Research &amp; Technology
                                </span>
                            </div>
                        </a>

                        {/* Center Navigation Links (Pill Dock) */}
                        <div className="hidden lg:flex items-center gap-1 p-1.5 rounded-full bg-[#0A3D4F]/40 border border-[#A8E6E8]/20 backdrop-blur-md">
                            {navLinks.map((link) => {
                                const isActive = activeSection === link.href.substring(1);
                                return (
                                    <a
                                        key={link.name}
                                        href={link.href}
                                        onClick={(e) => scrollToSection(e, link.href)}
                                        className={`relative px-3.5 py-1.5 rounded-full text-xs xl:text-sm font-semibold transition-all duration-200 ${isActive
                                                ? 'bg-[#0B6E8A]/60 text-[#F4FBFC] shadow-[0_0_12px_rgba(46,196,214,0.3)] border border-[#2EC4D6]/40 font-bold'
                                                : 'text-[#A8E6E8]/80 hover:text-[#F4FBFC] hover:bg-[#0B6E8A]/25'
                                            }`}
                                    >
                                        {link.name}
                                    </a>
                                );
                            })}
                        </div>

                        {/* Right: Actions */}
                        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                            <PwaInstallButton className="hidden sm:inline-flex" />
                            {user ? (
                                <Link
                                    href={dashboardUrl}
                                    className="hidden sm:inline-flex relative group overflow-hidden items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm font-bold text-[#F4FBFC] cyber-glow-btn rounded-xl transition-all duration-200 hover:-translate-y-0.5 cursor-pointer"
                                >
                                    <span>Dashboard</span>
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                                    <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/25 to-transparent pointer-events-none" />
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href="/login"
                                        className="hidden sm:inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-2 text-xs sm:text-sm font-semibold text-[#A8E6E8] hover:text-[#F4FBFC] cyber-oauth-btn border border-[#A8E6E8]/20 hover:border-[#2EC4D6]/40 rounded-xl backdrop-blur-md transition-all duration-200"
                                    >
                                        <LogIn className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#2EC4D6]" />
                                        <span>Log In</span>
                                    </Link>
                                    <Link
                                        href="/register"
                                        className="hidden md:inline-flex relative group overflow-hidden items-center gap-1.5 px-4 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm font-bold text-[#F4FBFC] cyber-glow-btn rounded-xl transition-all duration-200 hover:-translate-y-0.5"
                                    >
                                        <UserPlus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                        <span>Get Started</span>
                                        <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/25 to-transparent pointer-events-none" />
                                    </Link>
                                </>
                            )}

                            {/* Mobile Hamburger Button — visible below lg */}
                            <button
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                className="p-2 sm:p-2.5 rounded-xl bg-[#0A3D4F]/50 hover:bg-[#0B6E8A]/40 border border-[#A8E6E8]/25 text-[#A8E6E8] hover:text-[#F4FBFC] backdrop-blur-md lg:hidden transition-all duration-200 focus:outline-none cursor-pointer"
                                aria-label="Toggle navigation menu"
                                aria-expanded={mobileMenuOpen}
                            >
                                {mobileMenuOpen ? (
                                    <X className="w-5 h-5 transition-transform duration-200 rotate-90" />
                                ) : (
                                    <Menu className="w-5 h-5 transition-transform duration-200" />
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Mobile Dropdown Panel */}
                    {mobileMenuOpen && (
                        <div className="lg:hidden border-t border-[#A8E6E8]/15 px-4 pt-3 pb-5 space-y-3 bg-[#061923]/95 backdrop-blur-xl rounded-b-2xl sm:rounded-b-3xl animate-in fade-in slide-in-from-top-2 duration-200">
                            <div className="flex flex-col space-y-1">
                                {navLinks.map((link) => {
                                    const isActive = activeSection === link.href.substring(1);
                                    return (
                                        <a
                                            key={link.name}
                                            href={link.href}
                                            onClick={(e) => scrollToSection(e, link.href)}
                                            className={`flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${isActive
                                                    ? 'bg-[#0B6E8A]/50 text-[#F4FBFC] font-bold border border-[#2EC4D6]/40'
                                                    : 'text-[#A8E6E8]/80 hover:text-[#F4FBFC] hover:bg-[#0B6E8A]/20'
                                                }`}
                                        >
                                            <span>{link.name}</span>
                                            <ChevronRight className={`w-4 h-4 transition-transform ${isActive ? 'text-[#2EC4D6] translate-x-0.5' : 'text-[#A8E6E8]/40'}`} />
                                        </a>
                                    );
                                })}
                            </div>

                            <div className="pt-3 border-t border-[#A8E6E8]/15 flex flex-col sm:flex-row gap-2">
                                <PwaInstallButton className="w-full justify-center" />
                                {user ? (
                                    <Link
                                        href={dashboardUrl}
                                        className="flex items-center justify-center gap-2 w-full py-2.5 px-4 text-sm font-bold text-[#F4FBFC] cyber-glow-btn rounded-xl shadow-md"
                                    >
                                        <span>Go to Dashboard</span>
                                        <ArrowRight className="w-4 h-4" />
                                    </Link>
                                ) : (
                                    <>
                                        <Link
                                            href="/login"
                                            className="flex items-center justify-center gap-2 w-full py-2.5 px-4 text-sm font-semibold text-[#A8E6E8] hover:text-[#F4FBFC] cyber-oauth-btn border border-[#A8E6E8]/20 rounded-xl"
                                        >
                                            <LogIn className="w-4 h-4" />
                                            <span>Log In</span>
                                        </Link>
                                        <Link
                                            href="/register"
                                            className="flex items-center justify-center gap-2 w-full py-2.5 px-4 text-sm font-bold text-[#F4FBFC] cyber-glow-btn rounded-xl shadow-md"
                                        >
                                            <UserPlus className="w-4 h-4" />
                                            <span>Get Started</span>
                                        </Link>
                                    </>
                                )}
                            </div>
                        </div>
                    )}
                </nav>
            </div>
        </header>
    );
}
