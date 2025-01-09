<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Profile extends Model
{
    protected $fillable = [
        'user_id',
        'birth_date',
        'gender',
        'religion',
        'phone',
        'address',
        'city',
        'state',
        'postcode',
        'country',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function determineReligion()
    {
        return strtolower($this->religion) === 'islam' ? 'Islam' : 'Non-Islam';
    }
}
