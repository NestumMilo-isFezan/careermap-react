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
            // Core Subjects
            ['subject_name' => 'Bahasa Melayu', 'short_name' => 'BM', 'type' => 'core', 'stream_id' => 1],
            ['subject_name' => 'English', 'short_name' => 'BI', 'type' => 'core', 'stream_id' => 1],
            ['subject_name' => 'Mathematics', 'short_name' => 'MT', 'type' => 'core', 'stream_id' => 1],
            ['subject_name' => 'History', 'short_name' => 'SEJ', 'type' => 'core', 'stream_id' => 1],

            // Science Subjects
            ['subject_name' => 'Chemistry', 'short_name' => 'CHEM', 'stream_id' => 2, 'type' => 'science'],
            ['subject_name' => 'Physics', 'short_name' => 'PHY', 'stream_id' => 2, 'type' => 'science'],
            ['subject_name' => 'Biology', 'short_name' => 'BIO', 'stream_id' => 2, 'type' => 'science'],
            ['subject_name' => 'Additional Mathematics', 'short_name' => 'AddMath', 'stream_id' => 2, 'type' => 'science'],

            // Arts Subjects
            ['subject_name' => 'Geography', 'short_name' => 'GEO', 'stream_id' => 3, 'type' => 'arts'],
            ['subject_name' => 'Accounting', 'short_name' => 'ACC', 'stream_id' => 3, 'type' => 'arts'],
            ['subject_name' => 'Economics', 'short_name' => 'EKON', 'stream_id' => 3, 'type' => 'arts'],
            ['subject_name' => 'Business Studies', 'short_name' => 'PER', 'stream_id' => 3, 'type' => 'arts'],

            // Religion Based Subjects
            ['subject_name' => 'Pendidikan Islam', 'short_name' => 'PI', 'type' => 'religious', 'stream_id' => 1],
            ['subject_name' => 'Pendidikan Moral', 'short_name' => 'PM', 'type' => 'religious', 'stream_id' => 1],

            // Optional Subjects
            ['subject_name' => 'Information and Communication Technology', 'short_name' => 'ICT', 'type' => 'optional', 'stream_id' => 4],
            ['subject_name' => 'Reka Cipta', 'short_name' => 'RC', 'type' => 'optional', 'stream_id' => 4],
        ];

        foreach ($subjects as $subject) {
            Subject::create($subject);
        }
    }
}
