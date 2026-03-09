export default function Loading() {
    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
                <div className="animate-spin h-10 w-10 border-4 border-indigo-500 rounded-full border-t-transparent mx-auto mb-4"></div>
                <p className="text-zinc-600 font-medium">読み込み中💫...🦅</p>
            </div>
        </div>
    );
}