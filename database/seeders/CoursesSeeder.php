<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class CoursesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $courses = [
            [
                'id' => 1,
                'course_name' => 'Bachelor Of Visual Arts Technology With Honours',
                'institution_name' => 'Universiti Malaysia Sabah',
                'course_level' => 'Bachelor',
                'faculty_name' => 'ASTiF',
                'domain_id' => 1,
                'description' => null,
                'created_at' => '2025-01-19 04:59:09',
                'updated_at' => '2025-01-19 04:59:09'
            ],
            [
                'id' => 2,
                'course_name' => 'Bachelor Of Arts  With Honours (Music Studies)',
                'institution_name' => 'Universiti Malaysia Sabah',
                'course_level' => 'Bachelor',
                'faculty_name' => 'ASTiF',
                'domain_id' => 1,
                'description' => null,
                'created_at' => '2025-01-19 04:59:09',
                'updated_at' => '2025-01-19 04:59:09'
            ],
            [
                'id' => 5,
                'course_name' => 'Bachelor Of Usuluddin With Honours',
                'institution_name' => 'Universiti Malaysia Sabah',
                'course_level' => 'Bachelor',
                'faculty_name' => 'FIS',
                'domain_id' => 2,
                'description' => null,
                'created_at' => '2025-01-19 04:59:09',
                'updated_at' => '2025-01-19 04:59:09'
            ],
            [
                'id' => 6,
                'course_name' => 'Bachelor In Islamic Studies With Honour',
                'institution_name' => 'Universiti Malaysia Sabah',
                'course_level' => 'Bachelor',
                'faculty_name' => 'FIS',
                'domain_id' => 2,
                'description' => null,
                'created_at' => '2025-01-19 04:59:09',
                'updated_at' => '2025-01-19 04:59:09'
            ],
            [
                'id' => 7,
                'course_name' => 'Bachelor Of International Marketing With Honours',
                'institution_name' => 'Universiti Malaysia Sabah',
                'course_level' => 'Bachelor',
                'faculty_name' => 'FKAL',
                'domain_id' => 3,
                'description' => null,
                'created_at' => '2025-01-19 04:59:09',
                'updated_at' => '2025-01-19 04:59:09'
            ],
            // ... existing code up to course ID 7 ...
            [
                'id' => 8,
                'course_name' => 'Bachelor Of International Business (International Finance) With Honours',
                'institution_name' => 'Universiti Malaysia Sabah',
                'course_level' => 'Bachelor',
                'faculty_name' => 'FKAL',
                'domain_id' => 3,
                'description' => null,
                'created_at' => '2025-01-19 04:59:09',
                'updated_at' => '2025-01-19 04:59:09'
            ],
            [
                'id' => 9,
                'course_name' => 'Bachelor Of International Finance (International And Offshore Banking) With Honours',
                'institution_name' => 'Universiti Malaysia Sabah',
                'course_level' => 'Bachelor',
                'faculty_name' => 'FKAL',
                'domain_id' => 3,
                'description' => null,
                'created_at' => '2025-01-19 04:59:09',
                'updated_at' => '2025-01-19 04:59:09'
            ],
            [
                'id' => 10,
                'course_name' => 'Bachelor Of International Finance (International Financial Economics) With Honours',
                'institution_name' => 'Universiti Malaysia Sabah',
                'course_level' => 'Bachelor',
                'faculty_name' => 'FKAL',
                'domain_id' => 3,
                'description' => null,
                'created_at' => '2025-01-19 04:59:09',
                'updated_at' => '2025-01-19 04:59:09'
            ],
            [
                'id' => 11,
                'course_name' => 'Bachelor Of Islamic Finance With Honours',
                'institution_name' => 'Universiti Malaysia Sabah',
                'course_level' => 'Bachelor',
                'faculty_name' => 'FKAL',
                'domain_id' => 3,
                'description' => null,
                'created_at' => '2025-01-19 04:59:09',
                'updated_at' => '2025-01-19 04:59:09'
            ],
            [
                'id' => 12,
                'course_name' => 'Bachelor Of Computer Science With Honours (Software Engineering)',
                'institution_name' => 'Universiti Malaysia Sabah',
                'course_level' => 'Bachelor',
                'faculty_name' => 'FKI',
                'domain_id' => 4,
                'description' => null,
                'created_at' => '2025-01-19 04:59:09',
                'updated_at' => '2025-01-19 04:59:09'
            ],
            [
                'id' => 13,
                'course_name' => 'Bachelor Of Computer Science With Honours (Network Engineering)',
                'institution_name' => 'Universiti Malaysia Sabah',
                'course_level' => 'Bachelor',
                'faculty_name' => 'FKI',
                'domain_id' => 4,
                'description' => null,
                'created_at' => '2025-01-19 04:59:09',
                'updated_at' => '2025-01-19 04:59:09'
            ],
            [
                'id' => 14,
                'course_name' => 'Bachelor Of Science With Honours (Multimedia Technology)',
                'institution_name' => 'Universiti Malaysia Sabah',
                'course_level' => 'Bachelor',
                'faculty_name' => 'FKI',
                'domain_id' => 4,
                'description' => null,
                'created_at' => '2025-01-19 04:59:09',
                'updated_at' => '2025-01-19 04:59:09'
            ],
            [
                'id' => 15,
                'course_name' => 'Bachelor Of Information Technology (Business Computing )With Honours',
                'institution_name' => 'Universiti Malaysia Sabah',
                'course_level' => 'Bachelor',
                'faculty_name' => 'FKI',
                'domain_id' => 4,
                'description' => null,
                'created_at' => '2025-01-19 04:59:09',
                'updated_at' => '2025-01-19 04:59:09'
            ],
            [
                'id' => 16,
                'course_name' => 'Bachelor Degree In Computer Science (Data Science) With Honours',
                'institution_name' => 'Universiti Malaysia Sabah',
                'course_level' => 'Bachelor',
                'faculty_name' => 'FKI',
                'domain_id' => 4,
                'description' => null,
                'created_at' => '2025-01-19 04:59:09',
                'updated_at' => '2025-01-19 04:59:09'
            ],
            [
                'id' => 17,
                'course_name' => 'Diploma In Process Engineering (Oil And Gas Operations)',
                'institution_name' => 'Universiti Malaysia Sabah',
                'course_level' => 'Diploma',
                'faculty_name' => 'FKJ',
                'domain_id' => 5,
                'description' => null,
                'created_at' => '2025-01-19 04:59:09',
                'updated_at' => '2025-01-19 04:59:09'
            ],
            [
                'id' => 18,
                'course_name' => 'Bachelor Of Mechanical Engineering With Honours',
                'institution_name' => 'Universiti Malaysia Sabah',
                'course_level' => 'Bachelor',
                'faculty_name' => 'FKJ',
                'domain_id' => 5,
                'description' => null,
                'created_at' => '2025-01-19 04:59:09',
                'updated_at' => '2025-01-19 04:59:09'
            ],
            [
                'id' => 19,
                'course_name' => 'Bachelor Of Electrical And Electronics Engineering With Honours',
                'institution_name' => 'Universiti Malaysia Sabah',
                'course_level' => 'Bachelor',
                'faculty_name' => 'FKJ',
                'domain_id' => 5,
                'description' => null,
                'created_at' => '2025-01-19 04:59:09',
                'updated_at' => '2025-01-19 04:59:09'
            ],
            [
                'id' => 20,
                'course_name' => 'Bachelor Of Electronic Engineering (Computer) With Honours',
                'institution_name' => 'Universiti Malaysia Sabah',
                'course_level' => 'Bachelor',
                'faculty_name' => 'FKJ',
                'domain_id' => 5,
                'description' => null,
                'created_at' => '2025-01-19 04:59:09',
                'updated_at' => '2025-01-19 04:59:09'
            ],
            [
                'id' => 21,
                'course_name' => 'Bachelor Of Chemical Engineering With Honours',
                'institution_name' => 'Universiti Malaysia Sabah',
                'course_level' => 'Bachelor',
                'faculty_name' => 'FKJ',
                'domain_id' => 5,
                'description' => null,
                'created_at' => '2025-01-19 04:59:09',
                'updated_at' => '2025-01-19 04:59:09'
            ],
            [
                'id' => 22,
                'course_name' => 'Bachelor Of Oil And Gas Engineering With Honours',
                'institution_name' => 'Universiti Malaysia Sabah',
                'course_level' => 'Bachelor',
                'faculty_name' => 'FKJ',
                'domain_id' => 5,
                'description' => null,
                'created_at' => '2025-01-19 04:59:09',
                'updated_at' => '2025-01-19 04:59:09'
            ],
            [
                'id' => 23,
                'course_name' => 'Bachelor Of Civil Engineering With Honours',
                'institution_name' => 'Universiti Malaysia Sabah',
                'course_level' => 'Bachelor',
                'faculty_name' => 'FKJ',
                'domain_id' => 5,
                'description' => null,
                'created_at' => '2025-01-19 04:59:09',
                'updated_at' => '2025-01-19 04:59:09'
            ],
            [
                'id' => 24,
                'course_name' => 'Bachelor Of Economics With Honours (Planning And Development Economics)',
                'institution_name' => 'Universiti Malaysia Sabah',
                'course_level' => 'Bachelor',
                'faculty_name' => 'FPEP',
                'domain_id' => 7,
                'description' => null,
                'created_at' => '2025-01-19 04:59:09',
                'updated_at' => '2025-01-19 04:59:09'
            ],
            [
                'id' => 25,
                'course_name' => 'Bachelor Of Economics With Honours (Financial Economics)',
                'institution_name' => 'Universiti Malaysia Sabah',
                'course_level' => 'Bachelor',
                'faculty_name' => 'FPEP',
                'domain_id' => 7,
                'description' => null,
                'created_at' => '2025-01-19 04:59:09',
                'updated_at' => '2025-01-19 04:59:09'
            ],
            [
                'id' => 26,
                'course_name' => 'Bachelor Of Economics With Honours (Human Resource Economics)',
                'institution_name' => 'Universiti Malaysia Sabah',
                'course_level' => 'Bachelor',
                'faculty_name' => 'FPEP',
                'domain_id' => 7,
                'description' => null,
                'created_at' => '2025-01-19 04:59:09',
                'updated_at' => '2025-01-19 04:59:09'
            ],
            [
                'id' => 27,
                'course_name' => 'Bachelor Of Business With Honours (Marketing)',
                'institution_name' => 'Universiti Malaysia Sabah',
                'course_level' => 'Bachelor',
                'faculty_name' => 'FPEP',
                'domain_id' => 7,
                'description' => null,
                'created_at' => '2025-01-19 04:59:09',
                'updated_at' => '2025-01-19 04:59:09'
            ],
            [
                'id' => 28,
                'course_name' => 'Bachelor Of Business With Honours (Financial Management And Banking)',
                'institution_name' => 'Universiti Malaysia Sabah',
                'course_level' => 'Bachelor',
                'faculty_name' => 'FPEP',
                'domain_id' => 7,
                'description' => null,
                'created_at' => '2025-01-19 04:59:09',
                'updated_at' => '2025-01-19 04:59:09'
            ],
            [
                'id' => 29,
                'course_name' => 'Bachelor Of Accounting With Honours',
                'institution_name' => 'Universiti Malaysia Sabah',
                'course_level' => 'Bachelor',
                'faculty_name' => 'FPEP',
                'domain_id' => 7,
                'description' => null,
                'created_at' => '2025-01-19 04:59:09',
                'updated_at' => '2025-01-19 04:59:09'
            ],
            [
                'id' => 30,
                'course_name' => 'Bachelor Of Business With Honours (Entrepreneurship)',
                'institution_name' => 'Universiti Malaysia Sabah',
                'course_level' => 'Bachelor',
                'faculty_name' => 'FPEP',
                'domain_id' => 7,
                'description' => null,
                'created_at' => '2025-01-19 04:59:09',
                'updated_at' => '2025-01-19 04:59:09'
            ],
            [
                'id' => 31,
                'course_name' => 'Bachelor Of Business With Honours (International Business)',
                'institution_name' => 'Universiti Malaysia Sabah',
                'course_level' => 'Bachelor',
                'faculty_name' => 'FPEP',
                'domain_id' => 7,
                'description' => null,
                'created_at' => '2025-01-19 04:59:09',
                'updated_at' => '2025-01-19 04:59:09'
            ],
            [
                'id' => 32,
                'course_name' => 'Bachelor Of Business With Honours (Hotel Management)',
                'institution_name' => 'Universiti Malaysia Sabah',
                'course_level' => 'Bachelor',
                'faculty_name' => 'FPEP',
                'domain_id' => 7,
                'description' => null,
                'created_at' => '2025-01-19 04:59:09',
                'updated_at' => '2025-01-19 04:59:09'
            ],
            [
                'id' => 33,
                'course_name' => 'Bachelor Of Business With Honours (Tourism Management)',
                'institution_name' => 'Universiti Malaysia Sabah',
                'course_level' => 'Bachelor',
                'faculty_name' => 'FPEP',
                'domain_id' => 7,
                'description' => null,
                'created_at' => '2025-01-19 04:59:09',
                'updated_at' => '2025-01-19 04:59:09'
            ],
            [
                'id' => 34,
                'course_name' => 'Bachelor Of Psychology With Honours (Industrial And Organisational Psychology)',
                'institution_name' => 'Universiti Malaysia Sabah',
                'course_level' => 'Bachelor',
                'faculty_name' => 'FPKS',
                'domain_id' => 8,
                'description' => null,
                'created_at' => '2025-01-19 04:59:09',
                'updated_at' => '2025-01-19 04:59:09'
            ],
            [
                'id' => 35,
                'course_name' => 'Bachelor Of Psychology With Honours (Youth And Community Development)',
                'institution_name' => 'Universiti Malaysia Sabah',
                'course_level' => 'Bachelor',
                'faculty_name' => 'FPKS',
                'domain_id' => 8,
                'description' => null,
                'created_at' => '2025-01-19 04:59:09',
                'updated_at' => '2025-01-19 04:59:09'
            ],
            [
                'id' => 36,
                'course_name' => 'Bachelor Of Psychology With Honours (Counselling Psychology)',
                'institution_name' => 'Universiti Malaysia Sabah',
                'course_level' => 'Bachelor',
                'faculty_name' => 'FPKS',
                'domain_id' => 8,
                'description' => null,
                'created_at' => '2025-01-19 04:59:09',
                'updated_at' => '2025-01-19 04:59:09'
            ],
            [
                'id' => 37,
                'course_name' => 'Bachelor Of Psychology With Honours (Child And Family Psychology)',
                'institution_name' => 'Universiti Malaysia Sabah',
                'course_level' => 'Bachelor',
                'faculty_name' => 'FPKS',
                'domain_id' => 8,
                'description' => null,
                'created_at' => '2025-01-19 04:59:09',
                'updated_at' => '2025-01-19 04:59:09'
            ],
            [
                'id' => 38,
                'course_name' => 'Bachelor Of Social Work  With Honours',
                'institution_name' => 'Universiti Malaysia Sabah',
                'course_level' => 'Bachelor',
                'faculty_name' => 'FPKS',
                'domain_id' => 8,
                'description' => null,
                'created_at' => '2025-01-19 04:59:09',
                'updated_at' => '2025-01-19 04:59:09'
            ],
            [
                'id' => 39,
                'course_name' => 'Bachelor Of Agricultural Science With Honours  (Crop Production )',
                'institution_name' => 'Universiti Malaysia Sabah',
                'course_level' => 'Bachelor',
                'faculty_name' => 'FPL',
                'domain_id' => 9,
                'description' => null,
                'created_at' => '2025-01-19 04:59:09',
                'updated_at' => '2025-01-19 04:59:09'
            ],
            [
                'id' => 40,
                'course_name' => 'Bachelor Of Agricultural Science With Honours  ( Livestock Production )',
                'institution_name' => 'Universiti Malaysia Sabah',
                'course_level' => 'Bachelor',
                'faculty_name' => 'FPL',
                'domain_id' => 9,
                'description' => null,
                'created_at' => '2025-01-19 04:59:09',
                'updated_at' => '2025-01-19 04:59:09'
            ],
            [
                'id' => 41,
                'course_name' => 'Bachelor Of Agricultural Science With Honours (Horticulture And Landscaping)',
                'institution_name' => 'Universiti Malaysia Sabah',
                'course_level' => 'Bachelor',
                'faculty_name' => 'FPL',
                'domain_id' => 9,
                'description' => null,
                'created_at' => '2025-01-19 04:59:09',
                'updated_at' => '2025-01-19 04:59:09'
            ],
            [
                'id' => 42,
                'course_name' => 'Bachelor Of Education With Honours (Education With Tesl)',
                'institution_name' => 'Universiti Malaysia Sabah',
                'course_level' => 'Bachelor',
                'faculty_name' => 'FPPS',
                'domain_id' => 10,
                'description' => null,
                'created_at' => '2025-01-19 04:59:09',
                'updated_at' => '2025-01-19 04:59:09'
            ],
            [
                'id' => 43,
                'course_name' => 'Bachelor Of Early Childhood Education With Honours',
                'institution_name' => 'Universiti Malaysia Sabah',
                'course_level' => 'Bachelor',
                'faculty_name' => 'FPPS',
                'domain_id' => 10,
                'description' => null,
                'created_at' => '2025-01-19 04:59:09',
                'updated_at' => '2025-01-19 04:59:09'
            ],
            [
                'id' => 44,
                'course_name' => 'Bachelor Of Education With Honours (Education With Science)',
                'institution_name' => 'Universiti Malaysia Sabah',
                'course_level' => 'Bachelor',
                'faculty_name' => 'FPPS',
                'domain_id' => 10,
                'description' => null,
                'created_at' => '2025-01-19 04:59:09',
                'updated_at' => '2025-01-19 04:59:09'
            ],
            [
                'id' => 45,
                'course_name' => 'Bachelor Of Education With Honours(History)',
                'institution_name' => 'Universiti Malaysia Sabah',
                'course_level' => 'Bachelor',
                'faculty_name' => 'FPPS',
                'domain_id' => 10,
                'description' => null,
                'created_at' => '2025-01-19 04:59:09',
                'updated_at' => '2025-01-19 04:59:09'
            ],
            [
                'id' => 46,
                'course_name' => 'Bachelor Of Sports Science With Honours',
                'institution_name' => 'Universiti Malaysia Sabah',
                'course_level' => 'Bachelor',
                'faculty_name' => 'FPPS',
                'domain_id' => 10,
                'description' => null,
                'created_at' => '2025-01-19 04:59:09',
                'updated_at' => '2025-01-19 04:59:09'
            ],
            [
                'id' => 47,
                'course_name' => 'Diploma In Nursing',
                'institution_name' => 'Universiti Malaysia Sabah',
                'course_level' => 'Diploma',
                'faculty_name' => 'FPSK',
                'domain_id' => 11,
                'description' => null,
                'created_at' => '2025-01-19 04:59:09',
                'updated_at' => '2025-01-19 04:59:09'
            ],
            [
                'id' => 48,
                'course_name' => 'Bachelor In Nursing Science With Honours',
                'institution_name' => 'Universiti Malaysia Sabah',
                'course_level' => 'Bachelor',
                'faculty_name' => 'FPSK',
                'domain_id' => 11,
                'description' => null,
                'created_at' => '2025-01-19 04:59:09',
                'updated_at' => '2025-01-19 04:59:09'
            ],
            [
                'id' => 49,
                'course_name' => 'Bachelor Of Science With Honours (Conservation Biology)',
                'institution_name' => 'Universiti Malaysia Sabah',
                'course_level' => 'Bachelor',
                'faculty_name' => 'FPT',
                'domain_id' => 12,
                'description' => null,
                'created_at' => '2025-01-19 04:59:09',
                'updated_at' => '2025-01-19 04:59:09'
            ],
            [
                'id' => 50,
                'course_name' => 'Bachelor Of Forestry Science With Honours (Wood Industry And Technology)',
                'institution_name' => 'Universiti Malaysia Sabah',
                'course_level' => 'Bachelor',
                'faculty_name' => 'FPT',
                'domain_id' => 12,
                'description' => null,
                'created_at' => '2025-01-19 04:59:09',
                'updated_at' => '2025-01-19 04:59:09'
            ],
            [
                'id' => 51,
                'course_name' => 'Bachelor Of Forestry Science With Honours (International Tropical Forestry)',
                'institution_name' => 'Universiti Malaysia Sabah',
                'course_level' => 'Bachelor',
                'faculty_name' => 'FPT',
                'domain_id' => 12,
                'description' => null,
                'created_at' => '2025-01-19 04:59:09',
                'updated_at' => '2025-01-19 04:59:09'
            ],
            [
                'id' => 52,
                'course_name' => 'Bachelor Of Forestry Science With Honours (Forest Plantation And Agroforestry)',
                'institution_name' => 'Universiti Malaysia Sabah',
                'course_level' => 'Bachelor',
                'faculty_name' => 'FPT',
                'domain_id' => 12,
                'description' => null,
                'created_at' => '2025-01-19 04:59:09',
                'updated_at' => '2025-01-19 04:59:09'
            ],
            [
                'id' => 53,
                'course_name' => 'Bachelor Of Forestry Science With Honours (Nature Park And Recreation)',
                'institution_name' => 'Universiti Malaysia Sabah',
                'course_level' => 'Bachelor',
                'faculty_name' => 'FPT',
                'domain_id' => 12,
                'description' => null,
                'created_at' => '2025-01-19 04:59:09',
                'updated_at' => '2025-01-19 04:59:09'
            ],
            [
                'id' => 54,
                'course_name' => 'Bachelor Of Food Science With Honours (Food Service)',
                'institution_name' => 'Universiti Malaysia Sabah',
                'course_level' => 'Bachelor',
                'faculty_name' => 'FSMP',
                'domain_id' => 13,
                'description' => null,
                'created_at' => '2025-01-19 04:59:09',
                'updated_at' => '2025-01-19 04:59:09'
            ],
            [
                'id' => 55,
                'course_name' => 'Bachelor Of Food Science With Honours (Food Science And Nutrition)',
                'institution_name' => 'Universiti Malaysia Sabah',
                'course_level' => 'Bachelor',
                'faculty_name' => 'FSMP',
                'domain_id' => 13,
                'description' => null,
                'created_at' => '2025-01-19 04:59:09',
                'updated_at' => '2025-01-19 04:59:09'
            ],
            [
                'id' => 56,
                'course_name' => 'Bachelor Of Nutrition With Honours',
                'institution_name' => 'Universiti Malaysia Sabah',
                'course_level' => 'Bachelor',
                'faculty_name' => 'FSMP',
                'domain_id' => 13,
                'description' => null,
                'created_at' => '2025-01-19 04:59:09',
                'updated_at' => '2025-01-19 04:59:09'
            ],
            [
                'id' => 57,
                'course_name' => 'Bachelor Of Food Science With Honours (Food Technology And Bioprocessing)',
                'institution_name' => 'Universiti Malaysia Sabah',
                'course_level' => 'Bachelor',
                'faculty_name' => 'FSMP',
                'domain_id' => 13,
                'description' => null,
                'created_at' => '2025-01-19 04:59:09',
                'updated_at' => '2025-01-19 04:59:09'
            ],
            [
                'id' => 58,
                'course_name' => 'Bachelor Of Science With Honours (Environmental Science)',
                'institution_name' => 'Universiti Malaysia Sabah',
                'course_level' => 'Bachelor',
                'faculty_name' => 'FSSA',
                'domain_id' => 14,
                'description' => null,
                'created_at' => '2025-01-19 04:59:09',
                'updated_at' => '2025-01-19 04:59:09'
            ],
            [
                'id' => 59,
                'course_name' => 'Bachelor Of Science With Honors (Industrial Physics)',
                'institution_name' => 'Universiti Malaysia Sabah',
                'course_level' => 'Bachelor',
                'faculty_name' => 'FSSA',
                'domain_id' => 14,
                'description' => null,
                'created_at' => '2025-01-19 04:59:09',
                'updated_at' => '2025-01-19 04:59:09'
            ],
            [
                'id' => 60,
                'course_name' => 'Bachelor Of Science With Honours (Geology)',
                'institution_name' => 'Universiti Malaysia Sabah',
                'course_level' => 'Bachelor',
                'faculty_name' => 'FSSA',
                'domain_id' => 14,
                'description' => null,
                'created_at' => '2025-01-19 04:59:09',
                'updated_at' => '2025-01-19 04:59:09'
            ],
            [
                'id' => 61,
                'course_name' => 'Bachelor Of Science With Honours (Marine Science)',
                'institution_name' => 'Universiti Malaysia Sabah',
                'course_level' => 'Bachelor',
                'faculty_name' => 'FSSA',
                'domain_id' => 14,
                'description' => null,
                'created_at' => '2025-01-19 04:59:09',
                'updated_at' => '2025-01-19 04:59:09'
            ],
            [
                'id' => 62,
                'course_name' => 'Bachelor Of Science With Honours (Mathematics With Economics)',
                'institution_name' => 'Universiti Malaysia Sabah',
                'course_level' => 'Bachelor',
                'faculty_name' => 'FSSA',
                'domain_id' => 14,
                'description' => null,
                'created_at' => '2025-01-19 04:59:09',
                'updated_at' => '2025-01-19 04:59:09'
            ],
            [
                'id' => 63,
                'course_name' => 'Bachelor Of Science With Honours (Mathematics With Computer Graphics)',
                'institution_name' => 'Universiti Malaysia Sabah',
                'course_level' => 'Bachelor',
                'faculty_name' => 'FSSA',
                'domain_id' => 14,
                'description' => null,
                'created_at' => '2025-01-19 04:59:09',
                'updated_at' => '2025-01-19 04:59:09'
            ],
            [
                'id' => 64,
                'course_name' => 'Foundation In Social Science',
                'institution_name' => 'Universiti Malaysia Sabah',
                'course_level' => 'Foundation',
                'faculty_name' => 'PPST',
                'domain_id' => 15,
                'description' => null,
                'created_at' => '2025-01-19 04:59:09',
                'updated_at' => '2025-01-19 04:59:09'
            ],
            [
                'id' => 65,
                'course_name' => 'Bachelor Of Science With Honours (Biotechnology)',
                'institution_name' => 'Universiti Malaysia Sabah',
                'course_level' => 'Bachelor',
                'faculty_name' => 'FSSA',
                'domain_id' => 14,
                'description' => null,
                'created_at' => '2025-01-19 04:59:09',
                'updated_at' => '2025-01-19 04:59:09'
            ],
            [
                'id' => 66,
                'course_name' => 'Bachelor Of Science With Honours (Industrial Chemistry)',
                'institution_name' => 'Universiti Malaysia Sabah',
                'course_level' => 'Bachelor',
                'faculty_name' => 'FSSA',
                'domain_id' => 14,
                'description' => null,
                'created_at' => '2025-01-19 04:59:09',
                'updated_at' => '2025-01-19 04:59:09'
            ],
            [
                'id' => 67,
                'course_name' => 'Bachelor Of Science With Honours (Aquaculture)',
                'institution_name' => 'Universiti Malaysia Sabah',
                'course_level' => 'Bachelor',
                'faculty_name' => 'FSSA',
                'domain_id' => 14,
                'description' => null,
                'created_at' => '2025-01-19 04:59:09',
                'updated_at' => '2025-01-19 04:59:09'
            ],
            [
                'id' => 68,
                'course_name' => 'Bachelor Of Social Science With Honours (History)',
                'institution_name' => 'Universiti Malaysia Sabah',
                'course_level' => 'Bachelor',
                'faculty_name' => 'FSSK',
                'domain_id' => 15,
                'description' => null,
                'created_at' => '2025-01-19 04:59:09',
                'updated_at' => '2025-01-19 04:59:09'
            ],
            [
                'id' => 69,
                'course_name' => 'Bachelor Of Social Science With Honours (Sociology And Social Anthropology)',
                'institution_name' => 'Universiti Malaysia Sabah',
                'course_level' => 'Bachelor',
                'faculty_name' => 'FSSK',
                'domain_id' => 15,
                'description' => null,
                'created_at' => '2025-01-19 04:59:09',
                'updated_at' => '2025-01-19 04:59:09'
            ],
            [
                'id' => 70,
                'course_name' => 'Bachelor Of Social Science With Honours (International Relations)',
                'institution_name' => 'Universiti Malaysia Sabah',
                'course_level' => 'Bachelor',
                'faculty_name' => 'FSSK',
                'domain_id' => 15,
                'description' => null,
                'created_at' => '2025-01-19 04:59:09',
                'updated_at' => '2025-01-19 04:59:09'
            ],
            [
                'id' => 71,
                'course_name' => 'Bachelor Of Social Science With Honours (Communications)',
                'institution_name' => 'Universiti Malaysia Sabah',
                'course_level' => 'Bachelor',
                'faculty_name' => 'FSSK',
                'domain_id' => 15,
                'description' => null,
                'created_at' => '2025-01-19 04:59:09',
                'updated_at' => '2025-01-19 04:59:09'
            ],
            [
                'id' => 72,
                'course_name' => 'Bachelor Of Social Science With Honours (Industrial Relations)',
                'institution_name' => 'Universiti Malaysia Sabah',
                'course_level' => 'Bachelor',
                'faculty_name' => 'FSSK',
                'domain_id' => 15,
                'description' => null,
                'created_at' => '2025-01-19 04:59:09',
                'updated_at' => '2025-01-19 04:59:09'
            ],
            [
                'id' => 73,
                'course_name' => 'Bachelor Of Social Science With Honours (Geography)',
                'institution_name' => 'Universiti Malaysia Sabah',
                'course_level' => 'Bachelor',
                'faculty_name' => 'FSSK',
                'domain_id' => 15,
                'description' => null,
                'created_at' => '2025-01-19 04:59:09',
                'updated_at' => '2025-01-19 04:59:09'
            ],
            [
                'id' => 74,
                'course_name' => 'Foundation In Science',
                'institution_name' => 'Universiti Malaysia Sabah',
                'course_level' => 'Foundation',
                'faculty_name' => 'PPST',
                'domain_id' => 14,
                'description' => null,
                'created_at' => '2025-01-19 04:59:09',
                'updated_at' => '2025-01-19 04:59:09'
            ],
            [
                'id' => 75,
                'course_name' => 'Foundation In Information Technology',
                'institution_name' => 'Universiti Malaysia Sabah',
                'course_level' => 'Foundation',
                'faculty_name' => 'PPST',
                'domain_id' => 4,
                'description' => null,
                'created_at' => '2025-01-19 04:59:09',
                'updated_at' => '2025-01-19 04:59:09'
            ],
            [
                'id' => 76,
                'course_name' => 'Foundation In Agriscience',
                'institution_name' => 'Universiti Malaysia Sabah',
                'course_level' => 'Foundation',
                'faculty_name' => 'PPST',
                'domain_id' => 9,
                'description' => null,
                'created_at' => '2025-01-19 04:59:09',
                'updated_at' => '2025-01-19 04:59:09'
            ],
            [
                'id' => 77,
                'course_name' => 'Bachelor Of Arts With Honours (Creative Arts)',
                'institution_name' => 'Universiti Malaysia Sabah',
                'course_level' => 'Bachelor',
                'faculty_name' => 'ASTiF',
                'domain_id' => 1,
                'description' => null,
                'created_at' => '2025-01-19 04:59:34',
                'updated_at' => '2025-01-19 04:59:34'
            ],
            [
                'id' => 78,
                'course_name' => 'Bachelor Of Shariah With Honours',
                'institution_name' => 'Universiti Malaysia Sabah',
                'course_level' => 'Bachelor',
                'faculty_name' => 'FIS',
                'domain_id' => 2,
                'description' => null,
                'created_at' => '2025-01-19 04:59:34',
                'updated_at' => '2025-01-19 04:59:34'
            ]
        ];

        foreach ($courses as $course) {
            DB::table('courses')->insert($course);
        }
    }
}
