<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Profile;

class ProfileController extends Controller
{
    public function store(Request $request)
    {
        $profile = Profile::where('user_id', auth()->id())->first();

        $path = $request->hasFile('profile_image') ? $request->file('profile_image')->store('profiles','public') : ($profile->profile_image ?? null);

        $newProfile = Profile::updateOrCreate(
            ['user_id' => auth()->id()],
            [
                'nickname' => $request->nickname,
                'profile_image' => $path,
            ]
        );

        return response()->json($newProfile);
    }

}