<?php

namespace App\Http\Resources\Curriculum;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;
class CurriculumResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $documentUrl = $this->document ? Storage::url($this->document) : null;

        return [
            'id' => $this->id,
            'name' => $this->name,
            'description' => $this->description,
            'student_id' => $this->student_id,
            'document_url' => $documentUrl,
            'status' => $this->status,
            'level' => $this->level,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
