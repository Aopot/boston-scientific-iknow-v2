"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Database, 
  FileText, 
  RefreshCw, 
  HardDrive, 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal, 
  Shield, 
  ShieldCheck, 
  ShieldAlert,
  Edit2,
  Trash2,
  X,
  Users,
  Lock,
  ChevronRight
} from "lucide-react";

const departments = ["全部部门", "Cardiology", "Neuromodulation", "Compliance", "HR", "R&D"];

const libraryData = [
  {
    id: 1,
    name: "Polaris System Manual v2.0",
    department: "Cardiovascular",
    permission: "Internal",
    lastSync: "2024-03-05 14:30",
    size: "12.4 MB",
    status: "Synced"
  },
  {
    id: 2,
    name: "FDA Compliance Guidelines 2024",
    department: "Compliance",
    permission: "Confidential - L3",
    lastSync: "2024-03-04 09:15",
    size: "4.8 MB",
    status: "Synced"
  },
  {
    id: 3,
    name: "Neuromodulation Patient Protocols",
    department: "Neuromodulation",
    permission: "Internal",
    lastSync: "2024-03-05 11:45",
    size: "8.2 MB",
    status: "Syncing"
  },
  {
    id: 4,
    name: "Global HR Onboarding Docs",
    department: "HR",
    permission: "Public",
    lastSync: "2024-02-28 16:20",
    size: "15.1 MB",
    status: "Synced"
  },
  {
    id: 5,
    name: "R&D Stent Material Research",
    department: "R&D",
    permission: "Confidential - L3",
    lastSync: "2024-03-05 08:00",
    size: "24.6 MB",
    status: "Synced"
  }
];

export default function KnowledgeManagement() {
  const [activeDept, setActiveDept] = useState("全部部门");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSource, setSelectedSource] = useState<any>(null);

  const stats = [
    { label: "总文档数量", value: "1,284", icon: FileText, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "同步状态 (实时)", value: "98.2%", icon: RefreshCw, color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "已用存储空间", value: "4.2 GB", icon: HardDrive, color: "text-amber-600", bg: "bg-amber-50" },
  ];

  const getPermissionBadge = (level: string) => {
    switch (level) {
      case "Public":
        return <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 text-[11px] font-bold flex items-center gap-1.5 w-fit"><Shield size={12} /> {level}</span>;
      case "Internal":
        return <span className="px-2.5 py-1 rounded-full bg-blue-50 text-clinical-blue text-[11px] font-bold flex items-center gap-1.5 w-fit"><ShieldCheck size={12} /> {level}</span>;
      case "Confidential - L3":
        return <span className="px-2.5 py-1 rounded-full bg-rose-50 text-rose-600 text-[11px] font-bold flex items-center gap-1.5 w-fit"><ShieldAlert size={12} /> {level}</span>;
      default:
        return level;
    }
  };

  return (
    <div className="h-full flex flex-col space-y-8 overflow-hidden">
      {/* Header */}
      <div className="flex items-end justify-between shrink-0">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-clinical-blue/5 text-clinical-blue text-xs font-bold border border-clinical-blue/10">
            <Database size={12} />
            中心化知识调度枢纽
          </div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">知识库管理</h1>
          <p className="text-slate-500 max-w-2xl">
            管理跨部门数据源，配置精细化的 AI 访问权限与数据同步任务。
          </p>
        </div>
        <button className="px-6 py-3 bg-clinical-blue text-white rounded-xl font-bold flex items-center gap-2 hover:bg-blue-700 transition-all shadow-lg shadow-clinical-blue/20 active:scale-95">
          <Plus size={20} />
          添加新数据源
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 shrink-0">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl border border-slate-200/60 shadow-sm flex items-center gap-5">
            <div className={`p-4 rounded-2xl ${stat.bg} ${stat.color}`}>
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{stat.label}</p>
              <p className="text-2xl font-black text-slate-800 tracking-tight">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Content Area */}
      <div className="flex-1 flex gap-8 overflow-hidden">
        {/* Left Filter Sidebar */}
        <div className="w-56 shrink-0 space-y-2 overflow-y-auto pr-2 custom-scrollbar">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-4 mb-4">部门细分</p>
          {departments.map((dept) => (
            <button
              key={dept}
              onClick={() => setActiveDept(dept)}
              className={`w-full text-left px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                activeDept === dept 
                  ? "bg-clinical-blue text-white shadow-md shadow-clinical-blue/20" 
                  : "text-slate-500 hover:bg-white hover:text-clinical-blue"
              }`}
            >
              {dept}
            </button>
          ))}
        </div>

        {/* Right Table Area */}
        <div className="flex-1 bg-white rounded-[32px] border border-slate-200/60 shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
            <div className="relative w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="text" 
                placeholder="搜索数据源名称..." 
                className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-white border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-clinical-blue/10 focus:border-clinical-blue transition-all"
              />
            </div>
            <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all">
              <Filter size={16} />
              高级筛选
            </button>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar">
            <table className="w-full text-left border-collapse">
              <thead className="sticky top-0 bg-white z-10 shadow-[0_1px_0_0_rgba(0,0,0,0.05)]">
                <tr>
                  <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">数据源名称</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">部门标签</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">权限等级</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">最后同步时间</th>
                  <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {libraryData.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-slate-100 rounded-lg text-slate-500 group-hover:bg-blue-50 group-hover:text-clinical-blue transition-colors">
                          <FileText size={18} />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-slate-800 group-hover:text-clinical-blue transition-colors">{item.name}</span>
                          <span className="text-[10px] text-slate-400 font-medium">{item.size}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-500 text-[11px] font-bold">
                        {item.department}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      {getPermissionBadge(item.permission)}
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2">
                        {item.status === "Syncing" ? (
                          <RefreshCw size={14} className="text-clinical-blue animate-spin" />
                        ) : (
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        )}
                        <span className="text-xs font-medium text-slate-600">{item.lastSync}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => { setSelectedSource(item); setIsModalOpen(true); }}
                          className="p-2 hover:bg-blue-50 text-slate-400 hover:text-clinical-blue rounded-lg transition-all" 
                          title="权限管理"
                        >
                          <Users size={18} />
                        </button>
                        <button className="p-2 hover:bg-slate-100 text-slate-400 hover:text-slate-600 rounded-lg transition-all" title="编辑">
                          <Edit2 size={18} />
                        </button>
                        <button className="p-2 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-lg transition-all" title="删除">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Permission Modal (Visual Only) */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-[40px] shadow-2xl overflow-hidden border border-white/20"
            >
              <div className="px-10 pt-10 pb-6 flex items-center justify-between border-b border-slate-100">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-clinical-blue rounded-2xl text-white shadow-lg shadow-clinical-blue/20">
                    <Users size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">访问权限管理</h3>
                    <p className="text-xs text-slate-500 mt-0.5">{selectedSource?.name}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-10 space-y-8">
                <div className="space-y-4">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">角色访问控制 (RBAC)</p>
                  <div className="space-y-3">
                    {[
                      { role: "Medical Reps (医药代表)", access: true },
                      { role: "Clinical Engineers (临床工程师)", access: true },
                      { role: "Quality Assurance (质量保证)", access: true },
                      { role: "External Partners (外部合作伙伴)", access: false },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100">
                        <span className="text-sm font-bold text-slate-700">{item.role}</span>
                        <div className={`w-12 h-6 rounded-full relative cursor-pointer transition-all ${item.access ? "bg-clinical-blue" : "bg-slate-300"}`}>
                          <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${item.access ? "left-7" : "left-1"}`} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-blue-50/50 border border-blue-100 flex gap-4">
                  <div className="shrink-0 p-2 bg-white rounded-xl text-clinical-blue shadow-sm h-fit">
                    <Lock size={18} />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-clinical-blue">强制执行 L3 级加密</p>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      由于该数据源包含敏感临床研究数据，系统已自动启用端到端加密与访问审计追踪。
                    </p>
                  </div>
                </div>
              </div>

              <div className="px-10 py-8 bg-slate-50 border-t border-slate-100 flex gap-4">
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-3.5 bg-clinical-blue text-white rounded-2xl font-bold shadow-lg shadow-clinical-blue/20 hover:bg-blue-700 transition-all active:scale-95"
                >
                  保存权限设置
                </button>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="px-8 py-3.5 bg-white border border-slate-200 text-slate-600 rounded-2xl font-bold hover:bg-slate-100 transition-all"
                >
                  取消
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
