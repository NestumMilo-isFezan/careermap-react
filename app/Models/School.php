<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class School extends Model
{
    protected $fillable = [
        "name","image","address","phone","email",
    ];

    public function students()
    {
        return $this->hasMany(Student::class);
    }
}
