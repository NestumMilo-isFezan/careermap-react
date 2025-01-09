<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Persona extends Model
{
    protected $fillable = ['name', 'description'];

    public function adaptationItems()
    {
        return $this->hasMany(AdaptationItem::class);
    }
}
