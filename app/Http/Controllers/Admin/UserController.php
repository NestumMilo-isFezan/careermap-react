<?php

namespace App\Http\Controllers\Admin;

use App\Models\User;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;

class UserController extends Controller
{
    public function index()
    {
        $users = User::query();

        if(request()->has('name')){
            $users->where('name', 'like', '%'.request()->get('name').'%');
        }
        if(request()->has('created_at')){
            if(request()->get('created_at') == 'today'){
                $users->whereDate('created_at', Carbon::today());
            }
            if(request()->get('created_at') == 'week'){
                $users->whereBetween('created_at', [Carbon::now()->startOfWeek(), Carbon::now()->endOfWeek()]);
            }
            if(request()->get('created_at') == 'month'){
                $users->whereBetween('created_at', [Carbon::now()->startOfMonth(), Carbon::now()->endOfMonth()]);
            }
            if(request()->get('created_at') == 'year'){
                $users->whereBetween('created_at', [Carbon::now()->startOfYear(), Carbon::now()->endOfYear()]);
            }
        }
        if(request()->has('role')){
            $users->where('role', request()->get('role'));
        }

        // Handle sorting
        if(request()->has('sort_name')){
            $direction = request()->get('sort_name') === 'asc' ? 'asc' : 'desc';
            $users->orderBy('name', $direction);
        } elseif(request()->has('sort_created_at')){
            $direction = request()->get('sort_created_at') === 'asc' ? 'asc' : 'desc';
            $users->orderBy('created_at', $direction);
        } else {
            $users->orderBy('created_at', 'desc'); // Default sort
        }

        $users = $users->paginate(10);

        return Inertia::render('Admin/User/Index', [
            'users' => UserResource::collection($users),
            'queryParams' => request()->query() ?: null,
            'messages' => [
                'add_success' => session('add_success'),
                'update_success' => session('update_success'),
                'delete_success' => session('delete_success'),
                'error' => session('error'),
            ],
        ]);
    }

    public function destroy($id)
    {
        $user = User::find($id);
        $user->delete();
        return to_route('admin.users.index')->with('delete_success', 'User deleted successfully');
    }
}
