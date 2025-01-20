<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Rating;
use Illuminate\Http\Request;

class RatingController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string|max:1000',
        ]);

        Rating::create([
            'rating' => $validated['rating'],
            'comment' => $validated['comment'],
            'user_id' => $request->user()->id,
        ]);

        // For now, we'll just return the rating and comment
        // You can extend this later to store in database
        return redirect()->back()->with('success', 'Rating submitted successfully');
    }
}
