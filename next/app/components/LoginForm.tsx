"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "@/lib/axios";


export default function LoginForm() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState<any>({});
    const [remember, setRemember] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors("");

        try {
            //門番に挨拶して「お守り（CSRFクッキー）」をもらう
            await axios.get("/sanctum/csrf-cookie");

            //ログイン情報を送る
            const response = await axios.post("/login", {
                email: email,
                password: password,
                remember: remember,
            });

            console.log("ログイン成功！", response.data);

            //成功したらダッシュボードへ リロードでユーザー情報も取ってくる
            window.location.href = "/dashboard";
        } catch (err: any) {
            if (err.response?.status === 422) {
                // Laravelが返してくれた「詳細なエラーリスト」をそのまま箱に入れる
                setErrors(err.response.data.errors);
            } else if (err.response?.status === 401) {
                // 認証エラー（登録されてないなど）の場合
                // 表示側の都合に合わせて「emailの引き出し」にメッセージを入れる
                setErrors({
                    email: ["メールアドレスかパスワードが違います。"],
                });
            } else {
                setErrors({ general: ["通信エラーが起きました。"] });
            }
        }
    };

    return (

            <form onSubmit={handleLogin} className="w-full max-w-sm space-y-6">
                <div>
                    <div className="m-4">
                        <label
                            htmlFor="email"
                            className="text-sm font-medium text-zinc-700 ml-1"
                        >
                            メールアドレス
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full h-12 px-4 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white shadow-sm"
                            placeholder="example@mail.com"
                        />
                        {errors.email && (
                            <p className="text-xs text-red-500">
                                {errors.email[0]}
                            </p>
                        )}
                    </div>

                    <div className="m-4">
                        <label
                            htmlFor="password"
                            className="text-sm font-medium text-zinc-700 ml-1"
                        >
                            パスワード
                        </label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full h-12 px-4 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white shadow-sm"
                        />
                        {errors.password && (
                            <p className="text-xs text-red-500">
                                {errors.password[0]}
                            </p>
                        )}
                    </div>

                    <div className="flex items-center gap-2 m-4">
                        <input
                            type="checkbox"
                            id="remember"
                            checked={remember}
                            onChange={(e) => setRemember(e.target.checked)}
                            className="w-4 h-4 rounded border-zinc-300 text-indigo-600"
                        />
                        <label
                            htmlFor="remember"
                            className="text-sm text-zinc-500 select-none"
                        >
                            ログイン状態を維持する
                        </label>
                    </div>
                </div>

                <div className="flex items-center justify-center">
                    <button
                        type="submit"
                        className="w-1/2 h-14 bg-gradient-to-r from-zinc-900 to-zinc-700 text-white rounded-xl font-bold shadow-lg transform transition active:scale-95 m-4"
                    >
                        ログイン
                    </button>
                </div>
            </form>

    );
}