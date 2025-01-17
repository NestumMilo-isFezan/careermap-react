<?php

namespace App\Services;

use App\Models\Domain;
use App\Models\Roadmap;
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

        $roadmaps = Roadmap::with('domain')
            ->whereIn('domain_id', $weightedDomains->pluck('id'))
            ->get()
            ->map(function($roadmap) use ($weightedDomains) {
                $domainWeight = $weightedDomains->firstWhere('id', $roadmap->domain_id)->weight ?? 0;
                // Multiply by 100 to get a percentage score
                $roadmap->recommendation_score = $domainWeight * 100;
                return $roadmap;
            });

        return $roadmaps->sortByDesc('recommendation_score');
    }

    public function recommendationProcess($recommendation = null, $name = null, $domainId = null)
    {
        $user = Auth::user();
        $studentStream = $user->student->stream;

        $sortedRoadmap = $this->recommendByStudentStream($studentStream->id);

        if($recommendation){
            $sortedRoadmap = $this->filterByRecommendation($recommendation, $sortedRoadmap);
        }
        if($name){
            $sortedRoadmap = $this->filterByName($name, $sortedRoadmap);
        }
        if($domainId){
            $sortedRoadmap = $this->filterByDomainId($domainId, $sortedRoadmap);
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
