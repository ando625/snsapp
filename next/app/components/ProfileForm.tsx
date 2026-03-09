"use client";

import { useState } from "react";
import axios from "@/lib/axios";
import { useRouter } from "next/navigation";
import { User } from "../layout";

interface ProfileFormProps {
    currentUser?: User | null;
}

export default function ProfileForm({currentUser}:ProfileFormProps) {
    const router = useRouter();
    const [nickname, setNickname] = useState(currentUser?.profile?.nickname || "");
    const [profileImage, setProfileImage] = useState<File | null>(null);

    // 今登録されてる画像表示
    const [previewUrl, setPreviewUrl] = useState<string | null>(
        currentUser?.profile?.profile_image
            ? `http://localhost/storage/${currentUser.profile.profile_image}`
            : null,
    );

    //送信ボタンを押した時の処理
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // 登録か編集か
        const isEdit = !!currentUser?.profile;
        const successMessage = isEdit
            ? "プロフィールを更新しました✨"
            : "プロフィールを登録しました✨";

        //画像を送るため 追加でニックネームも
        const formData = new FormData();
        formData.append("nickname", nickname);
        if (profileImage) {
            formData.append("profile_image", profileImage);
        }
        try {
            const response = await axios.post("/api/profiles", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            alert(successMessage);
            console.log(response.data);
            window.location.reload();
        } catch (error) {
            const errorMessage = isEdit ? "更新失敗" : "登録失敗";
            console.error("失敗...", error);
            alert(`${errorMessage}やり直してください`);
        }

    };

    const isEdit = !!currentUser?.profile;

    return (
        <div className="w-full max-w-xl mx-auto flex flex-col items-center justify-center bg-white rounded-2xl shadow-xl border border-zinc-200 p-8 sm:p-12">
            <h2 className="text-xl font-bold mb-6 text-zinc-800 text-center">
                {isEdit ? "プロフィール編集" : "プロフィール設定"}
            </h2>

            <form onSubmit={handleSubmit} className="w-full max-w-md space-y-6">
                <div>
                    <label className="block text-sm font-medium text-zinc-700 mb-1">
                        ニックネーム
                    </label>
                    <input
                        type="text"
                        value={nickname}
                        onChange={(e) => setNickname(e.target.value)}
                        placeholder="ニッキー"
                        required
                        className="w-full px-4 py-2 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-zinc-700 mb-1 text-center">
                        プロフィール画像
                    </label>
                    {previewUrl && (
                        <div className="flex justify-center mb-4">
                            <img
                                src={previewUrl}
                                alt="プレビュー"
                                className="w-20 h-20 rounded-full border-2 border-indigo-200 object-cover shadow-sm"
                            />
                        </div>
                    )}
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                            const file = e.target.files?.[0] || null;
                            setProfileImage(file);
                            //新しい画像を選んだら、プレビュー用のURLを新しく作り直す
                            if (file) {
                                setPreviewUrl(URL.createObjectURL(file));
                            }
                        }}
                        className="w-full text-sm text-zinc-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 pl-0 sm:pl-10"
                    />
                </div>

                <div>
                    <button
                        type="submit"
                        className="w-full py-3 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition duration-200 shadow-md"
                    >
                        {isEdit ? "変更を保存する" : "プロフィール登録"}
                    </button>
                </div>
            </form>
        </div>
    );
}