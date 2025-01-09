<?php

use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;

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
    Route::post('/roadmap/{roadmapId}', [App\Http\Controllers\Student\RoadmapController::class, 'store'])->name('roadmap.store');
    Route::delete('/roadmap/{roadmapId}', [App\Http\Controllers\Student\RoadmapController::class, 'destroy'])->name('roadmap.destroy');
    Route::get('/roadmap/{roadmapId}', [App\Http\Controllers\Student\RoadmapController::class, 'show'])->name('roadmap.show');

    Route::get('/traits/questions', [App\Http\Controllers\Student\TraitsController::class, 'index'])
        ->name('traits.questions');

    Route::post('/traits/answer', [App\Http\Controllers\Student\TraitsController::class, 'storeAnswer'])
        ->name('traits.store-answer');

    Route::get('/traits/results', [App\Http\Controllers\Student\TraitsController::class, 'results'])
        ->name('traits.results');

    Route::post('/traits/retake', [App\Http\Controllers\Student\TraitsController::class, 'retake'])
        ->name('traits.retake');
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
