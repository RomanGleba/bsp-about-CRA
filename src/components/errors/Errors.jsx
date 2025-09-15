import React, { useEffect, useState } from "react";
import s from "./Errors.module.scss";

export default function Errors({ children }) {
    const [online, setOnline] = useState(navigator.onLine);

    useEffect(() => {
        const on = () => setOnline(true);
        const off = () => setOnline(false);
        window.addEventListener("online", on);
        window.addEventListener("offline", off);
        return () => {
            window.removeEventListener("online", on);
            window.removeEventListener("offline", off);
        };
    }, []);

    if (!online) {
        return (
            <div className={s.fullscreen}>
                <div className={s.icon}>
                    {/* Wi-Fi Icon */}
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        className={s.wifi}
                    >
                        <path d="M5 12.55a11 11 0 0 1 14.08 0M1.42 9a16 16 0 0 1 21.16 0M8.53 16.11a6 6 0 0 1 6.95 0M12 20h.01" />
                    </svg>

                    {/* Close Circle Icon */}
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                        className={s.close}
                    >
                        <path d="M12 22a10 10 0 1 1 0-20 10 10 0 0 1 0 20zm-1.41-7.41L12 13.17l1.41 1.42 1.41-1.42L13.41 12l1.41-1.41L13.41 9.17 12 10.59l-1.41-1.42L9.17 10.59 10.59 12l-1.42 1.41 1.42 1.41z" />
                    </svg>
                </div>

                <h1 className={s.title}>Немає інтернету</h1>
                <p className={s.subtitle}>Перевірте підключення та спробуйте ще раз</p>

                <button
                    className={s.btn}
                    onClick={() => window.location.reload()}
                >
                    Оновити сторінку
                </button>
            </div>
        );
    }

    return children;
}
