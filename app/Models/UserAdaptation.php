<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserAdaptation extends Model
{
    protected $fillable = ['user_roadmap_id', 'adaptation_id', 'status'];

    public function userRoadmap()
    {
        return $this->belongsTo(UserRoadmap::class);
    }

    public function adaptation()
    {
        return $this->belongsTo(Adaptation::class);
    }
}
