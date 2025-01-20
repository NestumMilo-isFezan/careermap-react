<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ResumeSoftSkill extends Model
{
    protected $table = 'resume_soft_skills';
    protected $fillable = ['soft_skill', 'resume_id'];

    public function resume()
    {
        return $this->belongsTo(Resume::class);
    }
}
