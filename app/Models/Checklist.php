<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Checklist extends Model
{

    protected $fillable = [
        'milestone_id',
        'name',
        'task',
        'requirement',
    ];

    public function milestone(): BelongsTo
    {
        return $this->belongsTo(Milestone::class);
    }

    public function userChecklist(): HasMany
    {
        return $this->hasMany(UserChecklist::class);
    }
}
