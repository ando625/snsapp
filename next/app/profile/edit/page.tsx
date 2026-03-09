"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "@/lib/axios";
import ProfileForm from "@/app/components/ProfileForm";
import MyPostList from "@/app/components/MyPostList";
import { User } from "@/app/layout";
import Link from "next/link";


export default function ProfileEditPage() {

    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axios.get<User>("/api/user");
                setUser(response.data);
            } catch (error) {
                router.push("/login");
            }
        };
        fetchUser();
    }, [router]);

    if (!user) {
        return <p className="p-10 text-center">読み込み中...🦅</p>;
    }

    return (
        <div className="w-full max-w-4xl mx-auto py-10 px-6 flex flex-col gap-10">
            <div className="flex justify-end text-lg tracking-wider">
                <Link
                    href="/dashboard"
                    className="border border-zinc-200 bg-indigo-400 rounded-full p-2 px-5 text-white shadow-md  font-bold"
                >
                    HOME
                </Link>
            </div>
            <section className="w-full">
                <ProfileForm currentUser={user} />
            </section>

            <hr className="border-t-2 border-zinc-500" />

            <section>
                <MyPostList />
            </section>
        </div>
    );
}