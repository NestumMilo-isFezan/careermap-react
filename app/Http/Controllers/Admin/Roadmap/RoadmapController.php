<?php

namespace App\Http\Controllers\Admin\Roadmap;

use Inertia\Inertia;
use App\Models\Domain;
use App\Models\Persona;
use App\Models\Roadmap;
use App\Models\Subject;
use App\Models\Adaptation;
use Illuminate\Support\Str;
use App\Models\Prerequisite;
use Illuminate\Http\Request;
use App\Models\AdaptationItem;
use App\Models\PrerequisiteItem;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use App\Http\Resources\DomainResource;
use App\Http\Resources\RoadmapResource;
use App\Http\Requests\StoreRoadmapRequest;

class RoadmapController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $domainMap = Domain::all()->map(fn($domain) => [
            'id' => $domain->id,
            'name' => $domain->name,
            'description' => $domain->description
        ])->toArray();

        $query = Roadmap::query();
        if(request('name')){
            $query->where('title', 'like', '%' . request('name') . '%');
        }
        if(request('domain_id')){
            $query->where('domain_id', request('domain_id'));
        }

        $roadmaps = $query->paginate(12);
        return Inertia::render('Admin/Roadmap/Index',[
            // 'roadmaps' => Inertia::defer(function () use ($roadmaps) {
            //     return RoadmapResource::collection($roadmaps);
            // }),
            'roadmaps' => RoadmapResource::collection($roadmaps),
            'domains' => $domainMap,
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
        $domainMap = Domain::all()->map(fn($domain) => [
            'id' => $domain->id,
            'name' => $domain->name,
            'description' => $domain->description
        ])->toArray();
        $subjectMap = Subject::all()->map(fn($subject) => [
            'id' => $subject->id,
            'name' => $subject->subject_name,
            'short_name' => $subject->short_name,
        ])->toArray();
        $personaMap = Persona::all()->map(fn($persona) => [
            'id' => $persona->id,
            'name' => $persona->name,
            'description' => $persona->description
        ])->toArray();
        return Inertia::render('Admin/Roadmap/Create',[
            'domains' => $domainMap,
            'subjects' => $subjectMap,
            'personas' => $personaMap
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreRoadmapRequest $request)
    {
        $validated = $request->validated();

        DB::beginTransaction();
        try {
            $image = $validated['image'];
            $imagePath = '';
            if ($image) {
                $extension = $image->getClientOriginalExtension();
                $imageName = Str::slug($validated['title']) . '.' . $extension;
                $imagePath = $image->storeAs('roadmaps', $imageName, 'public');
            }
            $roadmap = Roadmap::create([
                'title' => $validated['title'],
                'domain_id' => $validated['domain_id'],
                'description' => $validated['description'],
                'image' => $imagePath
            ]);

            $prerequisite = Prerequisite::create([
                'name' => 'Trials SPM',
                'description' => 'This roadmap is recommended for students who is achieved these requirements in Trial SPM',
                'roadmap_id' => $roadmap->id,
            ]);
            $adaptation = Adaptation::create([
                'name' => 'Personalities',
                'description' => 'This roadmap is recommended for students who is achieved these requirements in Personalities',
                'roadmap_id' => $roadmap->id,
            ]);

            foreach ($validated['prerequisite_items'] as $item) {
                $subjectName = Subject::where('id', $item['subject_id'])->first()->subject_name;
                PrerequisiteItem::create([
                    'name' => "Achieve {$item['requirement']} or above in {$subjectName}",
                    'subject_id' => $item['subject_id'] ?? null,
                    'requirement' => $item['requirement'] ?? null,
                    'prerequisite_id' => $prerequisite->id,
                ]);
            }

            foreach ($validated['adaptation_items'] as $item) {
                AdaptationItem::create([
                    'name' => $item['name'] ?? null,
                    'persona_id' => $item['persona_id'] ?? null,
                    'adaptation_id' => $adaptation->id,
                ]);
            }

            DB::commit();
            return redirect()->route('admin.roadmap.index')->with('add_success', 'Roadmap created successfully');
        }
        catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()->with('error', 'Something went wrong');
        }

    }

    /**
     * Display the specified resource.
     */
    public function show(Roadmap $roadmap)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Roadmap $roadmap)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Roadmap $roadmap)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(int $id)
    {
        try {
            Roadmap::findOrFail($id)->delete();
            return redirect()->route('admin.roadmap.index')->with('delete_success', 'Roadmap deleted successfully');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Something went wrong');
        }
    }
}
