<?php

namespace App\Services;

use App\Models\Question;
use App\Models\UserAnswer;
use App\Models\DomainScore;
use App\Models\TraitResults;
use App\Models\Domain;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Auth;

class QuestionService
{
    public function getPaginatedQuestions(): LengthAwarePaginator
    {
        $studentId = Auth::user()->student->id;

        return Question::with(['domain1', 'domain2'])
            ->whereDoesntHave('userAnswers', function ($query) use ($studentId) {
                $query->where('student_id', $studentId);
            })
            ->paginate(10);
    }

    public function saveAnswer(int $studentId, int $questionId, string $selectedOption): void
    {
        UserAnswer::updateOrInsert(
            ['student_id' => $studentId, 'question_id' => $questionId],
            ['selected_option' => $selectedOption]
        );

        // Calculate scores after each answer if all questions are answered
        if ($this->hasAnsweredAllQuestions($studentId)) {
            $this->calculateDomainScores($studentId);
            $this->determineTraitResults($studentId);
        }
    }

    public function hasAnsweredAllQuestions(int $studentId): bool
    {
        $totalQuestions = Question::count();
        $answeredQuestions = UserAnswer::where('student_id', $studentId)->count();

        return $totalQuestions === $answeredQuestions;
    }

    public function calculateDomainScores(int $studentId): void
    {
        // Get all domains
        $domains = Domain::all();

        foreach ($domains as $domain) {
            // Calculate score for questions where the domain is domain_1
            $domain1Score = UserAnswer::join('questions', 'user_answers.question_id', '=', 'questions.id')
                ->where('user_answers.student_id', $studentId)
                ->where('questions.domain_1_id', $domain->id)
                ->where('user_answers.selected_option', 'option_1')
                ->count();

            // Calculate score for questions where the domain is domain_2
            $domain2Score = UserAnswer::join('questions', 'user_answers.question_id', '=', 'questions.id')
                ->where('user_answers.student_id', $studentId)
                ->where('questions.domain_2_id', $domain->id)
                ->where('user_answers.selected_option', 'option_2')
                ->count();

            // Total score for this domain
            $totalScore = $domain1Score + $domain2Score;

            // Update or create domain score
            DomainScore::updateOrInsert(
                [
                    'student_id' => $studentId,
                    'domain_id' => $domain->id
                ],
                ['score' => $totalScore]
            );
        }
    }

    public function determineTraitResults(int $studentId): void
    {
        // Get the top 2 scoring domains
        $topDomains = DomainScore::where('student_id', $studentId)
            ->orderBy('score', 'desc')
            ->take(2)
            ->get();

        if ($topDomains->count() >= 2) {
            // Update or create trait results
            TraitResults::updateOrInsert(
                ['student_id' => $studentId],
                [
                    'primary_domain_id' => $topDomains[0]->domain_id,
                    'secondary_domain_id' => $topDomains[1]->domain_id
                ]
            );
        }
    }

    public function getDomainScores(int $studentId): array
    {
        if (DomainScore::where('student_id', $studentId)->count() === 0) {
            $this->calculateDomainScores($studentId);
        }

        return DomainScore::where('student_id', $studentId)
            ->with('domain')
            ->orderBy('score', 'desc')
            ->get()
            ->map(function ($score) {
                return [
                    'domain' => $score->domain->name,
                    'score' => $score->score,
                    'percentage' => $this->calculatePercentage($score->score)
                ];
            })
            ->toArray();
    }

    private function calculatePercentage(int $score): float
    {
        // Get the total number of questions where the domain appears as either domain_1 or domain_2
        $totalQuestions = Question::count();

        // Calculate percentage based on the maximum possible score
        return round(($score / $totalQuestions) * 100, 2);
    }

    public function getTraitResults(int $studentId): ?array
    {
        if (TraitResults::where('student_id', $studentId)->count() === 0) {
            $this->determineTraitResults($studentId);
        }

        $traitResults = TraitResults::where('student_id', $studentId)
            ->with(['primaryDomain', 'secondaryDomain'])
            ->first();

        if (!$traitResults) {
            return null;
        }

        return [
            'primary_domain' => [
                'name' => $traitResults->primaryDomain->name,
                'score' => DomainScore::where('student_id', $studentId)
                    ->where('domain_id', $traitResults->primary_domain_id)
                    ->first()->score
            ],
            'secondary_domain' => [
                'name' => $traitResults->secondaryDomain->name,
                'score' => DomainScore::where('student_id', $studentId)
                    ->where('domain_id', $traitResults->secondary_domain_id)
                    ->first()->score
            ]
        ];
    }

    public function retakeQuestion(int $studentId): void
    {
        // Delete all answers for this student
        UserAnswer::where('student_id', $studentId)->delete();

        // Delete domain scores
        DomainScore::where('student_id', $studentId)->delete();

        // Delete trait results
        TraitResults::where('student_id', $studentId)->delete();
    }

}
