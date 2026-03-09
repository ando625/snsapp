"use client";

import { useEffect, useState } from "react";
import axios from "@/lib/axios";
import "./globals.css";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";

export interface User {
    id: number;
    name: string;
    email: string;

    profile: {
        id: number;
        user_id: number;
        nickname: string;
        profile_image: string | null;
    } | null;
}

export type Notification = {
    id: number;
    user_id: number;
    type: string;
    is_read: boolean;
};

export default function RootLayout({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    const router = useRouter();
    const pathname = usePathname();
    const [user, setUser] = useState<User | null>(null);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [isNotificationOpen, setIsNotificationOpen] = useState(false);

    //通知データを取ってくる関数
    const fetchNotifications = async () => {
        try {
            const res = await axios.get("/api/notifications");
            setNotifications(res.data);
        } catch (error) {
            console.error("通知の取得に失敗しました", error);
        }
    };

    useEffect(() => {
        if (user) {
            fetchNotifications();
            const interavel = setInterval(fetchNotifications, 60000);
            return () => clearInterval(interavel);
        }
    }, [user]);

    // 未読の数を数える
    const unreadCount = notifications.filter((n) => !n.is_read).length;

    //通知をクリックした時に既読にする処理＆その投稿にジャンプする処理
    const handleNotificationClick = async (id: number, postId: number) => {
        try {
            //既読処理
            await axios.patch(`/api/notifications/${id}/read`);
            setNotifications((prev) =>
                prev.map((n) => (n.id === id ? { ...n, is_read: true } : n)),
            );

            setIsNotificationOpen(false);
            router.push(`/dashboard#post-${postId}`);
        } catch (error) {
            console.error("既読処理に失敗", error);
        }
    };

    // ログアウト表示のためユーザー取得
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axios.get<User>("/api/user");
                setUser(response.data);
            } catch {
                setUser(null);
            }
        };
        fetchUser();
    }, []);

    //ログアウト
    const handleLogout = async () => {
        try {
            await axios.post("/logout");
            setUser(null);
            router.push("/");
            window.location.reload();
        } catch (error) {
            console.error("ログアウト失敗", error);
        }
    };

    return (
        <html lang="ja">
            <body
                className="min-h-screen flex flex-col antialiased bg-indigo-50 relative"
                style={{
                    backgroundImage: "url('/imageEagle.jpg')",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                }}
            >
                <div className="absolute inset-0 bg-indigo-50/90 -z-10"></div>

                <header className="w-full h-16 flex items-center justify-between px-6 border-b border-zinc-200/50 bg-white/30 backdrop-blur-md relative z-20">
                    {/* 左側：ロゴ */}
                    <div className="text-xl font-bold text-zinc-900">
                        <Link
                            href={user ? "/dashboard" : "/"}
                            className="flex flex-row gap-2"
                        >
                            EagleChat
                        </Link>
                    </div>

                    {/* 右側：通知とログアウトを一つのグループにする */}
                    {user && pathname !== "/" && (
                        <div className="flex items-center gap-6">
                            {" "}
                            {/* 通知アイコン */}
                            <div className="relative cursor-pointer">
                                <button
                                    onClick={() =>
                                        setIsNotificationOpen(
                                            !isNotificationOpen,
                                        )
                                    }
                                    className="relative cursor-pointer focus:outline-none"
                                >
                                    <span className="text-2xl">🔔</span>
                                    {unreadCount > 0 && (
                                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                                            {unreadCount}
                                        </span>
                                    )}
                                </button>

                                {/* 通知ドロップダウンメニュー */}
                                {isNotificationOpen && (
                                    <div
                                        className="fixed top-16 right-2 sm:right-0git sm:absolute sm:right-0 w-[90vw]   sm:w-80 max-w-[340px] bg-white border border-zinc-200 rounded-xl shadow-xl z-50 overflow-hidden"
                                    >
                                        <div className="p-3 border-b border-zinc-100 font-bold text-sm text-zinc-700 bg-zinc-50">
                                            通知
                                        </div>
                                        <div className="max-h-96 overflow-y-auto">
                                            {notifications.length === 0 ? (
                                                <p className="p-4 text-center text-sm text-zinc-500">
                                                    通知はありません
                                                </p>
                                            ) : (
                                                notifications.map((n: any) => (
                                                    <div
                                                        key={n.id}
                                                        onClick={() =>
                                                            handleNotificationClick(
                                                                n.id,
                                                                n.post_id,
                                                            )
                                                        }
                                                        className={`p-4 border-b border-zinc-50 flex gap-3 items-start hover:bg-indigo-50 transition cursor-pointer ${!n.is_read ? "bg-indigo-50/30" : ""}`}
                                                    >
                                                        <img
                                                            src={
                                                                n.notifier
                                                                    ?.profile
                                                                    ?.profile_image
                                                                    ? `http://localhost/storage/${n.notifier.profile.profile_image}`
                                                                    : "/default-avatar.png"
                                                            }
                                                            className="w-10 h-10 rounded-full object-cover border border-zinc-100"
                                                        />
                                                        <div className="flex-1">
                                                            <p className="text-sm text-zinc-800">
                                                                <span className="font-bold">
                                                                    {n.notifier
                                                                        ?.profile
                                                                        ?.nickname ||
                                                                        "誰か"}
                                                                </span>{" "}
                                                                さんがあなたの投稿に
                                                                {n.type ===
                                                                "comment"
                                                                    ? "コメントしました"
                                                                    : "いいねしました"}
                                                                。
                                                            </p>
                                                            <p className="text-[10px] text-zinc-400 mt-1">
                                                                {new Date(
                                                                    n.created_at,
                                                                ).toLocaleString()}
                                                            </p>
                                                        </div>
                                                        {!n.is_read && (
                                                            <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                                                        )}
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                            {/* ログアウトボタン */}
                            <button
                                onClick={handleLogout}
                                className="text-xs font-bold bg-zinc-300 hover:bg-zinc-200 text-zinc-700 py-2.5 px-4 rounded-lg transition duration-200"
                            >
                                ログアウト
                            </button>
                        </div>
                    )}
                </header>

                <main className="flex-1 w-full max-w-7xl mx-auto">
                    {children}
                </main>
                <footer className="w-full py-4 px-4 border-t bg-indigo-50 ">
                    <div className="max-w-screen-md mx-auto text-center text-xs text-zinc-500 leading-relaxed">
                        <p className="text-[10px] sm:text-xs leading-tight">
                            このサイトで使用している画像素材は{" "}
                            <a
                                href="https://jp.freepik.com/"
                                target="_blank"
                                rel="noopener"
                                className="text-indigo-600 hover:underline"
                            >
                                Freepik
                            </a>{" "}
                            提供のものです。
                        </p>
                        <p className="text-[9px] sm:text-[10px] text-zinc-400 mt-1 opacity-80">
                            Images used in this site are from{" "}
                            <a
                                href="https://jp.freepik.com/"
                                target="_blank"
                                rel="noopener"
                                className="text-indigo-600 hover:underline"
                            >
                                Freepik
                            </a>
                            .
                        </p>
                    </div>
                </footer>
            </body>
        </html>
    );
}
