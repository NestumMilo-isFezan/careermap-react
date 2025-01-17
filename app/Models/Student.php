<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;
class Student extends Model
{
    protected $fillable = [
        'user_id',
        'school_id',
        'stream_id',
        'classroom_id',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function school()
    {
        return $this->belongsTo(School::class);
    }

    public function stream()
    {
        return $this->belongsTo(Stream::class);
    }

    public function personaScores()
    {
        return $this->hasMany(PersonaScore::class);
    }

    public function classroom()
    {
        return $this->belongsTo(Classroom::class);
    }

    public function curriculums()
    {
        return $this->hasMany(Curriculum::class);
    }
}
