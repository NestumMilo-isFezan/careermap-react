<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use App\Http\Requests\UpdateProfileDataRequest;

class ProfileController extends Controller
{
    /**
     * Display the user's profile form.
     */
    public function edit(Request $request): Response
    {
        $user = $request->user();
        $userRoles = $user->role;
        if($userRoles === 0){
            return Inertia::render('Profile/Student/Edit', [
                'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
                'status' => session('status'),
                'user' => $user,
                'messages' => [
                    'update_success' => session('update_success'),
                ],
            ]);
        }
        return Inertia::render('Profile/Edit', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => session('status'),
            'userRoles' => $userRoles,
        ]);
    }

    /**
     * Update the user's profile information.
     */
    public function update(UpdateProfileDataRequest $request): RedirectResponse
    {
        $userData = [
            'first_name' => $request->first_name,
            'last_name' => $request->last_name,
            'image' => $request->image,
        ];
        $profileData = [
            'birth_date' => $request->birth_date,
            'gender' => $request->gender,
            'religion' => $request->religion,
            'phone' => $request->phone,
            'address' => $request->address,
            'city' => $request->city,
            'state' => $request->state,
            'postcode' => $request->postcode,
            'country' => $request->country,
        ];

        $user = $request->user();
        $userData['name'] = $userData['first_name'] . ' ' . $userData['last_name'];
        $profile = $user->profile;

        $image = $userData['image'];
        $imagePath = '';
        if($image){
            if($user->image){
                Storage::disk('public')->delete($user->image);
            }
            $extension = $image->getClientOriginalExtension();
            $imageName = Str::slug($userData['name']) . '.' . $extension;
            $imagePath = $image->storeAs('profilepics', $imageName, 'public');
            $userData['image'] = $imagePath;
        }
        else{
            unset($userData['image']);
        }

        $user->update($userData);
        $profile->update($profileData);
        return to_route('profile.edit')->with('update_success', 'Profile updated successfully');
    }

    /**
     * Delete the user's account.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return Redirect::to('/');
    }
}
