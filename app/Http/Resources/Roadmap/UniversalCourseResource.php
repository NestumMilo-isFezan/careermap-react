<?php

namespace App\Http\Resources\Roadmap;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UniversalCourseResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'faculty_name' => $this->faculty_name,
            'course_name' => $this->course_name,
            'description' => $this->description ?? 'No Description Available',
            'course_level' => $this->course_level,
        ];
    }
}
