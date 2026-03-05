"use client";

import { MessageSquare, FilePlus, Languages, Lock, ChevronRight, Database, Settings, LayoutDashboard } from "lucide-react";
import { motion } from "framer-motion";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  const navItems = [
    { id: "home", label: "工作台", icon: LayoutDashboard, disabled: false },
    { id: "qa", label: "知识问答", icon: MessageSquare, disabled: false },
    { id: "gen", label: "文档生成", icon: FilePlus, disabled: false },
    { id: "trans", label: "文档翻译", icon: Languages, disabled: false },
    { id: "mgmt", label: "知识库管理", icon: Database, disabled: false },
    { id: "admin", label: "管理员控制台", icon: Settings, disabled: false },
  ];

  return (
    <div className="w-[280px] h-screen fixed left-0 top-0 bg-clinical-blue text-white flex flex-col z-50 shadow-2xl">
      {/* Background Decorative Element */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -left-24 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -right-12 w-32 h-32 bg-blue-400/10 rounded-full blur-2xl" />
      </div>

      <div className="p-8 relative z-10">
        <div className="flex flex-col mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-white rounded-xl shadow-lg">
              <img src="/logo.png" alt="Boston Scientific Logo" className="w-12 h-12 object-contain" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">Boston Scientific</h1>
              <p className="text-[10px] text-white/50 uppercase tracking-[0.2em]">iKnow Platform</p>
            </div>
          </div>
          <div className="h-px w-full bg-white/10" />
        </div>

        <nav className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => !item.disabled && setActiveTab(item.id)}
                disabled={item.disabled}
                className={`w-full group relative flex items-center gap-4 px-4 py-4 rounded-xl transition-all duration-300 ${
                  isActive
                    ? "bg-white text-clinical-blue shadow-lg"
                    : item.disabled
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-white/10 text-white/70 hover:text-white"
                }`}
              >
                <div className={`p-2 rounded-lg transition-colors ${
                  isActive ? "bg-clinical-blue/10" : "bg-white/5 group-hover:bg-white/10"
                }`}>
                  <Icon size={20} />
                </div>
                <span className="font-medium flex-1 text-left">{item.label}</span>
                {item.disabled ? (
                  <Lock size={14} className="text-white/30" />
                ) : isActive ? (
                  <motion.div
                    layoutId="active-indicator"
                    className="w-1.5 h-1.5 bg-clinical-blue rounded-full"
                  />
                ) : (
                  <ChevronRight size={16} className="opacity-0 group-hover:opacity-40 transition-opacity" />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      <div className="mt-auto p-8">
        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
          <p className="text-xs text-white/40 mb-2">系统状态</p>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
            <span className="text-sm font-medium">医疗级 AI 已就绪</span>
          </div>
        </div>
      </div>
    </div>
  );
}
