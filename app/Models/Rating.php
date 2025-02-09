<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Rating extends Model
{
    protected $table = 'rating';
    protected $fillable = ['rating', 'comment', 'user_id'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
