<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Notification extends Model
{
    protected $fillable = [
        'user_id',
        'notified_by',
        'post_id',
        'type',
        'is_read',
    ];

    // 誰がコメント、いいねしたか
    public function notifier():BelongsTo
    {
        return $this->belongsTo(User::class,'notified_by');
    }


    // どの投稿の通知か
    public function post():BelongsTo{
        return $this->belongsTo(Post::class);
    }
}
