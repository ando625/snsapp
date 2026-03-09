"use client";

import { useState, useEffect } from "react";
import axios from "@/lib/axios";

// 時間を「〜前」という言葉に変換する関数
const formatRelativeTime = (dateString: string) => {
    const now = new Date();
    const past = new Date(dateString);
    const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);

    if (diffInSeconds < 60) return "今さっき";
    
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes}分前`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}時間前`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}日前`;

    // 1週間以上経っていたら普通の日付を出す
    return past.toLocaleDateString();
};

export interface Comment {
    id: number;
    user: { profile: { nickname: string; profile_image: string | null } };
    body: string;
    created_at: string;
    is_own_comment: boolean;
}

export default function CommentSection({ postId }: { postId: number }) {
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState("");

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const response = await axios.get(
                    `/api/posts/${postId}/comments`,
                );
                setComments(response.data);
            } catch (error) {
                console.error("コメントの取得に失敗しました", error);
            }
        };
        fetchComments();
    }, [postId]);

    const handleSend = async () => {
        if (!newComment.trim()) return;
        try {
            const response = await axios.post("/api/comments", {
                post_id: postId,
                body: newComment,
            });
            const addedComment = { ...response.data, is_own_comment: true };
            setComments([...comments, addedComment]);
            setNewComment("");
        } catch (error) {
            alert("送信に失敗しました");
        }
    };

    const handleDeleteComment = async (commentId: number) => {
        if (!confirm("このコメントを削除しますか？")) return;
        try {
            await axios.delete(`/api/comments/${commentId}`);
            setComments(comments.filter((c) => c.id !== commentId));
        } catch (error) {
            alert("削除失敗");
        }
    };

    return (
        <div className="flex flex-col gap-4 mt-2">
            <hr className="border-t border-zinc-300 w-full mb-1" />
            <div className="flex flex-col gap-3 pb-4">
                {comments.map((comment) => (
                    <div key={comment.id} className="flex gap-4 items-start">
                        {/* 🪄 1. 左側の「画像 + 名前」のカラム */}
                        <div className="flex flex-col items-center w-12 shrink-0">
                            <img
                                src={
                                    comment.user.profile.profile_image
                                        ? `http://localhost/storage/${comment.user.profile.profile_image}`
                                        : "/default-avatar.png"
                                }
                                alt="icon"
                                className="w-10 h-10 rounded-full object-cover mb-1 border border-zinc-200"
                            />

                            <span className="text-[10px] font-bold text-zinc-600 truncate w-full text-center">
                                {comment.user.profile.nickname}
                            </span>
                        </div>

                        {/* コメントの白い箱 */}
                        <div className="relative bg-white px-5 py-3 rounded-2xl shadow-sm border border-zinc-100 flex-1">
                            <div className="flex justify-end items-center mb-1">
                                <span className="text-[10px] text-zinc-400">
                                    {formatRelativeTime(comment.created_at)}
                                </span>
                            </div>
                            <p className="text-sm text-zinc-700 leading-relaxed whitespace-pre-wrap">
                                {comment.body}
                            </p>

                            {/* ゴミ箱を右下に配置 */}
                            {comment.is_own_comment && (
                                <div className="flex justify-end mt-1">
                                    <button
                                        onClick={() =>
                                            handleDeleteComment(comment.id)
                                        }
                                        className="text-zinc-300 hover:text-red-400 transition"
                                    >
                                        <span className="text-[14px]">🗑️</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* 🪄 2. 入力フォームの幅を 2/3 に調整 */}
            <div className="w-[95%] md:w-2/3 mx-auto flex gap-2 items-center bg-white rounded-full border border-zinc-200 px-4 py-1 shadow-sm mt-4">
                <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="コメントを書く..."
                    rows={2}
                    className="w-full text-sm bg-transparent focus:outline-none text-zinc-700 p-2 resize-none min-h-[40px] px-4 py-2"
                />
                <button
                    className="text-xs bg-indigo-500 text-white px-4 py-1.5 rounded-full font-bold hover:bg-indigo-600 transition shadow-sm shrink-0"
                    onClick={handleSend}
                >
                    送信
                </button>
            </div>
        </div>
    );
}
