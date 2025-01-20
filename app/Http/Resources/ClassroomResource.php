<?php

namespace App\Http\Resources;

use App\Models\Teacher;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ClassroomResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        // Get the teacher through the relationship instead of querying directly
        $teacher = $this->teacher;  // Assuming there's a teacher() relationship defined in Classroom model

        return [
            'id' => $this->id,
            'name' => $this->name,
            'teacher' => $teacher ? [
                'name' => $teacher->user->name,
                'email' => $teacher->user->email,
                'phone' => $teacher->user->profile->phone,
                'image' => $teacher->user->image ? asset('storage/'.$teacher->user->image) : asset('assets/avatar.png'),
            ] : [
                'name' => 'Not Assigned',
                'email' => 'No Email',
                'phone' => 'No Phone',
                'image' => asset('assets/avatar.png'),
            ],
            'students' => StudentResource::collection($this->students),
        ];
    }
}
