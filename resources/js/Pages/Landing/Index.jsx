import React from 'react';
import { Link, Head, usePage } from '@inertiajs/react';
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
    Download,
    LayoutDashboard
} from 'lucide-react';

export default function Landing({ categories = [], stats = {}, previewResources = [] }) {
    const { auth } = usePage().props;
    const user = auth?.user;
    const dashboardUrl = user?.is_admin
        ? '/admin/dashboard'
        : (user?.status === 'pending' ? '/approval-pending' : '/student/dashboard');

    const categoryIcons = {
        'video-lessons': Video,
        'illustrations': ImageIcon,
        'pdf-modules': FileText,
        'text-lessons': BookOpen,
        'other-materials': Folder,
    };

    return (
        <div className="min-h-screen cyber-grid-container text-[#F4FBFC] font-sans selection:bg-[#2EC4D6] selection:text-[#061923]">
            <Head title="Digital Learning Management System" />

            {/* Professional Glassmorphic Navigation Bar */}
            <LandingNavbar />

            {/* Hero Section */}
            <section className="relative overflow-hidden pt-16 pb-24 sm:pt-24 sm:pb-32">
                <div className="absolute top-1/4 -left-48 w-96 h-96 bg-[#0B6E8A]/25 rounded-full blur-[130px] pointer-events-none" />
                <div className="absolute top-1/3 -right-48 w-96 h-96 bg-[#2EC4D6]/20 rounded-full blur-[110px] pointer-events-none" />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center max-w-3xl mx-auto">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0B6E8A]/25 border border-[#2EC4D6]/40 text-[#2EC4D6] text-xs font-bold uppercase tracking-wider mb-6 animate-in fade-in duration-700">
                            <Sparkles className="w-4 h-4 text-[#2EC4D6]" />
                            Food &amp; Beverage Educational Portal
                        </div>

                        <h1 className="text-4xl sm:text-6xl font-extrabold text-[#F4FBFC] tracking-tight leading-[1.15]">
                            Your Classroom, Connected{' '}
                            <span className="bg-gradient-to-r from-[#2EC4D6] via-[#1ab8cb] to-[#A8E6E8] bg-clip-text text-transparent">
                                Anytime, Anywhere.
                            </span>
                        </h1>

                        <p className="mt-6 text-lg sm:text-xl text-[#A8E6E8]/85 leading-relaxed font-normal">
                            Access your learning materials, explore educational resources, and stay connected with your classroom through CRT F&amp;B Connect — your digital learning companion.
                        </p>

                        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
                            {user ? (
                                <>
                                    <Link
                                        href={dashboardUrl}
                                        className="inline-flex items-center gap-2 px-8 py-4 text-base font-bold text-[#F4FBFC] cyber-glow-btn rounded-2xl transition-all hover:-translate-y-1 cursor-pointer"
                                    >
                                        <LayoutDashboard className="w-5 h-5" />
                                        Return to My Dashboard
                                        <ArrowRight className="w-5 h-5" />
                                    </Link>
                                    <a
                                        href="#preview"
                                        className="inline-flex items-center gap-2 px-8 py-4 text-base font-semibold text-[#A8E6E8] hover:text-[#F4FBFC] cyber-oauth-btn border border-[#A8E6E8]/25 hover:border-[#2EC4D6]/40 rounded-2xl transition-all hover:-translate-y-0.5"
                                    >
                                        Explore Learning Materials
                                    </a>
                                </>
                            ) : (
                                <>
                                    <Link
                                        href="/register"
                                        className="inline-flex items-center gap-2 px-8 py-4 text-base font-bold text-[#F4FBFC] cyber-glow-btn rounded-2xl transition-all hover:-translate-y-1 cursor-pointer"
                                    >
                                        Get Started as a Student
                                        <ArrowRight className="w-5 h-5" />
                                    </Link>
                                    <Link
                                        href="/login"
                                        className="inline-flex items-center gap-2 px-8 py-4 text-base font-semibold text-[#A8E6E8] hover:text-[#F4FBFC] cyber-oauth-btn border border-[#A8E6E8]/25 hover:border-[#2EC4D6]/40 rounded-2xl transition-all hover:-translate-y-0.5 cursor-pointer"
                                    >
                                        Instructor &amp; Student Login
                                    </Link>
                                </>
                            )}
                        </div>

                        {/* Real Dynamic Stats Counters */}
                        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 pt-10 border-t border-[#A8E6E8]/15">
                            <div className="p-4 cyber-glass-card rounded-2xl border border-[#A8E6E8]/20">
                                <p className="text-3xl font-extrabold text-[#2EC4D6]">{stats.total_students ?? 0}</p>
                                <p className="text-xs font-semibold text-[#A8E6E8] mt-1">Active Students</p>
                            </div>
                            <div className="p-4 cyber-glass-card rounded-2xl border border-[#A8E6E8]/20">
                                <p className="text-3xl font-extrabold text-[#F4FBFC]">{stats.total_resources ?? 0}</p>
                                <p className="text-xs font-semibold text-[#A8E6E8] mt-1">Total Materials</p>
                            </div>
                            <div className="p-4 cyber-glass-card rounded-2xl border border-[#A8E6E8]/20">
                                <p className="text-3xl font-extrabold text-[#2EC4D6]">{stats.total_videos ?? 0}</p>
                                <p className="text-xs font-semibold text-[#A8E6E8] mt-1">Video Lessons</p>
                            </div>
                            <div className="p-4 cyber-glass-card rounded-2xl border border-[#A8E6E8]/20">
                                <p className="text-3xl font-extrabold text-[#F4FBFC]">{stats.total_modules ?? 0}</p>
                                <p className="text-xs font-semibold text-[#A8E6E8] mt-1">PDF Modules</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* About Section */}
            <section id="about" className="py-20 bg-[#061923]/85 border-y border-[#A8E6E8]/15 scroll-mt-24 sm:scroll-mt-28">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                        <div className="lg:col-span-6 space-y-6">
                            <span className="text-xs font-bold text-[#2EC4D6] uppercase tracking-widest bg-[#0B6E8A]/25 px-3 py-1 rounded-full border border-[#2EC4D6]/35">
                                About The Platform
                            </span>
                            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#F4FBFC] tracking-tight">
                                Empowering Future Hospitality Leaders Through Modern Digital Learning
                            </h2>
                            <p className="text-[#A8E6E8]/80 leading-relaxed font-normal">
                                CRT F&amp;B Connect is a digital classroom and educational resource management platform specifically tailored for the Food and Beverage Services Management department of the College of Research and Technology.
                            </p>
                            <p className="text-[#A8E6E8]/80 leading-relaxed font-normal">
                                Designed to bridge classroom theory and practical culinary &amp; banquet execution, CRT F&amp;B Connect provides students with instant, centralized, and organized access to high-definition video demonstrations, technical illustrations, standardized TESDA NC II modules, and reference guides.
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                                <div className="flex items-start gap-3">
                                    <CheckCircle className="w-5 h-5 text-[#2EC4D6] flex-shrink-0 mt-0.5" />
                                    <div>
                                        <h4 className="text-sm font-bold text-[#F4FBFC]">TESDA NC II Aligned</h4>
                                        <p className="text-xs text-[#A8E6E8]/70 mt-0.5">Complies with national competency standards.</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <CheckCircle className="w-5 h-5 text-[#2EC4D6] flex-shrink-0 mt-0.5" />
                                    <div>
                                        <h4 className="text-sm font-bold text-[#F4FBFC]">Cross-Device Ready</h4>
                                        <p className="text-xs text-[#A8E6E8]/70 mt-0.5">Seamless on smartphones, tablets, and desktops.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="lg:col-span-6">
                            <div className="relative p-6 sm:p-8 cyber-glass-card rounded-3xl text-white shadow-2xl border border-[#A8E6E8]/25 overflow-hidden">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-[#2EC4D6]/15 rounded-full blur-2xl" />
                                <div className="relative z-10 space-y-6">
                                    <div className="w-12 h-12 rounded-2xl bg-[#0B6E8A]/40 border border-[#2EC4D6]/35 flex items-center justify-center">
                                        <Award className="w-6 h-6 text-[#2EC4D6]" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-[#F4FBFC]">Excellence in Food &amp; Beverage Education</h3>
                                    <p className="text-[#A8E6E8]/80 text-sm leading-relaxed">
                                        From table appointments and silver service etiquette to barista espresso extraction and HACCP food safety standards, CRT F&amp;B Connect equips learners with comprehensive industry skills.
                                    </p>
                                    <div className="pt-4 border-t border-[#A8E6E8]/15 flex items-center justify-between text-xs text-[#A8E6E8]/70">
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
            <section id="mission-vision" className="py-20 scroll-mt-24 sm:scroll-mt-28">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-2xl mx-auto mb-16">
                        <span className="text-xs font-bold text-[#2EC4D6] uppercase tracking-widest bg-[#0B6E8A]/25 px-3 py-1 rounded-full border border-[#2EC4D6]/35">
                            Institutional Guidance
                        </span>
                        <h2 className="text-3xl sm:text-4xl font-extrabold text-[#F4FBFC] tracking-tight mt-3">
                            Vision &amp; Mission
                        </h2>
                        <p className="text-[#A8E6E8]/80 text-sm mt-3 font-normal">
                            Guiding principles driving the Bachelor of Technical-Vocational Teacher Education (BTVTEd) Food &amp; Beverage program.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Vision */}
                        <div className="cyber-glass-card cyber-glass-card-hover p-8 sm:p-10 rounded-3xl border border-[#A8E6E8]/20 relative overflow-hidden group">
                            <div className="w-14 h-14 rounded-2xl bg-[#0B6E8A]/35 border border-[#2EC4D6]/35 text-[#2EC4D6] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <Sparkles className="w-7 h-7" />
                            </div>
                            <h3 className="text-2xl font-bold text-[#F4FBFC] mb-4">Our Vision</h3>
                            <p className="text-[#A8E6E8]/85 leading-relaxed font-normal">
                                &ldquo;To be a premier, accessible, and innovative digital learning platform that empowers Bachelor of Technical-Vocational Teacher Education (BTVTEd) students with industry-standard competencies, bridging theoretical knowledge and practical excellence in Food and Beverage Services.&rdquo;
                            </p>
                        </div>

                        {/* Mission */}
                        <div className="cyber-glass-card cyber-glass-card-hover p-8 sm:p-10 rounded-3xl border border-[#A8E6E8]/20 relative overflow-hidden group">
                            <div className="w-14 h-14 rounded-2xl bg-[#0B6E8A]/35 border border-[#2EC4D6]/35 text-[#2EC4D6] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <Compass className="w-7 h-7" />
                            </div>
                            <h3 className="text-2xl font-bold text-[#F4FBFC] mb-4">Our Mission</h3>
                            <p className="text-[#A8E6E8]/85 leading-relaxed font-normal">
                                &ldquo;To provide a comprehensive, multimedia-enhanced digital handbook system that delivers organized learning materials, clear video demonstrations, step-by-step procedures, and interactive activities, ensuring flexible, self-paced, and engaging skill development for future technical-vocational educators.&rdquo;
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Key Features Section */}
            <section id="features" className="py-20 bg-[#061923]/85 border-y border-[#A8E6E8]/15 scroll-mt-24 sm:scroll-mt-28">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-2xl mx-auto mb-16">
                        <span className="text-xs font-bold text-[#2EC4D6] uppercase tracking-widest bg-[#0B6E8A]/25 px-3 py-1 rounded-full border border-[#2EC4D6]/35">
                            Platform Features
                        </span>
                        <h2 className="text-3xl sm:text-4xl font-extrabold text-[#F4FBFC] tracking-tight mt-3">
                            Everything You Need for Digital Learning
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="p-8 rounded-3xl cyber-glass-card-subtle cyber-glass-card-hover border border-[#A8E6E8]/20 group">
                            <div className="w-12 h-12 rounded-2xl bg-[#0B6E8A]/40 border border-[#2EC4D6]/35 text-[#2EC4D6] flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                                <Video className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold text-[#F4FBFC] mb-2">Video Lesson Streaming</h3>
                            <p className="text-[#A8E6E8]/80 text-sm leading-relaxed font-normal">
                                Watch high-definition culinary masterclasses, bar mixology, and formal banquet table setup demonstrations with custom responsive playback controls.
                            </p>
                        </div>

                        <div className="p-8 rounded-3xl cyber-glass-card-subtle cyber-glass-card-hover border border-[#A8E6E8]/20 group">
                            <div className="w-12 h-12 rounded-2xl bg-[#0B6E8A]/40 border border-[#2EC4D6]/35 text-[#2EC4D6] flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                                <ImageIcon className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold text-[#F4FBFC] mb-2">Technical Illustrations</h3>
                            <p className="text-[#A8E6E8]/80 text-sm leading-relaxed font-normal">
                                Zoom in on high-resolution schematic diagrams for formal dining table covers, glassware anatomy, cutlery spacing, and plate presentations.
                            </p>
                        </div>

                        <div className="p-8 rounded-3xl cyber-glass-card-subtle cyber-glass-card-hover border border-[#A8E6E8]/20 group">
                            <div className="w-12 h-12 rounded-2xl bg-[#0B6E8A]/40 border border-[#2EC4D6]/35 text-[#2EC4D6] flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                                <FileText className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold text-[#F4FBFC] mb-2">In-Browser PDF Modules</h3>
                            <p className="text-[#A8E6E8]/80 text-sm leading-relaxed font-normal">
                                Read TESDA NC II modules, syllabi, HACCP manuals, and study guides with embedded PDF viewing and offline download options.
                            </p>
                        </div>

                        <div className="p-8 rounded-3xl cyber-glass-card-subtle cyber-glass-card-hover border border-[#A8E6E8]/20 group">
                            <div className="w-12 h-12 rounded-2xl bg-[#0B6E8A]/40 border border-[#2EC4D6]/35 text-[#2EC4D6] flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                                <Smartphone className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold text-[#F4FBFC] mb-2">Multi-Device Responsive</h3>
                            <p className="text-[#A8E6E8]/80 text-sm leading-relaxed font-normal">
                                Fully responsive design optimized for smartphones, tablets, laptops, and large desktop screens without horizontal overflow.
                            </p>
                        </div>

                        <div className="p-8 rounded-3xl cyber-glass-card-subtle cyber-glass-card-hover border border-[#A8E6E8]/20 group">
                            <div className="w-12 h-12 rounded-2xl bg-[#0B6E8A]/40 border border-[#2EC4D6]/35 text-[#2EC4D6] flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                                <ShieldCheck className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold text-[#F4FBFC] mb-2">Role-Based Security</h3>
                            <p className="text-[#A8E6E8]/80 text-sm leading-relaxed font-normal">
                                Robust server-side authorization separating Administrator/Teacher privileges from student access with verified authentication.
                            </p>
                        </div>

                        <div className="p-8 rounded-3xl cyber-glass-card-subtle cyber-glass-card-hover border border-[#A8E6E8]/20 group">
                            <div className="w-12 h-12 rounded-2xl bg-[#0B6E8A]/40 border border-[#2EC4D6]/35 text-[#2EC4D6] flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                                <Folder className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold text-[#F4FBFC] mb-2">Organized Folders</h3>
                            <p className="text-[#A8E6E8]/80 text-sm leading-relaxed font-normal">
                                Multi-level category and folder structure with breadcrumb navigation, search filters, and quick categorization.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Learning Resources Preview */}
            <section id="preview" className="py-20 scroll-mt-24 sm:scroll-mt-28">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12">
                        <div>
                            <span className="text-xs font-bold text-[#2EC4D6] uppercase tracking-widest bg-[#0B6E8A]/25 px-3 py-1 rounded-full border border-[#2EC4D6]/35">
                                Educational Library
                            </span>
                            <h2 className="text-3xl font-extrabold text-[#F4FBFC] tracking-tight mt-3">
                                Learning Resources Preview
                            </h2>
                        </div>
                        <Link
                            href={user ? dashboardUrl : '/login'}
                            className="mt-4 sm:mt-0 text-sm font-semibold text-[#2EC4D6] hover:text-[#F4FBFC] inline-flex items-center gap-1.5 transition-colors"
                        >
                            {user ? 'Go to dashboard to browse materials' : 'Log in to browse all materials'}
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
                                    className="p-6 cyber-glass-card cyber-glass-card-hover rounded-2xl border border-[#A8E6E8]/20 group"
                                >
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="p-3 rounded-xl bg-[#0B6E8A]/40 border border-[#2EC4D6]/35 text-[#2EC4D6] group-hover:scale-110 transition-transform">
                                            <IconComponent className="w-6 h-6" />
                                        </div>
                                        <span className="text-xs font-semibold px-2.5 py-1 bg-[#0A3D4F]/60 text-[#A8E6E8] rounded-full border border-[#A8E6E8]/20">
                                            {cat.resources_count} {cat.resources_count === 1 ? 'material' : 'materials'}
                                        </span>
                                    </div>
                                    <h3 className="text-lg font-bold text-[#F4FBFC] group-hover:text-[#2EC4D6] transition-colors">
                                        {cat.name}
                                    </h3>
                                    <p className="text-xs text-[#A8E6E8]/70 mt-2 line-clamp-2 leading-relaxed font-normal">
                                        {cat.description}
                                    </p>
                                    <div className="mt-4 pt-4 border-t border-[#A8E6E8]/15 flex items-center justify-between">
                                        <Link
                                            href={user ? dashboardUrl : '/login'}
                                            className="text-xs font-semibold text-[#2EC4D6] group-hover:text-[#F4FBFC] group-hover:translate-x-1 transition-all inline-flex items-center gap-1"
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
            <section id="benefits" className="py-20 bg-[#061923]/85 border-y border-[#A8E6E8]/15 scroll-mt-24 sm:scroll-mt-28">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-2xl mx-auto mb-16">
                        <span className="text-xs font-bold text-[#2EC4D6] uppercase tracking-widest bg-[#0B6E8A]/25 px-3 py-1 rounded-full border border-[#2EC4D6]/35">
                            Why CRT F&amp;B Connect
                        </span>
                        <h2 className="text-3xl sm:text-4xl font-extrabold text-[#F4FBFC] tracking-tight mt-3">
                            Platform Benefits
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Student Benefits */}
                        <div className="p-8 rounded-3xl cyber-glass-card border border-[#A8E6E8]/20 space-y-4">
                            <span className="inline-block px-3 py-1 text-xs font-bold uppercase cyber-glow-btn text-[#F4FBFC] rounded-full">
                                For Students
                            </span>
                            <h3 className="text-2xl font-bold text-[#F4FBFC]">Learn at Your Own Pace</h3>
                            <ul className="space-y-3 pt-2 text-sm text-[#A8E6E8]/85 font-normal">
                                <li className="flex items-start gap-2.5">
                                    <CheckCircle className="w-5 h-5 text-[#2EC4D6] flex-shrink-0 mt-0.5" />
                                    <span>Stream instructional video lessons repeatedly before practical return demos.</span>
                                </li>
                                <li className="flex items-start gap-2.5">
                                    <CheckCircle className="w-5 h-5 text-[#2EC4D6] flex-shrink-0 mt-0.5" />
                                    <span>Download official TESDA NC II modules for offline study on mobile devices.</span>
                                </li>
                                <li className="flex items-start gap-2.5">
                                    <CheckCircle className="w-5 h-5 text-[#2EC4D6] flex-shrink-0 mt-0.5" />
                                    <span>Access high-res table cover blueprints and cutlery setup guides anywhere.</span>
                                </li>
                            </ul>
                        </div>

                        {/* Instructor Benefits */}
                        <div className="p-8 rounded-3xl cyber-glass-card border border-[#A8E6E8]/20 space-y-4">
                            <span className="inline-block px-3 py-1 text-xs font-bold uppercase bg-[#0B6E8A]/50 text-[#A8E6E8] border border-[#2EC4D6]/30 rounded-full">
                                For Instructors &amp; Administrators
                            </span>
                            <h3 className="text-2xl font-bold text-[#F4FBFC]">Seamless Resource Management</h3>
                            <ul className="space-y-3 pt-2 text-sm text-[#A8E6E8]/85 font-normal">
                                <li className="flex items-start gap-2.5">
                                    <CheckCircle className="w-5 h-5 text-[#2EC4D6] flex-shrink-0 mt-0.5" />
                                    <span>Centralize course syllabi, assessment rubrics, and video materials in one place.</span>
                                </li>
                                <li className="flex items-start gap-2.5">
                                    <CheckCircle className="w-5 h-5 text-[#2EC4D6] flex-shrink-0 mt-0.5" />
                                    <span>Track real-time student engagement, resource views, and download counts.</span>
                                </li>
                                <li className="flex items-start gap-2.5">
                                    <CheckCircle className="w-5 h-5 text-[#2EC4D6] flex-shrink-0 mt-0.5" />
                                    <span>Easily organize files into structured multi-level categories and folders.</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-gradient-to-b from-[#0B6E8A]/35 via-[#0A3D4F]/80 to-[#061923] text-white relative overflow-hidden border-t border-[#A8E6E8]/20">
                <div className="absolute top-0 right-0 w-96 h-96 bg-[#2EC4D6]/20 rounded-full blur-[130px] pointer-events-none" />
                <div className="max-w-4xl mx-auto px-4 text-center relative z-10 space-y-6">
                    <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#F4FBFC]">
                        Ready to Connect with Your Classroom?
                    </h2>
                    <p className="text-[#A8E6E8]/85 text-base sm:text-lg max-w-2xl mx-auto font-normal">
                        Join your fellow CRT Food and Beverage students and instructors today. Experience convenient, organized access to all your educational materials.
                    </p>
                    <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
                        {user ? (
                            <Link
                                href={dashboardUrl}
                                className="inline-flex items-center gap-2 px-8 py-4 text-base font-bold text-[#F4FBFC] cyber-glow-btn rounded-2xl shadow-xl transition-all hover:scale-105 cursor-pointer"
                            >
                                <LayoutDashboard className="w-5 h-5 text-[#F4FBFC]" />
                                Return to Classroom Dashboard
                                <ArrowRight className="w-5 h-5" />
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href="/register"
                                    className="inline-flex items-center gap-2 px-8 py-4 text-base font-bold text-[#F4FBFC] cyber-glow-btn rounded-2xl shadow-xl transition-all hover:scale-105 cursor-pointer"
                                >
                                    Register as a Student
                                    <ArrowRight className="w-5 h-5" />
                                </Link>
                                <Link
                                    href="/login"
                                    className="inline-flex items-center gap-2 px-8 py-4 text-base font-semibold text-[#A8E6E8] hover:text-[#F4FBFC] cyber-oauth-btn border border-[#A8E6E8]/25 rounded-2xl transition-all cursor-pointer"
                                >
                                    Sign In to Portal
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-[#061923] text-[#A8E6E8]/70 py-12 border-t border-[#A8E6E8]/15 text-xs">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                    <div className="space-y-3 md:col-span-2">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-[#0B6E8A]/30 border border-[#2EC4D6]/40 overflow-hidden flex items-center justify-center">
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
                                <span className="text-base font-bold text-[#F4FBFC] block">CRT F&amp;B Connect</span>
                                <span className="text-[10px] text-[#2EC4D6] font-semibold uppercase tracking-wider">Digital LMS</span>
                            </div>
                        </div>
                        <p className="text-[#A8E6E8]/70 text-xs max-w-md leading-relaxed font-normal">
                            College of Research &amp; Technology — Department of Food and Beverage Services Management. Digital Learning Management System designed for 24/7 classroom connectivity.
                        </p>
                    </div>
                    <div>
                        <h4 className="text-xs font-bold text-[#F4FBFC] uppercase tracking-wider mb-3">Quick Links</h4>
                        <ul className="space-y-2">
                            <li><a href="#about" className="hover:text-[#2EC4D6] transition-colors">About</a></li>
                            <li><a href="#mission-vision" className="hover:text-[#2EC4D6] transition-colors">Vision &amp; Mission</a></li>
                            <li><a href="#features" className="hover:text-[#2EC4D6] transition-colors">Features</a></li>
                            <li><a href="#preview" className="hover:text-[#2EC4D6] transition-colors">Resources Preview</a></li>
                            <li><a href="#benefits" className="hover:text-[#2EC4D6] transition-colors">Benefits</a></li>
                            {user ? (
                                <li><Link href={dashboardUrl} className="text-[#2EC4D6] font-bold hover:text-[#F4FBFC] transition-colors">My Dashboard</Link></li>
                            ) : (
                                <>
                                    <li><Link href="/login" className="hover:text-[#2EC4D6] transition-colors">Portal Login</Link></li>
                                    <li><Link href="/register" className="hover:text-[#2EC4D6] transition-colors">Student Registration</Link></li>
                                </>
                            )}
                        </ul>
                    </div>
                </div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 border-t border-[#A8E6E8]/15 text-center">
                    <p>© {new Date().getFullYear()} CRT F&amp;B Connect. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}
