// lib/axios.ts
import axios from "axios";

const axiosInstance = axios.create({
    baseURL: "http://localhost",
    withCredentials: true, // お守りを持っていく設定
});

// 毎回リクエストを送る直前に、ブラウザのカバンから最新のお守りを探してスタンプを押します。
axiosInstance.interceptors.request.use((config) => {
    if (typeof document !== "undefined") {
        // ブラウザのカバン（document.cookie）から XSRF-TOKEN を探す
        const match = document.cookie.match(/XSRF-TOKEN=([^;]+)/);
        if (match) {
            // 見つけたら、封筒の表にスタンプ（X-XSRF-TOKEN）を押す！
            config.headers["X-XSRF-TOKEN"] = decodeURIComponent(match[1]);
        }
    }
    return config;
});

export default axiosInstance;
