<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SoftSkill extends Model
{
    protected $fillable = ['name', 'description'];

    public function curriculumPoints()
    {
        return $this->hasMany(CurriculumPoint::class);
    }
}
