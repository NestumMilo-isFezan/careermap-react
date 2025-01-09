<?php

namespace App\Services;

use App\Models\Domain;
use App\Models\Student;
use App\Models\Roadmap;

class RoadmapRecommendationService
{
    public function getWeightedDomains(Student $student)
    {
        return Domain::select('domains.*', 'stream_domain_weights.weight')
            ->leftJoin('stream_domain_weights', function($join) use ($student) {
                $join->on('domains.id', '=', 'stream_domain_weights.domain_id')
                    ->where('stream_domain_weights.stream_id', '=', $student->stream->id);
            })
            ->orderBy('stream_domain_weights.weight', 'desc')
            ->with('roadmaps')
            ->get();
    }

    public function getSortedRoadmaps($domains)
    {
        return Roadmap::with('domain')
            ->whereIn('domain_id', $domains->pluck('id'))
            ->get()
            ->sortBy(function($roadmap) use ($domains) {
                $domainWeight = $domains->firstWhere('id', $roadmap->domain_id)->weight;
                return -$domainWeight;
            });
    }

    public function getCategorizedRoadmaps($domains)
    {
        $roadmaps = $this->getSortedRoadmaps($domains);

        return [
            'recommended' => $roadmaps->filter(function($roadmap) use ($domains) {
                $weight = $domains->firstWhere('id', $roadmap->domain_id)->weight;
                return $weight >= 0.70;
            }),

            'choices' => $roadmaps->filter(function($roadmap) use ($domains) {
                $weight = $domains->firstWhere('id', $roadmap->domain_id)->weight;
                return $weight >= 0.40 && $weight < 0.70;
            }),

            'not_recommended' => $roadmaps->filter(function($roadmap) use ($domains) {
                $weight = $domains->firstWhere('id', $roadmap->domain_id)->weight;
                return $weight < 0.40;
            })
        ];
    }
}
