<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PrerequisiteItem extends Model
{
    protected $table = 'prerequisites_items';
    protected $fillable = ['name', 'subject_id', 'requirement', 'prerequisite_id'];

    public function subject()
    {
        return $this->belongsTo(Subject::class);
    }

    public function prerequisite()
    {
        return $this->belongsTo(Prerequisite::class);
    }
}
