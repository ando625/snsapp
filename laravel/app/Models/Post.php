<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Post extends Model
{
    protected $fillable = [
        'user_id',
        'content',
        'sentiment_score',
    ];


    public function user(){
        return $this->belongsTo(User::class);
    }

    public function comments()
    {
        return $this->hasMany(Comment::class); // この投稿へのコメント
    }

    public function likes()
    {
        return $this->hasMany(Like::class); // この投稿へのいいね
    }

    protected $with = ['user.profile'];


    protected $appends = ['nickname', 'profile_image','is_liked','likes_count'];

    public function getNicknameAttribute()
    {
        return $this->user->profile->nickname ?? 'なし';
    }

    public function getProfileImageAttribute()
    {
        return $this->user->profile->profile_image ?? null;
    }

    public function getIsLikedAttribute()
    {
        if (!auth()->check()) return false;

        return $this->likes()->where('user_id',auth()->id())->exists();
    }

    public function getLikesCountAttribute()
    {
        return $this->likes()->count();
    }
}
