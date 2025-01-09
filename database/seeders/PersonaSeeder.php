<?php

namespace Database\Seeders;

use App\Models\Persona;
use Illuminate\Database\Seeder;

class PersonaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $personas = [
            [
                'name' => 'Creativity',
                'description' => 'Ability to think outside the box and generate innovative solutions.',
            ],
            [
                'name' => 'Confidence',
                'description' => 'Self-assured and certain about one\'s abilities and decisions.',
            ],
            [
                'name' => 'Honesty',
                'description' => 'Being truthful and maintaining integrity in all interactions.',
            ],
            [
                'name' => 'Conscientiousness',
                'description' => 'Being thorough, careful, and vigilant in work and responsibilities.',
            ],
            [
                'name' => 'Dependable',
                'description' => 'Reliable and trustworthy in fulfilling obligations and commitments.',
            ],
            [
                'name' => 'Communication',
                'description' => 'Effective exchange of information and ideas with others.',
            ],
            [
                'name' => 'Integrity',
                'description' => 'Strong adherence to moral and ethical principles.',
            ],
            [
                'name' => 'Loyalty',
                'description' => 'Strong feeling of support and allegiance.',
            ],
            [
                'name' => 'Organization',
                'description' => 'Ability to plan, arrange, and manage tasks efficiently.',
            ],
            [
                'name' => 'Problem solving',
                'description' => 'Ability to find solutions to difficult or complex issues.',
            ],
            [
                'name' => 'Motivation',
                'description' => 'Inner drive and enthusiasm to achieve goals.',
            ],
            [
                'name' => 'Teamwork',
                'description' => 'Ability to work collaboratively with others towards common goals.',
            ],
            [
                'name' => 'Agreeableness',
                'description' => 'Being friendly, cooperative, and compassionate towards others.',
            ],
            [
                'name' => 'Compassion',
                'description' => 'Showing concern and empathy for others\' well-being.',
            ],
            [
                'name' => 'Humble',
                'description' => 'Modest and respectful in behavior and attitude.',
            ],
            [
                'name' => 'Leadership',
                'description' => 'Ability to guide and inspire others towards achieving goals.',
            ],
            [
                'name' => 'Openness',
                'description' => 'Receptive to new ideas, experiences, and perspectives.',
            ],
            [
                'name' => 'Responsible',
                'description' => 'Taking ownership of actions and their consequences.',
            ],
            [
                'name' => 'Team player',
                'description' => 'Works well with others and contributes to group success.',
            ],
            [
                'name' => 'Flexibility',
                'description' => 'Ability to adapt to changing circumstances and requirements.',
            ],
            [
                'name' => 'Ambition',
                'description' => 'Strong desire and determination to achieve goals.',
            ],
            [
                'name' => 'Curiosity',
                'description' => 'Eager to learn and explore new concepts and ideas.',
            ],
            [
                'name' => 'Determined',
                'description' => 'Firm resolution and persistence in pursuing goals.',
            ],
            [
                'name' => 'Diligent',
                'description' => 'Careful and persistent in work and effort.',
            ],
        ];

        foreach ($personas as $persona) {
            Persona::create($persona);
        }
    }
}
