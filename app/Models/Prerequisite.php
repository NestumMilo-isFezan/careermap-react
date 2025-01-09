<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Prerequisite extends Model
{
    protected $fillable = ['name', 'description', 'roadmap_id'];

    public function items()
    {
        return $this->hasMany(PrerequisiteItem::class);
    }

    public function roadmap()
    {
        return $this->belongsTo(Roadmap::class);
    }
}
