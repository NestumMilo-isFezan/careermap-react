<?php

namespace App\Http\Controllers\Admin;

use App\Models\News;
use Inertia\Inertia;
use App\Models\Admin;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Http\Resources\NewsResource;

class NewsController extends Controller
{
    public function index()
    {
        $news = News::query();

        if (request()->has('title')) {
            $news->where('title', 'like', '%' . request()->title . '%');
        }

        if (request()->has('sort_created_at')) {
            $news->orderBy('created_at', request()->sort_created_at);
        }

        $news = $news->paginate(10);

        return Inertia::render('Admin/News/Index', [
            'news' => NewsResource::collection($news),
            'queryParams' => request()->query() ?: null,
            'messages' => [
                'add_success' => session('add_success'),
                'update_success' => session('update_success'),
                'delete_success' => session('delete_success'),
                'error' => session('error'),
            ],
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'image' => 'required|image|mimes:jpeg,png,jpg,gif,svg|max:10240',
        ]);

        $image = $request->file('image');
        $imagePath = $image->store('news', 'public');

        if (!Admin::where('user_id', request()->user()->id)->exists()) {
            Admin::create([
                'user_id' => request()->user()->id,
            ]);
        }

        $adminId = Admin::where('user_id', request()->user()->id)->first()->id;

        $news = News::create([
            'title' => $validated['title'],
            'description' => $validated['description'],
            'image' => $imagePath,
            'admin_id' => $adminId,
        ]);
        return to_route('admin.news.index')->with('add_success', 'News added successfully');
    }

    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:10240',
        ]);

        $news = News::find($id);

        if ($request->hasFile('image')) {
            $image = $request->file('image');
            $imagePath = $image->store('news', 'public');
            $news->image = $imagePath;
            $news->save();
        }

        if (!Admin::where('user_id', request()->user()->id)->exists()) {
            Admin::create([
                'user_id' => request()->user()->id,
            ]);
        }

        $adminId = Admin::where('user_id', request()->user()->id)->first()->id;

        $news->title = $validated['title'];
        $news->description = $validated['description'];
        $news->admin_id = $adminId;
        $news->save();

        return to_route('admin.news.index')->with('update_success', 'News updated successfully');
    }

    public function destroy($id)
    {
        $news = News::find($id);
        $news->delete();
        return to_route('admin.news.index')->with('delete_success', 'News deleted successfully');
    }
}
