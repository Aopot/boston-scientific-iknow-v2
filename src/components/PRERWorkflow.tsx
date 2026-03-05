"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ChevronRight, 
  Check, 
  FolderPlus, 
  ArrowLeft, 
  Sparkles, 
  Info, 
  FileSpreadsheet,
  AlertCircle,
  Loader2,
  FileText,
  Download,
  CheckCircle2,
  Activity,
  History,
  ClipboardList
} from "lucide-react";

interface PRERWorkflowProps {
  onBack: () => void;
}

const steps = [
  { 
    id: 1, 
    title: "上传内部销量数据", 
    desc: "Internal Sales Data", 
    requirement: "Excel/CSV", 
    icon: FileSpreadsheet,
    details: "上传本报告周期内的产品全球销量统计数据。"
  },
  { 
    id: 2, 
    title: "上传不良事件数据", 
    desc: "Adverse Events", 
    requirement: "Excel/CSV", 
    icon: Activity,
    details: "导入来自各渠道的临床不良事件及投诉记录。"
  },
  { 
    id: 3, 
    title: "上传内部注册证数据", 
    desc: "Registration Certificates", 
    requirement: "PDF/Images", 
    icon: FileText,
    details: "同步各国家/地区的注册证更新及合规性证明。"
  },
  { 
    id: 4, 
    title: "上传注册信息", 
    desc: "Registration Info", 
    requirement: "System Integration/Sync", 
    icon: History,
    details: "整合最新的法规注册状态及变更申请信息。"
  },
  { 
    id: 5, 
    title: "上传医学信息", 
    desc: "Medical/Clinical Info", 
    requirement: "Clinical Trial Data", 
    icon: ClipboardList,
    details: "导入最新的临床试验数据及同行评审文献摘要。"
  },
  { 
    id: 6, 
    title: "预览并生成报告", 
    desc: "Final Review & Generate", 
    requirement: "Automated Generation", 
    icon: CheckCircle2,
    details: "AI 自动整合数据并生成符合法规要求的 PRER 报告。"
  },
];

export default function PRERWorkflow({ onBack }: PRERWorkflowProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isHovered, setIsHovered] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const handleMockUpload = () => {
    if (currentStep === 6) return;
    
    setIsUploading(true);
    
    // Simulate AI parsing/uploading for 1.5s
    setTimeout(() => {
      setIsUploading(false);
      setShowToast(true);
      
      // Auto increment step after 0.5s toast visibility
      setTimeout(() => {
        setShowToast(false);
        if (currentStep < 6) {
          setCurrentStep(currentStep + 1);
        }
      }, 1000);
    }, 1500);
  };

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="h-full flex flex-col bg-[#F9F8F6] -m-12 p-12 overflow-hidden relative">
      {/* Toast Notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: -20, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: -20, x: "-50%" }}
            className="absolute top-8 left-1/2 z-[100] px-6 py-3 bg-[#2D6A4F] text-white rounded-full shadow-2xl flex items-center gap-2 font-bold text-sm"
          >
            <CheckCircle2 size={18} />
            文件上传并解析成功
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header Breadcrumb */}
      <div className="flex items-center justify-between mb-8 shrink-0">
        <div className="flex items-center gap-3 text-sm">
          <button 
            onClick={onBack}
            className="text-slate-400 hover:text-clinical-blue transition-colors flex items-center gap-1"
          >
            写报告
          </button>
          <ChevronRight size={14} className="text-slate-300" />
          <span className="font-bold text-slate-800">定期风险评估报告 PRER</span>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-slate-200 shadow-sm">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
          <span className="text-[11px] font-bold text-slate-600 uppercase tracking-tight">System Normal</span>
        </div>
      </div>

      <div className="flex-1 flex gap-8 overflow-hidden">
        {/* Left Column: AI Instruction & Stepper */}
        <div className="w-[320px] shrink-0 flex flex-col gap-6 overflow-y-auto pr-2 custom-scrollbar">
          {/* AI Instruction Box */}
          <div className="bg-slate-900 rounded-[24px] p-6 text-white relative overflow-hidden shadow-xl">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Sparkles size={48} />
            </div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-clinical-blue rounded-lg flex items-center justify-center">
                <Sparkles size={16} className="text-white" />
              </div>
              <span className="text-sm font-bold tracking-tight">AI 智能助手</span>
            </div>
            <p className="text-[15px] font-medium leading-relaxed mb-4">
              {currentStep === 6 
                ? "数据整合已完成，您可以预览并下载最终的 PRER 报告。"
                : `正在进行第 ${currentStep} 步：${steps[currentStep-1].title}。`}
            </p>
            <p className="text-xs text-slate-400 italic leading-relaxed">
              {currentStep === 6 
                ? "Data integration complete. You can preview and download the final PRER report."
                : `Currently on step ${currentStep}: ${steps[currentStep-1].desc}.`}
            </p>
          </div>

          {/* Vertical Stepper */}
          <div className="flex-1 bg-white rounded-[24px] p-8 border border-slate-200/60 shadow-sm overflow-y-auto custom-scrollbar">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-8">编制进度</p>
            <div className="space-y-10">
              {steps.map((step) => {
                const isCompleted = step.id < currentStep;
                const isActive = step.id === currentStep;
                
                return (
                  <div key={step.id} className="relative flex gap-4">
                    {step.id !== steps.length && (
                      <div className={`absolute left-[15px] top-[30px] w-0.5 h-[40px] transition-colors duration-500 ${
                        isCompleted ? "bg-[#2D6A4F]" : "bg-slate-100"
                      }`} />
                    )}
                    
                    <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center z-10 transition-all duration-500 ${
                      isCompleted ? "bg-[#2D6A4F] text-white" : 
                      isActive ? "bg-[#B86F52] text-white scale-125 shadow-lg shadow-[#B86F52]/30" : 
                      "bg-slate-100 text-slate-400"
                    }`}>
                      {isCompleted ? <Check size={16} strokeWidth={3} /> : <span className="text-xs font-bold">{step.id}</span>}
                    </div>
                    
                    <div className="flex flex-col gap-0.5">
                      <span className={`text-sm font-bold transition-colors ${isActive ? "text-[#B86F52]" : isCompleted ? "text-[#2D6A4F]" : "text-slate-400"}`}>
                        {step.title}
                      </span>
                      {isActive && (
                        <span className="text-[10px] font-bold text-[#B86F52]/60 uppercase tracking-wider animate-pulse">
                          Processing...
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Main Content Card */}
        <div className="flex-1 overflow-hidden">
          <AnimatePresence mode="wait">
            {currentStep < 6 ? (
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="h-full flex flex-col bg-white rounded-[32px] border border-slate-200/60 shadow-xl shadow-slate-200/20 overflow-hidden"
              >
                {/* Card Header */}
                <div className="px-10 py-8 border-b border-slate-50 flex items-center justify-between shrink-0">
                  <div className="space-y-1">
                    <div className="inline-flex px-3 py-1 rounded-full bg-[#B86F52]/10 text-[#B86F52] text-[11px] font-bold tracking-widest uppercase">
                      Step {currentStep} / 6
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                      {steps[currentStep - 1].title}
                    </h2>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      要求: {steps[currentStep - 1].requirement}
                    </div>
                    <div className="p-3 bg-slate-50 rounded-2xl text-slate-400">
                      <Info size={20} />
                    </div>
                  </div>
                </div>

                {/* Card Content: Dropzone */}
                <div className="flex-1 p-10 flex flex-col">
                  <p className="text-slate-500 mb-8 text-[15px]">{steps[currentStep-1].details}</p>
                  
                  <div 
                    onClick={handleMockUpload}
                    onMouseEnter={() => !isUploading && setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                    className={`flex-1 border-2 border-dashed rounded-[24px] flex flex-col items-center justify-center p-12 transition-all duration-500 cursor-pointer group relative ${
                      isUploading ? "border-clinical-blue bg-blue-50/30" :
                      isHovered ? "border-[#B86F52] bg-[#B86F52]/5" : "border-slate-200 bg-slate-50/50"
                    }`}
                  >
                    {isUploading ? (
                      <div className="flex flex-col items-center">
                        <Loader2 size={48} className="text-clinical-blue animate-spin mb-6" />
                        <h3 className="text-xl font-bold text-slate-800 mb-2">正在解析数据...</h3>
                        <p className="text-sm text-slate-400">AI 正在扫描并验证文件合规性</p>
                      </div>
                    ) : (
                      <>
                        <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 transition-all duration-500 ${
                          isHovered ? "bg-[#B86F52] text-white scale-110 rotate-6" : "bg-white text-slate-300 shadow-sm"
                        }`}>
                          <FolderPlus size={36} />
                        </div>
                        <h3 className="text-xl font-bold text-slate-800 mb-2">拖拽或点击上传文件</h3>
                        <p className="text-sm text-slate-400 mb-8">支持格式: {steps[currentStep-1].requirement}</p>
                        
                        <div className="flex flex-wrap justify-center gap-3">
                          <div className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 flex items-center gap-2 shadow-sm opacity-50">
                            样例文件_{steps[currentStep-1].desc.replace(/ /g, "_")}.{steps[currentStep-1].requirement.split('/')[0].toLowerCase()}
                          </div>
                        </div>
                      </>
                    )}
                  </div>

                  <div className="mt-8 p-5 rounded-2xl bg-amber-50 border border-amber-100 flex gap-4">
                    <div className="shrink-0 p-2 bg-white rounded-xl text-amber-500 shadow-sm h-fit">
                      <AlertCircle size={18} />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-bold text-amber-800">数据脱敏提醒</p>
                      <p className="text-xs text-amber-700/70 leading-relaxed">
                        请确保上传的文件已按照 HIPAA 规范移除所有患者隐私信息（PII）。AI 引擎将自动扫描并拦截包含敏感信息的原始文件。
                      </p>
                    </div>
                  </div>
                </div>

                {/* Action Bar */}
                <div className="px-10 py-8 bg-slate-50 border-t border-slate-100 flex items-center justify-between shrink-0">
                  <button 
                    onClick={prevStep}
                    disabled={currentStep === 1 || isUploading}
                    className="px-6 py-3 text-sm font-bold text-slate-400 hover:text-slate-600 disabled:opacity-0 transition-all flex items-center gap-2"
                  >
                    <ArrowLeft size={18} />
                    上一步
                  </button>
                  
                  <div className="flex items-center gap-4">
                    <button 
                      disabled={isUploading}
                      className="px-6 py-3 text-sm font-bold text-slate-500 hover:text-slate-700 transition-all disabled:opacity-30"
                    >
                      跳过此步
                    </button>
                    <button 
                      onClick={handleMockUpload}
                      disabled={isUploading}
                      className="group px-8 py-3.5 bg-clinical-blue text-white rounded-2xl font-bold shadow-lg shadow-clinical-blue/20 hover:bg-blue-700 transition-all active:scale-95 flex items-center gap-3 disabled:opacity-50"
                    >
                      {isUploading ? "处理中..." : "确认并继续"}
                      {!isUploading && (
                        <div className="flex items-center gap-1.5 px-2 py-1 bg-white/10 rounded-md text-[10px] font-black uppercase group-hover:bg-white/20 transition-colors">
                          Enter
                        </div>
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="result"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="h-full flex flex-col bg-white rounded-[32px] border border-slate-200/60 shadow-xl shadow-slate-200/20 overflow-hidden"
              >
                {/* Result Header */}
                <div className="px-10 py-10 border-b border-slate-100 bg-slate-50/30 flex items-center justify-between">
                  <div className="flex items-center gap-5">
                    <div className="p-4 bg-clinical-blue text-white rounded-[20px] shadow-lg shadow-clinical-blue/20">
                      <FileText size={32} />
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h2 className="text-2xl font-black text-slate-900 tracking-tight">定期风险评估报告 (PRER)</h2>
                        <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-700 text-[10px] font-black uppercase tracking-widest">Official Draft</span>
                      </div>
                      <div className="flex items-center gap-4 text-xs font-bold text-slate-400">
                        <span>版本: v1.0.4</span>
                        <span className="w-1 h-1 bg-slate-200 rounded-full" />
                        <span>日期: 2026年3月5日</span>
                        <span className="w-1 h-1 bg-slate-200 rounded-full" />
                        <span>ID: BSC-PRER-2026-001</span>
                      </div>
                    </div>
                  </div>
                  <button className="px-8 py-4 bg-clinical-blue text-white rounded-2xl font-bold flex items-center gap-3 shadow-xl shadow-clinical-blue/20 hover:bg-blue-700 transition-all active:scale-95">
                    <Download size={20} />
                    下载正式版 PDF
                  </button>
                </div>

                {/* Result Content */}
                <div className="flex-1 overflow-y-auto p-10 custom-scrollbar space-y-10">
                  {/* Section 1: Data Summary */}
                  <section className="space-y-6">
                    <div className="flex items-center gap-3">
                      <div className="w-1.5 h-6 bg-clinical-blue rounded-full" />
                      <h3 className="text-lg font-bold text-slate-800">Section 1: 数据摘要 (Data Summary)</h3>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                      {[
                        { label: "全球销量总计", value: "12,405 Units", detail: "同比 +12.5%" },
                        { label: "不良事件发生率", value: "0.02%", detail: "低于行业基准" },
                        { label: "临床回访完成率", value: "98.4%", detail: "符合法规要求" },
                        { label: "注册证更新状态", value: "已同步", detail: "覆盖 42 个国家" },
                      ].map((item, i) => (
                        <div key={i} className="p-5 rounded-2xl bg-slate-50 border border-slate-100">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">{item.label}</p>
                          <p className="text-xl font-black text-slate-800 mb-1">{item.value}</p>
                          <p className="text-[11px] font-bold text-emerald-600">{item.detail}</p>
                        </div>
                      ))}
                    </div>
                  </section>

                  {/* Section 2: AI Risk Assessment */}
                  <section className="space-y-6">
                    <div className="flex items-center gap-3">
                      <div className="w-1.5 h-6 bg-clinical-blue rounded-full" />
                      <h3 className="text-lg font-bold text-slate-800">Section 2: AI 风险评估 (AI Risk Assessment)</h3>
                    </div>
                    <div className="p-8 rounded-[24px] bg-clinical-blue/[0.02] border border-clinical-blue/10 relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-8 opacity-[0.03] text-clinical-blue">
                        <Sparkles size={120} />
                      </div>
                      <div className="prose prose-slate max-w-none relative z-10">
                        <p className="text-slate-700 leading-relaxed mb-6">
                          基于本报告周期内收集的 <strong>12,405</strong> 台设备的销售数据及 <strong>2,400</strong> 例临床回访记录，AI 风险评估模型分析显示：该支架系统在临床应用中的风险获益比保持在极佳水平。
                        </p>
                        <p className="text-slate-700 leading-relaxed mb-6">
                          通过对 <strong>不良事件数据</strong> 的语义分析，识别出 2 例与操作规范相关的轻微偏差，已自动关联至第 4 步的注册变更说明中。整体不良事件发生率（0.02%）远低于 ISO 14971 定义的风险阈值。
                        </p>
                        <div className="flex items-start gap-3 p-4 bg-white border border-clinical-blue/10 rounded-xl shadow-sm italic text-sm text-slate-500">
                          <Info size={16} className="text-clinical-blue shrink-0 mt-0.5" />
                          AI 结论：该产品符合欧盟 MDR 及 FDA 21 CFR 822 的安全性要求，建议维持当前的临床跟踪频率，无需额外的纠正或预防措施（CAPA）。
                        </div>
                      </div>
                    </div>
                  </section>

                  {/* Footer Actions */}
                  <div className="flex items-center justify-center gap-4 pt-10 pb-4">
                    <button className="px-6 py-3 text-sm font-bold text-slate-400 hover:text-slate-600 transition-colors">
                      保存为草稿
                    </button>
                    <button className="px-6 py-3 text-sm font-bold text-slate-400 hover:text-slate-600 transition-colors">
                      发送至合规部审核
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
