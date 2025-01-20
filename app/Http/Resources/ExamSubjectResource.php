<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ExamSubjectResource extends JsonResource
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
            'subject_id' => $this->subject_id,
            'subject_name' => $this->subject->subject_name,
            'short_name' => $this->subject->short_name,
            'type' => $this->subject->type,
            'stream_id' => $this->subject->stream_id,
            'stream_name' => $this->subject->stream->name,
            'grade' => $this->grade,
        ];
    }
}
