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
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-blue-600 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Student Directory
                </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Profile Card (Left 5 cols) */}
                <div className="lg:col-span-5 space-y-6">
                    <div className="bg-white rounded-3xl border border-slate-200 shadow-2xs p-6 sm:p-8 text-center relative overflow-hidden">
                        <div className="absolute top-0 inset-x-0 h-24 bg-gradient-to-r from-blue-600 to-sky-500" />

                        <div className="relative pt-8">
                            <img
                                src={student.avatar_url}
                                alt={student.name}
                                className="w-24 h-24 rounded-2xl object-cover mx-auto ring-4 ring-white shadow-md"
                            />
                            <h2 className="mt-4 text-xl font-bold text-slate-900">{student.name}</h2>
                            <p className="text-xs font-mono font-bold text-blue-600 mt-0.5">{student.student_number}</p>
                            <span className={`inline-block px-3 py-1 mt-2 text-[10px] font-bold uppercase rounded-full ${
                                student.status === 'active' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                            }`}>
                                {student.status}
                            </span>
                        </div>

                        <div className="mt-6 pt-6 border-t border-slate-100 text-left space-y-3 text-xs">
                            <div className="flex items-center gap-3 text-slate-600">
                                <Mail className="w-4 h-4 text-slate-400 flex-shrink-0" />
                                <span className="truncate">{student.email}</span>
                            </div>
                            <div className="flex items-center gap-3 text-slate-600">
                                <Phone className="w-4 h-4 text-slate-400 flex-shrink-0" />
                                <span>{student.contact_number || 'No contact number provided'}</span>
                            </div>
                            <div className="flex items-center gap-3 text-slate-600">
                                <Calendar className="w-4 h-4 text-slate-400 flex-shrink-0" />
                                <span>Enrolled {new Date(student.created_at).toLocaleDateString([], { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                            </div>
                        </div>

                        <div className="mt-6 pt-6 border-t border-slate-100 flex items-center justify-center gap-2">
                            <button
                                onClick={handleToggleStatus}
                                className={`px-4 py-2 text-xs font-bold rounded-xl border transition-colors ${
                                    student.status === 'active'
                                        ? 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
                                        : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                                }`}
                            >
                                {student.status === 'active' ? 'Deactivate Account' : 'Activate Account'}
                            </button>
                            <button
                                onClick={() => setIsEditOpen(true)}
                                className="px-4 py-2 text-xs font-bold bg-white text-slate-700 hover:bg-slate-50 border border-slate-200 rounded-xl"
                            >
                                Edit Profile
                            </button>
                        </div>
                    </div>
                </div>

                {/* Activity Trail (Right 7 cols) */}
                <div className="lg:col-span-7">
                    <div className="bg-white rounded-3xl border border-slate-200 shadow-2xs p-6 sm:p-8">
                        <h3 className="text-base font-bold text-slate-900 mb-1 flex items-center gap-2">
                            <Activity className="w-5 h-5 text-blue-600" />
                            Student Learning Activity Log
                        </h3>
                        <p className="text-xs text-slate-500 mb-6">
                            Record of resource downloads, module views, and logins.
                        </p>

                        <div className="divide-y divide-slate-100">
                            {activities.length > 0 ? (
                                activities.map((act) => (
                                    <div key={act.id} className="py-3.5 flex items-start gap-3 text-xs">
                                        <div className="p-2 rounded-xl bg-blue-50 text-blue-600 flex-shrink-0 mt-0.5">
                                            <Activity className="w-3.5 h-3.5" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-semibold text-slate-800 leading-snug">{act.description}</p>
                                            <div className="flex items-center gap-3 mt-1 text-[11px] text-slate-400">
                                                <span>{new Date(act.created_at).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                                                {act.ip_address && <span>IP: {act.ip_address}</span>}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="py-12 text-center text-xs text-slate-400">
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
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                            Student ID
                        </label>
                        <input
                            type="text"
                            value={editForm.student_number || ''}
                            onChange={(e) => setEditForm({ ...editForm, student_number: e.target.value })}
                            className="w-full px-3.5 py-2 text-xs bg-white rounded-xl border border-slate-200 focus:border-blue-600 focus:outline-none"
                            required
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                                First Name
                            </label>
                            <input
                                type="text"
                                value={editForm.first_name || ''}
                                onChange={(e) => setEditForm({ ...editForm, first_name: e.target.value })}
                                className="w-full px-3.5 py-2 text-xs bg-white rounded-xl border border-slate-200 focus:border-blue-600 focus:outline-none"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                                Last Name
                            </label>
                            <input
                                type="text"
                                value={editForm.last_name || ''}
                                onChange={(e) => setEditForm({ ...editForm, last_name: e.target.value })}
                                className="w-full px-3.5 py-2 text-xs bg-white rounded-xl border border-slate-200 focus:border-blue-600 focus:outline-none"
                                required
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                            Email Address
                        </label>
                        <input
                            type="email"
                            value={editForm.email || ''}
                            onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                            className="w-full px-3.5 py-2 text-xs bg-white rounded-xl border border-slate-200 focus:border-blue-600 focus:outline-none"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                            Contact
                        </label>
                        <input
                            type="text"
                            value={editForm.contact_number || ''}
                            onChange={(e) => setEditForm({ ...editForm, contact_number: e.target.value })}
                            className="w-full px-3.5 py-2 text-xs bg-white rounded-xl border border-slate-200 focus:border-blue-600 focus:outline-none"
                        />
                    </div>
                    <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                        <button
                            type="button"
                            onClick={() => setIsEditOpen(false)}
                            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl"
                        >
                            Save Changes
                        </button>
                    </div>
                </form>
            </Modal>
        </AppLayout>
    );
}
