<?php

namespace App\Http\Controllers\Teacher;

use Inertia\Inertia;
use App\Models\Student;
use App\Models\Feedback;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use App\Http\Resources\FeedbackResource;

class FeedbackController extends Controller
{
    public function index(Request $request)
    {
        $teacher = $request->user()->teacher;
        $selectedStudentId = $request->query('student_id');

        // Get students from teacher's classroom
        $students = Student::where('classroom_id', $teacher->classroom->id)
            ->with('user')
            ->get()
            ->map(function($student) {
                return [
                    'id' => $student->id,
                    'name' => $student->user->name,
                    'image' => $student->user->image ? asset('storage/'.$student->user->image) : null,
                ];
            });

        // Get feedback query builder
        $feedback = Feedback::where('teacher_id', $teacher->id);

        // Apply student filter if selected
        if ($selectedStudentId) {
            $feedback->where('student_id', $selectedStudentId);
        }

        // Add sorting (optional)
        if ($request->has('sort_created_at')) {
            $feedback->orderBy('created_at', $request->sort_created_at);
        } else {
            $feedback->latest(); // Default sorting
        }

        // Get the final results with relationships
        $feedback = $feedback->with(['student.user', 'reply'])->get();

        return Inertia::render('Teacher/Feedback/Index', [
            'feedbacks' => FeedbackResource::collection($feedback),
            'students' => $students,
            'selectedStudentId' => $selectedStudentId,
            'queryParams' => $request->query() ?: null,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'student_id' => 'required|exists:students,id',
            'feedback' => 'required|string',
        ]);

        Feedback::create([
            'teacher_id' => $request->user()->teacher->id,
            'student_id' => $request->student_id,
            'feedback' => $request->feedback,
        ]);

        return redirect()->back();
    }

    /**
     * Update the specified feedback.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Feedback  $feedback
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Feedback $feedback)
    {
        // Validate that the authenticated teacher owns this feedback
        if ($feedback->teacher_id !== Auth::user()->teacher->id) {
            abort(403);
        }

        // Validate the request
        $validated = $request->validate([
            'feedback' => ['required', 'string', 'max:1000'],
        ]);

        // Update the feedback
        $feedback->update($validated);

        return redirect()->back();
    }

    /**
     * Remove the specified feedback.
     *
     * @param  \App\Models\Feedback  $feedback
     * @return \Illuminate\Http\Response
     */
    public function destroy(Feedback $feedback)
    {
        // Validate that the authenticated teacher owns this feedback
        if ($feedback->teacher_id !== Auth::user()->teacher->id) {
            abort(403);
        }

        // Delete the feedback
        $feedback->delete();

        return redirect()->back();
    }
}
