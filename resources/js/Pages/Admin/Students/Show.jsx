import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import Modal from '@/Components/Modal';
import {
    ArrowLeft,
    User,
    Mail,
    Phone,
    Calendar,
    Activity,
    Shield,
    CheckCircle,
    XCircle,
    Edit3,
    Trash2
} from 'lucide-react';

export default function StudentShow({ student, activities = [] }) {
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [editForm, setEditForm] = useState({ ...student });

    const handleApprove = () => {
        if (confirm(`Approve student account for ${student.name} (${student.student_number})? This grants them access to learning modules.`)) {
            router.post(`/admin/students/${student.id}/approve`);
        }
    };

    const handleToggleStatus = () => {
        router.post(`/admin/students/${student.id}/toggle-status`);
    };

    const handleEditSubmit = (e) => {
        e.preventDefault();
        router.put(`/admin/students/${student.id}`, editForm, {
            onSuccess: () => setIsEditOpen(false),
        });
    };

    return (
        <AppLayout title={`Student: ${student.name}`}>
            <Head title={`Student: ${student.name} — CRT F&B Connect`} />

            {/* Back link */}
            <div className="mb-6">
                <Link
                    href="/admin/students"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#A8E6E8] hover:text-[#2EC4D6] transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Student Directory
                </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Profile Card (Left 5 cols) */}
                <div className="lg:col-span-5 space-y-6">
                    <div className="cyber-glass-card p-6 sm:p-8 text-center relative overflow-hidden">
                        <div className="absolute top-0 inset-x-0 h-24 bg-gradient-to-r from-[#0B6E8A] via-[#1ab8cb] to-[#2EC4D6]" />

                        <div className="relative pt-8">
                            <img
                                src={student.avatar_url}
                                alt={student.name}
                                className="w-24 h-24 rounded-2xl object-cover mx-auto ring-4 ring-[#2EC4D6]/40 shadow-xl"
                            />
                            <h2 className="mt-4 text-xl font-black text-[#F4FBFC]">{student.name}</h2>
                            <p className="text-xs font-mono font-bold text-[#2EC4D6] mt-0.5">{student.student_number}</p>
                            <span className={`inline-block px-3 py-1 mt-2 text-[10px] font-bold uppercase rounded-full border ${
                                student.status === 'active'
                                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                                    : student.status === 'pending'
                                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                                    : 'bg-[#2EC4D6]/20 text-[#2EC4D6] border-[#2EC4D6]/40'
                            }`}>
                                {student.status === 'pending' ? 'Pending Approval' : student.status}
                            </span>
                        </div>

                        <div className="mt-6 pt-6 border-t border-[#A8E6E8]/15 text-left space-y-3 text-xs">
                            <div className="flex items-center gap-3 text-[#F4FBFC]">
                                <Mail className="w-4 h-4 text-[#2EC4D6] flex-shrink-0" />
                                <span className="truncate">{student.email}</span>
                            </div>
                            <div className="flex items-center gap-3 text-[#F4FBFC]">
                                <Phone className="w-4 h-4 text-[#2EC4D6] flex-shrink-0" />
                                <span>{student.contact_number || 'No contact number provided'}</span>
                            </div>
                            <div className="flex items-center gap-3 text-[#A8E6E8]">
                                <Calendar className="w-4 h-4 text-[#2EC4D6] flex-shrink-0" />
                                <span>Enrolled {new Date(student.created_at).toLocaleDateString([], { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                            </div>
                            {student.approved_at && (
                                <div className="flex items-center gap-3 text-emerald-300 bg-emerald-500/15 p-2.5 rounded-xl border border-emerald-500/30">
                                    <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                                    <span>
                                        Approved by {student.approver?.name || 'Administrator'} on {new Date(student.approved_at).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                                    </span>
                                </div>
                            )}
                        </div>

                        <div className="mt-6 pt-6 border-t border-[#A8E6E8]/15 flex flex-wrap items-center justify-center gap-2">
                            {student.status === 'pending' && (
                                <button
                                    onClick={handleApprove}
                                    className="px-4 py-2 text-xs font-bold rounded-xl text-white bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 shadow-md shadow-emerald-500/20 transition-all flex items-center gap-1.5 cursor-pointer"
                                >
                                    <CheckCircle className="w-4 h-4" />
                                    Approve Account
                                </button>
                            )}
                            <button
                                onClick={handleToggleStatus}
                                className={`px-4 py-2 text-xs font-bold rounded-xl border transition-colors cursor-pointer ${
                                    student.status === 'active'
                                        ? 'bg-[#2EC4D6]/15 text-[#2EC4D6] border-[#2EC4D6]/30 hover:bg-[#0B6E8A]/25'
                                        : 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/25'
                                }`}
                            >
                                {student.status === 'active' ? 'Deactivate Account' : 'Activate Account'}
                            </button>
                            <button
                                onClick={() => setIsEditOpen(true)}
                                className="cyber-oauth-btn px-4 py-2 text-xs font-bold rounded-xl"
                            >
                                Edit Profile
                            </button>
                        </div>
                    </div>
                </div>

                {/* Activity Trail (Right 7 cols) */}
                <div className="lg:col-span-7">
                    <div className="cyber-glass-card p-6 sm:p-8">
                        <h3 className="text-base font-bold text-[#F4FBFC] mb-1 flex items-center gap-2">
                            <Activity className="w-5 h-5 text-[#2EC4D6]" />
                            Student Learning Activity Log
                        </h3>
                        <p className="text-xs text-[#A8E6E8]/70 mb-6">
                            Record of resource downloads, module views, and logins.
                        </p>

                        <div className="divide-y divide-[#A8E6E8]/10">
                            {activities.length > 0 ? (
                                activities.map((act) => (
                                    <div key={act.id} className="py-3.5 flex items-start gap-3 text-xs">
                                        <div className="p-2 rounded-xl bg-[#0B6E8A]/30 border border-[#A8E6E8]/20 text-[#2EC4D6] flex-shrink-0 mt-0.5">
                                            <Activity className="w-3.5 h-3.5" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-semibold text-[#F4FBFC] leading-snug">{act.description}</p>
                                            <div className="flex items-center gap-3 mt-1 text-[11px] text-[#A8E6E8]/60">
                                                <span>{new Date(act.created_at).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                                                {act.ip_address && <span>IP: {act.ip_address}</span>}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="py-12 text-center text-xs text-[#A8E6E8]/50">
                                    No recorded activities for this student yet.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Edit Modal */}
            <Modal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} title="Edit Student Profile">
                <form onSubmit={handleEditSubmit} className="space-y-3.5">
                    <div>
                        <label className="block text-xs font-bold text-[#A8E6E8] uppercase tracking-wider mb-1">
                            Student ID
                        </label>
                        <input
                            type="text"
                            value={editForm.student_number || ''}
                            onChange={(e) => setEditForm({ ...editForm, student_number: e.target.value })}
                            className="cyber-glass-input w-full px-3.5 py-2 text-xs rounded-xl"
                            required
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-bold text-[#A8E6E8] uppercase tracking-wider mb-1">
                                First Name
                            </label>
                            <input
                                type="text"
                                value={editForm.first_name || ''}
                                onChange={(e) => setEditForm({ ...editForm, first_name: e.target.value })}
                                className="cyber-glass-input w-full px-3.5 py-2 text-xs rounded-xl"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-[#A8E6E8] uppercase tracking-wider mb-1">
                                Last Name
                            </label>
                            <input
                                type="text"
                                value={editForm.last_name || ''}
                                onChange={(e) => setEditForm({ ...editForm, last_name: e.target.value })}
                                className="cyber-glass-input w-full px-3.5 py-2 text-xs rounded-xl"
                                required
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-[#A8E6E8] uppercase tracking-wider mb-1">
                            Email Address
                        </label>
                        <input
                            type="email"
                            value={editForm.email || ''}
                            onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                            className="cyber-glass-input w-full px-3.5 py-2 text-xs rounded-xl"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-[#A8E6E8] uppercase tracking-wider mb-1">
                            Contact
                        </label>
                        <input
                            type="text"
                            value={editForm.contact_number || ''}
                            onChange={(e) => setEditForm({ ...editForm, contact_number: e.target.value })}
                            className="cyber-glass-input w-full px-3.5 py-2 text-xs rounded-xl"
                        />
                    </div>
                    <div className="flex items-center justify-end gap-2 pt-4 border-t border-[#A8E6E8]/15">
                        <button
                            type="button"
                            onClick={() => setIsEditOpen(false)}
                            className="cyber-oauth-btn px-4 py-2 text-xs font-semibold rounded-xl"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="cyber-glow-btn px-5 py-2 text-xs font-bold rounded-xl"
                        >
                            Save Changes
                        </button>
                    </div>
                </form>
            </Modal>
        </AppLayout>
    );
}
