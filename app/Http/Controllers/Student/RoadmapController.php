<?php

namespace App\Http\Controllers\Student;


use Inertia\Inertia;
use App\Models\Course;
use App\Models\Domain;
use App\Models\Roadmap;
use App\Models\UserRoadmap;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use App\Services\RoadmapRecommendationService;
use App\Http\Resources\RecommendedRoadmapResource;
use App\Http\Resources\Roadmap\ModifiedCourseResource;
use App\Http\Resources\Roadmap\UniversalCourseResource;

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

        $recommendation = request('recommendation');
        $name = request('name');
        $domainId = request('domain_id');
        $favorite = request('favorites');

        $sortedRoadmap = match(true) {
            !empty($name) => $this->roadmapRecommendationService->recommendationProcess(null, $name),
            !empty($domainId) => $this->roadmapRecommendationService->recommendationProcess(null, null, $domainId),
            !empty($recommendation) => $this->roadmapRecommendationService->recommendationProcess($recommendation),
            !empty($favorite) => $this->roadmapRecommendationService->recommendationProcess(null, null, null, $favorite),
            default => $this->roadmapRecommendationService->recommendationProcess()
        };

        return Inertia::render('Student/Roadmap/Index',[
            'roadmaps' => RecommendedRoadmapResource::collection($sortedRoadmap),
            'domains' => $domainMap,
            'queryParams' => request()->query() ?: null,
        ]);
    }

    public function show(int $id)
    {
        //fixed
        $roadmap = $this->roadmapRecommendationService->getRoadmapById($id);

        $institutionName = Course::first()->institution_name;
        $institutionId = strtolower(str_replace(' ', '-', $institutionName));
        $universityCourses = Course::where('domain_id', $roadmap->domain_id)
        ->where('course_level', 'Bachelor')
        ->get();

        $foundationCourses = Course::where('domain_id', $roadmap->domain_id)
        ->where('course_level', 'Foundation')
        ->get();

        $diplomaCourses = Course::where('domain_id', $roadmap->domain_id)
        ->where('course_level', 'Diploma')
        ->get();

        // not fixed, cant access collection
        return response()->json([
            'data' => $roadmap,
            'courses' => [
                'universityCourses' => [
                    'id' => $institutionId,
                    'institution_name' => $institutionName,
                    'courses' => $universityCourses->isEmpty() ? collect() : UniversalCourseResource::collection($universityCourses)
                ],
                'foundationCourse' => [
                    'id' => $institutionId . '-foundation',
                    'institution_name' => $institutionName,
                    'faculty_name' => 'Foundation Programme',
                    'courses' => $foundationCourses->isEmpty() ? null : ModifiedCourseResource::collection($foundationCourses),
                ],
                'diplomaCourse' => [
                    'id' => $institutionId . '-diploma',
                    'institution_name' => $institutionName,
                    'faculty_name' => 'Diploma Programme',
                    'courses' => $diplomaCourses->isEmpty() ? null : ModifiedCourseResource::collection($diplomaCourses),
                ],
            ],
        ]);
    }

    public function store(Request $request)
    {
        UserRoadmap::create([
            'user_id' => $request->user()->id,
            'roadmap_id' => $request->roadmap_id,
        ]);
    }

    public function destroy($id)
    {
        UserRoadmap::where('user_id', Auth::user()  ->id)
            ->where('roadmap_id', $id)
            ->delete();

        return redirect()->back();
    }

    public function unfavorite($id)
    {
        UserRoadmap::where('user_id', Auth::user()->id)
            ->where('roadmap_id', $id)
            ->delete();

        return redirect()->back();
    }
}
