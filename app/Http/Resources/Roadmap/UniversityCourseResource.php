<?php

namespace App\Http\Resources\Roadmap;

use App\Models\Course;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UniversityCourseResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $currentInstitutionName = $this->institution_name;
        $previousInstitutionName = $this->previous_institution_name;
        return [
            'id' => $this->id,
            'institution_name' => $this->currentInstitutionName,

        ];
    }
}
