<?php

use App\Http\Controllers\CommentController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\PostController;
use App\Http\Controllers\LikeController;




Route::get('/user', function (Request $request) {
    return $request->user()->load('profile');
})->middleware('auth:sanctum');

Route::middleware('auth:sanctum')->group(function(){

    Route::get('/posts', [PostController::class,'index']);

    //プロフィール情報保存
    Route::post('/profiles', [ProfileController::class,'store']);

    //自分自身の投稿一覧を取得
    Route::get('/my-posts', [PostController::class,'myPosts']);

    //自身の投稿を削除
    Route::delete('/posts/{post}', [PostController::class,'destroy']);

    //自身の投稿作成
    Route::post('/posts', [PostController::class, 'postStore']);

    // コメント一覧
    Route::get('/posts/{post}/comments',[CommentController::class, 'index']);

    //コメント作成
    Route::post('/comments', [CommentController::class, 'store']);

    //コメント削除
    Route::delete('/comments/{comment}', [CommentController::class, 'destroy']);

    // いいね削除追加
    Route::post('/posts/{post}/like', [LikeController::class,'toggle']);
});
