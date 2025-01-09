<?php

namespace App\Services;

use App\Models\Domain;
use App\Models\Roadmap;
use Illuminate\Support\Facades\Auth;
use App\Http\Resources\RecommendedRoadmapResource;


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

    public function recommendationProcess($recommendation = null)
    {
        $user = Auth::user();
        $studentStream = $user->student->stream;

        $sortedRoadmap = $this->recommendByStudentStream($studentStream->id);

        if($recommendation){
            $sortedRoadmap = $this->filterByRecommendation($recommendation, $sortedRoadmap);
        }

        return $this->paginating(12, $sortedRoadmap);
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
