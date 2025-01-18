<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ResumeExperience extends Model
{
    protected $table = 'resume_experiences';
    protected $fillable = ['activity', 'position', 'start_date', 'end_date', 'resume_id'];

    public function resume()
    {
        return $this->belongsTo(Resume::class);
    }
}
