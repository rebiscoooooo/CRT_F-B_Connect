import React from 'react';
import { Link, Head } from '@inertiajs/react';
import LandingNavbar from '@/Components/LandingNavbar';
import {
    GraduationCap,
    Video,
    FileText,
    Image as ImageIcon,
    BookOpen,
    Folder,
    CheckCircle,
    ArrowRight,
    Sparkles,
    ShieldCheck,
    Smartphone,
    Award,
    Compass,
    Download
} from 'lucide-react';

export default function Landing({ categories = [], stats = {}, previewResources = [] }) {
    const categoryIcons = {
        'video-lessons': Video,
        'illustrations': ImageIcon,
        'pdf-modules': FileText,
        'text-lessons': BookOpen,
        'other-materials': Folder,
    };

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-600 selection:text-white">
            <Head title="Digital Learning Management System" />

                    {/* Professional Glassmorphic Navigation Bar */}
                    <LandingNavbar />

            {/* Hero Section */}
            <section className="relative overflow-hidden pt-16 pb-24 sm:pt-24 sm:pb-32">
                <div className="absolute top-1/4 -left-48 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute top-1/3 -right-48 w-96 h-96 bg-sky-300/20 rounded-full blur-3xl pointer-events-none" />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center max-w-3xl mx-auto">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-200/60 text-blue-700 text-xs font-bold uppercase tracking-wider mb-6 animate-in fade-in duration-700">
                            <Sparkles className="w-4 h-4 text-blue-600" />
                            Food &amp; Beverage Educational Portal
                        </div>

                        <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
                            Your Classroom, Connected{' '}
                            <span className="bg-gradient-to-r from-blue-600 to-sky-500 bg-clip-text text-transparent">
                                Anytime, Anywhere.
                            </span>
                        </h1>

                        <p className="mt-6 text-lg sm:text-xl text-slate-600 leading-relaxed">
                            Access your learning materials, explore educational resources, and stay connected with your classroom through CRT F&amp;B Connect — your digital learning companion.
                        </p>

                        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
                            <Link
                                href="/register"
                                className="inline-flex items-center gap-2 px-8 py-4 text-base font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-2xl shadow-xl shadow-blue-600/25 hover:shadow-2xl hover:shadow-blue-600/35 transition-all hover:-translate-y-1"
                            >
                                Get Started as a Student
                                <ArrowRight className="w-5 h-5" />
                            </Link>
                            <Link
                                href="/login"
                                className="inline-flex items-center gap-2 px-8 py-4 text-base font-bold text-slate-800 bg-white hover:bg-slate-50 border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5"
                            >
                                Instructor &amp; Student Login
                            </Link>
                        </div>

                        {/* Real Dynamic Stats Counters */}
                        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 pt-10 border-t border-slate-200/80">
                            <div className="p-4 bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200 shadow-xs">
                                <p className="text-3xl font-extrabold text-blue-600">{stats.total_students || '100+'}</p>
                                <p className="text-xs font-semibold text-slate-500 mt-1">Active Students</p>
                            </div>
                            <div className="p-4 bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200 shadow-xs">
                                <p className="text-3xl font-extrabold text-slate-900">{stats.total_resources || '25+'}</p>
                                <p className="text-xs font-semibold text-slate-500 mt-1">Total Materials</p>
                            </div>
                            <div className="p-4 bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200 shadow-xs">
                                <p className="text-3xl font-extrabold text-blue-600">{stats.total_videos || '10+'}</p>
                                <p className="text-xs font-semibold text-slate-500 mt-1">Video Lessons</p>
                            </div>
                            <div className="p-4 bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200 shadow-xs">
                                <p className="text-3xl font-extrabold text-slate-900">{stats.total_modules || '15+'}</p>
                                <p className="text-xs font-semibold text-slate-500 mt-1">PDF Modules</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* About Section */}
                <section id="about" className="py-20 bg-white border-y border-slate-200/70 scroll-mt-24 sm:scroll-mt-28">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                            <div className="lg:col-span-6 space-y-6">
                                <span className="text-xs font-bold text-blue-600 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                                    About The Platform
                                </span>
                                <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                                    Empowering Future Hospitality Leaders Through Modern Digital Learning
                                </h2>
                                <p className="text-slate-600 leading-relaxed">
                                    CRT F&amp;B Connect is a digital classroom and educational resource management platform specifically tailored for the Food and Beverage Services Management department of the College of Research and Technology.
                                </p>
                                <p className="text-slate-600 leading-relaxed">
                                    Designed to bridge classroom theory and practical culinary &amp; banquet execution, CRT F&amp;B Connect provides students with instant, centralized, and organized access to high-definition video demonstrations, technical illustrations, standardized TESDA NC II modules, and reference guides.
                                </p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                                    <div className="flex items-start gap-3">
                                        <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                                        <div>
                                            <h4 className="text-sm font-bold text-slate-900">TESDA NC II Aligned</h4>
                                            <p className="text-xs text-slate-500 mt-0.5">Complies with national competency standards.</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                                        <div>
                                            <h4 className="text-sm font-bold text-slate-900">Cross-Device Ready</h4>
                                            <p className="text-xs text-slate-500 mt-0.5">Seamless on smartphones, tablets, and desktops.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="lg:col-span-6">
                                <div className="relative p-6 sm:p-8 bg-gradient-to-br from-blue-900 via-blue-800 to-slate-900 rounded-3xl text-white shadow-2xl overflow-hidden">
                                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/20 rounded-full blur-2xl" />
                                    <div className="relative z-10 space-y-6">
                                        <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center">
                                            <Award className="w-6 h-6 text-sky-400" />
                                        </div>
                                        <h3 className="text-2xl font-bold">Excellence in Food &amp; Beverage Education</h3>
                                        <p className="text-slate-300 text-sm leading-relaxed">
                                            From table appointments and silver service etiquette to barista espresso extraction and HACCP food safety standards, CRT F&amp;B Connect equips learners with comprehensive industry skills.
                                        </p>
                                        <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs text-slate-300">
                                            <span>Curriculum-Aligned</span>
                                            <span>•</span>
                                            <span>Interactive Viewers</span>
                                            <span>•</span>
                                            <span>Secure Role Access</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Mission and Vision Section */}
                    <section id="mission-vision" className="py-20 bg-slate-50 scroll-mt-24 sm:scroll-mt-28">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="text-center max-w-2xl mx-auto mb-16">
                                <span className="text-xs font-bold text-blue-600 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                                    Institutional Guidance
                                </span>
                                <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-3">
                                    Vision &amp; Mission
                                </h2>
                                <p className="text-slate-600 text-sm mt-3">
                                    Guiding principles driving the Bachelor of Technical-Vocational Teacher Education (BTVTEd) Food &amp; Beverage program.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* Vision */}
                                <div className="bg-white p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                                    <div className="w-14 h-14 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                        <Sparkles className="w-7 h-7" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-slate-900 mb-4">Our Vision</h3>
                                    <p className="text-slate-600 leading-relaxed">
                                        &ldquo;To be a premier, accessible, and innovative digital learning platform that empowers Bachelor of Technical-Vocational Teacher Education (BTVTEd) students with industry-standard competencies, bridging theoretical knowledge and practical excellence in Food and Beverage Services.&rdquo;
                                    </p>
                                </div>

                                {/* Mission */}
                                <div className="bg-white p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                                    <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                        <Compass className="w-7 h-7" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-slate-900 mb-4">Our Mission</h3>
                                    <p className="text-slate-600 leading-relaxed">
                                        &ldquo;To provide a comprehensive, multimedia-enhanced digital handbook system that delivers organized learning materials, clear video demonstrations, step-by-step procedures, and interactive activities, ensuring flexible, self-paced, and engaging skill development for future technical-vocational educators.&rdquo;
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Key Features Section */}
                        <section id="features" className="py-20 bg-white border-y border-slate-200/70 scroll-mt-24 sm:scroll-mt-28">
                            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                                <div className="text-center max-w-2xl mx-auto mb-16">
                                    <span className="text-xs font-bold text-blue-600 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                                        Platform Features
                                    </span>
                                    <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-3">
                                        Everything You Need for Digital Learning
                                    </h2>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                    <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200/80 hover:border-blue-300 transition-all group">
                                        <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                                            <Video className="w-6 h-6" />
                                        </div>
                                        <h3 className="text-xl font-bold text-slate-900 mb-2">Video Lesson Streaming</h3>
                                        <p className="text-slate-600 text-sm leading-relaxed">
                                            Watch high-definition culinary masterclasses, bar mixology, and formal banquet table setup demonstrations with custom responsive playback controls.
                                        </p>
                                    </div>

                                    <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200/80 hover:border-blue-300 transition-all group">
                                        <div className="w-12 h-12 rounded-2xl bg-sky-500 text-white flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                                            <ImageIcon className="w-6 h-6" />
                                        </div>
                                        <h3 className="text-xl font-bold text-slate-900 mb-2">Technical Illustrations</h3>
                                        <p className="text-slate-600 text-sm leading-relaxed">
                                            Zoom in on high-resolution schematic diagrams for formal dining table covers, glassware anatomy, cutlery spacing, and plate presentations.
                                        </p>
                                    </div>

                                    <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200/80 hover:border-blue-300 transition-all group">
                                        <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                                            <FileText className="w-6 h-6" />
                                        </div>
                                        <h3 className="text-xl font-bold text-slate-900 mb-2">In-Browser PDF Modules</h3>
                                        <p className="text-slate-600 text-sm leading-relaxed">
                                            Read TESDA NC II modules, syllabi, HACCP manuals, and study guides with embedded PDF viewing and offline download options.
                                        </p>
                                    </div>

                                    <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200/80 hover:border-blue-300 transition-all group">
                                        <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                                            <Smartphone className="w-6 h-6" />
                                        </div>
                                        <h3 className="text-xl font-bold text-slate-900 mb-2">Multi-Device Responsive</h3>
                                        <p className="text-slate-600 text-sm leading-relaxed">
                                            Fully responsive design optimized for smartphones, tablets, laptops, and large desktop screens without horizontal overflow.
                                        </p>
                                    </div>

                                    <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200/80 hover:border-blue-300 transition-all group">
                                        <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                                            <ShieldCheck className="w-6 h-6" />
                                        </div>
                                        <h3 className="text-xl font-bold text-slate-900 mb-2">Role-Based Security</h3>
                                        <p className="text-slate-600 text-sm leading-relaxed">
                                            Robust server-side authorization separating Administrator/Teacher privileges from student access with verified authentication.
                                        </p>
                                    </div>

                                    <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200/80 hover:border-blue-300 transition-all group">
                                        <div className="w-12 h-12 rounded-2xl bg-purple-600 text-white flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                                            <Folder className="w-6 h-6" />
                                        </div>
                                        <h3 className="text-xl font-bold text-slate-900 mb-2">Organized Folders</h3>
                                        <p className="text-slate-600 text-sm leading-relaxed">
                                            Multi-level category and folder structure with breadcrumb navigation, search filters, and quick categorization.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Learning Resources Preview */}
                            <section id="preview" className="py-20 bg-slate-50 scroll-mt-24 sm:scroll-mt-28">
                                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                                    <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12">
                                        <div>
                                            <span className="text-xs font-bold text-blue-600 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                                                Educational Library
                                            </span>
                                            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-3">
                                                Learning Resources Preview
                                            </h2>
                                        </div>
                                        <Link
                                            href="/login"
                                            className="mt-4 sm:mt-0 text-sm font-bold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1.5"
                                        >
                                            Log in to browse all materials
                                            <ArrowRight className="w-4 h-4" />
                                        </Link>
                                    </div>

                                    {/* Category Cards */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {categories.map((cat) => {
                                            const IconComponent = categoryIcons[cat.slug] || Folder;
                                            return (
                                                <div
                                                    key={cat.id}
                                                    className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm hover:border-blue-300 hover:shadow-md transition-all group"
                                                >
                                                    <div className="flex items-center justify-between mb-4">
                                                        <div className="p-3 rounded-xl bg-blue-50 text-blue-600 group-hover:scale-110 transition-transform">
                                                            <IconComponent className="w-6 h-6" />
                                                        </div>
                                                        <span className="text-xs font-bold px-2.5 py-1 bg-slate-100 text-slate-700 rounded-full">
                                                            {cat.resources_count} {cat.resources_count === 1 ? 'material' : 'materials'}
                                                        </span>
                                                    </div>
                                                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                                                        {cat.name}
                                                    </h3>
                                                    <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                                                        {cat.description}
                                                    </p>
                                                    <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
                                                        <Link
                                                            href="/login"
                                                            className="text-xs font-bold text-blue-600 group-hover:translate-x-1 transition-transform inline-flex items-center gap-1"
                                                        >
                                                            View Resources
                                                            <ArrowRight className="w-3.5 h-3.5" />
                                                        </Link>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </section>

                            {/* Benefits Section */}
                                <section id="benefits" className="py-20 bg-white border-y border-slate-200/70 scroll-mt-24 sm:scroll-mt-28">
                                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                                        <div className="text-center max-w-2xl mx-auto mb-16">
                                            <span className="text-xs font-bold text-blue-600 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                                                Why CRT F&amp;B Connect
                                            </span>
                                            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-3">
                                                Platform Benefits
                                            </h2>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            {/* Student Benefits */}
                                            <div className="p-8 rounded-3xl bg-blue-50/50 border border-blue-100 space-y-4">
                                                <span className="inline-block px-3 py-1 text-xs font-bold uppercase bg-blue-600 text-white rounded-full">
                                                    For Students
                                                </span>
                                                <h3 className="text-2xl font-bold text-slate-900">Learn at Your Own Pace</h3>
                                                <ul className="space-y-3 pt-2 text-sm text-slate-600">
                                                    <li className="flex items-start gap-2.5">
                                                        <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                                                        <span>Stream instructional video lessons repeatedly before practical return demos.</span>
                                                    </li>
                                                    <li className="flex items-start gap-2.5">
                                                        <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                                                        <span>Download official TESDA NC II modules for offline study on mobile devices.</span>
                                                    </li>
                                                    <li className="flex items-start gap-2.5">
                                                        <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                                                        <span>Access high-res table cover blueprints and cutlery setup guides anywhere.</span>
                                                    </li>
                                                </ul>
                                            </div>

                                            {/* Instructor Benefits */}
                                            <div className="p-8 rounded-3xl bg-sky-50/50 border border-sky-100 space-y-4">
                                                <span className="inline-block px-3 py-1 text-xs font-bold uppercase bg-slate-900 text-white rounded-full">
                                                    For Instructors &amp; Administrators
                                                </span>
                                                <h3 className="text-2xl font-bold text-slate-900">Seamless Resource Management</h3>
                                                <ul className="space-y-3 pt-2 text-sm text-slate-600">
                                                    <li className="flex items-start gap-2.5">
                                                        <CheckCircle className="w-5 h-5 text-sky-600 flex-shrink-0 mt-0.5" />
                                                        <span>Centralize course syllabi, assessment rubrics, and video materials in one place.</span>
                                                    </li>
                                                    <li className="flex items-start gap-2.5">
                                                        <CheckCircle className="w-5 h-5 text-sky-600 flex-shrink-0 mt-0.5" />
                                                        <span>Track real-time student engagement, resource views, and download counts.</span>
                                                    </li>
                                                    <li className="flex items-start gap-2.5">
                                                        <CheckCircle className="w-5 h-5 text-sky-600 flex-shrink-0 mt-0.5" />
                                                        <span>Easily organize files into structured multi-level categories and folders.</span>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </section>

                                {/* CTA Section */}
                                <section className="py-20 bg-slate-900 text-white relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
                                    <div className="max-w-4xl mx-auto px-4 text-center relative z-10 space-y-6">
                                        <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
                                            Ready to Connect with Your Classroom?
                                        </h2>
                                        <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto">
                                            Join your fellow CRT Food and Beverage students and instructors today. Experience convenient, organized access to all your educational materials.
                                        </p>
                                        <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
                                            <Link
                                                href="/register"
                                                className="inline-flex items-center gap-2 px-8 py-4 text-base font-bold text-slate-900 bg-white hover:bg-slate-100 rounded-2xl shadow-xl transition-all hover:scale-105"
                                            >
                                                Register as a Student
                                                <ArrowRight className="w-5 h-5" />
                                            </Link>
                                            <Link
                                                href="/login"
                                                className="inline-flex items-center gap-2 px-8 py-4 text-base font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-2xl shadow-lg transition-all"
                                            >
                                                Sign In to Portal
                                            </Link>
                                        </div>
                                    </div>
                                </section>

                                {/* Footer */}
                                <footer className="bg-slate-950 text-slate-400 py-12 border-t border-slate-800 text-xs">
                                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                                        <div className="space-y-3 md:col-span-2">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-white ring-2 ring-blue-500/30 overflow-hidden flex items-center justify-center">
                                                    <img
                                                        src="/images/logo-badge.png"
                                                        alt="CRT F&B Connect"
                                                        className="w-full h-full object-cover"
                                                        onError={(e) => {
                                                            e.target.src = '/images/logo.png';
                                                        }}
                                                    />
                                                </div>
                                                <div>
                                                    <span className="text-base font-bold text-white block">CRT F&amp;B Connect</span>
                                                    <span className="text-[10px] text-blue-400 font-semibold uppercase tracking-wider">Digital LMS</span>
                                                </div>
                                            </div>
                                            <p className="text-slate-400 text-xs max-w-md leading-relaxed">
                                                College of Research &amp; Technology — Department of Food and Beverage Services Management. Digital Learning Management System designed for 24/7 classroom connectivity.
                                            </p>
                                        </div>
                                        <div>
                                            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Quick Links</h4>
                                            <ul className="space-y-2">
                                                <li><a href="#about" className="hover:text-white transition-colors">About</a></li>
                                                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                                                <li><a href="#preview" className="hover:text-white transition-colors">Resources Preview</a></li>
                                                <li><Link href="/login" className="hover:text-white transition-colors">Portal Login</Link></li>
                                                <li><Link href="/register" className="hover:text-white transition-colors">Student Registration</Link></li>
                                            </ul>
                                        </div>
                                    </div>
                                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 border-t border-slate-800 text-center">
                                        <p>© {new Date().getFullYear()} CRT F&amp;B Connect. All rights reserved.</p>
                                    </div>
                                </footer>
                            </div>
                            );
}

