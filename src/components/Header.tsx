"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Bell, 
  ChevronDown, 
  Settings, 
  Shield, 
  HelpCircle, 
  LogOut,
  ChevronRight
} from "lucide-react";

interface HeaderProps {
  activeTab: string;
  onLogout: () => void;
}

export default function Header({ activeTab, onLogout }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [hasNotification, setHasNotification] = useState(true);

  // Breadcrumb mapping logic
  const getBreadcrumbs = () => {
    switch (activeTab) {
      case "home":
        return [{ label: "首页", current: true }];
      case "qa":
        return [
          { label: "知识问答", current: false },
          { label: "临床技术支持", current: true }
        ];
      case "gen":
        return [
          { label: "写报告", current: false },
          { label: "定期风险评估报告 (PRER)", current: true }
        ];
      case "trans":
        return [
          { label: "文档翻译", current: false },
          { label: "医学文献转换", current: true }
        ];
      case "mgmt":
        return [
          { label: "知识库管理", current: false },
          { label: "部门数据源", current: true }
        ];
      case "admin":
        return [
          { label: "管理员控制台", current: false },
          { label: "系统审计与配置", current: true }
        ];
      default:
        return [{ label: "首页", current: true }];
    }
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <header className="sticky top-0 z-40 flex items-center justify-between h-20 mb-8 shrink-0 bg-background/80 backdrop-blur-md border-b border-slate-100 px-2">
      {/* Left: Breadcrumbs */}
      <nav className="flex items-center gap-3">
        {breadcrumbs.map((crumb, index) => (
          <div key={index} className="flex items-center gap-3">
            {index > 0 && <ChevronRight size={14} className="text-slate-300" />}
            <span className={`text-sm tracking-tight ${
              crumb.current 
                ? "text-slate-800 font-semibold" 
                : "text-slate-400 font-medium"
            }`}>
              {crumb.label}
            </span>
          </div>
        ))}
      </nav>

      <div className="flex items-center gap-6">
        {/* Notifications */}
        <button className="relative p-2.5 bg-white border border-slate-200 rounded-xl text-slate-500 hover:text-clinical-blue hover:border-clinical-blue/20 transition-all shadow-sm">
          <Bell size={20} />
          {hasNotification && (
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white animate-pulse" />
          )}
        </button>

        {/* User Profile */}
        <div className="relative">
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="flex items-center gap-3 p-1.5 pr-4 bg-white border border-slate-200 rounded-2xl hover:border-clinical-blue/20 transition-all shadow-sm group"
          >
            <div className="w-10 h-10 rounded-[14px] bg-gradient-to-br from-clinical-blue to-blue-400 flex items-center justify-center text-white font-bold text-lg border-2 border-white shadow-sm overflow-hidden">
              K
            </div>
            <div className="flex flex-col text-left">
              <span className="text-sm font-bold text-slate-800 group-hover:text-clinical-blue transition-colors">
                Kevin
              </span>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                质量保证部 / QA
              </span>
            </div>
            <ChevronDown 
              size={16} 
              className={`text-slate-400 transition-transform duration-300 ${isMenuOpen ? "rotate-180" : ""}`} 
            />
          </button>

          {/* Dropdown Menu */}
          <AnimatePresence>
            {isMenuOpen && (
              <>
                <div 
                  className="fixed inset-0 z-10" 
                  onClick={() => setIsMenuOpen(false)}
                />
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 mt-3 w-56 bg-white rounded-[24px] shadow-2xl shadow-slate-200 border border-slate-100 py-3 z-20 overflow-hidden"
                >
                  <div className="px-4 py-2 mb-2">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">账号管理</p>
                  </div>
                  
                  <button className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-slate-600 hover:bg-slate-50 hover:text-clinical-blue transition-all group">
                    <div className="p-1.5 bg-slate-100 rounded-lg group-hover:bg-blue-50 transition-colors">
                      <Settings size={16} />
                    </div>
                    个人设置
                  </button>
                  
                  <button className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-slate-600 hover:bg-slate-50 hover:text-clinical-blue transition-all group">
                    <div className="p-1.5 bg-slate-100 rounded-lg group-hover:bg-blue-50 transition-colors">
                      <Shield size={16} />
                    </div>
                    权限查看
                  </button>
                  
                  <button className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-slate-600 hover:bg-slate-50 hover:text-clinical-blue transition-all group">
                    <div className="p-1.5 bg-slate-100 rounded-lg group-hover:bg-blue-50 transition-colors">
                      <HelpCircle size={16} />
                    </div>
                    帮助文档
                  </button>

                  <div className="h-px bg-slate-50 my-2" />
                  
                  <button 
                    onClick={onLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-rose-500 hover:bg-rose-50 transition-all group"
                  >
                    <div className="p-1.5 bg-rose-50 rounded-lg text-rose-500">
                      <LogOut size={16} />
                    </div>
                    退出登录
                  </button>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
