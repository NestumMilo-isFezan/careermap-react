<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UserChecklist extends Model
{
    protected $fillable = [
        'user_milestone_id',
        'checklist_id',
        'status',
        'completion_date'
    ];

    protected $casts = [
        'completion_date' => 'date'
    ];

    public function userMilestone(): BelongsTo
    {
        return $this->belongsTo(UserMilestone::class);
    }

    public function checklist(): BelongsTo
    {
        return $this->belongsTo(Checklist::class);
    }
}
