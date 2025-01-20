<?php

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Auth\PasswordController;
use App\Http\Controllers\Auth\NewPasswordController;
use App\Http\Controllers\Auth\VerifyEmailController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\Auth\PasswordResetLinkController;
use App\Http\Controllers\Auth\ConfirmablePasswordController;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\EmailVerificationPromptController;
use App\Http\Controllers\Auth\EmailVerificationNotificationController;

Route::middleware('guest')->group(function () {
    Route::get('register', [RegisteredUserController::class, 'create'])
        ->name('register');

    Route::post('register', [RegisteredUserController::class, 'store']);

    Route::get('register/teacher', [RegisteredUserController::class, 'createTeacher'])
        ->name('register.teacher');

    Route::post('register/teacher', [RegisteredUserController::class, 'storeTeacher'])
        ->name('register.teacher');

    Route::get('login', [AuthenticatedSessionController::class, 'create'])
        ->name('login');

    Route::post('login', [AuthenticatedSessionController::class, 'store']);

    Route::get('forgot-password', [PasswordResetLinkController::class, 'create'])
        ->name('password.request');

    Route::post('forgot-password', [PasswordResetLinkController::class, 'store'])
        ->name('password.email');

    Route::get('reset-password/{token}', [NewPasswordController::class, 'create'])
        ->name('password.reset');

    Route::post('reset-password', [NewPasswordController::class, 'store'])
        ->name('password.store');
});

Route::middleware('auth')->group(function () {
    Route::get('verify-email', EmailVerificationPromptController::class)
        ->name('verification.notice');

    Route::get('verify-email/{id}/{hash}', VerifyEmailController::class)
        ->middleware(['signed', 'throttle:6,1'])
        ->name('verification.verify');

    Route::post('email/verification-notification', [EmailVerificationNotificationController::class, 'store'])
        ->middleware('throttle:6,1')
        ->name('verification.send');

    Route::get('confirm-password', [ConfirmablePasswordController::class, 'show'])
        ->name('password.confirm');

    Route::post('confirm-password', [ConfirmablePasswordController::class, 'store']);

    Route::put('password', [PasswordController::class, 'update'])->name('password.update');

    Route::post('logout', [AuthenticatedSessionController::class, 'destroy'])
        ->name('logout');
});


Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::put('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::get('/account-settings', [ProfileController::class, 'editAccount'])->name('profile.account.edit');

    Route::get('/teacher-profile', [ProfileController::class, 'editTeacherDetails'])->name('profile.teacher.edit');

    Route::post('/profile/teacher/details', [ProfileController::class, 'updateTeacherDetails'])->name('profile.teacher.details.update');

    Route::get('/student-profile', [ProfileController::class, 'editStudentDetails'])->name('profile.student.edit');

    Route::post('/profile/student/details', [ProfileController::class, 'updateStudentDetails'])
        ->name('profile.student.details.update');

    Route::post('/profile/student/grades', [ProfileController::class, 'updateStudentGrades'])
        ->name('profile.student.grades.update');
});

Route::middleware(['auth', 'user_access:3'])->prefix('guest')->name('guest.')->group(function () {
    Route::get('register/students', [App\Http\Controllers\Auth\StudentRegistrationController::class, 'index'])
        ->name('register.students');

    Route::get('register/students/skip-grades', [App\Http\Controllers\Auth\StudentRegistrationController::class, 'skipGrades'])
        ->name('register.students.skip-grades');

    Route::post('register/students/profile', [App\Http\Controllers\Auth\StudentRegistrationController::class, 'storeProfile'])
        ->name('register.students.profile.store');
    Route::post('register/students/details', [App\Http\Controllers\Auth\StudentRegistrationController::class, 'storeStudent'])
        ->name('register.students.details.store');
    Route::post('register/students/grade', [App\Http\Controllers\Auth\StudentRegistrationController::class, 'storeGrades'])
        ->name('register.students.grade.store');
});

Route::middleware(['auth', 'user_access:4'])->prefix('guest')->name('guest.')->group(function () {
    Route::get('register/teachers', [App\Http\Controllers\Auth\TeacherRegistrationController::class, 'index'])
        ->name('register.teachers');

    Route::post('register/teachers/profile', [App\Http\Controllers\Auth\TeacherRegistrationController::class, 'storeProfile'])
        ->name('register.teachers.profile.store');

    Route::post('register/teachers/details', [App\Http\Controllers\Auth\TeacherRegistrationController::class, 'storeDetails'])
        ->name('register.teachers.details.store');
});
