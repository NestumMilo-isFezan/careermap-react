<?php

namespace App\Http\Resources\Roadmap;

use App\Models\Persona;
use App\Models\Student;
use App\Models\PersonaScore;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PersonaResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $persona = Persona::find($this->persona_id);
        $studentId = Student::where('user_id', request()->user()->id)->first()->id;
        $personaScores = PersonaScore::where('student_id', $studentId)
        ->where('persona_id', $this->persona_id)
        ->first() ?? null;

        $status = match(true) {
            $personaScores == null => "Not Taken",
            $personaScores->score >= 5 => "High",
            default => "Low"
        };
        return[
            'id' => $this->id,
            'name' => $this->name,
            'persona_name' => $persona->name,
            'persona_description' => $persona->description,
            'status' => $status,
        ];
    }
}
