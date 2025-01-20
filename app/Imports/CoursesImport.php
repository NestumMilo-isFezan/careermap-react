<?php

namespace App\Imports;

use App\Models\Course;
use Illuminate\Support\Str;
use Maatwebsite\Excel\Concerns\ToArray;
use Maatwebsite\Excel\Concerns\WithHeadingRow;

class CoursesImport implements ToArray, WithHeadingRow
{
    public $data = [];

    public function array(array $rows)
    {
        foreach ($rows as $row) {
            $courseName = Str::title($row['course_name']);

            // Check if course doesn't exist already
            if (!Course::where('course_name', $courseName)->exists()) {
                $this->data[] = [
                    'course_name' => $courseName,
                    'faculty_name' => $row['faculty'],
                    'domain_id' => $row['field_of_study'] ?? null,
                    'course_level' => $row['level'],
                    'institution_name' => $row['institution_name'],
                    'description' => $row['description'] ?? null,
                ];
            }
        }
    }
}
