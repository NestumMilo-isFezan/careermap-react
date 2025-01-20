<?php

namespace App\Http\Controllers\Student;

use Inertia\Inertia;
use App\Models\Feedback;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Http\Resources\FeedbackResource;
use App\Models\FeedbackResponse;

class FeedbackController extends Controller
{
    public function index()
    {
        $student = request()->user()->student;

        $feedback = Feedback::where('student_id', $student->id)
            ->with(['teacher.user', 'reply', 'student.user'])
            ->latest()
            ->get();

        return Inertia::render('Student/Feedback/Index', [
            'feedbacks' => FeedbackResource::collection($feedback),
        ]);
    }

    public function respond(Request $request, Feedback $feedback)
    {
        $request->validate([
            'reaction' => 'required|string|in:like,anger,sad,happy,fear,surprise',
            'response' => 'required|string',
        ]);

        // Check if student owns this feedback
        if ($feedback->student_id !== $request->user()->student->id) {
            abort(403, 'Unauthorized action.');
        }

        // Check if response already exists
        if ($feedback->reply) {
            abort(400, 'Response already exists.');
        }

        // Create response
        FeedbackResponse::create([
            'feedback_id' => $feedback->id,
            'student_id' => $request->user()->student->id,
            'reaction' => $request->reaction,
            'response' => $request->response,
        ]);

        return back()->with('success', 'Response submitted successfully.');
    }

    public function updateResponse(Request $request, Feedback $feedback)
    {
        $request->validate([
            'reaction' => 'required|string|in:like,anger,sad,happy,fear,surprise',
            'response' => 'required|string',
        ]);

        // Check if student owns this feedback
        if ($feedback->student_id !== $request->user()->student->id) {
            abort(403, 'Unauthorized action.');
        }

        // Check if response exists
        if (!$feedback->reply) {
            abort(404, 'Response not found.');
        }

        // Update response
        $feedback->reply->update([
            'reaction' => $request->reaction,
            'response' => $request->response,
        ]);

        return back()->with('success', 'Response updated successfully.');
    }
}
