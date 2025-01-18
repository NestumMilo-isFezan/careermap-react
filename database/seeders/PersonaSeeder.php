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
                'name' => 'Ambitious',
                'description' => "Ambition is a personality trait that smart people tend to have. It’s a driving force that helps them achieve their goals and succeed in life.",
            ],
            [
                'name' => 'Confidence',
                'description' => "Confidence is a quality that helps you feel good about yourself, your abilities, and your place in the world. It’s a skill that can be learned and practiced.",
            ],
            [
                'name' => 'Constant Learner',
                'description' => "Constant Learner is a personality trait that applying the concept of always expanding the knowledge to gain new skills and expertise.",
            ],
            [
                'name' => 'Creative',
                'description' => 'Creativity is an important characteristic of successful professionals. It can help you solve problems, come up with new ideas, and communicate more effectively.',
            ],
            [
                'name' => 'Curious',
                'description' => 'Curious people often look for opportunities to learn more about situations and places.',
            ],
            [
                'name' => 'Dedicated',
                'description' => 'Dedicated is a person who puts a lot of energy, time, efforts, etc. to something that he/she believes is important.',
            ],
            [
                'name' => 'Be Helpful',
                'description' => 'Being helpful in a career involves consistently providing value, support, or assistance to others within your professional environment.',
            ],
            [
                'name' => 'Self-Aware',
                'description' => 'Self-awareness is the ability to recognize your strengths and weaknesses, and it’s a crucial part of being able to make good decisions about where you want to go professionally.',
            ],
            [
                'name' => 'Responsible',
                'description' => 'Being responsible in a career means consistently demonstrating reliability, accountability, and a commitment to fulfilling professional duties and expectations.',
            ],
            [
                'name' => 'Accepting',
                'description' => 'Accepting change is a fundamental skill for success in the workplace.',
            ],
        ];

        foreach ($personas as $persona) {
            Persona::create($persona);
        }
    }
}
