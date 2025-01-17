<?php

namespace App\Http\Resources\Roadmap;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ModifiedCourseResource extends JsonResource
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
            'course_name' => $this->course_name,
            'description' => $this->description ?? 'No Description Available',
        ];
    }
}
