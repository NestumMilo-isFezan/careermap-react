<?php

namespace App\Http\Controllers\Teacher;

use App\Models\User;
use Inertia\Inertia;
use App\Models\School;
use App\Models\Student;
use App\Models\Classroom;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Http\Resources\StudentResource;

class DashboardController extends Controller
{
    public function index(){
        $user = User::find(request()->user()->id);
        $schools = School::where('id', $user->teacher->school_id)->first();
        $school = [
            'name' => $schools->name,
            'image' => $schools->image ? asset('storage/'.$schools->image) : null,
            'address' => $schools->address,
            'phone' => $schools->phone,
            'email' => $schools->email,
        ];
        $classroom = Classroom::where('teacher_id', $user->teacher->id)->first();
        $user = [
            'name' => $user->name,
            'email' => $user->email,
            'phone' => $user->profile->phone,
            'image' => $user->image ? asset('storage/'.$user->image) : null,
        ];
        $classroom = [
            'name' => $classroom->name,
            'students' => StudentResource::collection(Student::where('classroom_id', $classroom->id)->get()),
        ];
        return Inertia::render('Teacher/Dashboard', [
            'school' => $school,
            'user' => $user,
            'classroom' => $classroom,
        ]);
    }

}
