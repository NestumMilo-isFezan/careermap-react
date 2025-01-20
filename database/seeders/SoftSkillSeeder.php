<?php

namespace Database\Seeders;

use App\Models\SoftSkill;
use Illuminate\Database\Seeder;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class SoftSkillSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $softskills = [
            ['name' => 'Communication', 'description' => 'Ability to communicate effectively with others.'], //
            ['name' => 'Emotional Intelligence', 'description' => 'Ability to understand and manage emotions.'],
            ['name' => 'Adaptability', 'description' => 'Ability to adapt to new situations and environments.'],
            ['name' => 'Problem Solving', 'description' => 'Ability to solve problems effectively.'],
            ['name' => 'Leadership', 'description' => 'Ability to lead and guide others.'],
            ['name' => 'Teamwork', 'description' => 'Ability to work well with others in a team.'],
            ['name' => 'Time Management', 'description' => 'Ability to manage time effectively.'],
        ];

        foreach ($softskills as $softskill) {
            SoftSkill::create($softskill);
        }
    }
}
