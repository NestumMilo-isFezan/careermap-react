<?php

namespace App\Http\Controllers\Student;


use App\Http\Resources\Roadmap\UniversalCourseResource;
use Inertia\Inertia;
use App\Models\Course;
use App\Models\Domain;
use App\Models\Roadmap;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Services\RoadmapRecommendationService;
use App\Http\Resources\RecommendedRoadmapResource;
use App\Http\Resources\Roadmap\ModifiedCourseResource;

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

        $roadmap = null;

        $query = Roadmap::query();

        $recommendation = request('recommendation');
        $name = request('name');
        $domainId = request('domain_id');

        $sortedRoadmap = match(true) {
            !empty($name) => $this->roadmapRecommendationService->recommendationProcess(null, $name),
            !empty($domainId) => $this->roadmapRecommendationService->recommendationProcess(null, null, $domainId),
            !empty($recommendation) => $this->roadmapRecommendationService->recommendationProcess($recommendation),
            default => $this->roadmapRecommendationService->recommendationProcess()
        };

        $roadmaps = $query->paginate(12);

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
                    'courses' => $universityCourses->isEmpty() ? null : UniversalCourseResource::collection($universityCourses)
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

    public function store(Request $request, $roadmapId)
    {
        //
    }

    public function destroy($roadmapId)
    {
        //
    }
}
