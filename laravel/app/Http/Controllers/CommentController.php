<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Comment;
use App\Models\Notification;
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

        //投稿者に通知を送る処理 自分の投稿にコメントした場合は通知しないように
        $post = $comment->post;

        if($post->user_id !== auth()->id()){
            Notification::create([
                'user_id' => $post->user_id,
                'notified_by' => auth()->id(),
                'post_id' => $post->id,
                'type' =>'comment',
                'is_read' => false,
            ]);

        }

        return response()->json($comment->load('user.profile'));

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
