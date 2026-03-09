"use client";

import { useEffect, useState } from "react";
import axios from "@/lib/axios";


interface PostModalProps{
    onClose: () => void;
}

export default function PostModal({ onClose }: PostModalProps) {
    const [content, setContent] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        if (isSubmitting) return;


        setIsSubmitting(true);
        try {
            await axios.post("/api/posts", { content });
            onClose();
            window.location.reload();
        } catch (err: any) {
            if (err.response && err.response.status === 422) {
                const serverError = err.response.data.errors.content[0];
                setError(serverError);
            }
        } finally {
            setIsSubmitting(false);
        }
    };


    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            {/* モーダル本体 */}
            <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="p-6 border-b border-zinc-100 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-zinc-800">
                        いま何してる？
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-zinc-100 rounded-full transition"
                    >
                        ✖️
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="出来事を共有しよう..."
                        required
                        maxLength={280}
                        className="w-full h-48 p-4 text-lg border-none focus:ring-0 outline-none resize-none placeholder:text-zinc-300"
                    ></textarea>
                    {error && (
                        <p className="text-red-500 text-sm font-bold animate-bounce">
                            ⚠️ {error}
                        </p>
                    )}

                    <div className="flex justify-end items-center gap-4 pt-4 border-t border-zinc-100">
                        <span className="text-sm text-zinc-400">
                            {content.length} / 280
                        </span>

                        <button
                            type="submit"
                            disabled={!content.trim() || isSubmitting}
                            className={`px-8 py-3 rounded-full font-bold text-white transition shadow-md
                                ${
                                    content.trim() && !isSubmitting
                                        ? "bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200"
                                        : "bg-zinc-300 cursor-not-allowed"
                                }`}
                        >
                            {isSubmitting ? "送信中..." : "投稿する"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}