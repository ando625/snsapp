<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Post;
use App\Models\Like;
use App\Http\Requests\PostRequest;

class PostController extends Controller
{
    public function index()
    {
        $posts = Post::withCount('likes')
            ->withExists(['likes as liked' => function ($query){
                $query->where('user_id', auth()->id());
            }])
            ->latest()
            ->get();


        return response()->json($posts);

    }


    public function myPosts(Request $request)
    {
        $userId = $request->user()->id;

        $posts = Post::with('user.profile')
            ->where('user_id', $userId)
            ->latest()
            ->get();

        return response()->json($posts);

    }

    public function destroy(Post $post)
    {
        if(auth()->id() !== $post->user_id){
            return response()->json();
        }

        $post->delete();
        return response()->json(['message' => '削除しました']);
    }

    public function postStore(PostRequest $request)
    {

        $post = Post::create([
            'user_id' => auth()->id(),
            'content' => $request->content,
        ]);

        return response()->json($post);
    }
}
