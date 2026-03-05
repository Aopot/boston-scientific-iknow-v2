"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Users, 
  MessageSquare, 
  ShieldCheck, 
  Cpu, 
  TrendingUp, 
  Activity, 
  AlertTriangle, 
  CheckCircle2, 
  Settings2, 
  Lock,
  Sliders,
  Database,
  Search,
  ArrowUpRight
} from "lucide-react";

const auditLogs = [
  { user: "张伟", dept: "Cardiology", action: "生成 PRER 报告", time: "2024-03-05 14:20", status: "Success", sensitive: false },
  { user: "李娜", dept: "Compliance", action: "访问敏感临床数据", time: "2024-03-05 13:45", status: "Success", sensitive: true },
  { user: "王强", dept: "R&D", action: "更新术语库 v4.2", time: "2024-03-05 11:30", status: "Success", sensitive: false },
  { user: "Sarah Miller", dept: "Legal", action: "导出合规性审计表", time: "2024-03-05 10:15", status: "Success", sensitive: false },
  { user: "陈静", dept: "Neuromodulation", action: "启动文档翻译任务", time: "2024-03-05 09:00", status: "Success", sensitive: false },
];

export default function AdminConsole() {
  const [activeModel, setActiveModel] = useState("medical-gpt4");
  const [temperature, setTemperature] = useState(0.3);
  const [isDeIDEnabled, setIsDeIDEnabled] = useState(true);

  const stats = [
    { label: "活跃用户 (Active Users)", value: "1,240", trend: "+5%", icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "每日查询 (Daily Queries)", value: "8,500", trend: "+12%", icon: MessageSquare, color: "text-indigo-600", bg: "bg-indigo-50" },
    { label: "合规得分 (Compliance Score)", value: "99.8%", trend: "Stable", icon: ShieldCheck, color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "Token 使用量 (Usage)", value: "68%", trend: "Within Quota", icon: Cpu, color: "text-amber-600", bg: "bg-amber-50" },
  ];

  return (
    <div className="h-full flex flex-col space-y-8 overflow-y-auto pr-2 custom-scrollbar pb-12">
      {/* Header */}
      <div className="flex items-end justify-between shrink-0">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-bold border border-slate-800">
            <Settings2 size={12} />
            超级管理员控制台
          </div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">系统管理与审计</h1>
          <p className="text-slate-500 max-w-2xl">
            全局监控平台运行状态，配置 AI 模型参数，并审计所有敏感数据访问记录。
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 shrink-0">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-[32px] border border-slate-200/60 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color}`}>
                <stat.icon size={20} />
              </div>
              <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">
                <TrendingUp size={10} />
                {stat.trend}
              </div>
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
            <p className="text-2xl font-black text-slate-800 tracking-tight">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Audit Log */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-[32px] border border-slate-200/60 shadow-sm overflow-hidden flex flex-col">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <Activity size={16} className="text-clinical-blue" />
                实时审计日志 (Real-time Audit Log)
              </h3>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                <input 
                  type="text" 
                  placeholder="搜索记录..." 
                  className="pl-9 pr-4 py-1.5 rounded-lg bg-white border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-clinical-blue/10"
                />
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50">
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">用户</th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">部门</th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">操作行为</th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">时间</th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">状态</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {auditLogs.map((log, i) => (
                    <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 text-sm font-bold text-slate-700">{log.user}</td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 rounded-md bg-slate-100 text-slate-500 text-[10px] font-bold">{log.dept}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-slate-600">{log.action}</span>
                          {log.sensitive && (
                            <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-600 text-[9px] font-black flex items-center gap-1 border border-amber-100 animate-pulse">
                              <AlertTriangle size={10} /> SENSITIVE
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-xs text-slate-400 font-medium">{log.time}</td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1.5 text-emerald-500 font-bold text-[11px]">
                          <CheckCircle2 size={12} />
                          {log.status}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-4 bg-slate-50/50 border-t border-slate-100 text-center">
              <button className="text-[11px] font-bold text-clinical-blue hover:underline flex items-center gap-1 mx-auto">
                查看完整审计报告 <ArrowUpRight size={12} />
              </button>
            </div>
          </div>
        </div>

        {/* Right: Controls */}
        <div className="space-y-6">
          {/* Model Control Center */}
          <div className="bg-white rounded-[32px] border border-slate-200/60 shadow-sm p-8 space-y-8">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2 mb-2">
              <Cpu size={16} className="text-clinical-blue" />
              模型控制中心 (Model Control)
            </h3>
            
            <div className="space-y-4">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">当前活跃模型</p>
              <div className="grid grid-cols-1 gap-2">
                {[
                  { id: "medical-gpt4", name: "Medical Fine-tuned GPT-4", desc: "最高精度，适用于报告生成" },
                  { id: "base-model", name: "Base GPT-4 Model", desc: "通用模型，响应速度更快" },
                ].map((model) => (
                  <button
                    key={model.id}
                    onClick={() => setActiveModel(model.id)}
                    className={`text-left p-4 rounded-2xl border transition-all ${
                      activeModel === model.id 
                        ? "border-clinical-blue bg-blue-50/50 ring-2 ring-clinical-blue/10" 
                        : "border-slate-100 hover:border-slate-200"
                    }`}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className={`text-sm font-bold ${activeModel === model.id ? "text-clinical-blue" : "text-slate-700"}`}>
                        {model.name}
                      </span>
                      {activeModel === model.id && <CheckCircle2 size={14} className="text-clinical-blue" />}
                    </div>
                    <p className="text-[10px] text-slate-400 font-medium">{model.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">模型温度 (Temperature)</p>
                <span className="text-xs font-black text-clinical-blue">{temperature}</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="1" 
                step="0.1" 
                value={temperature}
                onChange={(e) => setTemperature(parseFloat(e.target.value))}
                className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-clinical-blue"
              />
              <div className="flex justify-between text-[9px] font-bold text-slate-400 uppercase tracking-tighter">
                <span>Precision (精确)</span>
                <span>Creativity (创意)</span>
              </div>
            </div>
          </div>

          {/* Data Privacy Toggle */}
          <div className="bg-slate-900 rounded-[32px] p-8 text-white space-y-6 shadow-xl shadow-slate-200/50">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/10 rounded-xl">
                <Lock size={18} className="text-white" />
              </div>
              <h3 className="text-sm font-bold">隐私与数据脱敏</h3>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10">
                <div className="space-y-1">
                  <p className="text-sm font-bold">自动脱敏 (De-ID)</p>
                  <p className="text-[10px] text-white/40">自动掩盖患者姓名与 PII 信息</p>
                </div>
                <div 
                  onClick={() => setIsDeIDEnabled(!isDeIDEnabled)}
                  className={`w-12 h-6 rounded-full relative cursor-pointer transition-all ${isDeIDEnabled ? "bg-clinical-blue" : "bg-white/20"}`}
                >
                  <motion.div 
                    animate={{ left: isDeIDEnabled ? "28px" : "4px" }}
                    className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-lg" 
                  />
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                <div className="flex items-center gap-2 text-[10px] font-bold text-white/60">
                  <Database size={12} />
                  数据保留策略
                </div>
                <select className="w-full bg-transparent border-none text-xs font-bold focus:ring-0 cursor-pointer">
                  <option className="bg-slate-900">30 天后自动物理删除</option>
                  <option className="bg-slate-900">90 天后自动物理删除</option>
                  <option className="bg-slate-900">永久保留 (不建议)</option>
                </select>
              </div>
            </div>
            
            <p className="text-[10px] text-white/30 italic leading-relaxed">
              * 所有配置变更都将被记录在审计日志中，并同步至合规性仪表盘。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
