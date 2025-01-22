<?php

namespace App\Http\Controllers\Admin;

use App\Models\User;
use Inertia\Inertia;
use App\Models\Resume;
use App\Models\Roadmap;
use App\Models\Student;
use App\Models\Analytics;
use App\Models\UserRoadmap;
use Illuminate\Http\Request;
use App\Models\StudentAnswer;
use App\Models\StudentResponse;
use App\Http\Controllers\Controller;

class DashboardController extends Controller
{
    public function index(){

        // Get total users, students, teachers, admins
        $totalUsers = User::count();
        $totalStudents = User::where('role', '0')->count();
        $totalTeachers = User::where('role', '2')->count();
        $totalAdmins = User::where('role', '1')->count();

        // Get login and register count
        $loginCount = Analytics::where('name', 'login-event')->first()?->clicks ?? 0;
        $registerCount = Analytics::where('name', 'register-event')->first()?->clicks ?? 0;

        // Get science and non-science stream count
        $scienceStream = Student::where('stream_id', '2')->count();
        $nonScienceStream = Student::where('stream_id', '3')->count();

        // Get total roadmaps and roadmaps with user
        $totalRoadmaps = Roadmap::count();
        $roadmapsWithUser = UserRoadmap::count();

        $completedTests = StudentAnswer::select('student_id')
            ->distinct()
            ->count('student_id');

        $resumeCount = Resume::select('user_id')
            ->distinct()
            ->count('user_id');

        return Inertia::render('Admin/Dashboard', [
            'totalUsers' => $totalUsers,
            'totalStudents' => $totalStudents,
            'totalTeachers' => $totalTeachers,
            'totalAdmins' => $totalAdmins,
            'loginCount' => $loginCount,
            'registerCount' => $registerCount,
            'scienceStream' => $scienceStream,
            'nonScienceStream' => $nonScienceStream,
            'totalRoadmaps' => $totalRoadmaps,
            'roadmapsWithUser' => $roadmapsWithUser,
            'completedTests' => $completedTests,
            'resumeCount' => $resumeCount,
        ]);
    }

}
