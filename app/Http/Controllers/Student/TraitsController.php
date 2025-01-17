<?php

namespace App\Http\Controllers\Student;

use Inertia\Inertia;
use App\Models\Roadmap;
use App\Models\Question;
use App\Models\PersonaScore;
use Illuminate\Http\Request;
use App\Models\StudentAnswer;
use App\Http\Controllers\Controller;
use App\Services\RoadmapRecommendationService;
use App\Http\Resources\RecommendedRoadmapResource;
use Illuminate\Support\Facades\DB;

class TraitsController extends Controller
{

    protected $roadmapRecommendationService;

    public function __construct(RoadmapRecommendationService $roadmapRecommendationService)
    {
        $this->roadmapRecommendationService = $roadmapRecommendationService;
    }

    public function index()
    {
        $studentId = request()->user()->student->id;
        $personaScoreExisted = PersonaScore::where('student_id', $studentId)->first() ? true : false;
        if ($personaScoreExisted) {
            $personaScores = PersonaScore::where('student_id', $studentId)->orderBy('score', 'desc')->get()
                ->map(function ($score) {
                    return [
                    'persona_id' => $score->persona_id,
                    'persona_name' => $score->persona->name,
                    'score' => $score->score
                ];
            });
            $personaIds = $personaScores->pluck('persona_id')->toArray();

            // Get the suggested roadmap for the 4 highest persona score
            $suggestedRoadmaps = $this->roadmapRecommendationService->getRoadmapByThreeHighestPersonaScore($personaIds[0], $personaIds[1], $personaIds[2]);
            $collectedRoadmaps = RecommendedRoadmapResource::collection($suggestedRoadmaps);
            //
        }
        else{
            $suggestedRoadmaps = null;
            $collectedRoadmaps = null;
            $personaScores = null;
        }
        return Inertia::render('Student/Traits/Index', [
            'personaScoreExisted' => $personaScoreExisted,
            'messages' => [
                'add_success' => session('add_success'),
                'update_success' => session('update_success'),
                'delete_success' => session('delete_success'),
                'error' => session('error')
            ],
            'personaScores' => Inertia::defer(fn () => $personaScores, 'view'),
            'suggestedRoadmaps' => Inertia::defer(fn () => $collectedRoadmaps, 'view')
        ]);
    }

    public function create()
    {
        $questions = Question::all()->map(fn($question) => [
            'id' => $question->id,
            'question' => $question->title,
            'answers' => [
                [
                    'text' => $question->question_1,
                    'personaId' => $question->persona_1_id,
                ],
                [
                    'text' => $question->question_2,
                    'personaId' => $question->persona_2_id,
                ],
            ]
        ])->toArray();
        return Inertia::render('Student/Traits/Create', [
            'data' => $questions
        ]);
    }

    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'student_answers' => 'required|array',
                'student_answers.*.question_id' => 'required|integer',
                'student_answers.*.persona_id' => 'required|integer',
            ]);

            $studentId = $request->user()->student->id;

            // Store individual answers
            foreach ($validated['student_answers'] as $answer) {
                $question = Question::findOrFail($answer['question_id']);
                $selectedOption = $question->persona_1_id === $answer['persona_id'] ? 'option_1' : 'option_2';

                StudentAnswer::create([
                    'student_id' => $studentId,
                    'question_id' => $answer['question_id'],
                    'selected_option' => $selectedOption
                ]);
            }

            // Calculate persona scores as percentages
            $totalAnswers = count($validated['student_answers']);
            $personaScores = [];

            foreach ($validated['student_answers'] as $answer) {
                $personaId = $answer['persona_id'];
                if (!isset($personaScores[$personaId])) {
                    $personaScores[$personaId] = 0;
                }
                $personaScores[$personaId]++;
            }

            // Store percentage-based scores
            foreach ($personaScores as $personaId => $count) {
                PersonaScore::create([
                    'student_id' => $studentId,
                    'persona_id' => $personaId,
                    'score' => $count
                ]);
            }

            return redirect()->route('student.traits.index')
                ->with('add_success', 'Assessment completed successfully!');
        }
        catch (\Exception $e) {
            return redirect()->route('student.traits.index')
                ->with('error', 'Assessment failed: ' . $e->getMessage());
        }
    }

    public function destroy()
    {

            $studentId = request()->user()->student->id;
            $studentAnswers = StudentAnswer::where('student_id', $studentId)->get();
            $personaScores = PersonaScore::where('student_id', $studentId)->get();

            foreach ($studentAnswers as $studentAnswer) {
                $studentAnswer->delete();
            }

            foreach ($personaScores as $personaScore) {
                $personaScore->delete();
            }

            return redirect()->route('student.traits.index')
                ->with('delete_success', 'Assessment results have been cleared successfully.');

    }
}
