<?php

namespace App\Http\Controllers\Admin;

use Inertia\Inertia;
use App\Models\School;
use App\Models\Classroom;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Http\Resources\ClassroomResource;

class SchoolController extends Controller
{
    public function index(){
        $schools = School::first();
        $school = [
            'name' => $schools->name,
            'image' => $schools->image ? asset('storage/'.$schools->image) : null,
            'address' => $schools->address,
            'phone' => $schools->phone,
            'email' => $schools->email,
            'referral_code' => $schools->referral_code,
        ];

        return Inertia::render('Admin/School/Index', [
            'school' => $school,
            'classrooms' => ClassroomResource::collection(Classroom::where('school_id', $schools->id)->get()),
            'message' => [
                'add_success' => session('add_success'),
                'edit_success' => session('edit_success'),
                'delete_success' => session('delete_success'),
                'error' => session('error'),
            ],
        ]);
    }
}
