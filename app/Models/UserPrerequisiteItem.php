<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserPrerequisiteItem extends Model
{
    protected $fillable = ['user_prerequisite_id', 'prerequisites_item_id', 'status', 'completion_date'];

    public function userPrerequisite()
    {
        return $this->belongsTo(UserPrerequisite::class);
    }

    public function prerequisiteItem()
    {
        return $this->belongsTo(PrerequisiteItem::class);
    }
}
