<?php

namespace App\Http\Controllers\Admin\Course;

use Inertia\Inertia;
use App\Models\Course;
use App\Models\Domain;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Http\Requests\CourseRequest;
use App\Http\Resources\CourseResource;
use App\Services\CoursesManagementServices;
use App\Services\CoursesDataReconcilationServices;
use Maatwebsite\Excel\Facades\Excel;
use App\Imports\CoursesImport;

class CourseController extends Controller
{

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $domains = Domain::all()->map(function($domain){
            return [
                'id' => $domain->id,
                'name' => $domain->name,
                'description' => $domain->description
            ];
        })->toArray();

        $course = Course::query();
        if(request()->has('name')){
            $course->where('course_name', 'like', '%'.request()->get('name').'%');
        }
        if(request()->has('domain_id')){
            $course->where('domain_id', request()->get('domain_id'));
        }
        $course = $course->orderBy('domain_id', 'asc')->paginate(10);

        return Inertia::render('Admin/Course/Index', [
            'courses' => CourseResource::collection($course),
            'domains' => $domains,
            'queryParams' => request()->query() ?: null,
            'messages' => [
                'add_success' => session('add_success'),
                'update_success' => session('update_success'),
                'delete_success' => session('delete_success'),
                'error' => session('error')
            ]
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
     * Store a single course manually.
     */
    public function store(Request $request)
    {

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
        $course = Course::find($id);
        $course->update($request->all());
        return redirect()->back()->with('update_success', 'Course updated successfully');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $course = Course::find($id);
        $course->delete();
        return redirect()->back()->with('delete_success', 'Course deleted successfully');
    }

    public function import(Request $request)
    {
        $request->validate([
            'courses' => 'required|array',
            'courses.*.course_name' => 'required|string',
            'courses.*.faculty_name' => 'required|string',
            'courses.*.domain_id' => 'required|numeric',
            'courses.*.course_level' => 'required|string',
            'courses.*.institution_name' => 'required|string',
            'courses.*.description' => 'nullable|string',
        ]);

        try {
            foreach ($request->courses as $courseData) {
                Course::create($courseData);
            }

            return redirect()->back()->with('success', 'Courses imported successfully');
        } catch (\Exception $e) {
            return redirect()->back()
                ->with('error', 'Failed to import courses: ' . $e->getMessage())
                ->withErrors(['import' => 'Failed to import courses']);
        }
    }

    public function preview(Request $request)
    {
        $request->validate([
            'file' => 'required|file|mimes:xlsx,xls',
        ]);

        try {
            $import = new CoursesImport();
            Excel::import($import, $request->file('file'));

            return response()->json([
                'courses' => $import->data,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Failed to parse Excel file: ' . $e->getMessage()
            ], 422);
        }
    }
}
