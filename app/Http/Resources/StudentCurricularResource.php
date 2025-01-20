<?php

namespace App\Http\Resources;

use App\Models\Curriculum;
use Illuminate\Http\Request;
use App\Models\CurriculumPoint;
use Illuminate\Http\Resources\Json\JsonResource;
use App\Http\Resources\Curriculum\CurriculumResource;

class StudentCurricularResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $curricularCount = Curriculum::where('student_id', $this->user->student->id)->count();
        return [
            'name' => $this->user->name,
            'email' => $this->user->email,
            'phone' => $this->user->profile->phone,
            'image' => $this->user->image ? asset('storage/'.$this->user->image) : null,
            'curricularCount' => $curricularCount,
            'curricular' => CurriculumResource::collection(Curriculum::where('student_id', $this->user->student->id)->get()),
        ];
    }
}
