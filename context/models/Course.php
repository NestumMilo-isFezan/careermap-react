<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
class Course extends Model
{
    use HasFactory;

    protected $fillable = [
        'course_name',
        'institution_name',
        'course_level',
        'faculty_name',
        'domain_id',
    ];

    public function domain(): BelongsTo
    {
        return $this->belongsTo(Domain::class);
    }
}
