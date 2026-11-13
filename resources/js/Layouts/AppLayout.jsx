import React, { useState } from 'react';
import Navbar from '../Components/Navbar';
import Sidebar from '../Components/Sidebar';
import Toast from '../Components/Toast';
import ErrorBoundary from '../Components/ErrorBoundary';

export default function AppLayout({ children, title }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
            {/* Sidebar */}
            <Sidebar
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
            />

            {/* Main Area with dynamic margin for desktop sidebar */}
            <div className="flex-1 lg:pl-64 flex flex-col min-h-screen">
                <Navbar onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

                <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
                    <ErrorBoundary>
                        {children}
                    </ErrorBoundary>
                </main>

                <footer className="py-6 px-6 text-center text-xs text-slate-400 border-t border-slate-200/60 mt-auto bg-white/40">
                    <p>© {new Date().getFullYear()} CRT F&amp;B Connect — College of Research &amp; Technology Food &amp; Beverage LMS. All rights reserved.</p>
                </footer>
            </div>

            {/* Global Flash Toasts */}
            <Toast />
        </div>
    );
}

