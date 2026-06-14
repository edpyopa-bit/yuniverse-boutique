import React, { useState } from "react";
import { X, Lock, Mail, User, ShieldCheck, ArrowRight } from "lucide-react";
import { User as UserType } from "../types";

interface AuthModalProps {
  onClose: () => void;
  onLoginSuccess: (user: UserType, token: string) => void;
}

export default function AuthModal({ onClose, onLoginSuccess }: AuthModalProps) {
  const [isRegister, setIsRegister] = useState(false);
  const [userRole, setUserRole] = useState<"user" | "admin">("user");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    const url = isRegister ? "/api/auth/register" : "/api/auth/login";
    const body = isRegister ? { name, email, password } : { email, password };

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Terjadi kesalahan sistem, silakan coba lagi");
      }

      // Check role authorization for separate portals
      if (!isRegister && userRole === "admin" && data.user.role !== "admin") {
        throw new Error("Akun ini bukan akun Admin. Silakan pilih tab 'Pelanggan Butik'.");
      }

      onLoginSuccess(data.user, data.token);
      onClose();
    } catch (error: any) {
      setErrorMsg(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      id="auth-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-xs animate-fade-in"
    >
      <div className="bg-white rounded-3xl max-w-sm w-full mx-auto overflow-hidden shadow-2xl border border-pink-100 relative">
        {/* Close Button */}
        <button
          id="btn-close-auth-modal"
          onClick={onClose}
          className="absolute top-4 right-4 text-pink-400 hover:text-pink-700 p-1.5 rounded-full transition-colors z-10 hover:bg-pink-50"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Modal Banner Title */}
        <div className="bg-[#FFF5F6] border-b border-pink-100 p-6 text-left">
          <h3 className="font-serif text-xl font-bold text-pink-brand-dark tracking-tight leading-none mb-1.5 uppercase">
            {isRegister ? "Registrasi Akun" : "Masuk Sesi"}
          </h3>
          <p className="text-[11px] text-pink-700 font-bold tracking-wide uppercase">
            {isRegister ? "Selamat datang di Yuniverse Boutique" : "Autentikasi Aman & Eksklusif"}
          </p>
        </div>

        {/* Roles Tab (Separate portals) */}
        {!isRegister && (
          <div className="flex border-b border-pink-50 bg-[#FFF5F6]/40 p-2 gap-2">
            <button
              id="tab-role-user"
              onClick={() => {
                setUserRole("user");
                setErrorMsg("");
              }}
              className={`flex-1 py-2 text-xs tracking-wider uppercase font-semibold rounded-full transition-all flex items-center justify-center gap-1.5 ${
                userRole === "user"
                  ? "bg-pink-brand text-white shadow-xs font-bold"
                  : "text-stone-400 hover:text-pink-brand"
              }`}
            >
              🙋‍♀️ Pelanggan Butik
            </button>
            <button
              id="tab-role-admin"
              onClick={() => {
                setUserRole("admin");
                setErrorMsg("");
              }}
              className={`flex-1 py-2 text-xs tracking-wider uppercase font-semibold rounded-full transition-all flex items-center justify-center gap-1.5 ${
                userRole === "admin"
                  ? "bg-amber-600 text-white shadow-xs font-bold"
                  : "text-stone-400 hover:text-amber-700"
              }`}
            >
              🛠️ Manajemen Admin
            </button>
          </div>
        )}

        <div className="p-6">
          <form id="auth-form" onSubmit={handleSubmit} className="space-y-4 text-left">
            {/* Input: Name (Register Only) */}
            {isRegister && (
              <div>
                <label className="block text-[10px] font-bold tracking-wider text-stone-600 uppercase mb-1">
                  Nama Lengkap
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 h-4 w-4 text-pink-400" />
                  <input
                    id="auth-input-name"
                    required
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Contoh: Siti Rahma"
                    className="w-full pl-9 pr-3 py-2 border border-pink-200 focus:outline-none focus:ring-1 focus:ring-pink-brand rounded-xl text-sm bg-white"
                  />
                </div>
              </div>
            )}

            {/* Input: Email */}
            <div>
              <label className="block text-[10px] font-bold tracking-wider text-stone-600 uppercase mb-1">
                E-mail Akun
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-pink-400" />
                <input
                  id="auth-input-email"
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Contoh: sitirahma@gmail.com"
                  className="w-full pl-9 pr-3 py-2 border border-pink-200 focus:outline-none focus:ring-1 focus:ring-pink-brand rounded-xl text-sm bg-white"
                />
              </div>
            </div>

            {/* Input: Password */}
            <div>
              <label className="block text-[10px] font-bold tracking-wider text-stone-600 uppercase mb-1">
                Sandi Keamanan
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-pink-400" />
                <input
                  id="auth-input-password"
                  required
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2 border border-pink-200 focus:outline-none focus:ring-1 focus:ring-pink-brand rounded-xl text-sm bg-white font-mono"
                />
              </div>
            </div>

            {errorMsg && (
              <p id="auth-error-display" className="text-xs text-red-600 font-semibold bg-red-50 border border-red-100 p-2.5 rounded-xl">
                ⚠️ {errorMsg}
              </p>
            )}

            {/* Submit Trigger */}
            <button
              id="btn-auth-submit"
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-pink-brand hover:bg-pink-brand-dark text-white font-bold text-xs tracking-wider uppercase rounded-full flex items-center justify-center gap-2 transition-all disabled:bg-stone-300 shadow-xs cursor-pointer"
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-white/35 border-t-white rounded-full animate-spin"></span>
              ) : (
                <>
                  <span>{isRegister ? "Daftar Akun Baru" : "Masuk Ke Butik"}</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          {/* Form Toggle Switch */}
          <div className="mt-6 pt-4 border-t border-pink-50 text-center">
            {isRegister ? (
              <p className="text-xs text-stone-500">
                Sudah memiliki akun?{" "}
                <button
                  id="btn-auth-toggle-login"
                  onClick={() => {
                    setIsRegister(false);
                    setErrorMsg("");
                  }}
                  className="text-pink-brand font-bold hover:text-pink-brand-dark hover:underline"
                >
                  Masuk Sesi di Sini
                </button>
              </p>
            ) : (
              <p className="text-xs text-stone-500">
                Pelanggan baru?{" "}
                <button
                  id="btn-auth-toggle-register"
                  onClick={() => {
                    setIsRegister(true);
                    setErrorMsg("");
                  }}
                  className="text-pink-brand font-bold hover:text-pink-brand-dark hover:underline"
                >
                  Registrasi Akun Baru
                </button>
              </p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
