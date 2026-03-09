import Link from "next/link";
import RegisterForm from "../components/RegisterForm";

export default function RegisterPage() {
    return (
        <div className="flex flex-col items-center min-h-full px-6 py-12 ">
            <div className="mb-2 text-center">
                <h1 className="text-3xl font-bold tracking-tighter text-zinc-900">
                    新規会員登録画面
                </h1>
            </div>

            <RegisterForm />

            <div>
                <Link href="/login" className="text-blue-600 text-sm">
                    ログインはこちら
                </Link>
            </div>
        </div>
    );
}
