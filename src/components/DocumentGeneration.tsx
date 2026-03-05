"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ClipboardCheck, 
  ShieldCheck, 
  FileText, 
  Stethoscope, 
  Activity, 
  Settings, 
  ChevronRight, 
  Plus, 
  Sparkles 
} from "lucide-react";
import PRERWorkflow from "./PRERWorkflow";

const templates = [
  {
    id: 1,
    title: "定期风险评估报告 PRER",
    description: "自动汇总产品上市后的安全性数据，进行周期性的风险与获益分析评估。",
    icon: ShieldCheck,
    color: "bg-emerald-50 text-emerald-600 border-emerald-100",
    tag: "Safety",
    slug: "prer",
  },
  {
    id: 2,
    title: "召回事件报告",
    description: "针对识别出的潜在缺陷或安全隐患，快速生成标准化的产品召回通告与流程报告。",
    icon: Activity,
    color: "bg-rose-50 text-rose-600 border-rose-100",
    tag: "Urgent",
  },
  {
    id: 3,
    title: "医疗器械质量管理评审报告",
    description: "系统性评估质量管理体系的适宜性、充分性和有效性，汇总各部门质量指标。",
    icon: ClipboardCheck,
    color: "bg-blue-50 text-blue-600 border-blue-100",
    tag: "QMS",
  },
  {
    id: 4,
    title: "临床试验研究中心稽查报告",
    description: "针对临床试验站点进行合规性稽查，评估 GCP 执行情况及原始数据的真实性。",
    icon: Stethoscope,
    color: "bg-indigo-50 text-indigo-600 border-indigo-100",
    tag: "Clinical",
  },
  {
    id: 5,
    title: "医疗器械质量体系内部审核报告",
    description: "详尽记录内部质量审计发现项，评估生产与管理流程对 ISO 13485 标准的符合度。",
    icon: FileText,
    color: "bg-amber-50 text-amber-600 border-amber-100",
    tag: "Audit",
  },
  {
    id: 6,
    title: "临床供应商周期性稽查报告",
    description: "定期对外部临床服务供应商（CRO/SMO）进行能力评估与合规性审查记录。",
    icon: Settings,
    color: "bg-slate-50 text-slate-600 border-slate-100",
    tag: "Supplier",
  },
];

export default function DocumentGeneration() {
  const [activeWorkflow, setActiveWorkflow] = useState<string | null>(null);

  if (activeWorkflow === "prer") {
    return <PRERWorkflow onBack={() => setActiveWorkflow(null)} />;
  }

  return (
    <div className="h-full flex flex-col space-y-8">
      {/* Header Area */}
      <div className="flex items-end justify-between">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-clinical-blue/5 text-clinical-blue text-xs font-bold border border-clinical-blue/10">
            <Sparkles size={12} className="animate-pulse" />
            AI 驱动的文档引擎
          </div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">智能文档生成</h1>
          <p className="text-slate-500 max-w-2xl">
            选择下方的专业模板，AI 将基于最新的医学数据和合规要求为您快速生成高质量的专业文档。
          </p>
        </div>
        <button className="px-6 py-3 bg-clinical-blue text-white rounded-xl font-bold flex items-center gap-2 hover:bg-blue-700 transition-all shadow-lg shadow-clinical-blue/20 active:scale-95">
          <Plus size={20} />
          新建自定义模板
        </button>
      </div>

      {/* Grid Area */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 flex-1 overflow-y-auto pr-2 custom-scrollbar pb-8">
        {templates.map((template, index) => {
          const Icon = template.icon;
          return (
            <motion.div
              key={template.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.02, translateY: -5 }}
              onClick={() => template.slug && setActiveWorkflow(template.slug)}
              className="group relative bg-white rounded-3xl p-8 border border-slate-200/60 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 hover:border-clinical-blue/30 transition-all cursor-pointer overflow-hidden"
            >
              {/* Card Background Pattern */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-slate-50 to-transparent -mr-8 -mt-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <div className="relative z-10 flex flex-col h-full">
                <div className="flex items-start justify-between mb-6">
                  <div className={`p-4 rounded-2xl border ${template.color} shadow-sm group-hover:shadow-md transition-all`}>
                    <Icon size={28} />
                  </div>
                  <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-500 text-[10px] font-bold tracking-widest uppercase">
                    {template.tag}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-slate-800 mb-3 group-hover:text-clinical-blue transition-colors">
                  {template.title}
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed mb-8 flex-1">
                  {template.description}
                </p>

                <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                  <span className="text-xs text-slate-400 font-medium">预计耗时: ~2 mins</span>
                  <button className="flex items-center gap-2 text-sm font-bold text-clinical-blue hover:gap-3 transition-all">
                    开始生成
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
