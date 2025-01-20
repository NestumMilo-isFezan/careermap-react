<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class News extends Model
{
    protected $fillable = ['title', 'description', 'image', 'admin_id'];

    public function admin()
    {
        return $this->belongsTo(Admin::class);
    }
}
