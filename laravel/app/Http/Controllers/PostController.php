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
        $content = $request->content;
        $scriptPath = base_path('python/sentiment.py');

        // 余計なエラー出力を混ぜないようにシンプルに呼び出す
        $command = "python3 $scriptPath " . escapeshellarg($content);
        $output = shell_exec($command);

        // 改行や空白でバラバラにして、最初の数字だけを取り出す
        $parts = preg_split('/\s+/', trim($output));
        $scoreRaw = $parts[0] ?? 50;

        $sentimentScore = is_numeric($scoreRaw) ? (int)$scoreRaw : 50;

        $post = Post::create([
            'user_id' => auth()->id(),
            'content' => $content,
            'sentiment_score' => $sentimentScore,
        ]);

        return response()->json($post);
    }
}
