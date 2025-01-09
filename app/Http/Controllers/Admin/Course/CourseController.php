<?php

namespace App\Http\Controllers\Admin\Course;

use App\Models\Course;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Http\Requests\CourseRequest;
use App\Services\CoursesDataReconcilationServices;
use App\Services\CoursesManagementServices;

class CourseController extends Controller
{

    public function __construct(
        protected CoursesManagementServices $coursesManagementServices,
        protected CoursesDataReconcilationServices $coursesDataReconcilationServices
    ){

    }
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $courses = Course::paginate(10);
        return view('pages.admin.course.index', [
            'courses' => $courses
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return view('pages.admin.course.create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $data = $this->coursesManagementServices->getCourseInfoFrom($request->get('institute'));
        Course::where('course_code', 'AC220')->update(['course_name' => 'Computer Science', 'faculty_name' => 'Faculty ICT']);
        Course::create([
            'course_name' => 'Web Engineering',
            'course_code' => 'WEB220',
            'institution_name' => 'UITM',
            'course_level' => 'Undergraduate',
            'faculty_name' => 'Faculty of Information Technology',
        ]);
        $this->coursesDataReconcilationServices->reconcilation($data);

        return redirect()->route('admin.course.index');

    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {

    }
}
