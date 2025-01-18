<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ResumeSkill extends Model
{
    protected $table = 'resume_skills';
    protected $fillable = ['skill', 'level', 'resume_id'];

    public function resume()
    {
        return $this->belongsTo(Resume::class);
    }
}
