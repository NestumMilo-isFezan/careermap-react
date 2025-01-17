<?php

namespace App\Http\Resources\Traits;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class QuestionResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'question' => $this->title,
            'answers' => [
                [
                    'text' => $this->question_1,
                    'personaId' => $this->persona_1_id,
                ],
                [
                    'text' => $this->question_2,
                    'personaId' => $this->persona_2_id,
                ],
            ],
        ];
    }
}
