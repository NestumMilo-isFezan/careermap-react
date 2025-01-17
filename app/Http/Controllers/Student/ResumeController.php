<?php

namespace App\Http\Controllers\Student;

use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;

class ResumeController extends Controller
{
    public function index(){
        return Inertia::render('Student/Resume/Index', [
            'user' => Auth::user(),
        ]);
    }

    public function create(){
        return Inertia::render('Student/Resume/Create', [
            'user' => Auth::user(),
        ]);
    }

    public function show($id){
        return Inertia::render('Student/Resume/Show', [
            'user' => Auth::user(),
            'resume' => Resume::find($id),
        ]);
    }
}
