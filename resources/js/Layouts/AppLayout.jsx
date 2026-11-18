import React, { useState } from 'react';
import Navbar from '../Components/Navbar';
import Sidebar from '../Components/Sidebar';
import Toast from '../Components/Toast';
import ErrorBoundary from '../Components/ErrorBoundary';

export default function AppLayout({ children, title }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen bg-slate-50 relative flex flex-col font-sans selection:bg-blue-600 selection:text-white">
            {/* Atmospheric Background Canvas */}
            <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
                {/* Dynamic Base Gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100/70" />

                {/* Subtle Engineering Dot Grid */}
                <div className="absolute inset-0 dashboard-grid-pattern opacity-75" />

                {/* Primary Official Blue & Sky Ambient Glows (Top) */}
                <div className="absolute -top-32 left-1/4 w-[680px] h-[520px] bg-gradient-to-br from-blue-500/18 via-sky-400/15 to-transparent rounded-full blur-3xl transform -rotate-12 animate-pulse [animation-duration:10s]" />
                <div className="absolute -top-10 right-0 w-[550px] h-[480px] bg-gradient-to-bl from-sky-400/18 via-cyan-400/12 to-transparent rounded-full blur-3xl" />

                {/* Harmonic Accent: Soft Indigo / Deep Blue (Middle-Left) */}
                <div className="absolute top-1/3 -left-40 w-[520px] h-[520px] bg-gradient-to-tr from-blue-600/12 via-indigo-500/10 to-transparent rounded-full blur-3xl" />

                {/* Harmonic Warmth: Hospitality Amber Light Accent (Center-Right) */}
                <div className="absolute top-1/2 right-1/4 w-[420px] h-[420px] bg-gradient-to-bl from-amber-400/8 via-sky-300/10 to-transparent rounded-full blur-3xl" />

                {/* Ambient Foundation Glow (Bottom-Right) */}
                <div className="absolute -bottom-36 right-10 w-[620px] h-[500px] bg-gradient-to-tl from-sky-400/16 via-blue-500/10 to-transparent rounded-full blur-3xl" />
            </div>

            {/* Sidebar */}
            <Sidebar
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
            />

            {/* Main Area with dynamic margin for desktop sidebar */}
            <div className="relative z-10 flex-1 lg:pl-64 flex flex-col min-h-screen">
                <Navbar onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

                <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
                    <ErrorBoundary>
                        {children}
                    </ErrorBoundary>
                </main>

                <footer className="py-6 px-6 text-center text-xs text-slate-500 border-t border-slate-200/60 mt-auto bg-white/40 backdrop-blur-md">
                    <p>© {new Date().getFullYear()} CRT F&amp;B Connect — College of Research &amp; Technology Food &amp; Beverage LMS. All rights reserved.</p>
                </footer>
            </div>

            {/* Global Flash Toasts */}
            <Toast />
        </div>
    );
}

