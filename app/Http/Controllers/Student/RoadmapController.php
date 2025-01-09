<?php

namespace App\Http\Controllers\Student;


use Inertia\Inertia;
use App\Models\Domain;
use App\Models\Roadmap;
use App\Models\UserRoadmap;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use App\Http\Resources\RoadmapResource;
use App\Services\RoadmapRecommendationService;
use App\Http\Resources\RecommendedRoadmapResource;

class RoadmapController extends Controller
{
    public function __construct(
        private RoadmapRecommendationService $roadmapRecommendationService
    )
    {
        $this->roadmapRecommendationService = $roadmapRecommendationService;
    }

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
        if(request('recommendation')){
            $sortedRoadmap = $this->roadmapRecommendationService->recommendationProcess(request('recommendation'));
        }
        else{
            $sortedRoadmap = $this->roadmapRecommendationService->recommendationProcess();
        }

        $roadmaps = $query->paginate(12);

        return Inertia::render('Student/Roadmap/Index',[
            'roadmaps' => RecommendedRoadmapResource::collection($sortedRoadmap),
            'domains' => $domainMap,
            'queryParams' => request()->query() ?: null,
        ]);
    }

    public function show($id)
    {
        $userId = Auth::user()->id;
        $hasUserRoadmap = UserRoadmap::where('user_id', $userId)
            ->where('roadmap_id', $id)
            ->exists();

        if ($hasUserRoadmap) {
            $roadmap = Roadmap::with([
                'milestone',
                'milestone.checklists',
                'milestone.checklists.userChecklist' => function($query) use ($userId) {
                    $query->where('user_milestone_id', function($subquery) use ($userId) {
                        $subquery->select('id')
                            ->from('user_milestones')
                            ->where('user_id', $userId)
                            ->limit(1);
                    });
                }
            ])->findOrFail($id);
        } else {
            $roadmap = Roadmap::with([
                'milestone',
                'milestone.checklists'
            ])->findOrFail($id);
        }

        return view('pages.student.roadmap.show', compact('roadmap', 'hasUserRoadmap'));
    }

    public function store(Request $request, $roadmapId){
        try {
            $existingRoadmap = UserRoadmap::where('user_id', Auth::user()->id)->where('roadmap_id', $roadmapId)->first();
            if ($existingRoadmap) {
                return redirect()->back()->with('error', 'Roadmap already exists');
            }
            $this->compatibilityService->processCompatibility($request->user()->id, $roadmapId);
            return redirect()->back()->with('success', 'Roadmap added successfully');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', $e->getMessage());
        }
    }

    public function destroy($roadmapId)
    {
        try {
            $userRoadmap = UserRoadmap::where('user_id', Auth::user()->id)->where('roadmap_id', $roadmapId)->first();
            if (!$userRoadmap) {
                return redirect()->back()->with('error', 'Roadmap not found');
            }
            $userRoadmap->delete();
            return redirect()->back()->with('success', 'Roadmap deleted successfully');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', $e->getMessage());
        }
    }
}
