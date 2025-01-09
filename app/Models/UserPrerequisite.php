<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserPrerequisite extends Model
{
    protected $fillable = ['user_roadmap_id', 'prerequisites_id', 'status'];

    public function userRoadmap()
    {
        return $this->belongsTo(UserRoadmap::class);
    }

    public function prerequisite()
    {
        return $this->belongsTo(Prerequisite::class);
    }
}
