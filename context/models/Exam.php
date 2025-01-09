<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Exam extends Model
{
    protected $fillable = [
        'exam_name',
    ];

    public function examSubjects()
    {
        return $this->hasMany(ExamSubject::class);
    }

    public function academic()
    {
        return $this->belongsTo(Academic::class);
    }
}
