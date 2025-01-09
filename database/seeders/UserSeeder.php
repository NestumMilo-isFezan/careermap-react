<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::factory()->create([
            'first_name' => 'Nurahfezan',
            'last_name' => 'Nordin',
            'name' => 'Nurahfezan Nordin',
            'email' => 'nurahfezannordinn@gmail.com',
            'password' => Hash::make('terraxp13'),
            'image' => 'profilepic/user.jpg',
            'role' => 3,
        ]);
        User::factory()->create([
            'first_name' => 'Admin',
            'last_name' => 'Milo',
            'name' => 'Admin Milo',
            'email' => 'nestummilo@gmail.com',
            'password' => Hash::make('terraxp13'),
            'image' => 'profilepic/adminmilo.jpg',
            'role' => 1,
        ]);
        User::create([
            'first_name' => 'Howard',
            'last_name' => 'Stewart',
            'name' => 'Howard Stewart',
            'email' => 'howardstewart@email.edu.my',
            'password' => Hash::make('terraxp13'),
            'image' => 'profilepic/howart.jpeg',
            'role' => 4,
        ]);
    }
}
