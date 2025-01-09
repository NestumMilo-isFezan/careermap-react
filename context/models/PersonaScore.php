<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PersonaScore extends Model
{
    protected $fillable = ['student_id', 'persona_id', 'trait_result_id', 'score'];

    public function student(): BelongsTo
    {
        return $this->belongsTo(Student::class);
    }

    public function persona(): BelongsTo
    {
        return $this->belongsTo(Persona::class);
    }
}
