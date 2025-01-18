<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ResumeEducation extends Model
{
    protected $table = 'resume_educations';
    protected $fillable = ['school', 'education_level', 'start_date', 'end_date', 'resume_id'];

    public function resume()
    {
        return $this->belongsTo(Resume::class);
    }
}
