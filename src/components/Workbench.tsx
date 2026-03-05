"use client";

import { motion } from "framer-motion";
import { 
  MessageSquare, 
  FilePlus, 
  Languages, 
  Database, 
  TrendingUp, 
  Clock, 
  ChevronRight, 
  Sparkles,
  Zap,
  ShieldCheck,
  ArrowRight
} from "lucide-react";

interface WorkbenchProps {
  onNavigate: (tab: string) => void;
}

export default function Workbench({ onNavigate }: WorkbenchProps) {
  const quickActions = [
    { id: "qa", label: "发起知识问答", icon: MessageSquare, color: "bg-blue-50 text-blue-600", desc: "基于 RAG 的临床知识检索" },
    { id: "gen", label: "生成合规报告", icon: FilePlus, color: "bg-emerald-50 text-emerald-600", desc: "快速编制 PRER/SOP 等文档" },
    { id: "trans", label: "专业文档翻译", icon: Languages, color: "bg-indigo-50 text-indigo-600", desc: "集成术语库的高精度翻译" },
    { id: "mgmt", label: "管理数据源", icon: Database, color: "bg-amber-50 text-amber-600", desc: "配置部门级知识库权限" },
  ];

  const recentActivities = [
    { type: "report", title: "定期风险评估报告 (PRER) v1.0.4", time: "10 分钟前", status: "已生成" },
    { type: "qa", title: "咨询：Polaris 系统环境压力标准", time: "1 小时前", status: "已解答" },
    { type: "trans", title: "依维莫司支架技术指南 (EN -> ZH)", time: "3 小时前", status: "已完成" },
  ];

  return (
    <div className="h-full flex flex-col space-y-8 overflow-y-auto pr-2 custom-scrollbar pb-12">
      {/* Welcome Area */}
      <div className="flex items-end justify-between shrink-0">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-clinical-blue/5 text-clinical-blue text-xs font-bold border border-clinical-blue/10">
            <Zap size={12} className="fill-current" />
            早上好，Kevin
          </div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">您的智能工作台</h1>
          <p className="text-slate-500 max-w-2xl">
            欢迎回到 Boston Scientific iKnow 平台。今天您可以快速处理报告编制、知识检索或管理跨部门数据。
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-200 shadow-sm text-sm font-bold text-slate-600">
          <Clock size={16} className="text-clinical-blue" />
          2026年3月5日
        </div>
      </div>

      {/* Hero Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 shrink-0">
        <div className="col-span-2 relative bg-slate-900 rounded-[32px] p-8 text-white overflow-hidden shadow-2xl shadow-blue-900/20">
          <div className="absolute top-0 right-0 p-12 opacity-10">
            <Sparkles size={160} />
          </div>
          <div className="relative z-10 flex flex-col h-full justify-between">
            <div>
              <div className="flex items-center gap-2 text-blue-400 font-bold text-xs uppercase tracking-widest mb-4">
                <ShieldCheck size={14} />
                医疗级 AI 引擎已就绪
              </div>
              <h2 className="text-2xl font-bold mb-4 max-w-md leading-tight">
                使用 AI 辅助生成合规报告，编制效率提升 <span className="text-blue-400">85%</span>
              </h2>
            </div>
            <button 
              onClick={() => onNavigate("gen")}
              className="w-fit px-6 py-3 bg-clinical-blue text-white rounded-xl font-bold flex items-center gap-2 hover:bg-blue-700 transition-all shadow-lg shadow-clinical-blue/40"
            >
              立即开始写报告
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
        <div className="bg-white rounded-[32px] border border-slate-200/60 p-8 flex flex-col justify-between shadow-sm">
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">知识库索引量</p>
            <p className="text-4xl font-black text-slate-800 tracking-tighter">14,280</p>
            <div className="flex items-center gap-1.5 mt-2 text-emerald-600 font-bold text-xs">
              <TrendingUp size={14} />
              +12.5% 本周新增
            </div>
          </div>
          <div className="h-px w-full bg-slate-100 my-6" />
          <div className="space-y-3">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">活跃 AI 模型</p>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-bold text-slate-700">Medical Fine-tuned GPT-4</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Quick Access */}
        <div className="lg:col-span-2 space-y-6">
          <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] px-2">快捷入口 (Quick Access)</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {quickActions.map((action) => (
              <button
                key={action.id}
                onClick={() => onNavigate(action.id)}
                className="group p-6 bg-white rounded-[28px] border border-slate-200/60 shadow-sm hover:shadow-xl hover:border-clinical-blue/20 transition-all text-left"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-2xl ${action.color} shadow-sm group-hover:scale-110 transition-transform`}>
                    <action.icon size={24} />
                  </div>
                  <ChevronRight size={18} className="text-slate-300 group-hover:text-clinical-blue group-hover:translate-x-1 transition-all" />
                </div>
                <h4 className="text-lg font-bold text-slate-800 mb-1 group-hover:text-clinical-blue transition-colors">{action.label}</h4>
                <p className="text-xs text-slate-400 font-medium">{action.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="space-y-6">
          <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] px-2">最近动态 (Recent)</h3>
          <div className="bg-white rounded-[32px] border border-slate-200/60 shadow-sm p-6 space-y-6">
            {recentActivities.map((activity, i) => (
              <div key={i} className="flex gap-4 relative group">
                {i !== recentActivities.length - 1 && (
                  <div className="absolute left-[19px] top-[40px] w-px h-[30px] bg-slate-100" />
                )}
                <div className="w-10 h-10 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0 group-hover:bg-blue-50 group-hover:border-blue-100 transition-colors">
                  {activity.type === "report" && <FilePlus size={16} className="text-slate-400 group-hover:text-clinical-blue" />}
                  {activity.type === "qa" && <MessageSquare size={16} className="text-slate-400 group-hover:text-clinical-blue" />}
                  {activity.type === "trans" && <Languages size={16} className="text-slate-400 group-hover:text-clinical-blue" />}
                </div>
                <div className="flex flex-col gap-1">
                  <p className="text-sm font-bold text-slate-800 line-clamp-1">{activity.title}</p>
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-medium text-slate-400">{activity.time}</span>
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">{activity.status}</span>
                  </div>
                </div>
              </div>
            ))}
            <button className="w-full py-3 text-xs font-bold text-slate-400 hover:text-clinical-blue transition-colors border-t border-slate-50 pt-6">
              查看所有历史记录
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
