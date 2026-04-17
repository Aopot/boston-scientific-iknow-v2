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
                    <span className="text-sm font-bold text-slate-700">S842773-00_Global_Glossary_Rev_CK_final</span>
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
                  <span className="text-sm font-bold text-slate-800 tracking-tight">Global WI Risk Management Plan and Report.docx</span>
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
                <div className="flex-1 p-8 overflow-y-auto custom-scrollbar">
                  <pre className="whitespace-pre-wrap text-[13px] leading-relaxed text-slate-700 font-medium">
{`Global WI Risk Management Plan and Report

Purpose
This document describes the process for executing the Risk Management Plan and Report requirements for product risks.
This document provides a framework within which experience, insight, data, and judgment are applied systematically to manage the risks associated with the use of BSC medical devices.

Scope
This global work instruction applies to the products designed, developed, or modified by Boston Scientific throughout the entire product lifecycle. Product refers to the device, package, label, system, sub-system, software, and/or services.

Records Created
Risk Management Plan (RMP)
Risk Management Report (RMR)
Risk Management Competency Summary

Table of Contents
1. Overview
  1.1. Risk Management Plan & Report Process Flow
  1.2. Responsibilities
2. Develop a Risk Management Plan
  2.1. Identify Scope
  2.2. Identify Responsibilities and Authorities
  2.3. Identify Risk Estimation Scales
  2.4. Identify Risk Acceptance Criteria
  2.5. Identify Risk Criticality Zones (optional)
  2.6. Identify Software Safety Classification
  2.7. Identify the Review of Risk Management Activities
  2.8. Identify Verification Methods
  2.9. Identify Production and Post-Production Methods
3. Approve and Store the Risk Management Plan Record
  3.1. Approval Requirements
4. Develop a Risk Management Report
  4.1. Identify Scope
  4.2. Identify Deviations
  4.3. Identify Risk Management File
  4.4. Identify Additional References
  4.5. Establish Risk Thresholds
  4.6. Evaluate Risk Acceptability
  4.7. Identify Production and Post-Production Methods
  4.8. Document Conclusions
5. Approve and Store the Risk Management Report Record
  5.1. Approval Requirements
6. Maintenance
  6.1. Update the Risk Management Plan and/or Report
  6.2. Update the Risk Management Competency Summary
7. Supporting Information
  7.1. Definitions
  7.2. Applicable Documents
Appendix A. Pre-Determined Risk Acceptability Matrices
Appendix B. Examples of Risk Acceptability Matrices
Appendix C. Risk Criticality Zones
Appendix D. Risk Index Matrix`}
                  </pre>
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
                    <h2 className="text-2xl font-bold text-slate-900 mb-6">全球工作指导书：风险管理计划与报告</h2>
                    <p className="text-slate-600 leading-relaxed mb-6">
                      本文件描述用于执行产品风险相关
                      <span className="mx-1 px-1.5 py-0.5 bg-blue-50 text-clinical-blue rounded-md border border-blue-100 font-bold relative group cursor-help">
                        风险管理计划（RMP）
                        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-slate-800 text-white text-[10px] rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 shadow-xl pointer-events-none">
                          <span className="block font-bold text-blue-400 mb-1 italic underline decoration-blue-400/30 underline-offset-2">匹配术语库 v4.2</span>
                          Risk Management Plan（RMP）
                        </span>
                      </span>
                      与
                      <span className="mx-1 px-1.5 py-0.5 bg-blue-50 text-clinical-blue rounded-md border border-blue-100 font-bold relative group cursor-help">
                        风险管理报告（RMR）
                        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-slate-800 text-white text-[10px] rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 shadow-xl pointer-events-none">
                          <span className="block font-bold text-blue-400 mb-1 italic underline decoration-blue-400/30 underline-offset-2">匹配术语库 v4.2</span>
                          Risk Management Report（RMR）
                        </span>
                      </span>
                      相关要求的流程；并提供一个框架，使经验、洞察、数据与判断能够被系统性地应用于管理 Boston Scientific 医疗器械使用相关风险。
                    </p>
                    <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 mb-6">
                      <h4 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
                        <Search size={14} className="text-clinical-blue" />
                        适用范围（Scope）:
                      </h4>
                      <p className="text-sm text-slate-600 leading-relaxed">
                        本全球工作指导书适用于 Boston Scientific 在整个
                        <span className="mx-1 px-1.5 py-0.5 bg-blue-50 text-clinical-blue rounded-md border border-blue-100 font-bold relative group cursor-help">
                          产品全生命周期
                          <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-slate-800 text-white text-[10px] rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 shadow-xl pointer-events-none">
                            <span className="block font-bold text-blue-400 mb-1 italic underline decoration-blue-400/30 underline-offset-2">匹配术语库 v4.2</span>
                            Product lifecycle
                          </span>
                        </span>
                        内设计、开发或变更的产品。此处“产品”包括器械、包装、标签、系统、子系统、软件和/或服务。
                      </p>
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 mt-8 mb-4">记录创建（Records Created）</h3>
                    <ul className="text-sm text-slate-600 leading-relaxed">
                      <li>
                        风险管理计划（RMP）
                      </li>
                      <li>
                        风险管理报告（RMR）
                      </li>
                      <li>
                        风险管理胜任力汇总（Risk Management Competency Summary）
                      </li>
                    </ul>

                    <h3 className="text-lg font-bold text-slate-900 mt-8 mb-4">目录（Table of Contents）</h3>
                    <div className="p-6 bg-white rounded-2xl border border-slate-100">
                      <ol className="space-y-2 text-sm text-slate-600">
                        <li>1. 概述</li>
                        <li className="pl-4">1.1 风险管理计划与报告流程</li>
                        <li className="pl-4">1.2 职责</li>
                        <li>2. 制定风险管理计划</li>
                        <li className="pl-4">2.1 确定范围</li>
                        <li className="pl-4">2.2 确定职责与权限</li>
                        <li className="pl-4">
                          2.3 确定
                          <span className="mx-1 px-1.5 py-0.5 bg-blue-50 text-clinical-blue rounded-md border border-blue-100 font-bold relative group cursor-help">
                            风险估计量表
                            <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-slate-800 text-white text-[10px] rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 shadow-xl pointer-events-none">
                              <span className="block font-bold text-blue-400 mb-1 italic underline decoration-blue-400/30 underline-offset-2">匹配术语库 v4.2</span>
                              Risk Estimation Scales
                            </span>
                          </span>
                        </li>
                        <li className="pl-4">
                          2.4 确定
                          <span className="mx-1 px-1.5 py-0.5 bg-blue-50 text-clinical-blue rounded-md border border-blue-100 font-bold relative group cursor-help">
                            风险可接受准则
                            <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-slate-800 text-white text-[10px] rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 shadow-xl pointer-events-none">
                              <span className="block font-bold text-blue-400 mb-1 italic underline decoration-blue-400/30 underline-offset-2">匹配术语库 v4.2</span>
                              Risk Acceptance Criteria
                            </span>
                          </span>
                        </li>
                        <li className="pl-4">
                          2.5 确定
                          <span className="mx-1 px-1.5 py-0.5 bg-blue-50 text-clinical-blue rounded-md border border-blue-100 font-bold relative group cursor-help">
                            风险关键性分区
                            <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-slate-800 text-white text-[10px] rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 shadow-xl pointer-events-none">
                              <span className="block font-bold text-blue-400 mb-1 italic underline decoration-blue-400/30 underline-offset-2">匹配术语库 v4.2</span>
                              Risk Criticality Zones（optional）
                            </span>
                          </span>
                          （可选）
                        </li>
                        <li className="pl-4">
                          2.6 确定软件安全分类（Software Safety Classification）
                        </li>
                        <li className="pl-4">2.7 确定风险管理活动的评审</li>
                        <li className="pl-4">2.8 确定验证方法</li>
                        <li className="pl-4">
                          2.9 确定生产与上市后方法（Production and Post-Production Methods）
                        </li>
                        <li>3. 批准并归档风险管理计划记录</li>
                        <li className="pl-4">3.1 批准要求</li>
                        <li>4. 编制风险管理报告</li>
                        <li className="pl-4">4.1 确定范围</li>
                        <li className="pl-4">4.2 确定偏差</li>
                        <li className="pl-4">4.3 确定风险管理文件（Risk Management File）</li>
                        <li className="pl-4">4.4 确定附加参考</li>
                        <li className="pl-4">4.5 建立风险阈值</li>
                        <li className="pl-4">4.6 评估风险可接受性</li>
                        <li className="pl-4">4.7 确定生产与上市后方法</li>
                        <li className="pl-4">4.8 形成结论</li>
                        <li>5. 批准并归档风险管理报告记录</li>
                        <li className="pl-4">5.1 批准要求</li>
                        <li>6. 维护</li>
                        <li className="pl-4">6.1 更新风险管理计划和/或报告</li>
                        <li className="pl-4">6.2 更新风险管理胜任力汇总</li>
                        <li>7. 支持性信息</li>
                        <li className="pl-4">7.1 定义</li>
                        <li className="pl-4">7.2 适用文件</li>
                        <li>附录 A：预设风险可接受矩阵</li>
                        <li>附录 B：风险可接受矩阵示例</li>
                        <li>附录 C：风险关键性分区</li>
                        <li>附录 D：风险指数矩阵</li>
                      </ol>
                    </div>
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
