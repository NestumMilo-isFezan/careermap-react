<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Subject extends Model
{
    protected $fillable = [
        'subject_name',
        'short_name',
        'type',
        'stream_id',
    ];

    public function examSubjects()
    {
        return $this->hasMany(ExamSubject::class);
    }

    public function stream()
    {
        return $this->belongsTo(Stream::class);
    }
}
