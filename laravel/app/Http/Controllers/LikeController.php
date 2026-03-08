<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Like;
use App\Models\Post;

class LikeController extends Controller
{
    public function toggle(Request $request,Post $post)
    {
        $userId = auth()->id();

        $like = Like::where('user_id',$userId)->where('post_id', $post->id)->first();

        if($like){
            $like->delete();
            $liked = false;
        }else{
            Like::create([
                'user_id' => $userId,
                'post_id' => $post->id
            ]);
            $liked = true;
        }

        $count = $post->likes()->count();

        return response()->json([
            'liked' => $liked,
            'like_count' => $count,
        ]);


    }
}
