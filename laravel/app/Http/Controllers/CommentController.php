<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Comment;
use App\Http\Requests\CommentRequest;


class CommentController extends Controller
{
    public function index($postId)
    {
        $comments = Comment::where('post_id', $postId)
            ->with('user.profile')
            ->oldest()
            ->get()
            ->map(function ($comment){
                $comment->is_own_comment = $comment->user_id === auth()->id();
                return $comment;
            });

        return response()->json($comments);
    }


    public function store(CommentRequest $request)
    {
        $comment = Comment::create([
            'user_id' => $request->user()->id,
            'post_id' => $request->post_id,
            'body' => $request->body,
        ]);

        $comment->load('user.profile');

        return response()->json($comment);

    }

    public function destroy(Comment $comment)
    {
        if($comment->user_id !== auth()->id()){
            return response()->json(['message'=>'権限がありません'],403);
        }

        $comment->delete();
        return response()->json(['message'=>'削除しました']);
    }
}
