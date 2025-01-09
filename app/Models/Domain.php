<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Domain extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
    ];

    public function roadmaps()
    {
        return $this->hasMany(Roadmap::class);
    }

    // public function domainScores(): HasMany
    // {
    //     return $this->hasMany(DomainScore::class);
    // }

    public function questions(): HasMany
    {
        return $this->hasMany(Question::class);
    }

    public function courses(): HasMany
    {
        return $this->hasMany(Course::class);
    }
}
