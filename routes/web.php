<?php

use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Student\TraitsController;

Route::get('/', function () {
    if(Auth::check()){
        $routes = [
            0 => 'student.home',
            1 => 'admin.dashboard',
            2 => 'teacher.dashboard',
            3 => 'guest.register.students',
            4 => 'guest.register.teachers',
        ];

        $role = Auth::user()->role;

        if(isset($routes[$role])){
            return redirect()->route($routes[$role]);
        }
    }

    return Inertia::render('Welcome');
})->name('home');

// User Routes
Route::middleware(['auth', 'user_access:0'])->prefix('student')->name('student.')->group(function(){
    Route::get('/home', [App\Http\Controllers\Student\HomeController::class, 'index'])->name('home');

    Route::get('/roadmap', [App\Http\Controllers\Student\RoadmapController::class, 'index'])->name('roadmap.index');
    Route::get('/roadmap/{roadmapId}', [App\Http\Controllers\Student\RoadmapController::class, 'show'])->name('roadmap.show');

    Route::get('/traits', [App\Http\Controllers\Student\TraitsController::class, 'index'])->name('traits.index');
    Route::get('/traits/assessment', [App\Http\Controllers\Student\TraitsController::class, 'create'])->name('traits.create');
    Route::post('/traits/assessment', [App\Http\Controllers\Student\TraitsController::class, 'store'])->name('traits.store');
    Route::delete('/traits/delete/assessment', [App\Http\Controllers\Student\TraitsController::class, 'destroy'])->name('traits.destroy');

    Route::get('/resume', [App\Http\Controllers\Student\ResumeController::class, 'index'])->name('resume.index');
    Route::get('/resume/create', [App\Http\Controllers\Student\ResumeController::class, 'create'])->name('resume.create');
    Route::post('/resume/create', [App\Http\Controllers\Student\ResumeController::class, 'store'])->name('resume.store');
    Route::get('/resume/edit', [App\Http\Controllers\Student\ResumeController::class, 'edit'])->name('resume.edit');
    Route::put('/resume/edit', [App\Http\Controllers\Student\ResumeController::class, 'update'])->name('resume.update');

    Route::get('/curricular', [App\Http\Controllers\Student\CurricularExchangeController::class, 'index'])->name('curricular.index');
    Route::post('/curricular', [App\Http\Controllers\Student\CurricularExchangeController::class, 'store'])->name('curricular.store');
    Route::put('/curricular/{id}', [App\Http\Controllers\Student\CurricularExchangeController::class, 'update'])->name('curricular.update');
    Route::delete('/curricular/{id}', [App\Http\Controllers\Student\CurricularExchangeController::class, 'destroy'])->name('curricular.destroy');

    Route::get('/feedback', [App\Http\Controllers\Student\FeedbackController::class, 'index'])->name('feedback.index');

});

// Admin Routes
Route::middleware(['auth', 'user_access:1'])->prefix('admin')->name('admin.')->group(function(){
    Route::get('/dashboard', [App\Http\Controllers\Admin\DashboardController::class, 'index'])->name('dashboard');
    // // Route::resource('course', App\Http\Controllers\Admin\Course\CourseController::class);
    // Volt::route('course', 'pages.admin.course')->name('course');

    Route::resource('roadmap', App\Http\Controllers\Admin\Roadmap\RoadmapController::class);

    // Route::prefix('roadmap')->name('roadmap.')->group(function(){
    //     Volt::route('index', 'pages.admin.roadmap.index')->name('index');
    // });

    // Route::prefix('user')->name('users.')->group(function(){
    //     Volt::route('index', 'pages.admin.user.index')->name('index');
    // });

    // Route::prefix('domain')->name('domain.')->group(function(){
    //     Volt::route('index', 'pages.admin.domain.index')->name('index');
    // });
});

// Teacher Routes
Route::middleware(['auth', 'user_access:2'])->prefix('teacher')->name('teacher.')->group(function(){
    Route::get('/dashboard', [App\Http\Controllers\Teacher\DashboardController::class, 'index'])->name('dashboard');
});

require __DIR__.'/auth.php';
