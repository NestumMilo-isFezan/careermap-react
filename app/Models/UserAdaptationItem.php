<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserAdaptationItem extends Model
{
    protected $fillable = ['user_adaptation_id', 'adaptations_item_id', 'status', 'completion_date'];

    public function userAdaptation()
    {
        return $this->belongsTo(UserAdaptation::class);
    }

    public function adaptationItem()
    {
        return $this->belongsTo(AdaptationItem::class);
    }
}
