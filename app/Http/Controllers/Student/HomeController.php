<?php

namespace App\Http\Controllers\Student;

use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Http\Resources\RecommendedRoadmapResource;
use Illuminate\Support\Facades\Auth;
use App\Services\RoadmapRecommendationService;


class HomeController extends Controller
{
    protected $recommendationService;

    public function __construct(
        RoadmapRecommendationService $recommendationService,
    )
    {
        $this->recommendationService = $recommendationService;
    }
    public function index(){
        $recommendations = $this->recommendationService->recommendationProcess(null, null, null)->take(3);

        return Inertia::render('Student/Home', [
            'recommendations' => RecommendedRoadmapResource::collection($recommendations),
            'user' => Auth::user(),
        ]);
    }
}
