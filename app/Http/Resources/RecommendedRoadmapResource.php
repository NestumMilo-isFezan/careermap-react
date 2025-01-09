<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class RecommendedRoadmapResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $imagePath = asset('storage/' . $this->image);
        return [
            'id' => $this->id,
            'title' => $this->title,
            'description' => $this->description,
            'image' => $imagePath,
            'domain_id' => $this->domain_id,
            'domain_name' => $this->domain->name,
            'domain_details' => $this->domain->description,
            'recommendation_score' => $this->recommendation_score,
        ];
    }
}
