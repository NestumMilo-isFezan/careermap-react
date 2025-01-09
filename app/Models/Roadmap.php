<?php

namespace App\Models;

use App\Models\Prerequisite;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Roadmap extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
        'domain_id',
        'image',
    ];

    public function domain()
    {
        return $this->belongsTo(Domain::class);
    }

    public function prerequisite(): HasOne
    {
        return $this->hasOne(Prerequisite::class);
    }

    public function adaptation(): HasOne
    {
        return $this->hasOne(Adaptation::class);
    }

    public function userRoadmaps(): HasMany
    {
        return $this->hasMany(UserRoadmap::class);
    }
}
