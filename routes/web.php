<?php

use App\Http\Controllers\Admin\ActivityLogController;
use App\Http\Controllers\Admin\AssessmentController as AdminAssessmentController;
use App\Http\Controllers\Admin\DashboardController as AdminDashboardController;
use App\Http\Controllers\Admin\FolderController as AdminFolderController;
use App\Http\Controllers\Admin\ResourceController as AdminResourceController;
use App\Http\Controllers\Admin\SettingController as AdminSettingController;
use App\Http\Controllers\Admin\StudentController as AdminStudentController;
use App\Http\Controllers\Admin\TeacherController as AdminTeacherController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\LandingController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Student\AssessmentController as StudentAssessmentController;
use App\Http\Controllers\Student\DashboardController as StudentDashboardController;
use App\Http\Controllers\Student\ResourceController as StudentResourceController;
use Illuminate\Support\Facades\Route;

// Public routes
Route::get('/', [LandingController::class, 'index'])->name('home');

Route::middleware('guest')->group(function () {
    Route::get('/login', [AuthController::class, 'showLogin'])->name('login');
    Route::post('/login', [AuthController::class, 'login']);
    Route::get('/register', [AuthController::class, 'showRegister'])->name('register');
    Route::post('/register', [AuthController::class, 'register']);
});

// Two-Step Student Account Verification & Approval
Route::get('/verify-otp', [AuthController::class, 'showVerifyOtp'])->name('verification.otp');
Route::post('/verify-otp', [AuthController::class, 'verifyOtp'])->name('verification.otp.submit');
Route::post('/resend-otp', [AuthController::class, 'resendOtp'])->name('verification.otp.resend');
Route::get('/approval-pending', [AuthController::class, 'showApprovalPending'])->name('approval.pending');

// Authenticated shared routes
Route::middleware(['auth', 'active'])->group(function () {
    Route::post('/logout', [AuthController::class, 'logout'])->name('logout');

    // Profile
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::put('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::post('/profile/avatar', [ProfileController::class, 'updateAvatar'])->name('profile.avatar');
    Route::put('/profile/password', [ProfileController::class, 'updatePassword'])->name('profile.password');

    // Notifications
    Route::get('/notifications', [NotificationController::class, 'index'])->name('notifications.index');
    Route::post('/notifications/{id}/read', [NotificationController::class, 'markAsRead'])->name('notifications.read');
    Route::post('/notifications/read-all', [NotificationController::class, 'markAllAsRead'])->name('notifications.readAll');

    // Admin & Teacher routes
    Route::middleware('role:admin')->prefix('admin')->name('admin.')->group(function () {
        Route::get('/dashboard', [AdminDashboardController::class, 'index'])->name('dashboard');

        // Resources
        Route::get('/resources', [AdminResourceController::class, 'index'])->name('resources.index');
        Route::get('/resources/create', [AdminResourceController::class, 'create'])->name('resources.create');
        Route::post('/resources', [AdminResourceController::class, 'store'])->name('resources.store');
        Route::get('/resources/category/{slug}', [AdminResourceController::class, 'categoryView'])->name('resources.category');
        Route::get('/resources/folder/{folder}', [AdminResourceController::class, 'folderView'])->name('resources.folder');
        Route::get('/resources/{resource}', [AdminResourceController::class, 'show'])->name('resources.show');
        Route::get('/resources/{resource}/edit', [AdminResourceController::class, 'edit'])->name('resources.edit');
        Route::put('/resources/{resource}', [AdminResourceController::class, 'update'])->name('resources.update');
        Route::delete('/resources/{resource}', [AdminResourceController::class, 'destroy'])->name('resources.destroy');
        Route::post('/resources/{resource}/move', [AdminResourceController::class, 'move'])->name('resources.move');
        Route::post('/resources/{resource}/visibility', [AdminResourceController::class, 'updateVisibility'])->name('resources.visibility');
        Route::get('/resources/{resource}/download', [AdminResourceController::class, 'download'])->name('resources.download');
        Route::post('/resources/{resource}/announce', [AdminResourceController::class, 'broadcastAnnouncement'])->name('resources.announce');

        // Folders
        Route::post('/folders', [AdminFolderController::class, 'store'])->name('folders.store');
        Route::put('/folders/{folder}', [AdminFolderController::class, 'update'])->name('folders.update');
        Route::delete('/folders/{folder}', [AdminFolderController::class, 'destroy'])->name('folders.destroy');

        // Students
        Route::get('/students', [AdminStudentController::class, 'index'])->name('students.index');
        Route::post('/students', [AdminStudentController::class, 'store'])->name('students.store');
        Route::get('/students/export', [AdminStudentController::class, 'export'])->name('students.export');
        Route::get('/students/{user}', [AdminStudentController::class, 'show'])->name('students.show');
        Route::put('/students/{user}', [AdminStudentController::class, 'update'])->name('students.update');
        Route::post('/students/{user}/approve', [AdminStudentController::class, 'approve'])->name('students.approve');
        Route::post('/students/{user}/reject', [AdminStudentController::class, 'reject'])->name('students.reject');
        Route::post('/students/{user}/toggle-status', [AdminStudentController::class, 'toggleStatus'])->name('students.toggleStatus');
        Route::delete('/students/{user}', [AdminStudentController::class, 'destroy'])->name('students.destroy');

        // Teachers & Administrators (Faculty & Staff)
        Route::get('/teachers', [AdminTeacherController::class, 'index'])->name('teachers.index');
        Route::post('/teachers', [AdminTeacherController::class, 'store'])->name('teachers.store');
        Route::put('/teachers/{user}', [AdminTeacherController::class, 'update'])->name('teachers.update');
        Route::delete('/teachers/{user}', [AdminTeacherController::class, 'destroy'])->name('teachers.destroy');
        Route::post('/teachers/{user}/toggle-status', [AdminTeacherController::class, 'toggleStatus'])->name('teachers.toggleStatus');

        // Activity Logs
        Route::get('/activity-logs', [ActivityLogController::class, 'index'])->name('activityLogs.index');

        // System Settings
        Route::get('/settings', [AdminSettingController::class, 'index'])->name('settings.index');
        Route::post('/settings', [AdminSettingController::class, 'update'])->name('settings.update');

        // Student Assessments & Exam Results
        Route::get('/assessments', [AdminAssessmentController::class, 'index'])->name('assessments.index');
        Route::get('/assessments/{submission}', [AdminAssessmentController::class, 'show'])->name('assessments.show');
        Route::delete('/assessments/{submission}', [AdminAssessmentController::class, 'destroySubmission'])->name('assessments.destroySubmission');
        Route::post('/resources/{resource}/assessment', [AdminAssessmentController::class, 'saveAssessment'])->name('resources.assessment.save');
        Route::post('/resources/{resource}/assessment/smart-generate', [AdminAssessmentController::class, 'generateSmartAssessment'])->name('resources.assessment.generate');
        Route::post('/resources/{resource}/assessment/toggle-status', [AdminAssessmentController::class, 'togglePublishStatus'])->name('resources.assessment.toggleStatus');
    });

    // Student routes
    Route::middleware('role:student')->prefix('student')->name('student.')->group(function () {
        Route::get('/dashboard', [StudentDashboardController::class, 'index'])->name('dashboard');
        Route::get('/resources', [StudentResourceController::class, 'index'])->name('resources.index');
        Route::get('/resources/category/{slug}', [StudentResourceController::class, 'categoryView'])->name('resources.category');
        Route::get('/resources/folder/{folder}', [StudentResourceController::class, 'folderView'])->name('resources.folder');
        Route::get('/resources/{resource}', [StudentResourceController::class, 'show'])->name('resources.show');
        Route::get('/resources/{resource}/download', [StudentResourceController::class, 'download'])->name('resources.download');
        Route::post('/resources/{resource}/assessment', [StudentAssessmentController::class, 'submit'])->name('resources.assessment.submit');
    });
});
