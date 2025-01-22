<?php

namespace App\Http\Controllers\Auth;

use App\Models\User;
use Inertia\Inertia;
use Inertia\Response;
use App\Models\School;
use App\Models\Teacher;
use Illuminate\Http\Request;
use Illuminate\Validation\Rules;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Http\RedirectResponse;
use Illuminate\Auth\Events\Registered;

class RegisteredUserController extends Controller
{
    /**
     * Display the registration view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Register');
    }

    public function createTeacher(): Response
    {
        return Inertia::render('Auth/RegisterTeacher');
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:'.User::class,
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        $role = 3;
        $name = request('first_name') . ' ' . request('last_name');

        $user = User::create([
            'first_name' => $request->first_name,
            'last_name' => $request->last_name,
            'name' => $name,
            'role' => $role,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        event(new Registered($user));

        Auth::login($user);

        return redirect(route('home', absolute: false));
    }

    public function storeTeacher(Request $request)
    {
            $request->validate([
                'first_name' => 'required|string|max:255',
                'last_name' => 'required|string|max:255',
                'email' => 'required|string|lowercase|email|max:255|unique:'.User::class,
                'password' => ['required', 'confirmed', Rules\Password::defaults()],
                'referral_code' => 'required|string|max:255|exists:schools,referral_code',
            ]);
            $referral = School::where('referral_code', $request->referral_code)->first();

            if(!$referral){
                return redirect()->back()->with('error', 'Invalid referral code');
            }

            $role = 4;
            $name = request('first_name') . ' ' . request('last_name');

            $user = User::create([
                'first_name' => $request->first_name,
                'last_name' => $request->last_name,
                'name' => $name,
                'role' => $role,
                'email' => $request->email,
                'password' => Hash::make($request->password),
            ]);

            Teacher::create([
                'user_id' => $user->id,
                'school_id' => $referral->id,
            ]);

            event(new Registered($user));

            Auth::login($user);

            return redirect(route('home', absolute: false));


    }
}
