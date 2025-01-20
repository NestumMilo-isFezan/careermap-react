<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\School;
use App\Models\Teacher;
use Illuminate\Database\Seeder;

class SchoolSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        School::create([
            'name' => 'SMK Menumbok',
            'address' => 'Jalan SMK Menumbok, 89857 Menumbok, Sabah',
            'phone' => '087-857123',
            'image' => 'school-img/smkm.jpg',
            'email' => 'smkmenumbok@moe.gov.my',
            'referral_code' => 'SMKM001',
        ]);
        $teacher = User::where('email', 'howardstewart@email.edu.my')->first();
        Teacher::create([
            'user_id' => $teacher->id,
            'school_id' => 1,
        ]);
    }
}
