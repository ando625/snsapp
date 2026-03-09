<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Notification;

class NotificationController extends Controller
{
    // 自分宛の通知を新しい順に取得
    public function index()
    {
        $notifications = Notification::where('user_id',auth()->id())
            ->with(['notifier.profile','post'])
            ->latest()
            ->get();

        return response()->json($notifications);
    }

    // 通知を既読に
    public function markAsRead(Notification $notification)
    {
        $notification->update(['is_read' => true]);
        return response()->json(['message' => '既読にしました']);
    }
}
