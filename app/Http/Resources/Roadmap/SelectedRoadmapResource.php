<?php

namespace App\Http\Resources\Roadmap;

use App\Models\Course;
use App\Models\Roadmap;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use App\Http\Resources\RecommendedRoadmapResource;

class SelectedRoadmapResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $roadmap = Roadmap::find($this->id);
        $imagePath = asset('storage/' . $roadmap->image);
        $domain = $roadmap->domain;
        $prerequisite = $roadmap->prerequisite->items;
        $persona = $roadmap->adaptation->items;

        // $institutionName = Course::where('domain_id', $domain->id)->first()->institution_name;
        // $universityCourses = Course::where('domain_id', $domain->id)
        // ->where('course_level', 'Bachelor')
        // ->get();
        // $foundationCourses = Course::where('domain_id', $domain->id)
        // ->where('course_level', 'Foundation')
        // ->get();
        // $diplomaCourses = Course::where('domain_id', $domain->id)
        // ->where('course_level', 'Diploma')
        // ->get();

        // Return the roadmap data
        return[
            'roadmap' =>[
                'id' => $this->id,
                'title' => $this->title,
                'description' => $this->description,
                'domain_id' => $domain->id,
                'domain_name' => $domain->name,
                'domain_description' => $domain->description,
                'image' => $imagePath,
                'recommendation_score' => $this->recommendation_score,
            ],
            'prerequisites' => PrerequisiteResource::collection($prerequisite),
            'personas' => PersonaResource::collection($persona),
            'domain' => [
                'id' => $domain->id,
                'name' => $domain->name,
                'description' => $domain->description,
            ],

        ];
    }
}
