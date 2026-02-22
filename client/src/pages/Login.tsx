import { useState } from "react";
import { Link } from "wouter";

export default function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const API_BASE = (import.meta.env.VITE_API_BASE || "").replace(/\/$/, "");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const res = await fetch(`${API_BASE}/api/admin-login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ username, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || "Giriş başarısız");
                return;
            }

            // Redirect to admin panel
            window.location.href = "/admin";
        } catch {
            setError("Sunucuya bağlanılamadı");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="w-full max-w-md px-4">
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    {/* Logo */}
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-xl flex items-center justify-center">
                            <i className="ri-shield-keyhole-line text-3xl text-primary"></i>
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900">Yönetici Girişi</h1>
                        <p className="text-sm text-gray-500 mt-2">
                            Admin paneline erişmek için giriş yapın
                        </p>
                    </div>

                    {/* Error */}
                    {error && (
                        <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm flex items-center gap-2">
                            <i className="ri-error-warning-line text-lg"></i>
                            {error}
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                Kullanıcı Adı
                            </label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-gray-900"
                                placeholder="admin"
                                required
                                autoFocus
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                Şifre
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-gray-900"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                                    Giriş yapılıyor...
                                </>
                            ) : (
                                <>
                                    <i className="ri-login-box-line"></i>
                                    Giriş Yap
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <Link href="/" className="text-sm text-gray-500 hover:text-primary transition-colors">
                            ← Ana Sayfaya Dön
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
