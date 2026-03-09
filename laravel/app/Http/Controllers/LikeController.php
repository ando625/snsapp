<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Like;
use App\Models\Post;
use App\Models\Notification;


class LikeController extends Controller
{
    public function toggle(Request $request, Post $post)
    {
        $userId = auth()->id();
        $like = Like::where('user_id', $userId)->where('post_id', $post->id)->first();

        if ($like) {
            // 【解除】のときは通知は送らない
            $like->delete();
            $liked = false;
        } else {
            // 【新規いいね】のとき
            Like::create([
                'user_id' => $userId,
                'post_id' => $post->id
            ]);
            $liked = true;

            // 自分の投稿じゃない時だけ、通知を送る
            if ($post->user_id !== $userId) {
                Notification::create([
                    'user_id' => $post->user_id,      // 投稿した人へ
                    'notified_by' => $userId,        // いいねした人（自分）
                    'post_id' => $post->id,           // どの投稿か
                    'type' => 'like',                 // 種類は「like」
                    'is_read' => false,
                ]);
            }
        }

        $count = $post->likes()->count();

        return response()->json([
            'liked' => $liked,
            'like_count' => $count,
        ]);
    }
}
