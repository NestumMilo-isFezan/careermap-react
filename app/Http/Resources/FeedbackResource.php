<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class FeedbackResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<int|string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'feedback' => $this->feedback,
            'created_at' => $this->created_at,
            'teacher' => [
                'id' => $this->teacher->id,
                'name' => $this->teacher->user->name,
                'image' => $this->teacher->user->image ? asset('storage/'.$this->teacher->user->image) : null,
            ],
            'student' => [
                'id' => $this->student->id,
                'name' => $this->student->user->name,
                'image' => $this->student->user->image ? asset('storage/'.$this->student->user->image) : null,
            ],
            'reply' => $this->reply ? [
                'reaction' => $this->reply->reaction,
                'response' => $this->reply->response,
            ] : null,
        ];
    }
}
