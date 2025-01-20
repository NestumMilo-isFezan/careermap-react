<?php

namespace App\Http\Controllers\Student;

use App\Models\News;
use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use App\Services\RoadmapRecommendationService;
use App\Http\Resources\RecommendedRoadmapResource;
use Illuminate\Support\Str;


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
        $news = News::orderBy('created_at', 'desc')
            ->take(3)
            ->get()
            ->map(function ($item) {
                return [
                    'title' => $item->title,
                    'description' => Str::limit($item->description, 150),
                    'image' => $item->image ? asset('storage/' . $item->image) : asset('images/default-news.jpg'),
                    'created_at' => $item->created_at->format('Y-m-d H:i:s'),
                ];
            });
        $recommendations = $this->recommendationService->recommendationProcess(null, null, null)->take(3);

        return Inertia::render('Student/Home', [
            'recommendations' => RecommendedRoadmapResource::collection($recommendations),
            'user' => Auth::user(),
            'news' => $news,
        ]);
    }
}
