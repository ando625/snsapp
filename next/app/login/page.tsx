
import LoginForm from "../components/LoginForm";
import Link from "next/link";

export default function LoginPage() {

    return (
        <div className="flex flex-col items-center justify-center min-h-full px-6 py-12 ">
            <div className="mb-10 text-center">
                <h1 className="text-3xl font-bold tracking-tighter text-zinc-900">
                    ログイン画面
                </h1>
            </div>

            <LoginForm />

            <div>
                <Link href="/register" className="text-blue-600 text-sm">
                    会員登録はこちら
                </Link>
            </div>
        </div>
    );
}
