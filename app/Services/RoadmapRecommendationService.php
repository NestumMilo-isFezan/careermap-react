<?php

namespace App\Services;

use App\Models\Domain;
use App\Models\Roadmap;
use App\Models\ExamSubject;
use App\Models\UserRoadmap;
use Illuminate\Support\Facades\Auth;
use App\Http\Resources\RecommendedRoadmapResource;
use App\Http\Resources\Roadmap\SelectedRoadmapResource;

class RoadmapRecommendationService
{
    public function getWeightedScoreBasedOnStudentStream($streamId){
        return Domain::select('domains.*', 'stream_domain_weights.weight')
        ->leftJoin('stream_domain_weights', function($join) use ($streamId) {
            $join->on('domains.id', '=', 'stream_domain_weights.domain_id')
                ->where('stream_domain_weights.stream_id', '=', $streamId);
        })
        ->orderBy('stream_domain_weights.weight', 'desc')
        ->with('roadmaps')
        ->get();
    }

    public function recommendByStudentStream($streamId){
        $weightedDomains = $this->getWeightedScoreBasedOnStudentStream($streamId);

        $roadmaps = Roadmap::with(['domain', 'prerequisite.items.subject', 'adaptation.items.persona'])
            ->whereIn('domain_id', $weightedDomains->pluck('id'))
            ->get()
            ->map(function($roadmap) use ($weightedDomains) {
                $domainWeight = $weightedDomains->firstWhere('id', $roadmap->domain_id)->weight ?? 0;

                // Base score from domain weight (60% of total)
                $baseScore = $domainWeight * 0.6;

                // Calculate prerequisite match score (20% of total)
                $prerequisiteScore = $this->calculatePrerequisiteScore($roadmap);

                // Calculate adaptation match score (20% of total)
                $adaptationScore = $this->calculateAdaptationScore($roadmap);

                // Combine scores and convert to percentage
                $roadmap->recommendation_score = ($baseScore + $prerequisiteScore + $adaptationScore) * 100;

                $roadmap->is_favorite = UserRoadmap::where('user_id', Auth::user()->id)
                    ->where('roadmap_id', $roadmap->id)
                    ->exists() ? true : false;

                return $roadmap;
            });

        // Sort by favorite status first, then by recommendation score
        $roadmaps = $roadmaps->sortBy([
            ['is_favorite', 'desc'],
            ['recommendation_score', 'desc']
        ]);

        return $roadmaps;
    }

    private function calculatePrerequisiteScore($roadmap)
    {
        if (!$roadmap->prerequisite || !$roadmap->prerequisite->items->count()) {
            return 0;
        }

        $user = Auth::user();
        $examId = $user->academic->exam_id ?? null;
        $studentGrades = ExamSubject::where('exam_id', $examId)->get() ?? collect();

        $matchingPrerequisites = $roadmap->prerequisite->items->filter(function($item) use ($studentGrades) {
            $studentGrade = $studentGrades->firstWhere('subject_id', $item->subject_id);
            if (!$studentGrade) return false;

            return $this->compareGrades($studentGrade->grade, $item->requirement);
        })->count();

        $totalPrerequisites = $roadmap->prerequisite->items->count();

        // Return score weighted at 20% of total
        return ($matchingPrerequisites / $totalPrerequisites) * 0.2;
    }

    private function calculateAdaptationScore($roadmap)
    {
        if (!$roadmap->adaptation || !$roadmap->adaptation->items->count()) {
            return 0;
        }

        $user = Auth::user();
        $studentPersonas = $user->student->personaScores ?? collect();

        $matchingPersonas = $roadmap->adaptation->items->filter(function($item) use ($studentPersonas) {
            return $studentPersonas->contains('id', $item->persona_id);
        })->count();

        $totalPersonas = $roadmap->adaptation->items->count();

        // Return score weighted at 20% of total
        return ($matchingPersonas / $totalPersonas) * 0.2;
    }

    private function compareGrades($studentGrade, $requirement)
    {
        $gradeValues = [
            'a+' => 4,
            'a' => 4,
            'a-' => 4,
            'b+' => 3,
            'b' => 3,
            'c+' => 2,
            'c' => 2,
            'd' => 1,
            'e' => 0,
            'f' => 0,
            'th' => 0
        ];

        return $gradeValues[strtolower($studentGrade)] >= $gradeValues[strtolower($requirement)];
    }

    public function recommendationProcess($recommendation = null, $name = null, $domainId = null, $favorite = null)
    {
        $user = Auth::user();
        $studentStream = $user->student->stream;

        $sortedRoadmap = $this->recommendByStudentStream($studentStream->id);

        if($recommendation){
            $sortedRoadmap = $this->filterByRecommendation($recommendation, $sortedRoadmap);
        }
        else{
            $sortedRoadmap = $sortedRoadmap->where('recommendation_score', '>=', 40);
        }

        if($name){
            $sortedRoadmap = $this->filterByName($name, $sortedRoadmap);
        }
        if($domainId){
            $sortedRoadmap = $this->filterByDomainId($domainId, $sortedRoadmap);
        }
        if($favorite){
            $sortedRoadmap = $sortedRoadmap->where('is_favorite', true);
        }

        return $this->paginating(12, $sortedRoadmap);
    }

    public function getRoadmapById($id){
        $user = Auth::user();
        $studentStream = $user->student->stream;
        $sortedRoadmap = $this->recommendByStudentStream($studentStream->id);
        $roadmap = $sortedRoadmap->filter(function($roadmap) use ($id){
            return $roadmap->id == $id;
        })->first();
        return new SelectedRoadmapResource($roadmap);
    }

    public function getRoadmapByThreeHighestPersonaScore($personaId1, $personaId2, $personaId3){
        $user = Auth::user();
        $studentStream = $user->student->stream;
        $sortedRoadmap = $this->recommendByStudentStream($studentStream->id);
        $roadmap = $sortedRoadmap->filter(function($roadmap) use ($personaId1, $personaId2, $personaId3){
            $personaIds = $roadmap->adaptation->items->pluck('persona_id')->toArray();
            return in_array($personaId1, $personaIds) || in_array($personaId2, $personaIds) || in_array($personaId3, $personaIds);
        })->take(6);
        return $roadmap;
    }

    public function filterByRecommendation($recommendation, $sortedRoadmap){
        switch($recommendation){
            case 'not_recommended':
                return $sortedRoadmap->filter(function($roadmap) {
                    return $roadmap->recommendation_score <= 40;
                })->values();
            case 'recommended':
                return $sortedRoadmap->filter(function($roadmap) {
                    return $roadmap->recommendation_score > 40;
                })->values();
            default:
                return $sortedRoadmap;
        }
    }

    public function filterByName($name, $sortedRoadmap){
        return $sortedRoadmap->filter(function($roadmap) use ($name) {
            return strpos($roadmap->title, $name) !== false;
        })->values();
    }

    public function filterByDomainId($domainId, $sortedRoadmap){
        return $sortedRoadmap->filter(function($roadmap) use ($domainId) {
            return $roadmap->domain_id == $domainId;
        })->values();
    }

    public function paginating($pageSize, $collection)
    {
        $currentPage = request()->get('page', 1);
        $offset = ($currentPage - 1) * $pageSize;

        return new \Illuminate\Pagination\LengthAwarePaginator(
            $collection->slice($offset, $pageSize)->values(),
            $collection->count(),
            $pageSize,
            $currentPage,
            ['path' => request()->url()]
        );
    }
}
