<?php

namespace App\Http\Controllers\Student;

use Illuminate\View\View;
use Illuminate\Http\Request;
use App\Services\QuestionService;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use App\Models\UserAnswer;
use App\Models\Question;
use Illuminate\Http\RedirectResponse;

class TraitsController extends Controller
{
    protected $questionService;

    public function __construct(QuestionService $questionService)
    {
        $this->questionService = $questionService;
    }

    public function index(): View|RedirectResponse
    {
        $questions = $this->questionService->getPaginatedQuestions();

        // If no questions left, redirect to results
        if ($questions->isEmpty()) {
            return redirect()->route('student.traits.results');
        }

        return view('pages.student.traits.questions', compact('questions'));
    }

    public function storeAnswer(Request $request): RedirectResponse
    {
        $answers = $request->input('answers', []);
        $studentId = Auth::user()->student->id;

        foreach ($answers as $answer) {
            $this->questionService->saveAnswer(
                $studentId,
                $answer['question_id'],
                $answer['selected_option']
            );
        }

        // Check if all questions are answered
        if ($this->questionService->hasAnsweredAllQuestions($studentId)) {
            return redirect()->route('student.traits.results')
                ->with('success', 'All questions completed! View your results.');
        }

        return redirect()->back()->with('success', 'Answers submitted successfully!');
    }

    public function results(): View|RedirectResponse
    {
        $student = Auth::user()->student;

        if (!$student) {
            return redirect()->route('student.traits.questions')
                ->with('message', 'Student profile not found.');
        }

        if (!$this->questionService->hasAnsweredAllQuestions($student->id)) {
            return redirect()->back()
                ->with('message', 'Please answer all questions first.');
        }

        $domainScores = $this->questionService->getDomainScores($student->id);
        $traitResults = $this->questionService->getTraitResults($student->id);

        return view('pages.student.traits.results', compact('domainScores', 'traitResults'));
    }

    public function retake()
    {
        $studentId = Auth::user()->student->id;
        $this->questionService->retakeQuestion($studentId);

        return redirect()->route('student.traits.questions')
            ->with('success', 'Your previous answers have been cleared. You can now retake the assessment.');
    }
}
