<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Database\Seeders\UserSeeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();
        $this->call([UserSeeder::class]);
        $this->call([StreamSeeder::class]);
        $this->call([DomainSeeder::class]);
        $this->call([PersonaSeeder::class]);
        $this->call(SchoolSeeder::class);
        $this->call([SubjectSeeder::class]);
        $this->call([QuestionSeeder::class]);
        $this->call([ClassroomSeeder::class]);
        $this->call([RoadmapSeeder::class]);
    }
}
