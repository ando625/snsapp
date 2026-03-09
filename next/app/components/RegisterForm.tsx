"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "@/lib/axios";

export default function RegisterForm() {
    const router = useRouter();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirmation, setPasswordConfirmation] = useState("");
    const [errors, setErrors] = useState<any>({});

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({});

        try {
            //laravel Sanctumで必要な処理、laravelサーバーにアクセスしてCSRFトークンとCookieをもらう
            await axios.get("sanctum/csrf-cookie");

            //登録実行処理
            await axios.post("/register", {
                name,
                email,
                password,
                password_confirmation: passwordConfirmation,
            });

            // 成功後ダッシュボードへ
            router.push("/dashboard");
        } catch (err: any) {
            if (err.response?.status === 422) {
                //laravel側のエラーメッセージセット
                setErrors(err.response.data.errors);
            }
        }
    };

    return (
        <form onSubmit={handleRegister} className="w-full max-w-sm space-y-6">
            <div>
                <div className="m-2">
                    <label
                        htmlFor="name"
                        className="text-sm font-medium text-zinc-700 ml-1"
                    >
                        お名前
                    </label>
                    <input
                        type="name"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full h-12 px-4 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white shadow-sm"
                        placeholder="山田太郎"
                    />
                    {errors.name && (
                        <p className="text-xs text-red-500">
                            {errors.name[0]}
                        </p>
                    )}
                </div>
                <div className="m-2">
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

                <div className="m-2">
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

                <div className="m-2">
                    <label
                        htmlFor="password_confirmation"
                        className="text-sm font-medium text-zinc-700 ml-1"
                    >
                        パスワード確認
                    </label>
                    <input
                        id="password_confirmation"
                        type="password"
                        value={passwordConfirmation}
                        onChange={(e) =>
                            setPasswordConfirmation(e.target.value)
                        }
                        className="w-full h-12 px-4 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white shadow-sm"
                    />
                    {errors.password_confirmation && (
                        <p className="text-xs text-red-500">
                            {errors.password_confirmation[0]}
                        </p>
                    )}
                </div>
            </div>

            <div className="flex items-center justify-center">
                <button
                    type="submit"
                    className="w-1/2 h-14  bg-white border-2 border-zinc-400 text-zinc-900 rounded-xl font-bold shadow-lg transform transition active:scale-95 m-1"
                >
                    登録
                </button>
            </div>
        </form>
    );
}