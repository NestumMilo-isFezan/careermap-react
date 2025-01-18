<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ResumeLanguage extends Model
{
    protected $table = 'resume_languages';
    protected $fillable = ['language', 'level', 'resume_id'];

    public function resume()
    {
        return $this->belongsTo(Resume::class);
    }
}
