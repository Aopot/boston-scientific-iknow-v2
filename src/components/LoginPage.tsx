"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, ArrowRight, Lock, User, KeyRound, ChevronLeft } from "lucide-react";

interface LoginPageProps {
  onLogin: () => void;
}

export default function LoginPage({ onLogin }: LoginPageProps) {
  const [loginMode, setLoginMode] = useState<"sso" | "credentials">("sso");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleCredentialsLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username && password) {
      onLogin();
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url("/background_image.jpeg")' }}
      >
        <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]" />
      </div>

      <div className="relative z-10 w-full max-w-[440px] px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="bg-white rounded-[40px] shadow-2xl shadow-blue-900/10 border border-slate-100 p-10 flex flex-col items-center"
        >
          {/* Logo Container */}
          <div className="mb-8 p-6 bg-white rounded-[32px] shadow-sm border border-slate-50">
            <img src="/logo.png" alt="Boston Scientific Logo" className="w-28 h-28 object-contain" />
          </div>

          <div className="text-center mb-10">
            <h1 className="text-2xl font-black text-slate-900 mb-2 tracking-tight">iKnow 平台登录</h1>
            <p className="text-slate-400 text-xs font-medium leading-relaxed italic">
              "Advancing Science for Life — Artificial Intelligence for Life."
            </p>
          </div>

          <AnimatePresence mode="wait">
            {loginMode === "sso" ? (
              <motion.div
                key="sso"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="w-full"
              >
                {/* SSO Button */}
                <button
                  onClick={onLogin}
                  className="group w-full py-4 bg-clinical-blue text-white rounded-2xl font-bold flex items-center justify-center gap-3 shadow-xl shadow-clinical-blue/20 hover:bg-blue-700 transition-all active:scale-[0.98] mb-6"
                >
                  <Shield size={20} />
                  Single Sign-On (SSO) 登录
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  onClick={() => setLoginMode("credentials")}
                  className="w-full py-4 bg-slate-50 text-slate-600 rounded-2xl font-bold text-sm hover:bg-slate-100 transition-all mb-8 border border-slate-100"
                >
                  使用账号密码登录
                </button>
              </motion.div>
            ) : (
              <motion.div
                key="credentials"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="w-full"
              >
                <form onSubmit={handleCredentialsLogin} className="space-y-4 mb-6">
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                      type="text"
                      placeholder="用户名 / 邮箱"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-clinical-blue/10 focus:border-clinical-blue transition-all"
                      required
                    />
                  </div>
                  <div className="relative">
                    <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                      type="password"
                      placeholder="密码"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-clinical-blue/10 focus:border-clinical-blue transition-all"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-4 bg-clinical-blue text-white rounded-2xl font-bold shadow-lg shadow-clinical-blue/20 hover:bg-blue-700 transition-all active:scale-[0.98]"
                  >
                    立即登录
                  </button>
                </form>

                <button
                  onClick={() => setLoginMode("sso")}
                  className="w-full flex items-center justify-center gap-2 text-slate-400 hover:text-clinical-blue transition-colors text-xs font-bold mb-8"
                >
                  <ChevronLeft size={16} />
                  返回 SSO 登录
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="w-full flex items-center gap-4 mb-8">
            <div className="h-px flex-1 bg-slate-100" />
            <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">企业内部门户</span>
            <div className="h-px flex-1 bg-slate-100" />
          </div>

          <div className="flex items-center gap-2 text-slate-400">
            <Lock size={14} />
            <span className="text-xs font-medium">受安全策略保护的内部访问</span>
          </div>
        </motion.div>

        {/* Footer info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="mt-8 text-center"
        >
          <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest">
            © 2026 Boston Scientific Corporation. All rights reserved.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
