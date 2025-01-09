<?php

namespace App\Http\Controllers\Auth;

use App\Models\Exam;
use App\Models\User;
use App\Models\School;
use App\Models\Stream;
use App\Models\Profile;
use App\Models\Student;
use App\Models\Subject;
use App\Models\Academic;
use App\Models\ExamSubject;
use App\Models\Classroom;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Inertia\Inertia;

class StudentRegistrationController extends Controller
{
    // Initial page load - combines all steps into one component
    public function index()
    {
        $user = Auth::user();
        $step = 1;

        // Initiate core subjects and stream subjects
        $initiateCoreSubjects = [];
        $initiateStreamSubjects = [];

        $coreSubjects = Subject::where('stream_id', 1)->get();
        foreach($coreSubjects as $subject){
            if($subject->type === 'religious'){
                continue;
            }
            $initiateCoreSubjects[] = [
                'id' => $subject->id,
                'name' => $subject->subject_name,
                'short_name' => $subject->short_name,
            ];
        }

        // Determine current step based on user progress
        if ($user->profile) {
            $step = 2;
            if ($user->student) {
                $step = 3;
                $streamSubjects = Subject::where('stream_id', $user->student->stream_id)->get();
                foreach($streamSubjects as $subject){
                    $initiateStreamSubjects[] = [
                        'id' => $subject->id,
                        'name' => $subject->subject_name,
                        'short_name' => $subject->short_name,
                    ];
                }
                if(strtolower($user->profile->religion) === 'islam'){
                    $islamicSubject = Subject::where('subject_name', 'Pendidikan Islam')->first();
                    $initiateCoreSubjects[] = [
                        'id' => $islamicSubject->id,
                        'name' => $islamicSubject->subject_name,
                        'short_name' => $islamicSubject->short_name,
                    ];
                }
                else{
                    $moralSubject = Subject::where('subject_name', 'Pendidikan Moral')->first();
                    $initiateCoreSubjects[] = [
                        'id' => $moralSubject->id,
                        'name' => $moralSubject->subject_name,
                        'short_name' => $moralSubject->short_name,
                    ];
                }
            }
        }

        $query = Classroom::query();
        if(request('school_id')){
            $query->where('school_id', request('school_id'));
        }
        $classrooms = $query->get();

        return Inertia::render('Auth/Register/Student/WizardForm', [
            'user' => $user,
            'initialStep' => $step,
            'streams' => Stream::whereIn('id', [2, 3])->get(),
            'schools' => School::all(),
            'classrooms' => $classrooms->map(fn($classroom) => [
                'id' => $classroom->id,
                'name' => $classroom->name,
            ])->toArray(),
            'queryParams' => request()->query() ?: null,
            'coreSubjects' => $initiateCoreSubjects,
            'streamSubjects' => $initiateStreamSubjects,
            'stream' => $user->student
                ? Stream::find($user->student->stream_id)->name
                : null,
        ]);
    }

    public function getClassrooms(Request $request)
    {
        $school_id = $request->school_id;
        $classrooms = Classroom::where('school_id', $school_id)->get();
        return response()->json($classrooms);
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

        return redirect()->back();
    }

    public function storeStudent(Request $request)
    {
        $validated = $request->validate([
            'school_id' => 'required|exists:schools,id',
            'stream_id' => 'required|exists:streams,id',
            'classroom_id' => 'required|exists:classrooms,id',
        ]);

        Student::create([
            'user_id' => Auth::id(),
            'school_id' => $validated['school_id'],
            'stream_id' => $validated['stream_id'],
            'classroom_id' => $validated['classroom_id'],
        ]);

        return to_route('guest.register.students');
    }

    public function storeGrades(Request $request)
    {
        $validated = $request->validate([
            'grades' => 'required|array',
            'grades.*.subject_id' => 'required|exists:subjects,id',
            'grades.*.grade' => 'required|string|in:A+,A,A-,B+,B,B-,C+,C,C-,D,E,F',
        ]);

        $userId = Auth::id();
        $user = User::find($userId);

        // Create exam record
        $exam = Exam::create(['exam_name' => 'Trial SPM']);

        // Store grades
        foreach ($validated['grades'] as $grade) {
            ExamSubject::create([
                'exam_id' => $exam->id,
                'subject_id' => $grade['subject_id'],
                'grade' => $grade['grade'],
            ]);
        }

        // Create academic record
        Academic::create([
            'user_id' => $user->id,
            'exam_id' => $exam->id,
        ]);

        // Update user role
        $user->update(['role' => 0]);

        return redirect()->route('home');
    }

    public function skipGrades(Request $request)
    {
        $userId = Auth::id();
        $user = User::find($userId);
        $user->update(['role' => 0]);

        return redirect()->route('home');
    }
}
