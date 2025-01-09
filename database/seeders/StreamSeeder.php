<?php

namespace Database\Seeders;

use App\Models\Stream;
use Illuminate\Database\Seeder;

class StreamSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $streams = [
            'Core Subjects',
            'Science Stream',
            'Non-Science Stream',
            'Optional Subjects',
        ];

        foreach ($streams as $stream) {
            Stream::create(['name' => $stream]);
        }
    }
}
