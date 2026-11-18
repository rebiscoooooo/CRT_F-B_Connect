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
                    className={`rounded-2xl sm:rounded-3xl transition-all duration-300 ${isScrolled
                            ? 'glass-nav-scrolled bg-white/85 shadow-[0_14px_38px_0_rgba(15,23,42,0.09),inset_0_1px_1px_0_rgba(255,255,255,0.95)]'
                            : 'glass-nav bg-white/75 shadow-[0_8px_32px_0_rgba(15,23,42,0.06),inset_0_1px_1px_0_rgba(255,255,255,0.9)]'
                        }`}
                >
                    <div className="px-4 sm:px-6 h-18 sm:h-20 flex items-center justify-between gap-4">
                        {/* Brand Logo & Name */}
                        <a
                            href="#"
                            onClick={(e) => {
                                e.preventDefault();
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            className="flex items-center gap-3 group transition-transform shrink-0"
                        >
                            <div className="relative">
                                <ApplicationLogo
                                    size="md"
                                    className="group-hover:scale-105 transition-transform duration-300"
                                />
                                <div className="absolute -inset-1 rounded-full bg-blue-500/10 blur-sm -z-10 group-hover:bg-blue-500/20 transition-colors" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-base sm:text-xl font-black tracking-tight text-slate-900 leading-tight">
                                    CRT F&amp;B <span className="bg-gradient-to-r from-blue-600 to-sky-600 bg-clip-text text-transparent">Connect</span>
                                </span>
                                <span className="text-[10px] sm:text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                                    College of Research &amp; Technology
                                </span>
                            </div>
                        </a>

                        {/* Center Navigation Links (Pill Dock) */}
                        <div className="hidden lg:flex items-center gap-1 p-1.5 rounded-full bg-slate-900/[0.03] border border-slate-200/50 backdrop-blur-md shadow-[inset_0_1px_2px_rgba(0,0,0,0.03)]">
                            {navLinks.map((link) => {
                                const isActive = activeSection === link.href.substring(1);
                                return (
                                    <a
                                        key={link.name}
                                        href={link.href}
                                        onClick={(e) => scrollToSection(e, link.href)}
                                        className={`relative px-3.5 py-1.5 rounded-full text-xs xl:text-sm font-semibold transition-all duration-200 ${isActive
                                                ? 'bg-white text-blue-600 shadow-xs border border-slate-200/60 font-bold'
                                                : 'text-slate-600 hover:text-blue-600 hover:bg-white/60'
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
                                    className="relative group overflow-hidden inline-flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-blue-600 via-blue-600 to-sky-600 hover:from-blue-500 hover:to-sky-500 rounded-xl shadow-[0_4px_14px_0_rgba(37,99,235,0.35)] hover:shadow-[0_6px_20px_rgba(37,99,235,0.45)] border border-white/20 transition-all duration-200 hover:-translate-y-0.5"
                                >
                                    <span>Dashboard</span>
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                                    <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/25 to-transparent pointer-events-none" />
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href="/login"
                                        className="inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-2 text-xs sm:text-sm font-semibold text-slate-700 hover:text-blue-600 bg-white/50 hover:bg-white/90 border border-slate-200/60 hover:border-blue-200/80 rounded-xl shadow-xs backdrop-blur-md transition-all duration-200"
                                    >
                                        <LogIn className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-500" />
                                        <span>Log In</span>
                                    </Link>
                                    <Link
                                        href="/register"
                                        className="relative group overflow-hidden inline-flex items-center gap-1.5 px-4 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-blue-600 via-blue-600 to-sky-600 hover:from-blue-500 hover:to-sky-500 rounded-xl shadow-[0_4px_14px_0_rgba(37,99,235,0.35)] hover:shadow-[0_6px_20px_rgba(37,99,235,0.45)] border border-white/20 transition-all duration-200 hover:-translate-y-0.5"
                                    >
                                        <UserPlus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                        <span>Get Started</span>
                                        <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/25 to-transparent pointer-events-none" />
                                    </Link>
                                </>
                            )}

                            {/* Mobile Hamburger Button */}
                            <button
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                className="p-2 sm:p-2.5 rounded-xl bg-white/60 hover:bg-white/95 border border-slate-200/70 text-slate-700 hover:text-blue-600 shadow-xs backdrop-blur-md lg:hidden transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
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
                        <div className="lg:hidden border-t border-slate-200/60 px-4 pt-3 pb-5 space-y-3 bg-white/70 backdrop-blur-xl rounded-b-2xl sm:rounded-b-3xl animate-in fade-in slide-in-from-top-2 duration-200">
                            <div className="flex flex-col space-y-1">
                                {navLinks.map((link) => {
                                    const isActive = activeSection === link.href.substring(1);
                                    return (
                                        <a
                                            key={link.name}
                                            href={link.href}
                                            onClick={(e) => scrollToSection(e, link.href)}
                                            className={`flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${isActive
                                                    ? 'bg-blue-50/80 text-blue-600 font-bold border border-blue-200/60 shadow-xs'
                                                    : 'text-slate-600 hover:text-blue-600 hover:bg-white/60'
                                                }`}
                                        >
                                            <span>{link.name}</span>
                                            <ChevronRight className={`w-4 h-4 transition-transform ${isActive ? 'text-blue-600 translate-x-0.5' : 'text-slate-400'}`} />
                                        </a>
                                    );
                                })}
                            </div>

                            <div className="pt-3 border-t border-slate-200/60 flex flex-col sm:flex-row gap-2">
                                <PwaInstallButton className="w-full justify-center" />
                                {user ? (
                                    <Link
                                        href={dashboardUrl}
                                        className="flex items-center justify-center gap-2 w-full py-2.5 px-4 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md shadow-blue-600/20"
                                    >
                                        <span>Go to Dashboard</span>
                                        <ArrowRight className="w-4 h-4" />
                                    </Link>
                                ) : (
                                    <>
                                        <Link
                                            href="/login"
                                            className="flex items-center justify-center gap-2 w-full py-2.5 px-4 text-sm font-semibold text-slate-700 bg-white/80 hover:bg-white border border-slate-200/80 rounded-xl shadow-xs"
                                        >
                                            <LogIn className="w-4 h-4" />
                                            <span>Log In</span>
                                        </Link>
                                        <Link
                                            href="/register"
                                            className="flex items-center justify-center gap-2 w-full py-2.5 px-4 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md shadow-blue-600/20"
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
