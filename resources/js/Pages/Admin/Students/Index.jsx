import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import Pagination from '@/Components/Pagination';
import Modal from '@/Components/Modal';
import {
    Users,
    UserPlus,
    Search,
    Download,
    Eye,
    Edit3,
    Trash2,
    CheckCircle,
    XCircle,
    ArrowUpDown,
    ShieldAlert,
    ExternalLink,
    Clock,
    UserCheck,
    AlertCircle,
    Mail,
    Phone,
    Calendar,
    User,
    ArrowRight
} from 'lucide-react';

export default function StudentIndex({ students = { data: [] }, filters = {}, stats = {} }) {
    const [search, setSearch] = useState(filters.search || '');
    const [statusFilter, setStatusFilter] = useState(filters.status || '');
    const [sortBy, setSortBy] = useState(filters.sort || 'latest');

    // Add Student Modal
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [addForm, setAddForm] = useState({
        student_number: '',
        first_name: '',
        middle_name: '',
        last_name: '',
        email: '',
        contact_number: '',
        password: 'password123',
        status: 'active',
    });
    const [isSubmittingAdd, setIsSubmittingAdd] = useState(false);

    // Edit Student Modal
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [editForm, setEditForm] = useState(null);
    const [isSubmittingEdit, setIsSubmittingEdit] = useState(false);

    // Profile Preview Modal
    const [profileModalStudent, setProfileModalStudent] = useState(null);

    // Delete Student Modal
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [deletingStudent, setDeletingStudent] = useState(null);

    const handleSearch = (e) => {
        e.preventDefault();
        applyFilters({ search, status: statusFilter, sort: sortBy });
    };

    const applyFilters = (newFilters) => {
        router.get('/admin/students', newFilters, {
            preserveState: true,
            replace: true,
        });
    };

    const handleAddSubmit = (e) => {
        e.preventDefault();
        setIsSubmittingAdd(true);
        router.post('/admin/students', addForm, {
            onSuccess: () => {
                setIsAddOpen(false);
                setAddForm({
                    student_number: '',
                    first_name: '',
                    middle_name: '',
                    last_name: '',
                    email: '',
                    contact_number: '',
                    password: 'password123',
                    status: 'active',
                });
            },
            onFinish: () => setIsSubmittingAdd(false),
        });
    };

    const handleEditSubmit = (e) => {
        e.preventDefault();
        if (!editForm) return;
        setIsSubmittingEdit(true);
        router.put(`/admin/students/${editForm.id}`, editForm, {
            onSuccess: () => setIsEditOpen(false),
            onFinish: () => setIsSubmittingEdit(false),
        });
    };

    const handleApprove = (student) => {
        if (confirm(`Approve student account for ${student.name} (${student.student_number})? This grants them access to learning modules.`)) {
            router.post(`/admin/students/${student.id}/approve`, {}, {
                preserveScroll: true,
            });
        }
    };

    const handleReject = (student) => {
        if (confirm(`Reject and delete registration for ${student.name}? This will remove the dummy/unauthorized record.`)) {
            router.post(`/admin/students/${student.id}/reject`, {}, {
                preserveScroll: true,
            });
        }
    };

    const handleToggleStatus = (student) => {
        router.post(`/admin/students/${student.id}/toggle-status`);
    };

    const handleDelete = () => {
        if (!deletingStudent) return;
        router.delete(`/admin/students/${deletingStudent.id}`, {
            onSuccess: () => setIsDeleteOpen(false),
        });
    };

    return (
        <AppLayout title="Student Management">
            <Head title="Student Management — CRT F&B Connect" />

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8 min-w-0">
                <div className="min-w-0">
                    <h1 className="text-xl sm:text-3xl font-extrabold text-[#F4FBFC] tracking-tight">
                        Student Records &amp; Enrollment
                    </h1>
                    <p className="text-xs sm:text-sm text-[#A8E6E8]/80 mt-1 font-normal">
                        Manage registered students, update learning access permissions, and export rosters.
                    </p>
                </div>

                <div className="grid grid-cols-2 sm:flex sm:items-center gap-2 sm:gap-2.5 w-full sm:w-auto shrink-0">
                    <a
                        href="/admin/students/export"
                        className="inline-flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2.5 text-xs font-semibold text-[#A8E6E8] hover:text-[#F4FBFC] cyber-oauth-btn border border-[#A8E6E8]/20 hover:border-[#2EC4D6]/40 rounded-xl transition-all text-center"
                    >
                        <Download className="w-4 h-4 text-[#2EC4D6] shrink-0" />
                        <span>Export CSV</span>
                    </a>
                    <button
                        onClick={() => setIsAddOpen(true)}
                        className="inline-flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2.5 text-xs font-bold text-[#F4FBFC] cyber-glow-btn rounded-xl shadow-sm transition-all cursor-pointer text-center"
                    >
                        <UserPlus className="w-4 h-4 shrink-0" />
                        <span>Add Student</span>
                    </button>
                </div>
            </div>

            {/* Summary Counters */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="p-4 cyber-glass-card rounded-xl border border-[#A8E6E8]/20 flex items-center justify-between">
                    <div>
                        <p className="text-xs font-semibold text-[#A8E6E8] uppercase">Total Students</p>
                        <p className="text-2xl font-bold text-[#F4FBFC] mt-1">{stats.total || 0}</p>
                    </div>
                    <div className="p-3 rounded-xl bg-[#0B6E8A]/40 text-[#2EC4D6]">
                        <Users className="w-6 h-6" />
                    </div>
                </div>
                <div className="p-4 cyber-glass-card rounded-xl border border-[#A8E6E8]/20 flex items-center justify-between">
                    <div>
                        <p className="text-xs font-semibold text-[#A8E6E8] uppercase">Active Accounts</p>
                        <p className="text-2xl font-bold text-emerald-300 mt-1">{stats.active || 0}</p>
                    </div>
                    <div className="p-3 rounded-xl bg-emerald-500/20 text-emerald-300">
                        <CheckCircle className="w-6 h-6" />
                    </div>
                </div>
                <div className="p-4 cyber-glass-card rounded-xl border border-[#A8E6E8]/20 flex items-center justify-between">
                    <div>
                        <div className="flex items-center gap-1.5">
                            <p className="text-xs font-semibold text-[#A8E6E8] uppercase">Pending Approval</p>
                            {(stats.pending || 0) > 0 && (
                                <span className="px-1.5 py-0.5 rounded text-[10px] font-extrabold bg-amber-500 text-[#061923] animate-pulse">
                                    Action
                                </span>
                            )}
                        </div>
                        <p className="text-2xl font-bold text-amber-300 mt-1">{stats.pending || 0}</p>
                    </div>
                    <div className="p-3 rounded-xl bg-amber-500/20 text-amber-300">
                        <Clock className="w-6 h-6" />
                    </div>
                </div>
                <div className="p-4 cyber-glass-card rounded-xl border border-[#A8E6E8]/20 flex items-center justify-between">
                    <div>
                        <p className="text-xs font-semibold text-[#A8E6E8] uppercase">Inactive Accounts</p>
                        <p className="text-2xl font-bold text-[#A8E6E8]/70 mt-1">{stats.inactive || 0}</p>
                    </div>
                    <div className="p-3 rounded-xl bg-[#2EC4D6]/20 text-[#2EC4D6]/80">
                        <XCircle className="w-6 h-6" />
                    </div>
                </div>
            </div>

            {/* Search and Filters Bar */}
            <div className="cyber-glass-card p-3.5 sm:p-4 rounded-2xl border border-[#A8E6E8]/20 shadow-2xs mb-6 min-w-0">
                <form onSubmit={handleSearch} className="flex flex-col lg:flex-row items-stretch lg:items-center gap-2.5 sm:gap-3">
                    <div className="relative flex-1 min-w-0 w-full">
                        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A8E6E8]/60 pointer-events-none" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search by student number, student name, or email..."
                            className="w-full pl-10 pr-4 py-2 text-xs cyber-glass-input rounded-xl focus:border-[#2EC4D6] transition-all"
                        />
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-2 md:flex md:items-center gap-2 w-full lg:w-auto">
                        <select
                            value={statusFilter}
                            onChange={(e) => {
                                setStatusFilter(e.target.value);
                                applyFilters({ search, status: e.target.value, sort: sortBy });
                            }}
                            className="w-full md:w-auto px-3 py-2 text-xs bg-[#0A3D4F]/60 border border-[#A8E6E8]/25 text-[#F4FBFC] rounded-xl focus:border-[#2EC4D6] focus:outline-none cursor-pointer"
                        >
                            <option value="" className="bg-[#061923] text-[#F4FBFC]">All Statuses</option>
                            <option value="active" className="bg-[#061923] text-[#F4FBFC]">Active Only</option>
                            <option value="pending" className="bg-[#061923] text-[#F4FBFC]">Pending Approval</option>
                            <option value="inactive" className="bg-[#061923] text-[#F4FBFC]">Inactive Only</option>
                        </select>

                        <select
                            value={sortBy}
                            onChange={(e) => {
                                setSortBy(e.target.value);
                                applyFilters({ search, status: statusFilter, sort: e.target.value });
                            }}
                            className="w-full md:w-auto px-3 py-2 text-xs bg-[#0A3D4F]/60 border border-[#A8E6E8]/25 text-[#F4FBFC] rounded-xl focus:border-[#2EC4D6] focus:outline-none cursor-pointer"
                        >
                            <option value="latest" className="bg-[#061923] text-[#F4FBFC]">Newest First</option>
                            <option value="oldest" className="bg-[#061923] text-[#F4FBFC]">Oldest First</option>
                            <option value="name" className="bg-[#061923] text-[#F4FBFC]">Name (A-Z)</option>
                            <option value="student_number" className="bg-[#061923] text-[#F4FBFC]">Student ID Number</option>
                        </select>

                        <button
                            type="submit"
                            className="col-span-2 md:col-span-1 px-4 py-2 text-xs font-bold text-[#F4FBFC] cyber-glow-btn rounded-xl cursor-pointer flex items-center justify-center gap-1.5 transition-colors"
                        >
                            <Search className="w-3.5 h-3.5" />
                            <span>Search</span>
                        </button>
                    </div>
                </form>
            </div>

            {/* Students Table */}
            <div className="cyber-glass-card rounded-2xl border border-[#A8E6E8]/20 shadow-2xs overflow-hidden mb-6 min-w-0">
                {/* Horizontal scroll hint on mobile */}
                <div className="sm:hidden px-3.5 py-2 bg-[#0A3D4F]/40 border-b border-[#A8E6E8]/15 flex items-center justify-between text-[11px] text-[#A8E6E8] font-medium">
                    <span>Swipe horizontally to view full table</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#2EC4D6] animate-pulse" />
                </div>
                <div className="overflow-x-auto overscroll-x-contain touch-pan-x">
                    <table className="w-full min-w-[620px] text-left text-xs border-collapse text-[#F4FBFC]">
                        <thead>
                            <tr className="cyber-table-header uppercase tracking-wider text-[11px] font-bold">
                                <th className="py-3.5 px-4">Student ID</th>
                                <th className="py-3.5 px-4">Student Name</th>
                                <th className="py-3.5 px-4">Email</th>
                                <th className="py-3.5 px-4 hidden sm:table-cell">Contact</th>
                                <th className="py-3.5 px-4 hidden md:table-cell">Enrolled</th>
                                <th className="py-3.5 px-4">Status</th>
                                <th className="py-3.5 px-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#A8E6E8]/10">
                            {students.data && students.data.length > 0 ? (
                                students.data.map((student) => (
                                    <tr key={student.id} className="cyber-table-row">
                                        <td className="py-3.5 px-4 font-mono font-bold text-[#2EC4D6]">
                                            {student.student_number || '—'}
                                        </td>
                                        <td className="py-3.5 px-4">
                                            <div className="flex items-center gap-3">
                                                <button
                                                    type="button"
                                                    onClick={() => setProfileModalStudent(student)}
                                                    className="relative group/avatar cursor-pointer shrink-0 rounded-xl overflow-hidden focus:outline-none focus:ring-2 focus:ring-[#2EC4D6]/50"
                                                    title={`View profile for ${student.name}`}
                                                >
                                                    <img
                                                        src={student.avatar_url}
                                                        alt={student.name}
                                                        className="w-9 h-9 rounded-xl object-cover ring-2 ring-[#2EC4D6]/35 group-hover/avatar:ring-[#2EC4D6] group-hover/avatar:scale-105 transition-all shadow-2xs"
                                                    />
                                                    <div className="absolute inset-0 bg-[#0B6E8A]/40 opacity-0 group-hover/avatar:opacity-100 transition-opacity flex items-center justify-center rounded-xl">
                                                        <Eye className="w-3.5 h-3.5 text-white" />
                                                    </div>
                                                </button>
                                                <div className="min-w-0">
                                                    <button
                                                        type="button"
                                                        onClick={() => setProfileModalStudent(student)}
                                                        className="font-bold text-[#F4FBFC] hover:text-[#2EC4D6] text-left block truncate cursor-pointer transition-colors"
                                                        title={`Click to preview profile of ${student.name}`}
                                                    >
                                                        {student.name}
                                                    </button>
                                                    <span className="text-[10px] text-[#A8E6E8]/60 sm:hidden block font-mono">
                                                        {student.student_number}
                                                    </span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-3.5 px-4 text-[#A8E6E8]">{student.email}</td>
                                        <td className="py-3.5 px-4 text-[#A8E6E8]/80 hidden sm:table-cell font-mono text-[11px]">
                                            {student.contact_number || '—'}
                                        </td>
                                        <td className="py-3.5 px-4 text-[#A8E6E8]/60 hidden md:table-cell">
                                            {new Date(student.created_at).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                                        </td>
                                        <td className="py-3.5 px-4">
                                            {student.status === 'pending' ? (
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-amber-500/20 text-amber-300 border border-amber-400/30">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                                                    Pending Approval
                                                </span>
                                            ) : (
                                                <button
                                                    onClick={() => handleToggleStatus(student)}
                                                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase transition-all cursor-pointer ${
                                                        student.status === 'active'
                                                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 hover:bg-emerald-500/30'
                                                            : 'bg-[#2EC4D6]/20 text-[#2EC4D6] border border-[#2EC4D6]/40 hover:bg-[#0B6E8A]/30'
                                                    }`}
                                                    title="Click to toggle account status"
                                                >
                                                    <span className={`w-1.5 h-1.5 rounded-full ${student.status === 'active' ? 'bg-emerald-400' : 'bg-rose-400'}`} />
                                                    {student.status}
                                                </button>
                                            )}
                                        </td>
                                        <td className="py-3.5 px-4 text-right">
                                            <div className="inline-flex items-center gap-1.5">
                                                {student.status === 'pending' && (
                                                    <button
                                                        onClick={() => handleApprove(student)}
                                                        className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold text-emerald-200 bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-400/35 rounded-lg shadow-2xs transition-all mr-1 cursor-pointer"
                                                        title="Approve Student Account"
                                                    >
                                                        <CheckCircle className="w-3.5 h-3.5" />
                                                        Approve
                                                    </button>
                                                )}
                                                <Link
                                                    href={`/admin/students/${student.id}`}
                                                    className="p-1.5 text-[#A8E6E8] hover:text-[#2EC4D6] rounded-lg hover:bg-[#0B6E8A]/30 transition-colors"
                                                    title="View Profile"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </Link>
                                                <button
                                                    onClick={() => {
                                                        setEditForm({ ...student });
                                                        setIsEditOpen(true);
                                                    }}
                                                    className="p-1.5 text-[#A8E6E8] hover:text-[#F4FBFC] rounded-lg hover:bg-[#0B6E8A]/30 transition-colors cursor-pointer"
                                                    title="Edit Record"
                                                >
                                                    <Edit3 className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setDeletingStudent(student);
                                                        setIsDeleteOpen(true);
                                                    }}
                                                    className="p-1.5 text-[#A8E6E8] hover:text-rose-300 rounded-lg hover:bg-rose-500/20 transition-colors cursor-pointer"
                                                    title="Delete Student"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={7} className="py-12 text-center text-[#A8E6E8]/60">
                                        No student records found matching the query.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Pagination */}
            <Pagination links={students.links} />

            {/* Modal: Add Student Record */}
            <Modal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} title="Register Student Record">
                <form onSubmit={handleAddSubmit} className="space-y-3.5">
                    <div>
                        <label className="block text-xs font-semibold text-[#A8E6E8] uppercase tracking-wider mb-1">
                            Student ID Number <span className="text-rose-400">*</span>
                        </label>
                        <input
                            type="text"
                            value={addForm.student_number}
                            onChange={(e) => setAddForm({ ...addForm, student_number: e.target.value })}
                            placeholder="e.g. 2024-CRT-0150"
                            className="w-full px-3.5 py-2 text-xs cyber-glass-input rounded-xl focus:border-[#2EC4D6] focus:outline-none"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-semibold text-[#A8E6E8] uppercase tracking-wider mb-1">
                                First Name <span className="text-rose-400">*</span>
                            </label>
                            <input
                                type="text"
                                value={addForm.first_name}
                                onChange={(e) => setAddForm({ ...addForm, first_name: e.target.value })}
                                className="w-full px-3.5 py-2 text-xs cyber-glass-input rounded-xl focus:border-[#2EC4D6] focus:outline-none"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-[#A8E6E8] uppercase tracking-wider mb-1">
                                Last Name <span className="text-rose-400">*</span>
                            </label>
                            <input
                                type="text"
                                value={addForm.last_name}
                                onChange={(e) => setAddForm({ ...addForm, last_name: e.target.value })}
                                className="w-full px-3.5 py-2 text-xs cyber-glass-input rounded-xl focus:border-[#2EC4D6] focus:outline-none"
                                required
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-semibold text-[#A8E6E8] uppercase tracking-wider mb-1">
                                Middle Name
                            </label>
                            <input
                                type="text"
                                value={addForm.middle_name}
                                onChange={(e) => setAddForm({ ...addForm, middle_name: e.target.value })}
                                className="w-full px-3.5 py-2 text-xs cyber-glass-input rounded-xl focus:border-[#2EC4D6] focus:outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-[#A8E6E8] uppercase tracking-wider mb-1">
                                Contact Number
                            </label>
                            <input
                                type="text"
                                value={addForm.contact_number}
                                onChange={(e) => setAddForm({ ...addForm, contact_number: e.target.value })}
                                placeholder="+63 917 000 0000"
                                className="w-full px-3.5 py-2 text-xs cyber-glass-input rounded-xl focus:border-[#2EC4D6] focus:outline-none"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-[#A8E6E8] uppercase tracking-wider mb-1">
                            Email Address <span className="text-rose-400">*</span>
                        </label>
                        <input
                            type="email"
                            value={addForm.email}
                            onChange={(e) => setAddForm({ ...addForm, email: e.target.value })}
                            placeholder="student@crt.edu.ph"
                            className="w-full px-3.5 py-2 text-xs cyber-glass-input rounded-xl focus:border-[#2EC4D6] focus:outline-none"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-semibold text-[#A8E6E8] uppercase tracking-wider mb-1">
                                Initial Password
                            </label>
                            <input
                                type="text"
                                value={addForm.password}
                                onChange={(e) => setAddForm({ ...addForm, password: e.target.value })}
                                className="w-full px-3.5 py-2 text-xs cyber-glass-input rounded-xl focus:border-[#2EC4D6] focus:outline-none font-mono"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-[#A8E6E8] uppercase tracking-wider mb-1">
                                Account Status
                            </label>
                            <select
                                value={addForm.status}
                                onChange={(e) => setAddForm({ ...addForm, status: e.target.value })}
                                className="w-full px-3.5 py-2 text-xs bg-[#0A3D4F]/60 border border-[#A8E6E8]/25 text-[#F4FBFC] rounded-xl focus:border-[#2EC4D6] focus:outline-none"
                            >
                                <option value="active" className="bg-[#061923]">Active</option>
                                <option value="pending" className="bg-[#061923]">Pending Approval</option>
                                <option value="inactive" className="bg-[#061923]">Inactive</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-4 border-t border-[#A8E6E8]/15">
                        <button
                            type="button"
                            onClick={() => setIsAddOpen(false)}
                            className="px-4 py-2 text-xs font-semibold text-[#A8E6E8] hover:text-[#F4FBFC] cyber-oauth-btn rounded-xl"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmittingAdd}
                            className="px-5 py-2 text-xs font-bold text-[#F4FBFC] cyber-glow-btn rounded-xl shadow-sm cursor-pointer"
                        >
                            {isSubmittingAdd ? 'Saving...' : 'Create Account'}
                        </button>
                    </div>
                </form>
            </Modal>

            {/* Modal: Edit Student Record */}
            <Modal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} title="Edit Student Record">
                {editForm && (
                    <form onSubmit={handleEditSubmit} className="space-y-3.5">
                        <div>
                            <label className="block text-xs font-semibold text-[#A8E6E8] uppercase tracking-wider mb-1">
                                Student ID Number
                            </label>
                            <input
                                type="text"
                                value={editForm.student_number || ''}
                                onChange={(e) => setEditForm({ ...editForm, student_number: e.target.value })}
                                className="w-full px-3.5 py-2 text-xs cyber-glass-input rounded-xl focus:border-[#2EC4D6] focus:outline-none"
                                required
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-xs font-semibold text-[#A8E6E8] uppercase tracking-wider mb-1">
                                    First Name
                                </label>
                                <input
                                    type="text"
                                    value={editForm.first_name || ''}
                                    onChange={(e) => setEditForm({ ...editForm, first_name: e.target.value })}
                                    className="w-full px-3.5 py-2 text-xs cyber-glass-input rounded-xl focus:border-[#2EC4D6] focus:outline-none"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-[#A8E6E8] uppercase tracking-wider mb-1">
                                    Last Name
                                </label>
                                <input
                                    type="text"
                                    value={editForm.last_name || ''}
                                    onChange={(e) => setEditForm({ ...editForm, last_name: e.target.value })}
                                    className="w-full px-3.5 py-2 text-xs cyber-glass-input rounded-xl focus:border-[#2EC4D6] focus:outline-none"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-[#A8E6E8] uppercase tracking-wider mb-1">
                                Email Address
                            </label>
                            <input
                                type="email"
                                value={editForm.email || ''}
                                onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                                className="w-full px-3.5 py-2 text-xs cyber-glass-input rounded-xl focus:border-[#2EC4D6] focus:outline-none"
                                required
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-xs font-semibold text-[#A8E6E8] uppercase tracking-wider mb-1">
                                    Contact
                                </label>
                                <input
                                    type="text"
                                    value={editForm.contact_number || ''}
                                    onChange={(e) => setEditForm({ ...editForm, contact_number: e.target.value })}
                                    className="w-full px-3.5 py-2 text-xs cyber-glass-input rounded-xl focus:border-[#2EC4D6] focus:outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-[#A8E6E8] uppercase tracking-wider mb-1">
                                    Account Status
                                </label>
                                <select
                                    value={editForm.status}
                                    onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                                    className="w-full px-3.5 py-2 text-xs bg-[#0A3D4F]/60 border border-[#A8E6E8]/25 text-[#F4FBFC] rounded-xl focus:border-[#2EC4D6] focus:outline-none"
                                >
                                    <option value="active" className="bg-[#061923]">Active</option>
                                    <option value="pending" className="bg-[#061923]">Pending Approval</option>
                                    <option value="inactive" className="bg-[#061923]">Inactive</option>
                                </select>
                            </div>
                        </div>

                        <div className="flex items-center justify-end gap-2 pt-4 border-t border-[#A8E6E8]/15">
                            <button
                                type="button"
                                onClick={() => setIsEditOpen(false)}
                                className="px-4 py-2 text-xs font-semibold text-[#A8E6E8] hover:text-[#F4FBFC] cyber-oauth-btn rounded-xl"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmittingEdit}
                                className="px-5 py-2 text-xs font-bold text-[#F4FBFC] cyber-glow-btn rounded-xl shadow-sm cursor-pointer"
                            >
                                {isSubmittingEdit ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </form>
                )}
            </Modal>

            {/* Modal: Delete Confirmation */}
            <Modal isOpen={isDeleteOpen} onClose={() => setIsDeleteOpen(false)} title="Confirm Account Removal">
                <div className="space-y-4">
                    <p className="text-xs text-[#A8E6E8]/90 leading-relaxed font-normal">
                        Are you sure you want to delete student account <strong className="text-[#F4FBFC]">{deletingStudent?.name}</strong> ({deletingStudent?.student_number})? Educational resources uploaded by instructors will remain unaffected.
                    </p>
                    <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#A8E6E8]/15">
                        <button
                            type="button"
                            onClick={() => setIsDeleteOpen(false)}
                            className="px-4 py-2 text-xs font-semibold text-[#A8E6E8] hover:text-[#F4FBFC] cyber-oauth-btn rounded-xl"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={handleDelete}
                            className="px-5 py-2 text-xs font-bold text-rose-200 bg-rose-500/25 hover:bg-rose-500/40 border border-rose-400/35 rounded-xl cursor-pointer"
                        >
                            Yes, Delete Account
                        </button>
                    </div>
                </div>
            </Modal>

            {/* Modal: Student Profile Preview */}
            <Modal isOpen={!!profileModalStudent} onClose={() => setProfileModalStudent(null)} title="Student Profile Overview">
                {profileModalStudent && (
                    <div className="space-y-5">
                        {/* Header Banner & Avatar */}
                        <div className="relative rounded-2xl bg-gradient-to-r from-[#0B6E8A] via-[#0A3D4F] to-[#061923] border border-[#A8E6E8]/20 p-6 text-white text-center overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-[#2EC4D6]/20 rounded-full blur-2xl pointer-events-none" />
                            <div className="relative z-10 flex flex-col items-center">
                                <img
                                    src={profileModalStudent.avatar_url}
                                    alt={profileModalStudent.name}
                                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover ring-4 ring-[#2EC4D6]/40 shadow-xl"
                                />
                                <h3 className="mt-3 text-lg sm:text-xl font-black text-[#F4FBFC] tracking-tight">
                                    {profileModalStudent.name}
                                </h3>
                                <div className="mt-1 flex items-center gap-2 flex-wrap justify-center">
                                    <span className="font-mono text-xs font-bold text-[#2EC4D6] bg-[#0A3D4F]/60 border border-[#A8E6E8]/20 px-2.5 py-0.5 rounded-lg backdrop-blur-xs">
                                        ID: {profileModalStudent.student_number || 'N/A'}
                                    </span>
                                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                        profileModalStudent.status === 'active'
                                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30'
                                            : profileModalStudent.status === 'pending'
                                            ? 'bg-amber-500/20 text-amber-300 border border-amber-400/30'
                                            : 'bg-[#0A3D4F]/50 text-[#A8E6E8] border border-[#A8E6E8]/20'
                                    }`}>
                                        <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                                        {profileModalStudent.status === 'pending' ? 'Pending Approval' : profileModalStudent.status}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Profile Details List */}
                        <div className="cyber-glass-card-subtle rounded-2xl p-4 border border-[#A8E6E8]/15 space-y-3 text-xs">
                            <div className="flex items-center gap-3 text-[#A8E6E8]">
                                <div className="w-8 h-8 rounded-lg bg-[#0B6E8A]/40 text-[#2EC4D6] flex items-center justify-center shrink-0">
                                    <Mail className="w-4 h-4" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <span className="text-[10px] font-bold text-[#A8E6E8]/60 uppercase tracking-wider block">Email Address</span>
                                    <p className="font-semibold text-[#F4FBFC] truncate">{profileModalStudent.email}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 text-[#A8E6E8]">
                                <div className="w-8 h-8 rounded-lg bg-[#0B6E8A]/40 text-[#2EC4D6] flex items-center justify-center shrink-0">
                                    <Phone className="w-4 h-4" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <span className="text-[10px] font-bold text-[#A8E6E8]/60 uppercase tracking-wider block">Contact Number</span>
                                    <p className="font-semibold text-[#F4FBFC] font-mono">{profileModalStudent.contact_number || 'Not provided'}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 text-[#A8E6E8]">
                                <div className="w-8 h-8 rounded-lg bg-[#0B6E8A]/40 text-[#2EC4D6] flex items-center justify-center shrink-0">
                                    <Calendar className="w-4 h-4" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <span className="text-[10px] font-bold text-[#A8E6E8]/60 uppercase tracking-wider block">Registration Date</span>
                                    <p className="font-semibold text-[#F4FBFC]">
                                        {new Date(profileModalStudent.created_at).toLocaleDateString([], { month: 'long', day: 'numeric', year: 'numeric' })}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5 pt-3 border-t border-[#A8E6E8]/15">
                            <Link
                                href={`/admin/students/${profileModalStudent.id}`}
                                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 text-xs font-bold text-[#F4FBFC] cyber-glow-btn rounded-xl shadow-sm transition-all"
                            >
                                <ExternalLink className="w-3.5 h-3.5" />
                                <span>Open Full Student Record &amp; Logs</span>
                            </Link>

                            <div className="w-full sm:w-auto flex items-center gap-2 justify-end">
                                <button
                                    type="button"
                                    onClick={() => {
                                        const st = profileModalStudent;
                                        setProfileModalStudent(null);
                                        setEditForm({ ...st });
                                        setIsEditOpen(true);
                                    }}
                                    className="w-full sm:w-auto px-4 py-2 text-xs font-semibold text-[#A8E6E8] hover:text-[#F4FBFC] cyber-oauth-btn border border-[#A8E6E8]/20 rounded-xl cursor-pointer"
                                >
                                    Edit Details
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setProfileModalStudent(null)}
                                    className="w-full sm:w-auto px-4 py-2 text-xs font-semibold text-[#A8E6E8]/60 hover:text-[#F4FBFC] cursor-pointer"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </Modal>
        </AppLayout>
    );
}
