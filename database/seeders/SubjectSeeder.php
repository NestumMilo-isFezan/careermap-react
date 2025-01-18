<?php

namespace Database\Seeders;

use App\Models\Subject;
use Illuminate\Database\Seeder;

class SubjectSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $subjects = [
            // Core Subjects & Language Subjects
            ['subject_name' => 'Bahasa Melayu', 'short_name' => 'BM', 'type' => 'language', 'stream_id' => 1],
            ['subject_name' => 'English', 'short_name' => 'BI', 'type' => 'language', 'stream_id' => 1],

            // Core Subjects
            ['subject_name' => 'Mathematics', 'short_name' => 'MT', 'type' => 'core', 'stream_id' => 1],
            ['subject_name' => 'History', 'short_name' => 'SEJ', 'type' => 'core', 'stream_id' => 1],

            // Language Subjects
            ['subject_name' => 'Mandarin', 'short_name' => 'BC', 'type' => 'language', 'stream_id' => 4],
            ['subject_name' => 'Japanese', 'short_name' => 'BJ', 'type' => 'language', 'stream_id' => 4],
            ['subject_name' => 'Arabic', 'short_name' => 'BA', 'type' => 'language', 'stream_id' => 4],

            // Science Subjects
            ['subject_name' => 'Chemistry', 'short_name' => 'CHEM', 'stream_id' => 2, 'type' => 'science'],
            ['subject_name' => 'Physics', 'short_name' => 'PHY', 'stream_id' => 2, 'type' => 'science'],
            ['subject_name' => 'Biology', 'short_name' => 'BIO', 'stream_id' => 2, 'type' => 'science'],
            ['subject_name' => 'Additional Mathematics', 'short_name' => 'AddMath', 'stream_id' => 2, 'type' => 'science'],

            // Non-Science Subjects
            ['subject_name' => 'Science', 'short_name' => 'SCI', 'stream_id' => 3, 'type' => 'non-science'],
            ['subject_name' => 'Geography', 'short_name' => 'GEO', 'stream_id' => 3, 'type' => 'non-science'],
            ['subject_name' => 'Principles of Accounts', 'short_name' => 'PA', 'stream_id' => 3, 'type' => 'non-science'],
            ['subject_name' => 'Economics', 'short_name' => 'ECO', 'stream_id' => 3, 'type' => 'non-science'],
            ['subject_name' => 'Business', 'short_name' => 'BUS', 'stream_id' => 3, 'type' => 'non-science'],
            ['subject_name' => 'Visual Arts Education', 'short_name' => 'PS', 'stream_id' => 3, 'type' => 'non-science'],

            // Religion Based Subjects
            ['subject_name' => 'Islamic Studies', 'short_name' => 'PI', 'type' => 'religious', 'stream_id' => 1],
            ['subject_name' => 'Moral', 'short_name' => 'PM', 'type' => 'religious', 'stream_id' => 1],

            // Optional Subjects
            ['subject_name' => 'Computer Science', 'short_name' => 'CS', 'type' => 'optional', 'stream_id' => 4],
            ['subject_name' => 'Reka Cipta', 'short_name' => 'RC', 'type' => 'optional', 'stream_id' => 4],
            ['subject_name' => 'Pertanian', 'short_name' => 'PT', 'type' => 'optional', 'stream_id' => 4],
            ['subject_name' => 'Sport Science', 'short_name' => 'SS', 'type' => 'optional', 'stream_id' => 4],
        ];

        foreach ($subjects as $subject) {
            Subject::create($subject);
        }
    }
}
