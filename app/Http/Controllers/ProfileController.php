<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    /**
     * Show the form to edit the user's profile.
     *
     * @param Request $request
     * @return Response
     */
    public function showEditForm(Request $request): Response
    {
        return Inertia::render('Profile/Edit', [
            'requiresEmailVerification' => $request->user() instanceof MustVerifyEmail,
            'notificationStatus' => session('status'),
        ]);
    }

    /**
     * Update the user's profile data.
     *
     * @param ProfileUpdateRequest $request
     * @return RedirectResponse
     */
    public function updateProfile(ProfileUpdateRequest $request): RedirectResponse
    {
        $user = $request->user();
        $user->fill($request->validated());

        if ($user->isDirty('email')) {
            $user->email_verified_at = null;
        }

        $user->save();

        return Redirect::route('profile.edit');
    }

    /**
     * Remove the user's account from the system.
     *
     * @param Request $request
     * @return RedirectResponse
     */
    public function deleteAccount(Request $request): RedirectResponse
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