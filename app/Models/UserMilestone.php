<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class UserMilestone extends Model
{
    protected $fillable = [
        'user_roadmap_id',
        'milestone_id',
        'status'
    ];

    public function userRoadmap(): BelongsTo
    {
        return $this->belongsTo(UserRoadmap::class);
    }

    public function milestone(): BelongsTo
    {
        return $this->belongsTo(Milestone::class);
    }

    public function userChecklists(): HasMany
    {
        return $this->hasMany(UserChecklist::class);
    }
}
