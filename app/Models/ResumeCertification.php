<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ResumeCertification extends Model
{
    protected $table = 'resume_certifications';
    protected $fillable = ['certification', 'date_of_issue', 'resume_id'];

    public function resume()
    {
        return $this->belongsTo(Resume::class);
    }
}
