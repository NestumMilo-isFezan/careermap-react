<?php

namespace App\Http\Controllers;

use App\Models\Exam;
use Inertia\Inertia;
use App\Models\Grade;
use Inertia\Response;
use App\Models\School;
use App\Models\Stream;
use App\Models\Subject;
use App\Models\Classroom;
use App\Models\ExamSubject;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Redirect;
use App\Http\Resources\ExamSubjectResource;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use App\Http\Requests\UpdateProfileDataRequest;

class ProfileController extends Controller
{
    /**
     * Display the user's profile form.
     */
    public function edit(Request $request): Response
    {
        $user = $request->user();
        $userRoles = $user->role;
        $props  = [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => session('status'),
            'messages' => [
                'update_success' => session('update_success'),
            ],
        ];
        if($userRoles === 0) return Inertia::render('Profile/Student/Edit', $props);
        if($userRoles === 1) return Inertia::render('Profile/Admin/Edit', $props);
        return Inertia::render('Profile/Teacher/Edit', $props);
    }

    public function editAccount(Request $request): Response
    {
        $user = $request->user();
        $userRoles = $user->role;
        $props  = [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => session('status'),
            'messages' => [
                'update_success' => session('update_success'),
            ],
        ];
        if($userRoles === 0) return Inertia::render('Profile/Student/AccountEdit', $props);

        if($userRoles === 1) return Inertia::render('Profile/Admin/AccountEdit', $props);

        return Inertia::render('Profile/Teacher/AccountEdit', $props);
    }

    public function editStudentDetails(Request $request): Response
    {
        $user = $request->user();
        $userRoles = $user->role;
        $schools = School::all()->map(function($school){
            return [
                'id' => $school->id,
                'name' => $school->name,
            ];
        })->toArray();

        $streams = Stream::all()->map(function($stream){
            return [
                'id' => $stream->id,
                'name' => $stream->name,
            ];
        })->toArray();

        // Get student data
        $student = $user->student;
        $classrooms = [];

        if($student && $student->school_id){
            $classrooms = Classroom::where('school_id', $student->school_id)->get()->map(function($classroom) {
                return [
                    'id' => $classroom->id,
                    'name' => $classroom->name,
                ];
            })->toArray();
        } else if($request->has('school_id')){
            $classrooms = Classroom::where('school_id', $request->school_id)->get()->map(function($classroom) {
                return [
                    'id' => $classroom->id,
                    'name' => $classroom->name,
                ];
            })->toArray();
        }

        // Get subjects based on student's stream
        $streamSubjects = [];
        $coreSubjects = [];
        $optionalSubjects = [];
        $selectedOptionalSubjects = [];
        $streamName = '';

        if ($student) {
            $streamSubjects = $this->getStreamSubjects($student->stream_id);
            $coreSubjects = $this->getCoreSubjects();
            $coreSubjects = array_merge($coreSubjects, $this->getReligiousSubjects($user));
            $optionalSubjects = $this->getOptionalSubjects();
            $streamName = Stream::find($student->stream_id)->name ?? '';

            // Get selected optional subjects from existing grades
            if ($user->academic) {
                $examId = $user->academic->exam_id;
                $examSubjects = ExamSubject::where('exam_id', $examId)->get();

                // Filter out optional subjects that are already selected
                $selectedOptionalIds = $examSubjects->pluck('subject_id')->toArray();
                $selectedOptionalSubjects = array_filter($optionalSubjects, function($subject) use ($selectedOptionalIds) {
                    return in_array($subject['id'], $selectedOptionalIds);
                });

                // Remove selected subjects from available optional subjects
                $optionalSubjects = array_filter($optionalSubjects, function($subject) use ($selectedOptionalIds) {
                    return !in_array($subject['id'], $selectedOptionalIds);
                });
            }
        }

        // Get existing grades
        $grades = [];
        if($user->academic){
            $exams = $user->academic->exam_id;
            $examSubjects = ExamSubject::where('exam_id', $exams)->get();
            $grades = $examSubjects->map(function($subject) {
                return [
                    'subject_id' => $subject->subject_id,
                    'grade' => $subject->grade,
                ];
            })->toArray();
        }

        $props = [
            'user' => $user,
            'student' => $student ? [
                'school_id' => $student->school_id,
                'stream_id' => $student->stream_id,
                'classroom_id' => $student->classroom_id,
            ] : null,
            'schools' => $schools,
            'streams' => $streams,
            'classrooms' => $classrooms,
            'coreSubjects' => $coreSubjects,
            'streamSubjects' => $streamSubjects,
            'optionalSubjects' => array_values($optionalSubjects),
            'selectedOptionalSubjects' => array_values($selectedOptionalSubjects),
            'stream' => $streamName,
            'grades' => $grades,
            'messages' => [
                'add_success' => session('add_success'),
                'update_success' => session('update_success'),
                'delete_success' => session('delete_success'),
                'error' => session('error'),
            ],
        ];

        return Inertia::render('Profile/Student/StudentEdit', $props);
    }

    public function editTeacherDetails(Request $request): Response
    {
        $user = $request->user();
        $teacher = $user->teacher;

        // Get classrooms from teacher's school
        $classrooms = [];
        if ($teacher && $teacher->school_id) {
            $classrooms = Classroom::where('school_id', $teacher->school_id)
                ->where('teacher_id', null)
                ->orWhere('teacher_id', $teacher->id)
                ->get()
                ->map(function($classroom) {
                    return [
                        'id' => $classroom->id,
                        'name' => $classroom->name,
                    ];
                })
                ->toArray();
        }

        $currentClassroom = Classroom::where('teacher_id', $teacher->id)->first()->id ?? 0;

        $props = [
            'user' => $user,
            'classrooms' => $classrooms,
            'currentClassroom' => $currentClassroom,
            'messages' => [
                'add_success' => session('add_success'),
                'update_success' => session('update_success'),
                'delete_success' => session('delete_success'),
                'error' => session('error'),
            ],
        ];

        return Inertia::render('Profile/Teacher/TeacherEdit', $props);
    }

    // Add this new method to handle the teacher details update
    public function updateTeacherDetails(Request $request)
    {
        $validated = $request->validate([
            'classroom_id' => 'required|exists:classrooms,id',
        ]);

        $user = $request->user();
        $teacher = $user->teacher;

        if ($teacher) {
            Classroom::where('teacher_id', $teacher->id)->update(['teacher_id' => null]);
            Classroom::find($validated['classroom_id'])->update(['teacher_id' => $teacher->id]);
        }

        return back()->with('update_success', 'Class updated successfully');
    }

    // Add helper methods from StudentRegistrationController
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

    private function getReligiousSubjects($user)
    {
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

    /**
     * Update the user's profile information.
     */
    public function update(UpdateProfileDataRequest $request): RedirectResponse
    {
        $userData = [
            'first_name' => $request->first_name,
            'last_name' => $request->last_name,
            'image' => $request->image,
        ];
        $profileData = [
            'birth_date' => Carbon::parse($request->birth_date)->format('Y-m-d'),
            'gender' => $request->gender,
            'religion' => $request->religion,
            'phone' => $request->phone,
            'address' => $request->address,
            'city' => $request->city,
            'state' => $request->state,
            'postcode' => $request->postcode,
            'country' => $request->country,
        ];

        $user = $request->user();
        $userData['name'] = $userData['first_name'] . ' ' . $userData['last_name'];
        $profile = $user->profile;

        $image = $userData['image'];
        $imagePath = '';
        if($image){
            if($user->image){
                Storage::disk('public')->delete($user->image);
            }
            $extension = $image->getClientOriginalExtension();
            $imageName = Str::slug($userData['name']) . '.' . $extension;
            $imagePath = $image->storeAs('profilepics', $imageName, 'public');
            $userData['image'] = $imagePath;
        }
        else{
            unset($userData['image']);
        }

        $user->update($userData);
        if(!$user->profile){
            $user->profile()->create($profileData);
        }
        else{
            $profile->update($profileData);
        }
        return to_route('profile.edit')->with('update_success', 'Profile updated successfully');
    }

    /**
     * Delete the user's account.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return Redirect::to('/');
    }

    public function updateStudentDetails(Request $request)
    {
        $validated = $request->validate([
            'school_id' => 'required|exists:schools,id',
            'stream_id' => 'required|exists:streams,id',
            'classroom_id' => 'required|exists:classrooms,id',
        ]);

        $user = $request->user();
        $student = $user->student;

        if ($student) {
            $student->update($validated);
        } else {
            $user->student()->create($validated);
        }

        return back()->with('success', 'Student details updated successfully');
    }

    public function updateStudentGrades(Request $request)
    {
        $validated = $request->validate([
            'grades' => 'required|array',
            'grades.*.subject_id' => 'required|exists:subjects,id',
            'grades.*.grade' => 'required|string',
        ]);

        $user = $request->user();
        $examId = $user->academic->exam_id;
        foreach ($validated['grades'] as $grade) {
            $examSubject = ExamSubject::where('exam_id', $examId)->where('subject_id', $grade['subject_id'])->first();
            if($examSubject){
                $examSubject->update(['grade' => $grade['grade']]);
            }
            else{
                $examSubject = ExamSubject::create([
                    'exam_id' => $examId,
                    'subject_id' => $grade['subject_id'],
                    'grade' => $grade['grade'],
                ]);
            }
        }

        return back()->with('success', 'Grades updated successfully');
    }
}
