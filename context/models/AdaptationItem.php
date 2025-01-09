<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AdaptationItem extends Model
{
    protected $table = 'adaptations_items';
    protected $fillable = ['persona_id', 'adaptation_id', 'name'];

    public function persona()
    {
        return $this->belongsTo(Persona::class);
    }

    public function adaptation()
    {
        return $this->belongsTo(Adaptation::class);
    }
}
