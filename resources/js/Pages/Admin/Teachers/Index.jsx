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
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold uppercase tracking-wider mb-2">
                        <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                        Authorized Staff &amp; Faculty
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                        Teacher &amp; Administrator Management
                    </h1>
                    <p className="text-xs sm:text-sm text-slate-500 mt-1">
                        Create, manage, and assign authorized teacher and administrator accounts for curriculum instruction.
                    </p>
                </div>

                <div className="flex items-center gap-2.5">
                    <button
                        onClick={() => setIsAddOpen(true)}
                        className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm shadow-blue-500/20 hover:shadow-md transition-all cursor-pointer"
                    >
                        <UserPlus className="w-4 h-4" />
                        Add Teacher / Admin
                    </button>
                </div>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Staff</span>
                    <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
                        {stats.total_staff || 0}
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">Total instructors &amp; admins</p>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Teachers / Chefs</span>
                    <div className="text-2xl sm:text-3xl font-black text-sky-600 mt-2">
                        {stats.teacher_count || 0}
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">Active curriculum educators</p>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Administrators</span>
                    <div className="text-2xl sm:text-3xl font-black text-blue-700 mt-2">
                        {stats.admin_count || 0}
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">Full system privilege holders</p>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Active Status</span>
                    <div className="text-2xl sm:text-3xl font-black text-emerald-600 mt-2">
                        {stats.active_count || 0}
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">Ready for portal access</p>
                </div>
            </div>

            {/* Filters Bar */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs mb-6">
                <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 items-center">
                    <div className="relative flex-1 w-full">
                        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search staff by name, email, or contact number..."
                            className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:bg-white focus:border-blue-600 focus:outline-none transition-all"
                        />
                    </div>

                    <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
                        <select
                            value={roleFilter}
                            onChange={(e) => {
                                setRoleFilter(e.target.value);
                                applyFilters({ search, role: e.target.value, status: statusFilter, sort: sortBy });
                            }}
                            className="px-3 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:bg-white focus:border-blue-600 focus:outline-none text-slate-700 font-medium"
                        >
                            <option value="">All Roles</option>
                            <option value="teacher">Teachers / Instructors</option>
                            <option value="admin">Administrators</option>
                        </select>

                        <select
                            value={statusFilter}
                            onChange={(e) => {
                                setStatusFilter(e.target.value);
                                applyFilters({ search, role: roleFilter, status: e.target.value, sort: sortBy });
                            }}
                            className="px-3 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:bg-white focus:border-blue-600 focus:outline-none text-slate-700 font-medium"
                        >
                            <option value="">All Statuses</option>
                            <option value="active">Active Only</option>
                            <option value="inactive">Inactive Only</option>
                        </select>

                        <select
                            value={sortBy}
                            onChange={(e) => {
                                setSortBy(e.target.value);
                                applyFilters({ search, role: roleFilter, status: statusFilter, sort: e.target.value });
                            }}
                            className="px-3 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:bg-white focus:border-blue-600 focus:outline-none text-slate-700 font-medium"
                        >
                            <option value="latest">Joined (Newest)</option>
                            <option value="oldest">Joined (Oldest)</option>
                            <option value="name">Name (A-Z)</option>
                            <option value="resources">Most Lessons Created</option>
                        </select>

                        <button
                            type="submit"
                            className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-2xs"
                        >
                            Filter
                        </button>

                        {(search || roleFilter || statusFilter) && (
                            <button
                                type="button"
                                onClick={handleResetFilters}
                                className="px-3 py-2 text-xs font-bold text-slate-500 hover:text-slate-800"
                            >
                                Reset
                            </button>
                        )}
                    </div>
                </form>
            </div>

            {/* Staff Table */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden mb-6">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                        <thead>
                            <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
                                <th className="py-3.5 px-6">Staff Member</th>
                                <th className="py-3.5 px-6">System Role</th>
                                <th className="py-3.5 px-6">Email Address</th>
                                <th className="py-3.5 px-6 hidden sm:table-cell">Contact</th>
                                <th className="py-3.5 px-6 hidden md:table-cell">Lessons Uploaded</th>
                                <th className="py-3.5 px-6">Status</th>
                                <th className="py-3.5 px-6 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {teachers.data && teachers.data.length > 0 ? (
                                teachers.data.map((staff) => {
                                    const isSelf = staff.id === currentUserId;
                                    const isAdminRole = staff.role === 'admin';

                                    return (
                                        <tr key={staff.id} className="hover:bg-blue-50/30 transition-colors">
                                            {/* Staff Member Avatar & Name */}
                                            <td className="py-3.5 px-6">
                                                <div className="flex items-center gap-3">
                                                    <img
                                                        src={staff.avatar_url}
                                                        alt={staff.name}
                                                        className="w-8 h-8 rounded-xl object-cover ring-2 ring-slate-100"
                                                    />
                                                    <div>
                                                        <div className="font-bold text-slate-900 flex items-center gap-1.5">
                                                            {staff.name}
                                                            {isSelf && (
                                                                <span className="text-[10px] font-semibold text-blue-600 bg-blue-50 px-1.5 py-0.2 rounded-md">
                                                                    (You)
                                                                </span>
                                                            )}
                                                        </div>
                                                        <p className="text-[10px] text-slate-400">
                                                            Joined {new Date(staff.created_at).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Role Badge */}
                                            <td className="py-3.5 px-6">
                                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                                                    isAdminRole
                                                        ? 'bg-blue-100 text-blue-800'
                                                        : 'bg-sky-100 text-sky-800'
                                                }`}>
                                                    {isAdminRole ? (
                                                        <Shield className="w-3 h-3 text-blue-600" />
                                                    ) : (
                                                        <GraduationCap className="w-3 h-3 text-sky-600" />
                                                    )}
                                                    {isAdminRole ? 'Administrator' : 'Teacher / Instructor'}
                                                </span>
                                            </td>

                                            {/* Email */}
                                            <td className="py-3.5 px-6 text-slate-600 font-medium">
                                                {staff.email}
                                            </td>

                                            {/* Contact */}
                                            <td className="py-3.5 px-6 hidden sm:table-cell text-slate-500">
                                                {staff.contact_number || '—'}
                                            </td>

                                            {/* Lessons Uploaded */}
                                            <td className="py-3.5 px-6 hidden md:table-cell">
                                                <span className="font-bold text-slate-800">
                                                    {staff.resources_count || 0}
                                                </span>
                                                <span className="text-[10px] text-slate-400 ml-1">materials</span>
                                            </td>

                                            {/* Status */}
                                            <td className="py-3.5 px-6">
                                                <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold capitalize ${
                                                    staff.status === 'active'
                                                        ? 'bg-emerald-100 text-emerald-800'
                                                        : 'bg-slate-100 text-slate-600'
                                                }`}>
                                                    {staff.status === 'active' ? (
                                                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                                    ) : (
                                                        <XCircle className="w-3 h-3 text-slate-400" />
                                                    )}
                                                    {staff.status}
                                                </span>
                                            </td>

                                            {/* Actions */}
                                            <td className="py-3.5 px-6 text-right">
                                                <div className="flex items-center justify-end gap-1.5">
                                                    <button
                                                        onClick={() => handleEditOpen(staff)}
                                                        className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                        title="Edit details"
                                                    >
                                                        <Edit3 className="w-3.5 h-3.5" />
                                                    </button>

                                                    <button
                                                        onClick={() => handleToggleStatus(staff)}
                                                        disabled={isSelf}
                                                        className={`p-1.5 rounded-lg transition-colors ${
                                                            isSelf
                                                                ? 'text-slate-200 cursor-not-allowed'
                                                                : staff.status === 'active'
                                                                ? 'text-slate-400 hover:text-amber-600 hover:bg-amber-50'
                                                                : 'text-slate-400 hover:text-emerald-600 hover:bg-emerald-50'
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
                                                                ? 'text-slate-200 cursor-not-allowed'
                                                                : 'text-slate-400 hover:text-rose-600 hover:bg-rose-50'
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
                                    <td colSpan={7} className="py-12 text-center text-slate-400">
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
                    {/* Role Selection */}
                    <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                            Account Role <span className="text-rose-500">*</span>
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                            <label className={`p-3 rounded-xl border text-xs flex items-center gap-2.5 cursor-pointer transition-all ${
                                addForm.role === 'teacher'
                                    ? 'border-sky-500 bg-sky-50 text-sky-950 font-bold ring-2 ring-sky-500/20'
                                    : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                            }`}>
                                <input
                                    type="radio"
                                    name="role"
                                    value="teacher"
                                    checked={addForm.role === 'teacher'}
                                    onChange={(e) => setAddForm({ ...addForm, role: e.target.value })}
                                    className="hidden"
                                />
                                <GraduationCap className="w-4 h-4 text-sky-600 shrink-0" />
                                <div>
                                    <p className="leading-snug">Teacher / Instructor</p>
                                    <p className="text-[10px] font-normal text-slate-500">Upload lessons &amp; monitor students</p>
                                </div>
                            </label>

                            <label className={`p-3 rounded-xl border text-xs flex items-center gap-2.5 cursor-pointer transition-all ${
                                addForm.role === 'admin'
                                    ? 'border-blue-600 bg-blue-50 text-blue-950 font-bold ring-2 ring-blue-500/20'
                                    : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                            }`}>
                                <input
                                    type="radio"
                                    name="role"
                                    value="admin"
                                    checked={addForm.role === 'admin'}
                                    onChange={(e) => setAddForm({ ...addForm, role: e.target.value })}
                                    className="hidden"
                                />
                                <Shield className="w-4 h-4 text-blue-600 shrink-0" />
                                <div>
                                    <p className="leading-snug">Full Administrator</p>
                                    <p className="text-[10px] font-normal text-slate-500">Full system &amp; user management</p>
                                </div>
                            </label>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                                First Name <span className="text-rose-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={addForm.first_name}
                                onChange={(e) => setAddForm({ ...addForm, first_name: e.target.value })}
                                placeholder="e.g. Maria"
                                className="w-full px-3.5 py-2 text-xs bg-white rounded-xl border border-slate-200 focus:border-blue-600 focus:outline-none"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                                Last Name <span className="text-rose-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={addForm.last_name}
                                onChange={(e) => setAddForm({ ...addForm, last_name: e.target.value })}
                                placeholder="e.g. Santos"
                                className="w-full px-3.5 py-2 text-xs bg-white rounded-xl border border-slate-200 focus:border-blue-600 focus:outline-none"
                                required
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                                Middle Name (Optional)
                            </label>
                            <input
                                type="text"
                                value={addForm.middle_name}
                                onChange={(e) => setAddForm({ ...addForm, middle_name: e.target.value })}
                                placeholder="e.g. Elena"
                                className="w-full px-3.5 py-2 text-xs bg-white rounded-xl border border-slate-200 focus:border-blue-600 focus:outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                                Contact Number
                            </label>
                            <input
                                type="text"
                                value={addForm.contact_number}
                                onChange={(e) => setAddForm({ ...addForm, contact_number: e.target.value })}
                                placeholder="e.g. +63 918 555 1001"
                                className="w-full px-3.5 py-2 text-xs bg-white rounded-xl border border-slate-200 focus:border-blue-600 focus:outline-none"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                            Institutional Email Address <span className="text-rose-500">*</span>
                        </label>
                        <input
                            type="email"
                            value={addForm.email}
                            onChange={(e) => setAddForm({ ...addForm, email: e.target.value })}
                            placeholder="e.g. chef.santos@crt.edu.ph"
                            className="w-full px-3.5 py-2 text-xs bg-white rounded-xl border border-slate-200 focus:border-blue-600 focus:outline-none"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                                Temporary Password <span className="text-rose-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={addForm.password}
                                onChange={(e) => setAddForm({ ...addForm, password: e.target.value })}
                                className="w-full px-3.5 py-2 text-xs bg-white rounded-xl border border-slate-200 focus:border-blue-600 focus:outline-none"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                                Initial Status <span className="text-rose-500">*</span>
                            </label>
                            <select
                                value={addForm.status}
                                onChange={(e) => setAddForm({ ...addForm, status: e.target.value })}
                                className="w-full px-3.5 py-2 text-xs bg-white rounded-xl border border-slate-200 focus:border-blue-600 focus:outline-none text-slate-700"
                            >
                                <option value="active">Active (Can Login Immediately)</option>
                                <option value="inactive">Inactive</option>
                            </select>
                        </div>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
                        <button
                            type="button"
                            onClick={() => setIsAddOpen(false)}
                            className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmittingAdd}
                            className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm disabled:opacity-50 cursor-pointer"
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
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                                Account Role
                            </label>
                            <select
                                value={editForm.role}
                                onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                                className="w-full px-3.5 py-2 text-xs bg-white rounded-xl border border-slate-200 focus:border-blue-600 focus:outline-none text-slate-700 font-semibold"
                            >
                                <option value="teacher">Teacher / Instructor</option>
                                <option value="admin">Full Administrator</option>
                            </select>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                                    First Name <span className="text-rose-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={editForm.first_name}
                                    onChange={(e) => setEditForm({ ...editForm, first_name: e.target.value })}
                                    className="w-full px-3.5 py-2 text-xs bg-white rounded-xl border border-slate-200 focus:border-blue-600 focus:outline-none"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                                    Last Name <span className="text-rose-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={editForm.last_name}
                                    onChange={(e) => setEditForm({ ...editForm, last_name: e.target.value })}
                                    className="w-full px-3.5 py-2 text-xs bg-white rounded-xl border border-slate-200 focus:border-blue-600 focus:outline-none"
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                                    Middle Name
                                </label>
                                <input
                                    type="text"
                                    value={editForm.middle_name}
                                    onChange={(e) => setEditForm({ ...editForm, middle_name: e.target.value })}
                                    className="w-full px-3.5 py-2 text-xs bg-white rounded-xl border border-slate-200 focus:border-blue-600 focus:outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                                    Contact Number
                                </label>
                                <input
                                    type="text"
                                    value={editForm.contact_number}
                                    onChange={(e) => setEditForm({ ...editForm, contact_number: e.target.value })}
                                    className="w-full px-3.5 py-2 text-xs bg-white rounded-xl border border-slate-200 focus:border-blue-600 focus:outline-none"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                                Email Address <span className="text-rose-500">*</span>
                            </label>
                            <input
                                type="email"
                                value={editForm.email}
                                onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                                className="w-full px-3.5 py-2 text-xs bg-white rounded-xl border border-slate-200 focus:border-blue-600 focus:outline-none"
                                required
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                                    Account Status
                                </label>
                                <select
                                    value={editForm.status}
                                    onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                                    className="w-full px-3.5 py-2 text-xs bg-white rounded-xl border border-slate-200 focus:border-blue-600 focus:outline-none text-slate-700"
                                >
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                                    Reset Password (Optional)
                                </label>
                                <input
                                    type="text"
                                    value={editForm.password}
                                    onChange={(e) => setEditForm({ ...editForm, password: e.target.value })}
                                    placeholder="Leave blank to keep"
                                    className="w-full px-3.5 py-2 text-xs bg-white rounded-xl border border-slate-200 focus:border-blue-600 focus:outline-none"
                                />
                            </div>
                        </div>

                        <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
                            <button
                                type="button"
                                onClick={() => setIsEditOpen(false)}
                                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmittingEdit}
                                className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm disabled:opacity-50 cursor-pointer"
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
                    <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                        <div>
                            <p className="font-bold">Are you sure you want to delete this staff account?</p>
                            <p className="mt-1">
                                This will remove account access for <strong>{deletingUser?.name}</strong> ({deletingUser?.email}). Their uploaded lessons will remain safe in the library.
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center justify-end gap-2.5">
                        <button
                            type="button"
                            onClick={() => setIsDeleteOpen(false)}
                            className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={handleDelete}
                            className="px-5 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-sm cursor-pointer"
                        >
                            Yes, Remove Account
                        </button>
                    </div>
                </div>
            </Modal>
        </AppLayout>
    );
}

