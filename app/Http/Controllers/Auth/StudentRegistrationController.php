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

        // Determine current step based on user progress
        if ($user->profile) {
            $step = 2;
        }

        if ($user->student) {
            $step = 3;
            $streamSubjects = $this->getStreamSubjects($user->student->stream_id);
            $coreSubjects = $this->getCoreSubjects();
            $coreSubjects = array_merge($coreSubjects, $this->getReligiousSubjects());
            $optionalSubjects = $this->getOptionalSubjects();
            $streamName = Stream::find($user->student->stream_id)->name ?? null;
        }

        $query = Classroom::query();
        if(request('school_id')){
            $query->where('school_id', request('school_id'));
        }
        $classrooms = $query->get();
        $classrooms = $classrooms->map(function($classroom){
            return [
                'id' => $classroom->id,
                'name' => $classroom->name,
            ];
        })->toArray();

        return Inertia::render('Auth/Register/Student/WizardForm', [
            'user' => $user,
            'initialStep' => $step,
            'streams' => Stream::whereIn('id', [2, 3])->get(),
            'schools' => School::all(),
            'classrooms' => $classrooms,
            'queryParams' => request()->query() ?: null,
            'coreSubjects' => $coreSubjects ?? null,
            'streamSubjects' => $streamSubjects ?? null,
            'optionalSubjects' => $optionalSubjects ?? null,
            'stream' => $streamName ?? null,
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
            'grades.*.grade' => 'required|string|in:A+,A,A-,B+,B,C+,C,D,E,F,TH',
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

        return to_route('home');
    }

    public function skipGrades()
    {
        $userId = Auth::id();
        $user = User::find($userId);
        $user->update(['role' => 0]);

        return to_route('home');
    }

    private function getStreamSubjects($streamId)
    {
        return Subject::where('stream_id', $streamId)->get()->map(function($subject){
            return [
                'id' => $subject->id,
                'name' => $subject->subject_name,
                'short_name' => $subject->short_name,
            ];
        })->toArray();
    }

    private function getCoreSubjects()
    {
        return Subject::where('stream_id', 1)->get()->filter(function($subject){
            return $subject->type !== 'religious';
        })->map(function($subject){
            return [
                'id' => $subject->id,
                'name' => $subject->subject_name,
                'short_name' => $subject->short_name,
            ];
        })->toArray();
    }

    private function getReligiousSubjects()
    {
        $user = Auth::user();
        return Subject::where('type', 'religious')->get()
        ->filter(function($subject) use ($user){
            if(strtolower($user->profile->religion) === 'islam'){
                return $subject->subject_name === 'Islamic Studies';
            }
            else{
                return $subject->subject_name === 'Moral';
            }
        })->map(function($subject){
            return [
                'id' => $subject->id,
                'name' => $subject->subject_name,
                'short_name' => $subject->short_name,
            ];
        })->toArray();
    }

    private function getOptionalSubjects()
    {
        return Subject::where('stream_id', 4)->get()->map(function($subject){
            return [
                'id' => $subject->id,
                'name' => $subject->subject_name,
                'short_name' => $subject->short_name,
            ];
        })->toArray();
    }
}
