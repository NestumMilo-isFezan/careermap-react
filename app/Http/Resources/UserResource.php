<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $image = $this->image ? asset('storage/'.$this->image) : asset('assets/avatar.png');
        switch($this->role){
            case 0:
                $role = 'Student';
                break;
            case 1:
                $role = 'Admin';
                break;
            case 2:
                $role = 'Teacher';
                break;
            case 3:
                $role = 'Pending Student';
                break;
            case 4:
                $role = 'Pending Teacher';
                break;
        }
        return [
            'id' => $this->id,
            'image' => $image,
            'name' => $this->name,
            'email' => $this->email,
            'role' => $role,
            'created_at' => Carbon::parse($this->created_at)->format('d-m-Y'),
        ];
    }
}
