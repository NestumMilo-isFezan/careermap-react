<?php

namespace App\Http\Resources;

use App\Models\Domain;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CourseResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $domain = Domain::find($this->domain_id);
        return [
            'id' => $this->id,
            'name' => $this->course_name,
            'code' => $this->institution_name,
            'level' => $this->course_level,
            'faculty' => $this->faculty_name,
            'institution' => $this->institution_name,
            'domain_id' => $this->domain_id,
            'domain_name' => $domain->name,
            'domain_description' => $domain->description,
        ];
    }
}
