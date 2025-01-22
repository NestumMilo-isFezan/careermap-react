<?php

namespace App\Http\Controllers\Student;

use Inertia\Inertia;
use App\Models\SoftSkill;
use App\Models\Curriculum;
use Illuminate\Http\Request;
use App\Models\CurriculumPoint;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Storage;
use App\Http\Resources\Curriculum\CurriculumResource;

class CurricularExchangeController extends Controller
{
    public function index()
    {
        $query = Curriculum::query()
            ->where('student_id', request()->user()->student->id);

        if (request('name')) {
            $query->where('name', 'like', '%' . request('name') . '%');
        }

        if (request('status')) {
            $query->where('status', request('status'));
        }

        if (request('level')) {
            $query->where('level', request('level'));
        }

        $points = CurriculumPoint::where('student_id', request()->user()->student->id)->get();

        // Transform the points data to group by soft skill and sort by points
        $skillPoints = SoftSkill::all()->map(function ($softSkill) use ($points) {
            $totalPoints = $points->where('soft_skill_id', $softSkill->id)
                ->sum('score');

            return [
                'name' => $softSkill->name,
                'description' => $softSkill->description,
                'points' => $totalPoints
            ];
        })
        ->sortByDesc('points')
        ->values()
        ->all();

        $exchangePoints = [
            'value' => $skillPoints
        ];

        $curriculums = $query->paginate(12);

        return Inertia::render('Student/Curricular/Index',[
            'curriculums' => CurriculumResource::collection($curriculums),
            'queryParams' => request()->query() ?: null,
            'skillPoints' => $exchangePoints,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'level' => 'required|string|in:school,district,state,national,international',
            'document' => 'required|file|mimes:pdf,doc,docx|max:10240',
            'type' => 'required|string|in:certificates,activities',
        ]);


        $curriculum = new Curriculum([
            'name' => $validated['name'],
            'description' => $validated['description'],
            'level' => $validated['level'],
            'status' => 'pending',
            'type' => $validated['type'],
            'student_id' => $request->user()->student->id,
        ]);

        if ($request->hasFile('document')) {
            $curriculum->saveFile($request->file('document'));
        }

        $curriculum->save();

        return to_route('student.curricular.index')->with('success', 'Curricular created successfully.');
    }

    public function update(Request $request, $id)
    {
        $curriculum = Curriculum::findOrFail($id);

        // Check if the curriculum belongs to the authenticated student
        if ($curriculum->student_id !== $request->user()->student->id) {
            abort(403);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'level' => 'required|string|in:school,district,state,national,international',
            'document' => 'nullable|file|mimes:pdf,doc,docx|max:10240',
            'type' => 'required|string|in:certificates,activities',
        ]);

        $curriculum->fill([
            'name' => $validated['name'],
            'description' => $validated['description'],
            'level' => $validated['level'],
            'type' => $validated['type'],
        ]);

        if ($request->hasFile('document')) {
            // Delete old document if exists
            if ($curriculum->document) {
                Storage::disk('public')->delete($curriculum->document);
            }
            $curriculum->saveFile($request->file('document'));
        }

        $curriculum->save();

        return to_route('student.curricular.index')->with('success', 'Curricular updated successfully.');
    }
}
