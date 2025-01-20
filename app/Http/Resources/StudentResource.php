<?php

namespace App\Http\Resources;

use App\Models\Resume;
use App\Models\UserRoadmap;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class StudentResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $favourite = UserRoadmap::where('user_id', $this->user_id)->where('roadmap_id', $this->roadmap_id)->count();
        $resume = Resume::where('user_id', $this->user_id)->exists() ? true : false;
        return [
            'name' => $this->user->name,
            'email' => $this->user->email,
            'phone' => $this->user->profile->phone,
            'image' => $this->user->image ? asset('storage/'.$this->user->image) : null,
            'favourite' => $favourite,
            'resume' => $resume,
        ];
    }
}
