<?php

use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\RatingController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\Student\TraitsController;
use App\Http\Controllers\Teacher\FeedbackController;
use App\Http\Controllers\Admin\Course\CourseController;
use App\Http\Controllers\ProfileController;

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
    Route::post('/roadmap', [App\Http\Controllers\Student\RoadmapController::class, 'store'])->name('roadmap.store');

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
    Route::post('/feedback/{feedback}/respond', [App\Http\Controllers\Student\FeedbackController::class, 'respond'])->name('feedback.respond');
    Route::put('/feedback/{feedback}/update-response', [App\Http\Controllers\Student\FeedbackController::class, 'updateResponse'])->name('feedback.update-response');

    Route::delete('/student/roadmap/{roadmap}/favorite', [App\Http\Controllers\Student\RoadmapController::class, 'unfavorite'])
        ->name('roadmap.favorite.destroy');

});

// Admin Routes
Route::middleware(['auth', 'user_access:1'])->prefix('admin')->name('admin.')->group(function(){
    Route::get('/dashboard', [App\Http\Controllers\Admin\DashboardController::class, 'index'])->name('dashboard');

    Route::resource('roadmap', App\Http\Controllers\Admin\Roadmap\RoadmapController::class);

    Route::prefix('course')->name('course.')->group(function () {
        Route::get('/', [App\Http\Controllers\Admin\Course\CourseController::class, 'index'])->name('index');
        Route::post('/import', [CourseController::class, 'import'])->name('import');
        Route::post('/preview', [CourseController::class, 'preview'])->name('preview');
        Route::put('/{course}', [CourseController::class, 'update'])->name('update');
        Route::delete('/{course}', [CourseController::class, 'destroy'])->name('destroy');
    });

    Route::get('/user', [App\Http\Controllers\Admin\UserController::class, 'index'])->name('user.index');
    Route::delete('/user/{user}', [App\Http\Controllers\Admin\UserController::class, 'destroy'])->name('user.destroy');
    Route::put('/user/{user}', [App\Http\Controllers\Admin\UserController::class, 'update'])->name('user.update');
    Route::get('/user/{user}', [App\Http\Controllers\Admin\UserController::class, 'show'])->name('user.show');

    Route::resource('news', App\Http\Controllers\Admin\NewsController::class);

    Route::get('/school', [App\Http\Controllers\Admin\SchoolController::class, 'index'])->name('school.index');
    Route::prefix('classroom')->name('classroom.')->group(function(){
        Route::post('/', [App\Http\Controllers\Admin\ClassesController::class, 'store'])->name('store');
        Route::put('/{id}', [App\Http\Controllers\Admin\ClassesController::class, 'update'])->name('update');
        Route::delete('/{id}', [App\Http\Controllers\Admin\ClassesController::class, 'destroy'])->name('destroy');
    });
});

// Teacher Routes
Route::middleware(['auth', 'user_access:2'])->prefix('teacher')->name('teacher.')->group(function(){
    Route::get('/dashboard', [App\Http\Controllers\Teacher\DashboardController::class, 'index'])->name('dashboard');

    Route::resource('feedback', App\Http\Controllers\Teacher\FeedbackController::class);

    Route::get('/curricular', [App\Http\Controllers\Teacher\CurricularExchangeController::class, 'index'])->name('curricular.index');
    Route::post('/curricular', [App\Http\Controllers\Teacher\CurricularExchangeController::class, 'store'])->name('curricular.store');
    Route::put('/curricular/reject', [App\Http\Controllers\Teacher\CurricularExchangeController::class, 'reject'])->name('curricular.reject');
    Route::put('/curricular/retract', [App\Http\Controllers\Teacher\CurricularExchangeController::class, 'retract'])->name('curricular.retract');
});

Route::post('/ratings', [RatingController::class, 'store'])->name('ratings.store');
Route::post('/report', [ReportController::class, 'store'])->name('report.store');

// Add this route if it doesn't exist

require __DIR__.'/auth.php';
