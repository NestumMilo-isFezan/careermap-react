<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CurriculumPoint extends Model
{
    protected $table = 'curriculum_points';
    protected $fillable = ['student_id', 'curriculum_id', 'soft_skill_id', 'score'];

    public function student()
    {
        return $this->belongsTo(Student::class);
    }

    public function curriculum()
    {
        return $this->belongsTo(Curriculum::class);
    }

    public function softSkill()
    {
        return $this->belongsTo(SoftSkill::class);
    }
}
