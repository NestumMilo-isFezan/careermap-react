<?php

namespace App\Http\Resources;

use App\Models\Roadmap;
use App\Models\Prerequisite;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

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
        $prerequisite = $roadmap->prerequisite;
        $persona = $roadmap->persona;
        $domain = $roadmap->domain;

        // Results
        return [
            'roadmap' => RecommendedRoadmapResource::make($roadmap),
            'prerequisites' => [
                'id' => $this->prerequisite->id,
                'name' => $this->prerequisite->name,
                'subject_name' => $this->prerequisite->subject_name,
                'grade' => $this->prerequisite->grade,
                'user_grade' => $this->prerequisite->user_grade,
                'status' => $this->prerequisite->status,
            ],
            'personas' => [
                'id' => $this->persona->id,
                'name' => $this->persona->name,
                'persona_name' => $this->persona->persona_name,
                'persona_description' => $this->persona->persona_description,
                'status' => $this->persona->status,
            ],
            'domain' => [
                'id' => $this->domain->id,
                'name' => $this->domain->name,
                'description' => $this->domain->description,
            ],
            'university_course' => [
                'id' => $this->university_course->id,
                'institution_name' => $this->university_course->institution_name,
                'courses' => [
                    'id' => $this->university_course->courses->id,
                    'faculty_name' => $this->university_course->courses->faculty_name,
                    'course_name' => $this->university_course->courses->course_name,
                    'description' => $this->university_course->courses->description,
                    'course_level' => $this->university_course->courses->course_level,
                ]
            ],
            'foundation_course' => [
                'institution_name' => $this->foundation_course->institution_name,
                'faculty_name' => $this->foundation_course->faculty_name,
                'courses' => [
                    'id' => $this->foundation_course->courses->id,
                    'course_name' => $this->foundation_course->courses->course_name,
                    'description' => $this->foundation_course->courses->description,
                ]
            ],
            'diploma_course' => [
                'institution_name' => $this->diploma_course->institution_name,
                'faculty_name' => $this->diploma_course->faculty_name,
                'courses' => [
                    'id' => $this->diploma_course->courses->id,
                    'course_name' => $this->diploma_course->courses->course_name,
                    'description' => $this->diploma_course->courses->description,
                ]
            ]
        ];
    }
}
