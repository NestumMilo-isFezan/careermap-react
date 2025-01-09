<?php

namespace App\Models;

use App\Models\Persona;
use App\Models\UserAnswer;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Question extends Model
{
    protected $fillable = [
        'title',
        'question_1',
        'persona_1_id',
        'question_2',
        'persona_2_id'
    ];

    public function persona1(): BelongsTo
    {
        return $this->belongsTo(Persona::class, 'persona_1_id');
    }

    public function persona2(): BelongsTo
    {
        return $this->belongsTo(Persona::class, 'persona_2_id');
    }

    public function userAnswers(): HasMany
    {
        return $this->hasMany(UserAnswer::class);
    }
}
