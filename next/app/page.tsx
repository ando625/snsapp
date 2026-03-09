import Image from "next/image";
import Link from "next/link";

export default function Home() {
    return (
        <div className="min-h-screen text-zinc-900 font-sans flex flex-col">
            <div className="flex items-center justify-center h-20 border-b border-zinc-100 mt-2">
                <h1 className="text-3xl font-bold tracking-tight">EagleChat</h1>
            </div>

            <div className="flex-grow flex flex-col items-center pt-4 gap-8 px-10">
                <div className="flex gap-4 p-4 overflow-x-auto justify-center">
                    <div className="w-56 h-56 rounded-full border-4 border-zinc-100 p-2 shadow-inner overflow-hidden flex items-center justify-center bg-zinc-50">
                        <Image
                            src="/eagle.jpg"
                            alt="Eagle"
                            width={200}
                            height={200}
                            className="rounded-full object-cover"
                            priority
                        />
                    </div>
                </div>

                <div className="w-full max-w-xs sm:max-w-md flex flex-col sm:flex-row gap-4 mt-4">
                    <Link href="/login" className="w-full">
                        <button className="w-full h-14 bg-gradient-to-r from-zinc-900 to-zinc-700 text-white rounded-xl font-bold shadow-lg transform transition active:scale-95 hover:brightness-110 flex items-center justify-center gap-2">
                            ログイン
                        </button>
                    </Link>

                    <Link href="/register" className="w-full">
                        <button className="w-full h-14 bg-white border-2 border-zinc-200 text-zinc-900 rounded-xl font-bold shadow-sm transform transition active:scale-95 hover:bg-zinc-50 flex items-center justify-center gap-2 text-sm sm:text-base whitespace-nowrap px-4">
                            アカウントを作成
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
