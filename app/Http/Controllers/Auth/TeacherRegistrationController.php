<?php

namespace App\Http\Controllers\Auth;

use App\Models\Exam;
use App\Models\User;
use Inertia\Inertia;
use App\Models\School;
use App\Models\Stream;
use App\Models\Profile;
use App\Models\Student;
use App\Models\Subject;
use App\Models\Teacher;
use App\Models\Academic;
use App\Models\Classroom;
use App\Models\ExamSubject;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;

class TeacherRegistrationController extends Controller
{
    // Initial page load - combines all steps into one component
    public function index()
    {
        $user = Auth::user();
        $step = 1;
        $schools = request()->user()->teacher->school;

        // Determine current step based on user progress
        if ($user->profile) {
            $step = 2;
        }

        $classrooms = Classroom::where('school_id', $schools->id)->where('teacher_id', null)->get();
        $classrooms = $classrooms->map(function($classroom){
            return [
                'id' => $classroom->id,
                'name' => $classroom->name,
            ];
        })->toArray();

        return Inertia::render('Auth/Register/Teacher/TeacherWizard', [
            'user' => $user,
            'initialStep' => $step,
            'classrooms' => $classrooms,
        ]);
    }

    public function storeProfile(Request $request)
    {
        $validated = $request->validate([
            'birth_date' => 'required|date',
            'gender' => 'required|string|in:male,female',
            'phone' => 'required|string',
            'address' => 'required|string',
            'state' => 'required|string',
            'city' => 'required|string',
            'postcode' => 'required|string',
            'country' => 'required|string',
            'religion' => 'required|string',
            'image' => 'required|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        ]);

        $userId = Auth::id();

        // Convert birth_date to proper date format
        $birthDate = date('Y-m-d', strtotime($validated['birth_date']));

        // Create profile with formatted date
        Profile::create([
            'user_id' => $userId,
            'birth_date' => $birthDate,  // Use the formatted date
            'gender' => $validated['gender'],
            'phone' => $validated['phone'],
            'address' => $validated['address'],
            'state' => $validated['state'],
            'city' => $validated['city'],
            'postcode' => $validated['postcode'],
            'country' => $validated['country'],
            'religion' => $validated['religion']
        ]);

        // Handle image upload
        if ($request->hasFile('image')) {
            $user = User::find($userId);
            $imageName = $user->first_name . '' . time() . '.' . $request->image->extension();
            $path = $request->image->storeAs('profilepic', $imageName, 'public');
            $user->image = $path;
            $user->save();
        }

        return to_route('guest.register.students');
    }

    public function storeDetails(Request $request)
    {
        $validated = $request->validate([
            'classroom_id' => 'required|integer|exists:classrooms,id',
        ]);

        $classroom = Classroom::find($validated['classroom_id']);
        $classroom->teacher_id = Teacher::where('user_id', Auth::id())->first()->id;
        $classroom->save();

        $user = User::find(Auth::id());
        $user->role = 2;
        $user->save();

        return to_route('home');
    }
}
