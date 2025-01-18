<?php

namespace Database\Seeders;

use App\Models\Persona;
use App\Models\Question;
use Illuminate\Database\Seeder;

class QuestionSeeder extends Seeder
{
    public function run(): void
    {
        $questions = [
            [
                'title' => 'When starting a new project, what drives you most?',
                'question_1' => 'Setting challenging goals and pushing for excellence',
                'persona_1' => 'Ambitious',
                'question_2' => 'Understanding and improving your capabilities',
                'persona_2' => 'Self-Aware'
            ],
            [
                'title' => 'How do you approach learning new skills?',
                'question_1' => 'Eagerly seek out new knowledge and opportunities',
                'persona_1' => 'Constant Learner',
                'question_2' => 'Explore with natural interest and inquisitiveness',
                'persona_2' => 'Curious'
            ],
            [
                'title' => 'When facing challenges in a team, what\'s your typical response?',
                'question_1' => 'Take initiative with self-assured decision-making',
                'persona_1' => 'Confidence',
                'question_2' => 'Offer assistance and support to team members',
                'persona_2' => 'Be Helpful'
            ],
            [
                'title' => 'How do you handle project responsibilities?',
                'question_1' => 'Ensure all tasks are completed reliably',
                'persona_1' => 'Responsible',
                'question_2' => 'Commit fully until goals are achieved',
                'persona_2' => 'Dedicated'
            ],
            [
                'title' => 'When solving problems, what\'s your preferred approach?',
                'question_1' => 'Think outside the box and generate innovative solutions',
                'persona_1' => 'Creative',
                'question_2' => 'Adapt and embrace new approaches',
                'persona_2' => 'Accepting'
            ],
            [
                'title' => 'What motivates you to improve at work?',
                'question_1' => 'The desire to continuously expand knowledge',
                'persona_1' => 'Constant Learner',
                'question_2' => 'The drive to achieve ambitious goals',
                'persona_2' => 'Ambitious'
            ],
            [
                'title' => 'How do you contribute to team success?',
                'question_1' => 'Support others and provide assistance',
                'persona_1' => 'Be Helpful',
                'question_2' => 'Take ownership of responsibilities',
                'persona_2' => 'Responsible'
            ],
            [
                'title' => 'When facing new situations, what\'s your approach?',
                'question_1' => 'Embrace change and adapt readily',
                'persona_1' => 'Accepting',
                'question_2' => 'Investigate and learn from the experience',
                'persona_2' => 'Curious'
            ],
            [
                'title' => 'How do you handle project challenges?',
                'question_1' => 'Persist with dedication until resolved',
                'persona_1' => 'Dedicated',
                'question_2' => 'Apply creative thinking to find solutions',
                'persona_2' => 'Creative'
            ],
            [
                'title' => 'What\'s your approach to personal development?',
                'question_1' => 'Understand and work on your limitations',
                'persona_1' => 'Self-Aware',
                'question_2' => 'Face challenges with self-assurance',
                'persona_2' => 'Confidence'
            ],
            [
                'title' => 'How do you approach learning opportunities?',
                'question_1' => 'With curiosity and eagerness to explore',
                'persona_1' => 'Curious',
                'question_2' => 'With commitment to master new skills',
                'persona_2' => 'Dedicated'
            ],
            [
                'title' => 'What drives your professional growth?',
                'question_1' => 'The ambition to achieve greater things',
                'persona_1' => 'Ambitious',
                'question_2' => 'The desire to help others succeed',
                'persona_2' => 'Be Helpful'
            ],
            [
                'title' => 'How do you handle feedback?',
                'question_1' => 'Use it for self-awareness and improvement',
                'persona_1' => 'Self-Aware',
                'question_2' => 'Accept and adapt to suggestions',
                'persona_2' => 'Accepting'
            ],
            [
                'title' => 'What\'s your approach to problem-solving?',
                'question_1' => 'Take responsibility for finding solutions',
                'persona_1' => 'Responsible',
                'question_2' => 'Apply creative and innovative thinking',
                'persona_2' => 'Creative'
            ],
            [
                'title' => 'How do you face new challenges?',
                'question_1' => 'With confidence in your abilities',
                'persona_1' => 'Confidence',
                'question_2' => 'With a commitment to continuous learning',
                'persona_2' => 'Constant Learner'
            ]
        ];

        // Create questions
        foreach ($questions as $question) {
            $persona1 = Persona::where('name', $question['persona_1'])->first();
            $persona2 = Persona::where('name', $question['persona_2'])->first();

            Question::create([
                'title' => $question['title'],
                'question_1' => $question['question_1'],
                'persona_1_id' => $persona1->id,
                'question_2' => $question['question_2'],
                'persona_2_id' => $persona2->id
            ]);
        }
    }
}
