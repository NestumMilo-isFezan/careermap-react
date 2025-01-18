<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Resume extends Model
{
    protected $fillable = [
        'user_id',
        'image',
        'name',
        'email',
        'phone',
        'address',
        'summary',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function experience()
    {
        return $this->hasMany(ResumeExperience::class);
    }

    public function education()
    {
        return $this->hasMany(ResumeEducation::class);
    }

    public function certification()
    {
        return $this->hasMany(ResumeCertification::class);
    }

    public function skill()
    {
        return $this->hasMany(ResumeSkill::class);
    }

    public function softSkill()
    {
        return $this->hasMany(ResumeSoftSkill::class);
    }

    public function language()
    {
        return $this->hasMany(ResumeLanguage::class);
    }
}
