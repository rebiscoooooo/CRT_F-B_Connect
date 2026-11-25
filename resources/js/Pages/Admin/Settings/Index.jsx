import React from 'react';
import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { Settings, Save, BellRing, Building, Mail, ShieldCheck, Clock } from 'lucide-react';

export default function SettingIndex({ settings = {} }) {
    const { data, setData, post, processing, errors } = useForm({
        site_name: settings.site_name || 'CRT F&B Connect',
        institution: settings.institution || 'College of Research & Technology',
        department_name: settings.department_name || 'Food & Beverage Services Management',
        contact_email: settings.contact_email || 'fnb.support@crt.edu.ph',
        contact_phone: settings.contact_phone || '+63 (044) 463-0000',
        allow_registration: String(settings.allow_registration ?? '1'),
        system_announcement: settings.system_announcement || '',
        session_timeout: String(settings.session_timeout ?? '30'),
    });

    const submit = (e) => {
        e.preventDefault();
        post('/admin/settings');
    };

    return (
        <AppLayout title="System Settings">
            <Head title="System Settings — CRT F&B Connect" />

            <div className="max-w-4xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-2xl sm:text-3xl font-black text-[#F4FBFC] tracking-tight">
                        Account &amp; System Settings
                    </h1>
                    <p className="text-xs sm:text-sm text-[#A8E6E8]/70 mt-1">
                        Configure institutional branding, registration controls, and classroom announcements.
                    </p>
                </div>

                <div className="cyber-glass-card overflow-hidden">
                    <form onSubmit={submit} className="p-6 sm:p-8 space-y-6">
                        {/* Active System Brand Seal */}
                        <div className="p-4 bg-[#0B6E8A]/25 rounded-2xl border border-[#A8E6E8]/20 flex flex-col sm:flex-row items-center gap-4">
                            <div className="w-20 h-20 rounded-full bg-[#061923] ring-4 ring-[#2EC4D6]/30 shadow-lg overflow-hidden flex items-center justify-center flex-shrink-0">
                                <img
                                    src="/images/logo-badge.png"
                                    alt="CRT F&B Connect System Logo"
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        e.target.src = '/images/logo.png';
                                    }}
                                />
                            </div>
                            <div className="text-center sm:text-left">
                                <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#2EC4D6] text-[#061923] mb-1">
                                    Active System Logo
                                </span>
                                <h4 className="text-sm font-bold text-[#F4FBFC]">CRT F&amp;B Connect Official Emblem</h4>
                                <p className="text-xs text-[#A8E6E8]/70 mt-0.5">
                                    Displaying across the Public Landing Page, Login/Registration, Navigation Bar, and Sidebar.
                                </p>
                            </div>
                        </div>

                        {/* Institution & Department */}
                        <div>
                            <h3 className="text-sm font-bold text-[#F4FBFC] flex items-center gap-2 mb-4">
                                <Building className="w-4 h-4 text-[#2EC4D6]" />
                                Institutional Configuration
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-[#A8E6E8] uppercase tracking-wider mb-1">
                                        System Portal Name
                                    </label>
                                    <input
                                        type="text"
                                        value={data.site_name}
                                        onChange={(e) => setData('site_name', e.target.value)}
                                        className="cyber-glass-input w-full px-3.5 py-2 text-xs rounded-xl"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-[#A8E6E8] uppercase tracking-wider mb-1">
                                        Institution Name
                                    </label>
                                    <input
                                        type="text"
                                        value={data.institution}
                                        onChange={(e) => setData('institution', e.target.value)}
                                        className="cyber-glass-input w-full px-3.5 py-2 text-xs rounded-xl"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-[#A8E6E8] uppercase tracking-wider mb-1">
                                Department / Program
                            </label>
                            <input
                                type="text"
                                value={data.department_name}
                                onChange={(e) => setData('department_name', e.target.value)}
                                className="cyber-glass-input w-full px-3.5 py-2 text-xs rounded-xl"
                                required
                            />
                        </div>

                        {/* Contact details */}
                        <div className="pt-4 border-t border-[#A8E6E8]/15">
                            <h3 className="text-sm font-bold text-[#F4FBFC] flex items-center gap-2 mb-4">
                                <Mail className="w-4 h-4 text-[#2EC4D6]" />
                                Support &amp; Communication
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-[#A8E6E8] uppercase tracking-wider mb-1">
                                        Contact Email
                                    </label>
                                    <input
                                        type="email"
                                        value={data.contact_email}
                                        onChange={(e) => setData('contact_email', e.target.value)}
                                        className="cyber-glass-input w-full px-3.5 py-2 text-xs rounded-xl"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-[#A8E6E8] uppercase tracking-wider mb-1">
                                        Support Hotline / Phone
                                    </label>
                                    <input
                                        type="text"
                                        value={data.contact_phone}
                                        onChange={(e) => setData('contact_phone', e.target.value)}
                                        className="cyber-glass-input w-full px-3.5 py-2 text-xs rounded-xl"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Student Registration Access */}
                        <div className="pt-4 border-t border-[#A8E6E8]/15">
                            <h3 className="text-sm font-bold text-[#F4FBFC] flex items-center gap-2 mb-4">
                                <ShieldCheck className="w-4 h-4 text-[#2EC4D6]" />
                                Student Enrollment Gate
                            </h3>
                            <div>
                                <label className="block text-xs font-bold text-[#A8E6E8] uppercase tracking-wider mb-1">
                                    Allow Public Student Self-Registration
                                </label>
                                <select
                                    value={data.allow_registration}
                                    onChange={(e) => setData('allow_registration', e.target.value)}
                                    className="cyber-glass-input w-full sm:w-72 px-3.5 py-2 text-xs rounded-xl"
                                >
                                    <option value="1" className="bg-[#061923] text-[#F4FBFC]">Enabled (Students can register online)</option>
                                    <option value="0" className="bg-[#061923] text-[#F4FBFC]">Disabled (Registration closed)</option>
                                </select>
                            </div>
                        </div>

                        {/* Session Security & Auto Inactivity Timeout */}
                        <div className="pt-4 border-t border-[#A8E6E8]/15">
                            <h3 className="text-sm font-bold text-[#F4FBFC] flex items-center gap-2 mb-4">
                                <Clock className="w-4 h-4 text-[#2EC4D6]" />
                                Session Security &amp; Auto-Logout Controls
                            </h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-[#A8E6E8] uppercase tracking-wider mb-1">
                                        Idle Inactivity Timeout
                                    </label>
                                    <select
                                        value={data.session_timeout}
                                        onChange={(e) => setData('session_timeout', e.target.value)}
                                        className="cyber-glass-input w-full sm:w-72 px-3.5 py-2 text-xs rounded-xl"
                                    >
                                        <option value="15" className="bg-[#061923] text-[#F4FBFC]">15 Minutes of Inactivity</option>
                                        <option value="30" className="bg-[#061923] text-[#F4FBFC]">30 Minutes (Recommended)</option>
                                        <option value="60" className="bg-[#061923] text-[#F4FBFC]">60 Minutes (1 Hour)</option>
                                        <option value="120" className="bg-[#061923] text-[#F4FBFC]">120 Minutes (2 Hours)</option>
                                    </select>
                                    <p className="text-[11px] text-[#A8E6E8]/70 mt-1">
                                        Automatically terminates the session and safely logs out inactive users if a workstation, tablet, or smartphone is left unattended.
                                    </p>
                                </div>
                                <div className="p-3.5 bg-[#0B6E8A]/25 rounded-xl border border-[#A8E6E8]/20 text-xs text-[#A8E6E8] flex items-start gap-2.5">
                                    <ShieldCheck className="w-4 h-4 text-[#2EC4D6] flex-shrink-0 mt-0.5" />
                                    <div>
                                        <p className="font-semibold text-[#F4FBFC]">Hardware Back / Undo Button Protection</p>
                                        <p className="text-[11px] text-[#A8E6E8]/80 mt-0.5">
                                            Anti-cache headers and client session guards are active. When any user signs out, clicking the device's back button will immediately redirect to the login screen and block access to cached dashboard data.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* System Announcement Banner */}
                        <div className="pt-4 border-t border-[#A8E6E8]/15">
                            <h3 className="text-sm font-bold text-[#F4FBFC] flex items-center gap-2 mb-4">
                                <BellRing className="w-4 h-4 text-[#2EC4D6]" />
                                Student Classroom Announcement
                            </h3>
                            <div>
                                <label className="block text-xs font-bold text-[#A8E6E8] uppercase tracking-wider mb-1">
                                    Broadcast Notice (Visible on student dashboard banner)
                                </label>
                                <textarea
                                    value={data.system_announcement}
                                    onChange={(e) => setData('system_announcement', e.target.value)}
                                    rows={3}
                                    placeholder="e.g. Practical examination for Table Setup & Silver Service will begin next Monday. Please review the NC II checklists."
                                    className="cyber-glass-input w-full px-3.5 py-2 text-xs rounded-xl"
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-end pt-4 border-t border-[#A8E6E8]/15">
                            <button
                                type="submit"
                                disabled={processing}
                                className="cyber-glow-btn inline-flex items-center gap-2 px-6 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer"
                            >
                                <Save className="w-4 h-4" />
                                {processing ? 'Saving...' : 'Save Configuration'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
