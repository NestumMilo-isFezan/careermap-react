<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TraitResults extends Model
{
    protected $fillable = ['student_id'];

    public function student()
    {
        return $this->belongsTo(Student::class);
    }

    public function personaScores()
    {
        return $this->hasMany(PersonaScore::class);
    }
}
