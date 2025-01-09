<?php

namespace App\Http\Controllers\Student;

use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use App\Services\RoadmapCompatibilityService;
use App\Services\RoadmapRecommendationService;


class HomeController extends Controller
{
    protected $recommendationService;
    protected $compatibilityService;

    public function __construct(
    )
    {
    }
    public function index(){

        return Inertia::render('Student/Home', [
        ]);
    }
}
