<?php

namespace App\Http\Controllers\Teacher;

use App\Models\User;
use Inertia\Inertia;
use App\Models\Student;
use App\Models\Classroom;
use App\Models\SoftSkill;
use App\Models\Curriculum;
use Illuminate\Http\Request;
use App\Models\CurriculumPoint;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use App\Http\Resources\StudentResource;
use App\Http\Resources\StudentCurricularResource;

class CurricularExchangeController extends Controller
{
    public function index()
    {
        $user = User::find(request()->user()->id);
        $classroom = Classroom::where('teacher_id', $user->teacher->id)->first();
        $user = [
            'name' => $user->name,
            'email' => $user->email,
            'phone' => $user->profile->phone,
            'image' => $user->image ? asset('storage/'.$user->image) : null,
        ];
        $classroom = [
            'name' => $classroom->name,
            'students' => StudentCurricularResource::collection(Student::where('classroom_id', $classroom->id)->get()),
        ];
        $softskills = SoftSkill::all()->map(function ($softskill) {
            return [
                'id' => $softskill->id,
                'name' => $softskill->name,
                'description' => $softskill->description,
            ];
        });
        return Inertia::render('Teacher/Curricular/Index', [
            'user' => $user,
            'classroom' => $classroom,
            'softskills' => $softskills,
            'message' => [
                'add_success' => session('add_success'),
                'edit_success' => session('edit_success'),
                'delete_success' => session('delete_success'),
                'error' => session('error'),
            ],
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'curriculum_id' => 'required|exists:curriculums,id',
            'softskills' => 'required|array',
            'softskills.*.id' => 'required|exists:soft_skills,id',
            'softskills.*.score' => 'required|integer|min:0|max:100',
        ]);

        try {
            DB::beginTransaction();

            $curriculum = Curriculum::find($request->curriculum_id);

            // Update curriculum status to approved
            $curriculum->update([
                'status' => 'approved',
            ]);

            // Store soft skill scores
            foreach ($request->softskills as $skillData) {
                CurriculumPoint::create([
                    'student_id' => $curriculum->student_id,
                    'curriculum_id' => $curriculum->id,
                    'soft_skill_id' => $skillData['id'],
                    'score' => $skillData['score'],
                ]);
            }

            DB::commit();

            return back()->with('add_success', 'Curriculum assessment has been submitted successfully.');

        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', $e->getMessage());
        }
    }

    public function reject(Request $request)
    {
        $request->validate([
            'curriculum_id' => 'required|exists:curriculums,id',
        ]);

        try {
            DB::beginTransaction();

            $curriculum = Curriculum::find($request->curriculum_id);
            $curriculum->update([
                'status' => 'rejected',
            ]);

            DB::commit();

            return back()->with('delete_success', 'Curriculum has been rejected successfully.');

        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Failed to reject curriculum. Please try again.');
        }
    }

    public function retract(Request $request)
    {
        $request->validate([
            'curriculum_id' => 'required|exists:curriculums,id',
        ]);

        try{
            DB::beginTransaction();

            $curriculum = Curriculum::find($request->curriculum_id);
            $curriculum->update([
                'status' => 'pending',
            ]);

            CurriculumPoint::where('curriculum_id', $curriculum->id)->delete();

            DB::commit();

            return back()->with('edit_success', 'Curriculum has been retracted successfully.');

        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Failed to retract curriculum. Please try again.');
        }
    }
}
