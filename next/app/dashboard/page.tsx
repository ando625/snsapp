"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "@/lib/axios";
import ProfileForm from "../components/ProfileForm";
import Link from "next/link";
import PostModal from "../components/PostModal";
import PostCard from "../components/PostCard";
import { Post } from "../components/MyPostList";
import EagleIcon from "../components/Eaglelcon";




export default function DashboardPage() {
    const router = useRouter();

    const [posts, setPosts] = useState<Post[]>([]);
    const [currentUserId, setCurrentUserId] = useState<number | null>(null);
    const [user, setUser] = useState<any>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        //投稿だけを取ってくる関数（リアルタイムみたいに投稿があれば自動更新されるように）
        const fetchPostsOnly = async () => {
            
            try {
                const postRes = await axios.get("/api/posts");
                setPosts(postRes.data);
                console.log("タイムラインを更新しました");
            } catch (error) {
                console.error("投稿の取得に失敗しました", error);
            }
        };

        //画面が開いた時に一回だけやる初期設定（ユーザー取得や既存の投稿）
        const initializeDashboard = async () => {
            try {
                //ログインユーザー確認
                const userRes = await axios.get("/api/user");
                setUser(userRes.data);
                setCurrentUserId(userRes.data.id);

                //最初の投稿取得
                await fetchPostsOnly();
            } catch (error) {
                router.push("/login");
            };
        }

        initializeDashboard();

        const interval = setInterval(() => {
            fetchPostsOnly();
        }, 60000);

        //画面を離れる時にタイマーを止める
        return () => clearInterval(interval);
    }, [router]);
    

    if (!user) {
        return <p className="p-10 text-center">読み込み中...🦅</p>;
    }


    // プロフィール設定がないなら登録フォームだけ見せる
    if (!user.profile) {
        return (
            <div className="flex flex-col items-center justify-center p-10">
                <ProfileForm currentUser={user} />
            </div>
        );
    }

    //プロフィールがあるなら、SNS画面を表示
    return (
        <div className="max-w-4xl mx-auto w-full flex flex-col gap-6 p-4">
            <div className="flex justify-end items-center gap-6 mt-4">
                <button
                    onClick={() => setIsModalOpen(true)}
                    className=" flex items-center text-2xl "
                >
                    <span className="text-center">➕</span>
                </button>

                <div className="">
                    <Link
                        href="/profile/edit"
                        className="hover:opacity-80 transition duration-200"
                    >
                        <img
                            src={
                                user.profile?.profile_image
                                    ? `http://localhost/storage/${user.profile.profile_image}`
                                    : "/default-avatar.png"
                            }
                            alt="Icon"
                            className="w-12 h-12 rounded-full border-2 border-indigo-200 object-cover"
                        />
                    </Link>
                </div>
            </div>

            <div className="rounded-xl shadow-sm border border-zinc-200 p-6">
                <div className="flex items-center justify-center opacity-60">
                    <EagleIcon className="w-60 h-10" />
                </div>
                <div className="relative z-10">
                    <h3 className="font-bold text-base mb-4 text-zinc-800 text-center">
                        -タイムライン-
                    </h3>
                    <div className="space-y-4">
                        {posts.map((post) => (
                            <PostCard
                                key={post.id}
                                id={post.id}
                                nickname={post.nickname}
                                profileImage={post.profile_image}
                                content={post.content}
                                createdAt={post.created_at}
                                isOwnPost={post.user_id === currentUserId}
                                isLiked={post.is_liked}
                                initialLikeCount={post.likes_count}
                                sentimentScore={post.sentiment_score}
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* 新規投稿のモーダル */}
            {isModalOpen && <PostModal onClose={() => setIsModalOpen(false)} />}
        </div>
    );
}