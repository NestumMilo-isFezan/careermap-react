<?php

namespace App\Services;

use App\Models\Course;

class CoursesDataReconcilationServices{

    public function reconcilation($apiCourse){
        $localCourse = Course::all();

        foreach ($apiCourse as $course) {
            $manager = $localCourse->where('course_code', $course['course_code'])->first();

            if($manager === null){
                Course::create($course);
            }
            else{
                $changes = [];
                if ($manager->course_name !== $course['course_name']) {
                    $changes['course_name'] = $course['course_name'];
                }
                if($manager->faculty_name !== $course['faculty_name']){
                    $changes['faculty_name'] = $course['faculty_name'];
                }

                if (!empty($changes)) {
                    $manager->update($changes);
                }
            }
        }

        $apiCourseManager = collect($apiCourse)->pluck('course_code');
        $localCourse->whereNotIn('course_code', $apiCourseManager)->each(fn($course) => $course->delete());


    }


}
