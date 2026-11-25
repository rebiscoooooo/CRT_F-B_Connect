import React, { useState } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import Pagination from '@/Components/Pagination';
import Modal from '@/Components/Modal';
import {
    ShieldCheck,
    UserCheck,
    UserPlus,
    Search,
    Edit3,
    Trash2,
    CheckCircle2,
    XCircle,
    User,
    Lock,
    Phone,
    Mail,
    BookOpen,
    Shield,
    GraduationCap,
    Check,
    X,
    AlertCircle,
    Eye,
    Calendar,
    ArrowRight,
} from 'lucide-react';

export default function TeacherIndex({ teachers = { data: [] }, filters = {}, stats = {} }) {
    const page = usePage();
    const currentUserId = page?.props?.auth?.user?.id;

    const [search, setSearch] = useState(filters.search || '');
    const [roleFilter, setRoleFilter] = useState(filters.role || '');
    const [statusFilter, setStatusFilter] = useState(filters.status || '');
    const [sortBy, setSortBy] = useState(filters.sort || 'latest');

    // Add Modal State
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [addForm, setAddForm] = useState({
        first_name: '',
        middle_name: '',
        last_name: '',
        email: '',
        contact_number: '',
        role: 'teacher',
        password: 'password123',
        status: 'active',
    });
    const [isSubmittingAdd, setIsSubmittingAdd] = useState(false);

    // Edit Modal State
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [editForm, setEditForm] = useState(null);
    const [isSubmittingEdit, setIsSubmittingEdit] = useState(false);

    // Profile Preview Modal State
    const [profileModalStaff, setProfileModalStaff] = useState(null);

    // Delete Modal State
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [deletingUser, setDeletingUser] = useState(null);

    const handleSearch = (e) => {
        e && e.preventDefault();
        applyFilters({ search, role: roleFilter, status: statusFilter, sort: sortBy });
    };

    const applyFilters = (newFilters) => {
        router.get('/admin/teachers', newFilters, {
            preserveState: true,
            replace: true,
        });
    };

    const handleResetFilters = () => {
        setSearch('');
        setRoleFilter('');
        setStatusFilter('');
        setSortBy('latest');
        router.get('/admin/teachers');
    };

    const handleAddSubmit = (e) => {
        e.preventDefault();
        setIsSubmittingAdd(true);
        router.post('/admin/teachers', addForm, {
            onSuccess: () => {
                setIsAddOpen(false);
                setAddForm({
                    first_name: '',
                    middle_name: '',
                    last_name: '',
                    email: '',
                    contact_number: '',
                    role: 'teacher',
                    password: 'password123',
                    status: 'active',
                });
            },
            onFinish: () => setIsSubmittingAdd(false),
        });
    };

    const handleEditOpen = (user) => {
        setEditForm({
            id: user.id,
            first_name: user.first_name || '',
            middle_name: user.middle_name || '',
            last_name: user.last_name || '',
            email: user.email || '',
            contact_number: user.contact_number || '',
            role: user.role || 'teacher',
            status: user.status || 'active',
            password: '',
        });
        setIsEditOpen(true);
    };

    const handleEditSubmit = (e) => {
        e.preventDefault();
        if (!editForm) return;
        setIsSubmittingEdit(true);
        router.put(`/admin/teachers/${editForm.id}`, editForm, {
            onSuccess: () => setIsEditOpen(false),
            onFinish: () => setIsSubmittingEdit(false),
        });
    };

    const handleToggleStatus = (user) => {
        if (user.id === currentUserId) return;
        router.post(`/admin/teachers/${user.id}/toggle-status`);
    };

    const handleDelete = () => {
        if (!deletingUser || deletingUser.id === currentUserId) return;
        router.delete(`/admin/teachers/${deletingUser.id}`, {
            onSuccess: () => setIsDeleteOpen(false),
        });
    };

    return (
        <AppLayout title="Faculty & Administrators">
            <Head title="Faculty & Staff Management — CRT F&B Connect" />

            {/* Header Banner */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8 min-w-0">
                <div className="min-w-0">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0B6E8A]/30 border border-[#A8E6E8]/20 text-[#A8E6E8] text-xs font-semibold uppercase tracking-wider mb-2">
                        <ShieldCheck className="w-3.5 h-3.5 text-[#2EC4D6]" />
                        Authorized Staff &amp; Faculty
                    </div>
                    <h1 className="text-xl sm:text-3xl font-black text-[#F4FBFC] tracking-tight">
                        Teacher &amp; Administrator Management
                    </h1>
                    <p className="text-xs sm:text-sm text-[#A8E6E8]/70 mt-1">
                        Create, manage, and assign authorized teacher and administrator accounts for curriculum instruction.
                    </p>
                </div>

                <div className="w-full sm:w-auto shrink-0">
                    <button
                        onClick={() => setIsAddOpen(true)}
                        className="cyber-glow-btn w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold rounded-xl cursor-pointer"
                    >
                        <UserPlus className="w-4 h-4" />
                        <span>Add Teacher / Admin</span>
                    </button>
                </div>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
                <div className="cyber-glass-card cyber-glass-card-hover p-4 sm:p-5">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#A8E6E8]/70">Total Staff</span>
                    <div className="text-2xl sm:text-3xl font-black text-[#F4FBFC] mt-2">
                        {stats.total_staff || 0}
                    </div>
                    <p className="text-[11px] text-[#A8E6E8]/60 mt-1">Total instructors &amp; admins</p>
                </div>

                <div className="cyber-glass-card cyber-glass-card-hover p-4 sm:p-5">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#A8E6E8]/70">Teachers / Chefs</span>
                    <div className="text-2xl sm:text-3xl font-black text-[#2EC4D6] mt-2">
                        {stats.teacher_count || 0}
                    </div>
                    <p className="text-[11px] text-[#A8E6E8]/60 mt-1">Active curriculum educators</p>
                </div>

                <div className="cyber-glass-card cyber-glass-card-hover p-4 sm:p-5">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#A8E6E8]/70">Administrators</span>
                    <div className="text-2xl sm:text-3xl font-black text-[#A8E6E8] mt-2">
                        {stats.admin_count || 0}
                    </div>
                    <p className="text-[11px] text-[#A8E6E8]/60 mt-1">Full system privilege holders</p>
                </div>

                <div className="cyber-glass-card cyber-glass-card-hover p-4 sm:p-5">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#A8E6E8]/70">Active Status</span>
                    <div className="text-2xl sm:text-3xl font-black text-emerald-400 mt-2">
                        {stats.active_count || 0}
                    </div>
                    <p className="text-[11px] text-[#A8E6E8]/60 mt-1">Ready for portal access</p>
                </div>
            </div>

            {/* Filters Bar */}
            <div className="cyber-glass-card p-3.5 sm:p-5 mb-6 min-w-0">
                <form onSubmit={handleSearch} className="flex flex-col lg:flex-row gap-2.5 sm:gap-3 items-stretch lg:items-center">
                    <div className="relative flex-1 min-w-0 w-full">
                        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A8E6E8]/50 pointer-events-none" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search staff by name, email, or contact number..."
                            className="cyber-glass-input w-full pl-10 pr-4 py-2 text-xs rounded-xl"
                        />
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:flex lg:items-center gap-2 w-full lg:w-auto">
                        <select
                            value={roleFilter}
                            onChange={(e) => {
                                setRoleFilter(e.target.value);
                                applyFilters({ search, role: e.target.value, status: statusFilter, sort: sortBy });
                            }}
                            className="cyber-glass-input w-full lg:w-auto px-3 py-2 text-xs rounded-xl cursor-pointer"
                        >
                            <option value="" className="bg-[#061923] text-[#F4FBFC]">All Roles</option>
                            <option value="teacher" className="bg-[#061923] text-[#F4FBFC]">Teachers / Instructors</option>
                            <option value="admin" className="bg-[#061923] text-[#F4FBFC]">Administrators</option>
                        </select>

                        <select
                            value={statusFilter}
                            onChange={(e) => {
                                setStatusFilter(e.target.value);
                                applyFilters({ search, role: roleFilter, status: e.target.value, sort: sortBy });
                            }}
                            className="cyber-glass-input w-full lg:w-auto px-3 py-2 text-xs rounded-xl cursor-pointer"
                        >
                            <option value="" className="bg-[#061923] text-[#F4FBFC]">All Statuses</option>
                            <option value="active" className="bg-[#061923] text-[#F4FBFC]">Active Only</option>
                            <option value="inactive" className="bg-[#061923] text-[#F4FBFC]">Inactive Only</option>
                        </select>

                        <select
                            value={sortBy}
                            onChange={(e) => {
                                setSortBy(e.target.value);
                                applyFilters({ search, role: roleFilter, status: statusFilter, sort: e.target.value });
                            }}
                            className="cyber-glass-input col-span-2 sm:col-span-1 lg:w-auto px-3 py-2 text-xs rounded-xl cursor-pointer"
                        >
                            <option value="latest" className="bg-[#061923] text-[#F4FBFC]">Joined (Newest)</option>
                            <option value="oldest" className="bg-[#061923] text-[#F4FBFC]">Joined (Oldest)</option>
                            <option value="name" className="bg-[#061923] text-[#F4FBFC]">Name (A-Z)</option>
                            <option value="resources" className="bg-[#061923] text-[#F4FBFC]">Most Lessons Created</option>
                        </select>

                        <button
                            type="submit"
                            className="cyber-glow-btn px-4 py-2 text-xs font-bold rounded-xl cursor-pointer flex items-center justify-center gap-1"
                        >
                            <Search className="w-3.5 h-3.5 sm:hidden" />
                            <span>Filter</span>
                        </button>

                        {(search || roleFilter || statusFilter) && (
                            <button
                                type="button"
                                onClick={handleResetFilters}
                                className="cyber-oauth-btn px-3 py-2 text-xs font-bold rounded-xl"
                            >
                                Reset
                            </button>
                        )}
                    </div>
                </form>
            </div>

            {/* Staff Table */}
            <div className="cyber-glass-card overflow-hidden mb-6 min-w-0">
                {/* Horizontal scroll hint on mobile */}
                <div className="sm:hidden px-3.5 py-2 bg-[#061923]/60 border-b border-[#A8E6E8]/15 flex items-center justify-between text-[11px] text-[#A8E6E8] font-medium">
                    <span>Swipe horizontally to view full table</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#2EC4D6] animate-pulse" />
                </div>
                <div className="overflow-x-auto overscroll-x-contain touch-pan-x">
                    <table className="w-full min-w-[700px] text-left text-xs border-collapse">
                        <thead>
                            <tr className="cyber-table-header">
                                <th className="py-3.5 px-6">Staff Member</th>
                                <th className="py-3.5 px-6">System Role</th>
                                <th className="py-3.5 px-6">Email Address</th>
                                <th className="py-3.5 px-6 hidden sm:table-cell">Contact</th>
                                <th className="py-3.5 px-6 hidden md:table-cell">Lessons Uploaded</th>
                                <th className="py-3.5 px-6">Status</th>
                                <th className="py-3.5 px-6 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#A8E6E8]/10">
                            {teachers.data && teachers.data.length > 0 ? (
                                teachers.data.map((staff) => {
                                    const isSelf = staff.id === currentUserId;
                                    const isAdminRole = staff.role === 'admin';

                                    return (
                                        <tr key={staff.id} className="cyber-table-row transition-colors">
                                            {/* Staff Member Avatar & Name */}
                                            <td className="py-3.5 px-6">
                                                <div className="flex items-center gap-3">
                                                    <button
                                                        type="button"
                                                        onClick={() => setProfileModalStaff(staff)}
                                                        className="relative group/avatar cursor-pointer shrink-0 rounded-xl overflow-hidden focus:outline-none focus:ring-2 focus:ring-[#2EC4D6]/50"
                                                        title={`View profile for ${staff.name}`}
                                                    >
                                                        <img
                                                            src={staff.avatar_url}
                                                            alt={staff.name}
                                                            className="w-10 h-10 rounded-xl object-cover ring-2 ring-[#2EC4D6]/30 group-hover/avatar:ring-[#2EC4D6] group-hover/avatar:scale-105 transition-all shadow-md"
                                                        />
                                                        <div className="absolute inset-0 bg-[#0B6E8A]/50 opacity-0 group-hover/avatar:opacity-100 transition-opacity flex items-center justify-center rounded-xl">
                                                            <Eye className="w-3.5 h-3.5 text-white" />
                                                        </div>
                                                    </button>
                                                    <div className="min-w-0">
                                                        <button
                                                            type="button"
                                                            onClick={() => setProfileModalStaff(staff)}
                                                            className="font-bold text-[#F4FBFC] hover:text-[#2EC4D6] text-left block truncate cursor-pointer transition-colors"
                                                            title={`Click to preview profile of ${staff.name}`}
                                                        >
                                                            <span className="flex items-center gap-1.5">
                                                                {staff.name}
                                                                {isSelf && (
                                                                    <span className="text-[10px] font-semibold text-[#2EC4D6] bg-[#0B6E8A]/40 border border-[#2EC4D6]/30 px-1.5 py-0.2 rounded-md">
                                                                        (You)
                                                                    </span>
                                                                )}
                                                            </span>
                                                        </button>
                                                        <p className="text-[10px] text-[#A8E6E8]/60">
                                                            Joined {new Date(staff.created_at).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Role Badge */}
                                            <td className="py-3.5 px-6">
                                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                                                    isAdminRole
                                                        ? 'bg-blue-500/20 text-[#A8E6E8] border-[#2EC4D6]/30'
                                                        : 'bg-sky-500/20 text-sky-200 border-sky-500/30'
                                                }`}>
                                                    {isAdminRole ? (
                                                        <Shield className="w-3 h-3 text-[#2EC4D6]" />
                                                    ) : (
                                                        <GraduationCap className="w-3 h-3 text-sky-300" />
                                                    )}
                                                    {isAdminRole ? 'Administrator' : 'Teacher / Instructor'}
                                                </span>
                                            </td>

                                            {/* Email */}
                                            <td className="py-3.5 px-6 text-[#F4FBFC] font-medium">
                                                {staff.email}
                                            </td>

                                            {/* Contact */}
                                            <td className="py-3.5 px-6 hidden sm:table-cell text-[#A8E6E8]/80 font-mono">
                                                {staff.contact_number || '—'}
                                            </td>

                                            {/* Lessons Uploaded */}
                                            <td className="py-3.5 px-6 hidden md:table-cell">
                                                <span className="font-bold text-[#F4FBFC]">
                                                    {staff.resources_count || 0}
                                                </span>
                                                <span className="text-[10px] text-[#A8E6E8]/60 ml-1">materials</span>
                                            </td>

                                            {/* Status */}
                                            <td className="py-3.5 px-6">
                                                <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold capitalize border ${
                                                    staff.status === 'active'
                                                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                                                        : 'bg-[#A8E6E8]/10 text-[#A8E6E8]/60 border-[#A8E6E8]/20'
                                                }`}>
                                                    {staff.status === 'active' ? (
                                                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                                                    ) : (
                                                        <XCircle className="w-3 h-3 text-[#A8E6E8]/60" />
                                                    )}
                                                    {staff.status}
                                                </span>
                                            </td>

                                            {/* Actions */}
                                            <td className="py-3.5 px-6 text-right">
                                                <div className="flex items-center justify-end gap-1.5">
                                                    <button
                                                        onClick={() => setProfileModalStaff(staff)}
                                                        className="p-1.5 text-[#A8E6E8] hover:text-[#2EC4D6] hover:bg-[#0B6E8A]/30 rounded-lg transition-colors cursor-pointer"
                                                        title="View staff profile overview"
                                                    >
                                                        <Eye className="w-3.5 h-3.5" />
                                                    </button>

                                                    <button
                                                        onClick={() => handleEditOpen(staff)}
                                                        className="p-1.5 text-[#A8E6E8] hover:text-[#2EC4D6] hover:bg-[#0B6E8A]/30 rounded-lg transition-colors cursor-pointer"
                                                        title="Edit details"
                                                    >
                                                        <Edit3 className="w-3.5 h-3.5" />
                                                    </button>

                                                    <button
                                                        onClick={() => handleToggleStatus(staff)}
                                                        disabled={isSelf}
                                                        className={`p-1.5 rounded-lg transition-colors ${
                                                            isSelf
                                                                ? 'text-[#A8E6E8]/20 cursor-not-allowed'
                                                                : staff.status === 'active'
                                                                ? 'text-[#A8E6E8] hover:text-amber-400 hover:bg-amber-500/20'
                                                                : 'text-[#A8E6E8] hover:text-emerald-400 hover:bg-emerald-500/20'
                                                        }`}
                                                        title={isSelf ? 'Cannot deactivate self' : staff.status === 'active' ? 'Deactivate account' : 'Activate account'}
                                                    >
                                                        {staff.status === 'active' ? (
                                                            <X className="w-3.5 h-3.5" />
                                                        ) : (
                                                            <Check className="w-3.5 h-3.5" />
                                                        )}
                                                    </button>

                                                    <button
                                                        onClick={() => {
                                                            setDeletingUser(staff);
                                                            setIsDeleteOpen(true);
                                                        }}
                                                        disabled={isSelf}
                                                        className={`p-1.5 rounded-lg transition-colors ${
                                                            isSelf
                                                                ? 'text-[#A8E6E8]/20 cursor-not-allowed'
                                                                : 'text-[#A8E6E8] hover:text-[#2EC4D6] hover:bg-[#0B6E8A]/20'
                                                        }`}
                                                        title={isSelf ? 'Cannot delete self' : 'Delete staff record'}
                                                    >
                                                        <Trash2 className="w-3.5 h-3.5" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan={7} className="py-12 text-center text-[#A8E6E8]/60">
                                        No teacher or administrator records found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Pagination */}
            <Pagination links={teachers.links} />

            {/* Modal: Add Teacher / Admin */}
            <Modal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} title="Add Teacher / Administrator">
                <form onSubmit={handleAddSubmit} className="space-y-4">
                    {/* Automated Email Notice */}
                    <div className="p-3 bg-[#0B6E8A]/30 border border-[#A8E6E8]/25 rounded-2xl flex items-start gap-2.5">
                        <Mail className="w-4 h-4 text-[#2EC4D6] shrink-0 mt-0.5" />
                        <div className="text-[11px] text-[#A8E6E8] leading-normal">
                            <span className="font-bold text-[#F4FBFC]">Automated Email Notification:</span> An onboarding email with login credentials (email and temporary password) will be automatically sent to the registered email address upon submission.
                        </div>
                    </div>

                    {/* Role Selection */}
                    <div>
                        <label className="block text-xs font-bold text-[#A8E6E8] uppercase tracking-wider mb-1.5">
                            Account Role <span className="text-rose-400">*</span>
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                            <label className={`p-3 rounded-xl border text-xs flex items-center gap-2.5 cursor-pointer transition-all ${
                                addForm.role === 'teacher'
                                    ? 'border-[#2EC4D6] bg-[#0B6E8A]/40 text-[#F4FBFC] font-bold ring-2 ring-[#2EC4D6]/30'
                                    : 'border-[#A8E6E8]/20 bg-[#061923]/40 text-[#A8E6E8] hover:bg-[#0B6E8A]/20'
                            }`}>
                                <input
                                    type="radio"
                                    name="role"
                                    value="teacher"
                                    checked={addForm.role === 'teacher'}
                                    onChange={(e) => setAddForm({ ...addForm, role: e.target.value })}
                                    className="hidden"
                                />
                                <GraduationCap className="w-4 h-4 text-[#2EC4D6] shrink-0" />
                                <div>
                                    <p className="leading-snug text-[#F4FBFC]">Teacher / Instructor</p>
                                    <p className="text-[10px] font-normal text-[#A8E6E8]/70">Upload lessons &amp; monitor students</p>
                                </div>
                            </label>

                            <label className={`p-3 rounded-xl border text-xs flex items-center gap-2.5 cursor-pointer transition-all ${
                                addForm.role === 'admin'
                                    ? 'border-[#2EC4D6] bg-[#0B6E8A]/40 text-[#F4FBFC] font-bold ring-2 ring-[#2EC4D6]/30'
                                    : 'border-[#A8E6E8]/20 bg-[#061923]/40 text-[#A8E6E8] hover:bg-[#0B6E8A]/20'
                            }`}>
                                <input
                                    type="radio"
                                    name="role"
                                    value="admin"
                                    checked={addForm.role === 'admin'}
                                    onChange={(e) => setAddForm({ ...addForm, role: e.target.value })}
                                    className="hidden"
                                />
                                <Shield className="w-4 h-4 text-[#2EC4D6] shrink-0" />
                                <div>
                                    <p className="leading-snug text-[#F4FBFC]">Full Administrator</p>
                                    <p className="text-[10px] font-normal text-[#A8E6E8]/70">Full system &amp; user management</p>
                                </div>
                            </label>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-bold text-[#A8E6E8] uppercase tracking-wider mb-1">
                                First Name <span className="text-rose-400">*</span>
                            </label>
                            <input
                                type="text"
                                value={addForm.first_name}
                                onChange={(e) => setAddForm({ ...addForm, first_name: e.target.value })}
                                placeholder="e.g. Maria"
                                className="cyber-glass-input w-full px-3.5 py-2 text-xs rounded-xl"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-[#A8E6E8] uppercase tracking-wider mb-1">
                                Last Name <span className="text-rose-400">*</span>
                            </label>
                            <input
                                type="text"
                                value={addForm.last_name}
                                onChange={(e) => setAddForm({ ...addForm, last_name: e.target.value })}
                                placeholder="e.g. Santos"
                                className="cyber-glass-input w-full px-3.5 py-2 text-xs rounded-xl"
                                required
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-bold text-[#A8E6E8] uppercase tracking-wider mb-1">
                                Middle Name (Optional)
                            </label>
                            <input
                                type="text"
                                value={addForm.middle_name}
                                onChange={(e) => setAddForm({ ...addForm, middle_name: e.target.value })}
                                placeholder="e.g. Elena"
                                className="cyber-glass-input w-full px-3.5 py-2 text-xs rounded-xl"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-[#A8E6E8] uppercase tracking-wider mb-1">
                                Contact Number
                            </label>
                            <input
                                type="text"
                                value={addForm.contact_number}
                                onChange={(e) => setAddForm({ ...addForm, contact_number: e.target.value })}
                                placeholder="e.g. +63 918 555 1001"
                                className="cyber-glass-input w-full px-3.5 py-2 text-xs rounded-xl"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-[#A8E6E8] uppercase tracking-wider mb-1">
                            Institutional Email Address <span className="text-rose-400">*</span>
                        </label>
                        <input
                            type="email"
                            value={addForm.email}
                            onChange={(e) => setAddForm({ ...addForm, email: e.target.value })}
                            placeholder="e.g. chef.santos@crt.edu.ph"
                            className="cyber-glass-input w-full px-3.5 py-2 text-xs rounded-xl"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-bold text-[#A8E6E8] uppercase tracking-wider mb-1">
                                Temporary Password <span className="text-rose-400">*</span>
                            </label>
                            <input
                                type="text"
                                value={addForm.password}
                                onChange={(e) => setAddForm({ ...addForm, password: e.target.value })}
                                className="cyber-glass-input w-full px-3.5 py-2 text-xs rounded-xl"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-[#A8E6E8] uppercase tracking-wider mb-1">
                                Initial Status <span className="text-rose-400">*</span>
                            </label>
                            <select
                                value={addForm.status}
                                onChange={(e) => setAddForm({ ...addForm, status: e.target.value })}
                                className="cyber-glass-input w-full px-3.5 py-2 text-xs rounded-xl"
                            >
                                <option value="active" className="bg-[#061923] text-[#F4FBFC]">Active (Can Login Immediately)</option>
                                <option value="inactive" className="bg-[#061923] text-[#F4FBFC]">Inactive</option>
                            </select>
                        </div>
                    </div>

                    <div className="pt-3 border-t border-[#A8E6E8]/15 flex items-center justify-end gap-2.5">
                        <button
                            type="button"
                            onClick={() => setIsAddOpen(false)}
                            className="cyber-oauth-btn px-4 py-2 text-xs font-bold rounded-xl"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmittingAdd}
                            className="cyber-glow-btn px-5 py-2 text-xs font-bold rounded-xl disabled:opacity-50 cursor-pointer"
                        >
                            {isSubmittingAdd ? 'Registering...' : 'Add Account'}
                        </button>
                    </div>
                </form>
            </Modal>

            {/* Modal: Edit Staff Record */}
            <Modal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} title="Edit Staff Account">
                {editForm && (
                    <form onSubmit={handleEditSubmit} className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-[#A8E6E8] uppercase tracking-wider mb-1.5">
                                Account Role
                            </label>
                            <select
                                value={editForm.role}
                                onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                                className="cyber-glass-input w-full px-3.5 py-2 text-xs rounded-xl font-semibold"
                            >
                                <option value="teacher" className="bg-[#061923] text-[#F4FBFC]">Teacher / Instructor</option>
                                <option value="admin" className="bg-[#061923] text-[#F4FBFC]">Full Administrator</option>
                            </select>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-xs font-bold text-[#A8E6E8] uppercase tracking-wider mb-1">
                                    First Name <span className="text-rose-400">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={editForm.first_name}
                                    onChange={(e) => setEditForm({ ...editForm, first_name: e.target.value })}
                                    className="cyber-glass-input w-full px-3.5 py-2 text-xs rounded-xl"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-[#A8E6E8] uppercase tracking-wider mb-1">
                                    Last Name <span className="text-rose-400">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={editForm.last_name}
                                    onChange={(e) => setEditForm({ ...editForm, last_name: e.target.value })}
                                    className="cyber-glass-input w-full px-3.5 py-2 text-xs rounded-xl"
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-xs font-bold text-[#A8E6E8] uppercase tracking-wider mb-1">
                                    Middle Name
                                </label>
                                <input
                                    type="text"
                                    value={editForm.middle_name}
                                    onChange={(e) => setEditForm({ ...editForm, middle_name: e.target.value })}
                                    className="cyber-glass-input w-full px-3.5 py-2 text-xs rounded-xl"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-[#A8E6E8] uppercase tracking-wider mb-1">
                                    Contact Number
                                </label>
                                <input
                                    type="text"
                                    value={editForm.contact_number}
                                    onChange={(e) => setEditForm({ ...editForm, contact_number: e.target.value })}
                                    className="cyber-glass-input w-full px-3.5 py-2 text-xs rounded-xl"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-[#A8E6E8] uppercase tracking-wider mb-1">
                                Email Address <span className="text-rose-400">*</span>
                            </label>
                            <input
                                type="email"
                                value={editForm.email}
                                onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                                className="cyber-glass-input w-full px-3.5 py-2 text-xs rounded-xl"
                                required
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-xs font-bold text-[#A8E6E8] uppercase tracking-wider mb-1">
                                    Account Status
                                </label>
                                <select
                                    value={editForm.status}
                                    onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                                    className="cyber-glass-input w-full px-3.5 py-2 text-xs rounded-xl"
                                >
                                    <option value="active" className="bg-[#061923] text-[#F4FBFC]">Active</option>
                                    <option value="inactive" className="bg-[#061923] text-[#F4FBFC]">Inactive</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-[#A8E6E8] uppercase tracking-wider mb-1">
                                    Reset Password (Optional)
                                </label>
                                <input
                                    type="text"
                                    value={editForm.password}
                                    onChange={(e) => setEditForm({ ...editForm, password: e.target.value })}
                                    placeholder="Leave blank to keep"
                                    className="cyber-glass-input w-full px-3.5 py-2 text-xs rounded-xl"
                                />
                            </div>
                        </div>

                        <div className="pt-3 border-t border-[#A8E6E8]/15 flex items-center justify-end gap-2.5">
                            <button
                                type="button"
                                onClick={() => setIsEditOpen(false)}
                                className="cyber-oauth-btn px-4 py-2 text-xs font-bold rounded-xl"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmittingEdit}
                                className="cyber-glow-btn px-5 py-2 text-xs font-bold rounded-xl disabled:opacity-50 cursor-pointer"
                            >
                                {isSubmittingEdit ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </form>
                )}
            </Modal>

            {/* Modal: Delete Confirmation */}
            <Modal isOpen={isDeleteOpen} onClose={() => setIsDeleteOpen(false)} title="Confirm Staff Account Removal">
                <div className="space-y-4">
                    <div className="p-4 rounded-xl bg-[#2EC4D6]/15 border border-[#2EC4D6]/30 text-xs text-[#F4FBFC] flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                        <div>
                            <p className="font-bold text-rose-300">Are you sure you want to delete this staff account?</p>
                            <p className="mt-1 text-[#F4FBFC]">
                                This will remove account access for <strong>{deletingUser?.name}</strong> ({deletingUser?.email}). Their uploaded lessons will remain safe in the library.
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center justify-end gap-2.5">
                        <button
                            type="button"
                            onClick={() => setIsDeleteOpen(false)}
                            className="cyber-oauth-btn px-4 py-2 text-xs font-bold rounded-xl"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={handleDelete}
                            className="px-5 py-2 text-xs font-bold text-white bg-[#2EC4D6] hover:bg-[#0B6E8A] rounded-xl shadow-md cursor-pointer transition-colors"
                        >
                            Yes, Remove Account
                        </button>
                    </div>
                </div>
            </Modal>
            {/* Modal: Staff Profile Preview */}
            <Modal isOpen={!!profileModalStaff} onClose={() => setProfileModalStaff(null)} title="Staff Profile Overview">
                {profileModalStaff && (
                    <div className="space-y-5">
                        {/* Header Banner & Avatar */}
                        <div className="relative rounded-2xl bg-gradient-to-r from-[#0B6E8A] via-[#1ab8cb] to-[#2EC4D6] p-6 text-white text-center overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none" />
                            <div className="relative z-10 flex flex-col items-center">
                                <img
                                    src={profileModalStaff.avatar_url}
                                    alt={profileModalStaff.name}
                                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover ring-4 ring-white/90 shadow-xl"
                                />
                                <h3 className="mt-3 text-lg sm:text-xl font-black text-white tracking-tight flex items-center gap-2 justify-center">
                                    {profileModalStaff.name}
                                    {profileModalStaff.id === currentUserId && (
                                        <span className="text-[10px] font-semibold text-[#061923] bg-white/80 px-2 py-0.5 rounded-md">
                                            You
                                        </span>
                                    )}
                                </h3>
                                <div className="mt-1 flex items-center gap-2 flex-wrap justify-center">
                                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                                        profileModalStaff.role === 'admin'
                                            ? 'bg-[#061923]/60 text-[#A8E6E8] border border-[#2EC4D6]/40 shadow-xs'
                                            : 'bg-[#061923]/60 text-sky-200 border border-sky-400/40 shadow-xs'
                                    }`}>
                                        {profileModalStaff.role === 'admin' ? (
                                            <Shield className="w-3 h-3 text-[#2EC4D6]" />
                                        ) : (
                                            <GraduationCap className="w-3 h-3 text-sky-300" />
                                        )}
                                        {profileModalStaff.role === 'admin' ? 'Administrator' : 'Teacher / Instructor'}
                                    </span>
                                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                        profileModalStaff.status === 'active'
                                            ? 'bg-emerald-500 text-white shadow-xs'
                                            : 'bg-slate-400 text-white'
                                    }`}>
                                        <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                                        {profileModalStaff.status}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Profile Details List */}
                        <div className="bg-[#061923]/50 rounded-2xl p-4 border border-[#A8E6E8]/15 space-y-3 text-xs">
                            <div className="flex items-center gap-3 text-[#F4FBFC]">
                                <div className="w-8 h-8 rounded-lg bg-[#0B6E8A]/30 text-[#2EC4D6] border border-[#A8E6E8]/20 flex items-center justify-center shrink-0">
                                    <Mail className="w-4 h-4" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <span className="text-[10px] font-bold text-[#A8E6E8]/70 uppercase tracking-wider block">Email Address</span>
                                    <p className="font-semibold text-[#F4FBFC] truncate">{profileModalStaff.email}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 text-[#F4FBFC]">
                                <div className="w-8 h-8 rounded-lg bg-[#0B6E8A]/30 text-[#2EC4D6] border border-[#A8E6E8]/20 flex items-center justify-center shrink-0">
                                    <Phone className="w-4 h-4" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <span className="text-[10px] font-bold text-[#A8E6E8]/70 uppercase tracking-wider block">Contact Number</span>
                                    <p className="font-semibold text-[#F4FBFC] font-mono">{profileModalStaff.contact_number || 'Not provided'}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 text-[#F4FBFC]">
                                <div className="w-8 h-8 rounded-lg bg-[#0B6E8A]/30 text-[#2EC4D6] border border-[#A8E6E8]/20 flex items-center justify-center shrink-0">
                                    <BookOpen className="w-4 h-4" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <span className="text-[10px] font-bold text-[#A8E6E8]/70 uppercase tracking-wider block">Curriculum Materials Contributed</span>
                                    <p className="font-semibold text-[#F4FBFC]">{profileModalStaff.resources_count || 0} educational materials</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 text-[#F4FBFC]">
                                <div className="w-8 h-8 rounded-lg bg-[#0B6E8A]/30 text-[#2EC4D6] border border-[#A8E6E8]/20 flex items-center justify-center shrink-0">
                                    <Calendar className="w-4 h-4" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <span className="text-[10px] font-bold text-[#A8E6E8]/70 uppercase tracking-wider block">Account Created</span>
                                    <p className="font-semibold text-[#F4FBFC]">
                                        {new Date(profileModalStaff.created_at).toLocaleDateString([], { month: 'long', day: 'numeric', year: 'numeric' })}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#A8E6E8]/15">
                            <button
                                type="button"
                                onClick={() => {
                                    const st = profileModalStaff;
                                    setProfileModalStaff(null);
                                    handleEditOpen(st);
                                }}
                                className="cyber-glow-btn px-4 py-2 text-xs font-bold rounded-xl"
                            >
                                Edit Account Details
                            </button>
                            <button
                                type="button"
                                onClick={() => setProfileModalStaff(null)}
                                className="cyber-oauth-btn px-4 py-2 text-xs font-semibold rounded-xl"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                )}
            </Modal>
        </AppLayout>
    );
}

