"use client";

import { useState, useEffect } from "react";
import axios from "@/lib/axios";
import PostCard from "./PostCard";

export interface Post {
    id: number;
    user_id: number;
    content: string;
    created_at: string;
    is_liked: boolean;
    likes_count: number;
    nickname: string;
    profile_image: string | null;
    sentiment_score: number;
}

export default function MyPostList() {
    
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMyPosts = async () => {
            try {
                const response = await axios.get("/api/my-posts");
                setPosts(response.data);
            } catch (error) {
                console.error("投稿の取得に失敗しました...", error);
            } finally {
                setLoading(false);
            }
        };
        fetchMyPosts();
    }, []);

    if (loading) return <p className="text-center py-10">投稿を読み込み中...🦅</p>;

    if (posts.length === 0) {
        return (
            <div className="text-center py-10 bg-white rounded-xl border border-dashed border-zinc-300 text-zinc-400">
                まだ投稿がありません。最初の投稿をしてみましょう！
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {posts.map((post) => (
                <PostCard
                    id={post.id}
                    key={post.id}
                    nickname={post.nickname}
                    profileImage={post.profile_image}
                    content={post.content}
                    createdAt={post.created_at}
                    isOwnPost={true}
                    isLiked={post.is_liked}
                    initialLikeCount={post.likes_count}
                    sentimentScore={post.sentiment_score}
                />
            ))}
        </div>
    );
}