<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class StreamDomainWeight extends Model
{
    protected $fillable = [
        'stream_id',
        'domain_id',
        'weight'
    ];

    public function stream()
    {
        return $this->belongsTo(Stream::class);
    }

    public function domain()
    {
        return $this->belongsTo(Domain::class);
    }
}
