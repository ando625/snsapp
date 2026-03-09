"use client";

import axios from "@/lib/axios";
import CommentSection from "./CommentSection";
import { useState, useEffect } from "react";

export interface PostCardProps {
    id: number;
    nickname: string;
    profileImage: string | null;
    content: string;
    createdAt: string;
    isOwnPost: boolean;
    isLiked: boolean;
    initialLikeCount: number;
    sentimentScore: number;
}

export default function PostCard({
    id,
    nickname,
    profileImage,
    content,
    createdAt,
    isOwnPost,
    isLiked,
    initialLikeCount,
    sentimentScore,
}: PostCardProps) {
    const [isCommentOpen, setIsCommentOpen] = useState(false);
    const [liked, setLiked] = useState(isLiked); //自分がいいねしてるか
    const [likeCount, setLikeCount] = useState(initialLikeCount);
    const [isAnimating, setIsAnimating] = useState(true);

    const [isMagicActive, setIsMagicActive] = useState(() => {
        const postTime = new Date(createdAt).getTime();
        const now = new Date().getTime();
        const diff = (now - postTime) / 1000; // 秒数に変換
        return diff < 3; // 3秒以内に投稿されたなら true
    });

    useEffect(() => {
        if (isMagicActive) {
            const timer = setTimeout(() => {
                setIsMagicActive(false);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [isMagicActive]);


    
    const score = Number(sentimentScore);

    const cardStyle =
        isMagicActive && score > 55 // 🌟 50点（普通）より少し高ければポジティブ！
            ? "border-yellow-400 bg-yellow-50/80 shadow-yellow-100"
            : isMagicActive && score < 45 // 🌟 50点より少し低ければネガティブ！
              ? "border-blue-300 bg-blue-50/80 shadow-blue-100"
              : "border-zinc-100 bg-white/70";

    const handleLike = async () => {
        try {
            setIsAnimating(true);
            const response = await axios.post(`/api/posts/${id}/like`);
            setLiked(response.data.liked);
            setLikeCount(response.data.like_count);

            setTimeout(() => {
                setIsAnimating(false);
            }, 500);
        } catch (error) {
            console.error("いいね失敗", error);
            setIsAnimating(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm("この投稿を削除しますか？")) return;

        try {
            await axios.delete(`/api/posts/${id}`);
            window.location.reload();
        } catch (error) {
            alert("削除に失敗しました");
        }
    };

    return (
        <div
            id={`post-${id}`}
            className={`${cardStyle} backdrop-blur-md p-6 rounded-2xl shadow-sm border flex flex-col gap-4 transition-all duration-500 scroll-mt-20`}
        >
            {/* 感情に合わせたメッセージを表示 */}
            <div className="flex items-center gap-2 mb-1">
                {isMagicActive && score > 55 && (
                    <span className="text-[12px] font-bold text-yellow-600 animate-bounce">
                        ☀️ 素敵な時間でしたね、いいね！
                    </span>
                )}
                {isMagicActive && score < 45 && (
                    <span className="text-[12px] font-bold text-blue-600">
                        ☁️ 大丈夫、ゆっくり休んでね。
                    </span>
                )}
            </div>

            {/* 上段：投稿内容エリア */}
            <div className="flex gap-4">
                <img
                    src={
                        profileImage
                            ? `http://localhost/storage/${profileImage}`
                            : "/default-avatar.png"
                    }
                    className="w-12 h-12 rounded-full object-cover border border-zinc-200"
                    alt="icon"
                />

                <div className="flex-1 flex flex-col gap-2">
                    <div className="flex justify-between items-center mb-2">
                        <span className="font-bold text-zinc-800">
                            {nickname}
                        </span>
                        <span className="text-xs text-zinc-400">
                            {new Date(createdAt).toLocaleString()}
                        </span>
                    </div>

                    <p className="text-zinc-700 whitespace-pre-wrap">
                        {content}
                    </p>

                    {/* 下部アクションエリア（コメントボタンとゴミ箱） */}
                    <div className="flex justify-between items-end mt-4">
                        <button
                            onClick={() => setIsCommentOpen(!isCommentOpen)}
                            className="text-xs text-indigo-600 hover:text-indigo-800 font-bold"
                        >
                            {isCommentOpen
                                ? "▲ コメントを閉じる"
                                : "▼ コメントはこちら"}
                        </button>

                        <div className="flex items-center gap-3">
                            {/* 星型のいいねボタン */}
                            <div className="flex items-center gap-1">
                                <button
                                    onClick={handleLike}
                                    className={`text-[20px] transition-all duration-300 active:scale-150 ${liked ? "text-yellow-400" : "text-zinc-300"} ${isAnimating ? "animate-star-jump" : ""}`}
                                >
                                    {liked ? "★" : "☆"}
                                </button>

                                {likeCount > 0 && (
                                    <span className="text-[18px] font-bold text-zinc-500 animate-fade-in">
                                        {likeCount}
                                    </span>
                                )}
                            </div>

                            {/* 🪄 ゴミ箱を右下に配置 */}
                            {isOwnPost && (
                                <button
                                    onClick={handleDelete}
                                    className="text-zinc-400 hover:text-red-500 transition"
                                    title="削除する"
                                >
                                    <span className="text-[16px]">🗑️</span>
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* 下段：コメント表示エリア */}
            {isCommentOpen && <CommentSection postId={id} />}
        </div>
    );
}
