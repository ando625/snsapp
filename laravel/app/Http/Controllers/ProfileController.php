<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Profile;

class ProfileController extends Controller
{
    public function store(Request $request)
    {
        $path = $request->file('profile_image')->store('profiles','public');

        $profile = Profile::create([
            'user_id' => auth()->id(),
            'nickname' => $request->nickname,
            'profile_image' => $path,
        ]);

        return response()->json($profile);
    }
}
