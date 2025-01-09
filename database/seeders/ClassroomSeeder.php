<?php

namespace Database\Seeders;

use App\Models\Classroom;
use Illuminate\Database\Seeder;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class ClassroomSeeder extends Seeder
{

    public function run(): void
    {
        Classroom::create([
            'name' => '5 Usaha',
            'school_id' => 1,
        ]);
    }
}
