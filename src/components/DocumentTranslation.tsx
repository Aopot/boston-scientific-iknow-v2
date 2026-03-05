"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  CloudUpload, 
  Languages, 
  BookOpen, 
  FileText, 
  CheckCircle2, 
  Download, 
  Copy, 
  ChevronRight, 
  Loader2,
  ExternalLink,
  Search,
  ArrowRight
} from "lucide-react";

type TranslationPhase = "upload" | "processing" | "result";

export default function DocumentTranslation() {
  const [phase, setPhase] = useState<TranslationPhase>("upload");
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState("解析医疗实体...");

  // Simulate translation process
  useEffect(() => {
    if (phase === "processing") {
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => setPhase("result"), 500);
            return 100;
          }
          const next = prev + 1;
          
          // Update status text based on progress
          if (next < 30) setStatusText("解析医疗实体 (Parsing medical entities)...");
          else if (next < 60) setStatusText("应用排版模板 (Applying formatting templates)...");
          else if (next < 90) setStatusText("交叉引用术语库 (Cross-referencing terminology)...");
          else setStatusText("正在完成最终校对 (Final proofreading)...");
          
          return next;
        });
      }, 50);
      return () => clearInterval(interval);
    }
  }, [phase]);

  const handleUpload = () => {
    setPhase("processing");
    setProgress(0);
  };

  return (
    <div className="h-full flex flex-col space-y-6">
      <AnimatePresence mode="wait">
        {phase === "upload" && (
          <motion.div
            key="upload"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex-1 flex flex-col space-y-8"
          >
            {/* Header Area */}
            <div className="flex items-end justify-between">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-clinical-blue/5 text-clinical-blue text-xs font-bold border border-clinical-blue/10">
                  <Languages size={12} />
                  临床级精准翻译
                </div>
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight">AI 文档翻译</h1>
                <p className="text-slate-500 max-w-2xl">
                  专为 Boston Scientific 设计的高精度医疗翻译引擎，支持多种专业术语库。
                </p>
              </div>
            </div>

            {/* Language & Glossary Selectors */}
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-3 px-5 py-3 bg-white border border-slate-200 rounded-2xl shadow-sm">
                <span className="text-sm font-bold text-slate-400">源语言:</span>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-50 text-clinical-blue text-sm font-bold border border-blue-100">
                  English
                </div>
                <ArrowRight size={14} className="text-slate-300" />
                <span className="text-sm font-bold text-slate-400">目标语言:</span>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-50 text-clinical-blue text-sm font-bold border border-blue-100">
                  简体中文 (Chinese)
                </div>
              </div>

              <div className="relative group">
                <div className="flex items-center gap-3 px-5 py-3 bg-white border border-slate-200 rounded-2xl shadow-sm hover:border-clinical-blue transition-colors cursor-pointer">
                  <BookOpen size={18} className="text-clinical-blue" />
                  <div className="flex flex-col">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">术语库预设</span>
                    <span className="text-sm font-bold text-slate-700">BSCI Cardiovascular Terminology v4.2</span>
                  </div>
                  <ChevronRight size={16} className="ml-2 text-slate-300" />
                </div>
              </div>
            </div>

            {/* Dropzone */}
            <div 
              onClick={handleUpload}
              className="flex-1 border-2 border-dashed border-slate-200 rounded-[40px] bg-white hover:bg-slate-50 hover:border-clinical-blue/40 transition-all cursor-pointer flex flex-col items-center justify-center p-12 group"
            >
              <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-8 group-hover:scale-110 group-hover:bg-blue-50 transition-all duration-500">
                <CloudUpload size={48} className="text-slate-300 group-hover:text-clinical-blue transition-colors" />
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-4">上传医疗文档</h3>
              <p className="text-slate-400 text-center max-w-sm mb-8">
                支持 PDF, DOCX, CSV 等格式。AI 将自动保持原文档格式与排版，并应用专业术语校对。
              </p>
              <div className="flex items-center gap-4">
                <div className="px-6 py-3 bg-clinical-blue text-white rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-clinical-blue/20">
                  选择文件
                </div>
                <div className="px-6 py-3 bg-white border border-slate-200 text-slate-600 rounded-xl font-bold">
                  拖拽至此处
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {phase === "processing" && (
          <motion.div
            key="processing"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            className="flex-1 flex items-center justify-center"
          >
            <div className="max-w-md w-full bg-white rounded-[40px] p-12 shadow-2xl shadow-slate-200/50 border border-slate-100 flex flex-col items-center">
              <div className="relative mb-12">
                <div className="w-24 h-24 border-4 border-slate-50 rounded-full flex items-center justify-center">
                  <Loader2 size={40} className="text-clinical-blue animate-spin" />
                </div>
                <div className="absolute inset-0 border-4 border-clinical-blue rounded-full border-t-transparent animate-[spin_3s_linear_infinite]" />
              </div>
              
              <h3 className="text-2xl font-bold text-slate-800 mb-2">正在翻译文档...</h3>
              <p className="text-slate-400 text-sm mb-12">{progress}% 已完成</p>
              
              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden mb-8 relative">
                <motion.div 
                  className="h-full bg-clinical-blue shadow-[0_0_20px_rgba(0,85,150,0.4)]"
                  initial={{ width: "0%" }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.1 }}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-[shimmer_2s_infinite]" />
              </div>

              <div className="flex items-center gap-3 px-6 py-3 bg-slate-50 rounded-2xl border border-slate-100">
                <span className="text-clinical-blue font-bold text-sm animate-pulse">●</span>
                <span className="text-sm font-medium text-slate-600 tracking-tight">{statusText}</span>
              </div>
            </div>
          </motion.div>
        )}

        {phase === "result" && (
          <motion.div
            key="result"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex-1 flex flex-col space-y-6 overflow-hidden"
          >
            {/* Toolbar */}
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-6">
                <button 
                  onClick={() => setPhase("upload")}
                  className="flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-clinical-blue transition-colors"
                >
                  <ArrowRight className="rotate-180" size={16} />
                  返回上传
                </button>
                <div className="h-4 w-px bg-slate-200" />
                <div className="flex items-center gap-3">
                  <FileText size={18} className="text-clinical-blue" />
                  <span className="text-sm font-bold text-slate-800 tracking-tight">Promus PREMIER™ Technical Guide.pdf</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button className="px-5 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl text-sm font-bold hover:bg-slate-50 transition-colors flex items-center gap-2">
                  <Copy size={16} />
                  复制全部
                </button>
                <button className="px-5 py-2.5 bg-clinical-blue text-white rounded-xl text-sm font-bold shadow-lg shadow-clinical-blue/20 hover:bg-blue-700 transition-colors flex items-center gap-2">
                  <Download size={16} />
                  导出为 DOCX
                </button>
              </div>
            </div>

            {/* Split View Container */}
            <div className="flex-1 flex gap-6 overflow-hidden">
              {/* Source Pane (Left) */}
              <div className="flex-1 flex flex-col bg-slate-100/50 rounded-[32px] border border-slate-200/60 overflow-hidden group">
                <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-white/50 backdrop-blur-sm">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Source Document (English)</span>
                  <div className="flex gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-slate-200" />
                    <div className="w-2 h-2 rounded-full bg-slate-200" />
                    <div className="w-2 h-2 rounded-full bg-slate-200" />
                  </div>
                </div>
                <div className="flex-1 p-10 overflow-y-auto custom-scrollbar opacity-50 grayscale hover:opacity-70 transition-all cursor-not-allowed select-none">
                  <div className="space-y-6">
                    <div className="h-8 bg-slate-300 rounded-lg w-3/4" />
                    <div className="space-y-3">
                      <div className="h-4 bg-slate-200 rounded-md w-full" />
                      <div className="h-4 bg-slate-200 rounded-md w-full" />
                      <div className="h-4 bg-slate-200 rounded-md w-5/6" />
                    </div>
                    <div className="h-48 bg-slate-200 rounded-2xl w-full" />
                    <div className="space-y-3 pt-4">
                      <div className="h-4 bg-slate-200 rounded-md w-full" />
                      <div className="h-4 bg-slate-200 rounded-md w-full" />
                      <div className="h-4 bg-slate-200 rounded-md w-2/3" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Translation Pane (Right) */}
              <div className="flex-1 flex flex-col bg-white rounded-[32px] border border-slate-200 shadow-xl shadow-slate-200/40 overflow-hidden relative">
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                  <span className="text-[10px] font-bold text-clinical-blue uppercase tracking-widest">翻译结果 (简体中文)</span>
                  <div className="flex items-center gap-2 text-emerald-500 text-[11px] font-bold">
                    <CheckCircle2 size={12} />
                    已通过术语库校对
                  </div>
                </div>
                <div className="flex-1 p-10 overflow-y-auto custom-scrollbar">
                  <div className="prose prose-slate max-w-none">
                    <h2 className="text-2xl font-bold text-slate-900 mb-6">Promus PREMIER™ Everolimus 依维莫司洗脱冠状动脉支架系统</h2>
                    <p className="text-slate-600 leading-relaxed mb-6">
                      Promus PREMIER™ 支架系统是 Boston Scientific 开发的下一代支架技术。该系统采用专有的
                      <span className="mx-1 px-1.5 py-0.5 bg-blue-50 text-clinical-blue rounded-md border border-blue-100 font-bold relative group cursor-help">
                        Biolimus A9™
                        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-slate-800 text-white text-[10px] rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 shadow-xl pointer-events-none">
                          <span className="block font-bold text-blue-400 mb-1 italic underline decoration-blue-400/30 underline-offset-2">匹配术语库 v4.2</span>
                          专有药物涂层技术，旨在优化支架植入后的血管愈合。
                        </span>
                      </span>
                      药物涂层，旨在最大限度地减少
                      <span className="mx-1 px-1.5 py-0.5 bg-blue-50 text-clinical-blue rounded-md border border-blue-100 font-bold relative group cursor-help">
                        血管支架 (Vascular Stent)
                        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-slate-800 text-white text-[10px] rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 shadow-xl pointer-events-none">
                          <span className="block font-bold text-blue-400 mb-1 italic underline decoration-blue-400/30 underline-offset-2">匹配术语库 v4.2</span>
                          用于保持冠状动脉管腔开放的医疗器械。
                        </span>
                      </span>
                      内膜增生。
                    </p>
                    <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 mb-6">
                      <h4 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
                        <Search size={14} className="text-clinical-blue" />
                        主要技术规格:
                      </h4>
                      <ul className="space-y-2 text-sm text-slate-600">
                        <li className="flex justify-between">
                          <span>支架材料:</span>
                          <span className="font-bold text-slate-800">铂铬合金 (PtCr)</span>
                        </li>
                        <li className="flex justify-between">
                          <span>涂层厚度:</span>
                          <span className="font-bold text-slate-800">~7.0 μm</span>
                        </li>
                        <li className="flex justify-between">
                          <span>交付系统:</span>
                          <span className="font-bold text-slate-800">Monorail™ 快速交换系统</span>
                        </li>
                      </ul>
                    </div>
                    <p className="text-slate-600 leading-relaxed">
                      该支架系统集成了增强的可视性技术，确保在介入手术过程中能够实现精准的定位。
                    </p>
                  </div>
                </div>
                
                {/* Floating Bottom Action */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
                  <div className="px-4 py-2 bg-slate-800/90 backdrop-blur-md text-white rounded-full text-[11px] font-bold flex items-center gap-2 shadow-2xl border border-white/10">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                    置信度: 99.4%
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
