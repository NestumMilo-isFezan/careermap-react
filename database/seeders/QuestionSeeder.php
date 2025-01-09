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
                'title' => 'In a group project, how do you prefer to contribute?',
                'question_1' => 'Generate innovative ideas and creative solutions',
                'persona_1' => 'Creativity',
                'question_2' => 'Ensure the team stays organized and on track',
                'persona_2' => 'Organization'
            ],
            [
                'title' => 'When facing a challenge, what is your typical approach?',
                'question_1' => 'Take charge and guide others towards a solution',
                'persona_1' => 'Leadership',
                'question_2' => 'Analyze the problem carefully and methodically',
                'persona_2' => 'Problem solving'
            ],
            [
                'title' => 'How do you prefer to work on complex tasks?',
                'question_1' => 'Explore new and unconventional approaches',
                'persona_1' => 'Curiosity',
                'question_2' => 'Persist until the task is completed perfectly',
                'persona_2' => 'Diligent'
            ],
            [
                'title' => 'In a team discussion, what role do you usually take?',
                'question_1' => 'Share ideas openly and encourage others to do the same',
                'persona_1' => 'Openness',
                'question_2' => 'Listen carefully and build on others\' contributions',
                'persona_2' => 'Team player'
            ],
            [
                'title' => 'When starting a new project, what matters most to you?',
                'question_1' => 'Setting ambitious goals and pushing boundaries',
                'persona_1' => 'Ambition',
                'question_2' => 'Ensuring everyone\'s voice is heard and considered',
                'persona_2' => 'Compassion'
            ],
            [
                'title' => 'How do you handle project deadlines?',
                'question_1' => 'Take responsibility for ensuring everything is completed',
                'persona_1' => 'Responsible',
                'question_2' => 'Adapt quickly to changing requirements',
                'persona_2' => 'Flexibility'
            ],
            [
                'title' => 'When working with others, what do you value most?',
                'question_1' => 'Building trust through consistent reliability',
                'persona_1' => 'Dependable',
                'question_2' => 'Maintaining strong ethical standards',
                'persona_2' => 'Integrity'
            ],
            [
                'title' => 'How do you approach team conflicts?',
                'question_1' => 'Find ways to cooperate and maintain harmony',
                'persona_1' => 'Agreeableness',
                'question_2' => 'Address issues directly and honestly',
                'persona_2' => 'Honesty'
            ],
            [
                'title' => 'What motivates you in your work?',
                'question_1' => 'The drive to achieve excellence',
                'persona_1' => 'Motivation',
                'question_2' => 'Supporting and helping others succeed',
                'persona_2' => 'Loyalty'
            ],
            [
                'title' => 'How do you handle success?',
                'question_1' => 'Share credit and celebrate team achievements',
                'persona_1' => 'Humble',
                'question_2' => 'Feel confident about your contributions',
                'persona_2' => 'Confidence'
            ],
            [
                'title' => 'When learning something new, what approach do you prefer?',
                'question_1' => 'Explore and experiment independently',
                'persona_1' => 'Creativity',
                'question_2' => 'Follow a structured, methodical approach',
                'persona_2' => 'Conscientiousness'
            ],
            [
                'title' => 'In group discussions, how do you typically contribute?',
                'question_1' => 'Express ideas clearly and effectively',
                'persona_1' => 'Communication',
                'question_2' => 'Guide the conversation towards solutions',
                'persona_2' => 'Leadership'
            ],
            [
                'title' => 'When facing obstacles, what is your typical response?',
                'question_1' => 'Persist until you find a solution',
                'persona_1' => 'Determined',
                'question_2' => 'Seek innovative ways around the problem',
                'persona_2' => 'Problem solving'
            ],
            [
                'title' => 'How do you prefer to organize your work?',
                'question_1' => 'Create detailed plans and schedules',
                'persona_1' => 'Organization',
                'question_2' => 'Adapt and adjust as needed',
                'persona_2' => 'Flexibility'
            ],
            [
                'title' => 'What aspect of teamwork do you value most?',
                'question_1' => 'Supporting others and building relationships',
                'persona_1' => 'Teamwork',
                'question_2' => 'Achieving goals efficiently',
                'persona_2' => 'Ambition'
            ],
            [
                'title' => 'How do you approach decision-making?',
                'question_1' => 'Consider all perspectives carefully',
                'persona_1' => 'Conscientiousness',
                'question_2' => 'Trust your instincts and take initiative',
                'persona_2' => 'Confidence'
            ],
            [
                'title' => 'What drives you to improve?',
                'question_1' => 'Curiosity about new possibilities',
                'persona_1' => 'Curiosity',
                'question_2' => 'Commitment to excellence',
                'persona_2' => 'Diligent'
            ],
            [
                'title' => 'How do you handle responsibility?',
                'question_1' => 'Take ownership and ensure completion',
                'persona_1' => 'Responsible',
                'question_2' => 'Share tasks and collaborate effectively',
                'persona_2' => 'Team player'
            ],
            [
                'title' => 'What matters most in communication?',
                'question_1' => 'Being direct and truthful',
                'persona_1' => 'Honesty',
                'question_2' => 'Being diplomatic and considerate',
                'persona_2' => 'Compassion'
            ],
            [
                'title' => 'How do you approach challenges?',
                'question_1' => 'With determination to succeed',
                'persona_1' => 'Determined',
                'question_2' => 'With openness to different approaches',
                'persona_2' => 'Openness'
            ],
            [
                'title' => 'What do you prioritize in team relationships?',
                'question_1' => 'Building trust and reliability',
                'persona_1' => 'Dependable',
                'question_2' => 'Fostering cooperation and harmony',
                'persona_2' => 'Agreeableness'
            ],
            [
                'title' => 'How do you contribute to team success?',
                'question_1' => 'By maintaining high ethical standards',
                'persona_1' => 'Integrity',
                'question_2' => 'By motivating and inspiring others',
                'persona_2' => 'Motivation'
            ],
            [
                'title' => 'What approach do you take to problem-solving?',
                'question_1' => 'Think creatively and outside the box',
                'persona_1' => 'Creativity',
                'question_2' => 'Analyze systematically and thoroughly',
                'persona_2' => 'Problem solving'
            ],
            [
                'title' => 'How do you handle team leadership?',
                'question_1' => 'Guide and inspire others',
                'persona_1' => 'Leadership',
                'question_2' => 'Support and empower team members',
                'persona_2' => 'Loyalty'
            ],
            [
                'title' => 'What matters most in personal growth?',
                'question_1' => 'Continuous learning and exploration',
                'persona_1' => 'Curiosity',
                'question_2' => 'Building character and integrity',
                'persona_2' => 'Humble'
            ],
            [
                'title' => 'How do you approach collaboration?',
                'question_1' => 'Focus on effective communication',
                'persona_1' => 'Communication',
                'question_2' => 'Ensure reliable contribution',
                'persona_2' => 'Dependable'
            ],
            [
                'title' => 'What drives your work ethic?',
                'question_1' => 'Desire for excellence',
                'persona_1' => 'Diligent',
                'question_2' => 'Commitment to team success',
                'persona_2' => 'Teamwork'
            ],
            [
                'title' => 'How do you handle feedback?',
                'question_1' => 'Accept it with humility',
                'persona_1' => 'Humble',
                'question_2' => 'Use it as motivation to improve',
                'persona_2' => 'Motivation'
            ],
            [
                'title' => 'What\'s your approach to personal development?',
                'question_1' => 'Set ambitious goals',
                'persona_1' => 'Ambition',
                'question_2' => 'Focus on continuous improvement',
                'persona_2' => 'Conscientiousness'
            ],
            [
                'title' => 'How do you handle team dynamics?',
                'question_1' => 'Promote harmony and cooperation',
                'persona_1' => 'Agreeableness',
                'question_2' => 'Ensure clear communication',
                'persona_2' => 'Communication'
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
