"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ChevronRight, 
  Check, 
  FolderPlus, 
  ArrowLeft, 
  Sparkles, 
  Info, 
  Languages,
  FileSpreadsheet,
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
  const [isTranslating, setIsTranslating] = useState(false);
  const [isEnglishReport, setIsEnglishReport] = useState(false);
  const [isStepReady, setIsStepReady] = useState(false);
  const [isPreviewVerified, setIsPreviewVerified] = useState(false);
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false);
  const [isFinalizeModalOpen, setIsFinalizeModalOpen] = useState(false);
  const previewScrollRef = useRef<HTMLDivElement>(null);

  const handleMockUpload = () => {
    if (currentStep === 6 || isUploading) return;
    
    setIsUploading(true);
    
    setTimeout(() => {
      setIsUploading(false);
      setIsStepReady(true);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 1000);
    }, 1500);
  };

  const goToStep = (step: number) => {
    setCurrentStep(step);
    setIsStepReady(false);
    setShowToast(false);
    setIsHovered(false);
  };

  const prevStep = () => {
    if (currentStep > 1) {
      goToStep(currentStep - 1);
    }
  };

  const handleConfirmContinue = () => {
    if (currentStep === 6 || isUploading) return;

    if (!isStepReady) {
      handleMockUpload();
      return;
    }

    goToStep(Math.min(currentStep + 1, 6));
  };

  const handleTranslateToEnglish = () => {
    if (isTranslating) return;
    if (isEnglishReport) {
      setIsEnglishReport(false);
      return;
    }

    setIsTranslating(true);
    setTimeout(() => {
      setIsTranslating(false);
      setIsEnglishReport(true);
    }, 1400);
  };

  useEffect(() => {
    if (currentStep !== 6) return;

    setHasScrolledToBottom(false);
    setIsPreviewVerified(false);
    setIsFinalizeModalOpen(false);
    setIsEnglishReport(false);

    const timer = setTimeout(() => {
      setIsPreviewVerified(true);
    }, 1200);

    return () => clearTimeout(timer);
  }, [currentStep]);

  const handlePreviewScroll = () => {
    const el = previewScrollRef.current;
    if (!el) return;

    const threshold = 24;
    const isAtBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - threshold;
    if (isAtBottom) setHasScrolledToBottom(true);
  };

  const summaryItems = isEnglishReport
    ? [
        { label: "Total Global Sales", value: "12,405 Units", detail: "+12.5% vs. last year" },
        { label: "Adverse Event Rate", value: "0.02%", detail: "Below industry benchmark" },
        { label: "Clinical Follow-up Completion", value: "98.4%", detail: "Meets regulatory requirements" },
        { label: "Certificate Update Status", value: "Synced", detail: "42 countries covered" },
      ]
    : [
        { label: "全球销量总计", value: "12,405 Units", detail: "同比 +12.5%" },
        { label: "不良事件发生率", value: "0.02%", detail: "低于行业基准" },
        { label: "临床回访完成率", value: "98.4%", detail: "符合法规要求" },
        { label: "注册证更新状态", value: "已同步", detail: "覆盖 42 个国家" },
      ];

  return (
    <div className="h-full flex flex-col bg-[#F9F8FF] -m-12 px-12 pt-12 pb-6 overflow-hidden relative" style={{ height: "calc(100vh - 50px)" }}>
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



      {/* Horizontal Stepper */}
      <div className="w-full mb-6 px-8 shrink-0">
        <div className="relative flex items-center justify-between max-w-5xl mx-auto">
          <div className="absolute left-0 top-[15px] w-full h-[2px] bg-slate-200 -z-0" />
          
          {steps.map((step) => {
            const isCompleted = step.id < currentStep;
            const isActive = step.id === currentStep;
            
            return (
              <div key={step.id} className="relative z-10 flex flex-col items-center gap-3">
                <div className={`
                  w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 border-[3px]
                  ${isActive 
                    ? "bg-orange-500 border-white text-white shadow-lg shadow-orange-500/30 scale-125 ring-4 ring-orange-500/10 animate-pulse" 
                    : isCompleted 
                      ? "bg-emerald-600 border-white text-white" 
                      : "bg-slate-100 border-white text-slate-400"
                  }
                `}>
                  {isCompleted ? <Check size={14} strokeWidth={3} /> : <span className="text-xs font-bold">{step.id}</span>}
                </div>
                <div className="flex flex-col items-center gap-0.5">
                  <span className={`text-[11px] font-bold whitespace-nowrap px-2 py-0.5 rounded-md ${
                    isActive ? "text-slate-800 bg-white/50" : "text-slate-400"
                  }`}>
                    {step.title}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex-1 flex gap-8 overflow-hidden h-full min-h-0">
        {/* Left Column: AI Instruction & Tips */}
        <div className="w-[300px] shrink-0 flex flex-col gap-6 h-full min-h-0">
          {/* AI Instruction Box */}
          <div className="bg-slate-900 rounded-[24px] p-6 text-white relative overflow-hidden shadow-xl shrink-0">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Sparkles size={48} />
            </div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-clinical-blue rounded-lg flex items-center justify-center">
                <Sparkles size={16} className="text-white" />
              </div>
              <span className="text-sm font-bold tracking-tight">AI 智能助手</span>
            </div>
            <p className="text-[13px] font-medium leading-relaxed mb-4">
              {currentStep === 6 
                ? "数据整合已完成，您可以预览并下载最终的 PRER 报告。"
                : `正在进行第 ${currentStep} 步：${steps[currentStep-1].title}。`}
            </p>
            <p className="text-[10px] text-slate-400 italic leading-relaxed">
              {currentStep === 6 
                ? "Data integration complete. You can preview and download the final PRER report."
                : `Currently on step ${currentStep}: ${steps[currentStep-1].desc}.`}
            </p>
          </div>

          {/* Step Tips Card */}
          <div className="flex-1 bg-white rounded-[24px] p-6 border border-slate-200/60 shadow-sm overflow-hidden flex flex-col h-full min-h-0">
            <div className="flex items-center gap-2 mb-4 text-slate-800 shrink-0">
              <div className="p-1.5 bg-orange-50 rounded-lg text-orange-500">
                <Info size={16} />
              </div>
              <span className="font-bold text-sm">操作指引</span>
            </div>
            
            <div className="space-y-4 flex-1 overflow-y-auto pr-2 custom-scrollbar">
              <p className="text-xs text-slate-500 leading-relaxed">
                {steps[currentStep-1].details}
              </p>
              
              <div className="h-px bg-slate-100 w-full" />
              
              <div className="space-y-3">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Helpful Tips</p>
                <div className="flex gap-3">
                  <div className="w-1 h-full bg-slate-200 rounded-full" />
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    请确保上传的文件大小不超过 50MB。对于超过限制的文件，请使用压缩工具或分批上传。
                  </p>
                </div>
                <div className="flex gap-3">
                  <div className="w-1 h-full bg-slate-200 rounded-full" />
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    支持的文件格式: {steps[currentStep-1].requirement}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Main Content Card */}
        <div className="flex-1 overflow-hidden h-full flex flex-col min-h-0">
          <AnimatePresence mode="wait">
            {currentStep < 6 ? (
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="flex-1 flex flex-col bg-white rounded-[32px] border border-slate-200/60 shadow-xl shadow-slate-200/20 overflow-hidden h-full"
              >
                {/* Card Header */}
                <div className="px-10 py-4 border-b border-slate-50 flex items-center justify-between shrink-0">
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
                <div className="flex-1 p-10 flex flex-col overflow-hidden h-full min-h-0">
                  <p className="text-slate-500 mb-2 text-[15px] shrink-0 -mt-8">{steps[currentStep-1].details}</p>
                  
                  <div 
                    onClick={handleMockUpload}
                    onMouseEnter={() => !isUploading && setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                    className={`h-[300px] border-2 border-dashed rounded-[24px] flex flex-col items-center justify-center p-10 transition-all duration-500 cursor-pointer group relative shrink-0 ${
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
                </div>

                {/* Action Bar */}
                <div className="px-10 py-6 bg-slate-50 border-t border-slate-100 flex items-center justify-between shrink-0 mt-auto">
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
                      onClick={handleConfirmContinue}
                      disabled={isUploading}
                      className="group px-8 py-3.5 bg-clinical-blue text-white rounded-2xl font-bold shadow-lg shadow-clinical-blue/20 hover:bg-blue-700 transition-all active:scale-95 flex items-center gap-3 disabled:opacity-50"
                    >
                      {isUploading ? "处理中..." : isStepReady ? "确认并继续" : "上传并解析"}
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
                className="flex-1 flex flex-col bg-white rounded-[32px] border border-slate-200/60 shadow-xl shadow-slate-200/20 overflow-hidden mb-6"
              >
                {/* Result Header */}
                <div className="px-10 py-10 border-b border-slate-100 bg-slate-50/30 flex items-start justify-between gap-8">
                  <div className="flex items-center gap-5">
                    <div className="p-4 bg-clinical-blue text-white rounded-[20px] shadow-lg shadow-clinical-blue/20">
                      <FileText size={32} />
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                          {isEnglishReport ? "Periodic Risk Evaluation Report (PRER)" : "定期风险评估报告 (PRER)"}
                        </h2>
                        <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-700 text-[10px] font-black uppercase tracking-widest">
                          {isEnglishReport ? "OFFICIAL DRAFT" : "Official Draft"}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-xs font-bold text-slate-400">
                        <span>{isEnglishReport ? "Version: v1.0.4" : "版本: v1.0.4"}</span>
                        <span className="w-1 h-1 bg-slate-200 rounded-full" />
                        <span>{isEnglishReport ? "Date: Mar 5, 2026" : "日期: 2026年3月5日"}</span>
                        <span className="w-1 h-1 bg-slate-200 rounded-full" />
                        <span>ID: BSC-PRER-2026-001</span>
                      </div>
                    </div>
                  </div>
                  <div className="shrink-0 flex items-center gap-3 pt-1">
                    <button
                      onClick={handleTranslateToEnglish}
                      disabled={isTranslating}
                      className="h-10 px-4 rounded-lg border border-clinical-blue text-clinical-blue bg-white font-bold text-sm flex items-center gap-2 hover:bg-clinical-blue/5 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {isTranslating ? (
                        <Loader2 size={16} className="animate-spin" />
                      ) : (
                        <Languages size={16} />
                      )}
                      {isTranslating ? "正在翻译..." : isEnglishReport ? "返回原版" : "翻译为英文 (EN)"}
                    </button>
                    <button className="h-10 px-5 rounded-lg bg-clinical-blue text-white font-bold text-sm flex items-center gap-2 hover:bg-blue-700 transition-all active:scale-[0.99]">
                      <Download size={16} />
                      {isEnglishReport ? "Download PDF" : "下载 PDF"}
                    </button>
                  </div>
                </div>

                {/* Result Content */}
                <div
                  ref={previewScrollRef}
                  onScroll={handlePreviewScroll}
                  className="flex-1 overflow-y-auto p-10 custom-scrollbar space-y-10 min-h-0"
                >
                  {/* Section 1: Data Summary */}
                  <section className="space-y-6">
                    <div className="flex items-center gap-3">
                      <div className="w-1.5 h-6 bg-clinical-blue rounded-full" />
                      <h3 className="text-lg font-bold text-slate-800">
                        {isEnglishReport ? "Section 1: Data Summary" : "Section 1: 数据摘要 (Data Summary)"}
                      </h3>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                      {summaryItems.map((item, i) => (
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
                      <h3 className="text-lg font-bold text-slate-800">
                        {isEnglishReport ? "Section 2: AI Risk Assessment" : "Section 2: AI 风险评估 (AI Risk Assessment)"}
                      </h3>
                    </div>
                    <div className="p-8 rounded-[24px] bg-clinical-blue/[0.02] border border-clinical-blue/10 relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-8 opacity-[0.03] text-clinical-blue">
                        <Sparkles size={120} />
                      </div>
                      <div className="prose prose-slate max-w-none relative z-10">
                        <p className="text-slate-700 leading-relaxed mb-6">
                          {isEnglishReport ? (
                            <>
                              Based on <strong>12,405</strong> units of sales data collected in this reporting period and <strong>2,400</strong> clinical follow-up records, the AI risk assessment indicates the stent system maintains an excellent benefit–risk profile in real-world clinical use.
                            </>
                          ) : (
                            <>
                              基于本报告周期内收集的 <strong>12,405</strong> 台设备的销售数据及 <strong>2,400</strong> 例临床回访记录，AI 风险评估模型分析显示：该支架系统在临床应用中的风险获益比保持在极佳水平。
                            </>
                          )}
                        </p>
                        <p className="text-slate-700 leading-relaxed mb-6">
                          {isEnglishReport ? (
                            <>
                              Through semantic analysis of <strong>adverse event data</strong>, two minor deviations related to operating procedures were identified and automatically linked to the Step 4 registration change notes. The overall adverse event rate (0.02%) remains well below the ISO 14971 risk threshold.
                            </>
                          ) : (
                            <>
                              通过对 <strong>不良事件数据</strong> 的语义分析，识别出 2 例与操作规范相关的轻微偏差，已自动关联至第 4 步的注册变更说明中。整体不良事件发生率（0.02%）远低于 ISO 14971 定义的风险阈值。
                            </>
                          )}
                        </p>
                        <div className="flex items-start gap-3 p-4 bg-white border border-clinical-blue/10 rounded-xl shadow-sm italic text-sm text-slate-500">
                          <Info size={16} className="text-clinical-blue shrink-0 mt-0.5" />
                          {isEnglishReport
                            ? "AI conclusion: This product meets EU MDR and FDA 21 CFR 822 safety requirements. Maintain the current clinical follow-up frequency; no additional CAPA actions are recommended."
                            : "AI 结论：该产品符合欧盟 MDR 及 FDA 21 CFR 822 的安全性要求，建议维持当前的临床跟踪频率，无需额外的纠正或预防措施（CAPA）。"}
                        </div>
                      </div>
                    </div>
                  </section>
                </div>

                <div className="px-10 py-6 bg-slate-50 border-t border-slate-100 flex items-center justify-end shrink-0 mt-auto">
                  <button
                    onClick={() => setIsFinalizeModalOpen(true)}
                    disabled={!isPreviewVerified && !hasScrolledToBottom}
                    className="h-12 px-8 rounded-lg bg-clinical-blue text-white font-bold text-base flex items-center gap-2 shadow-lg shadow-clinical-blue/20 hover:bg-blue-700 transition-all active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <CheckCircle2 size={18} />
                    确认并完成报告编制
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <AnimatePresence>
        {isFinalizeModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center"
          >
            <div
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]"
              onClick={() => setIsFinalizeModalOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: 12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.98 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="relative w-full max-w-[520px] mx-6 bg-white rounded-[24px] border border-slate-200/70 shadow-2xl shadow-slate-900/20 p-8"
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <CheckCircle2 size={20} />
                </div>
                <div className="space-y-2">
                  <div className="text-lg font-black text-slate-900 tracking-tight">完成确认</div>
                  <div className="text-sm text-slate-600 leading-relaxed">
                    {isEnglishReport
                      ? "The report has been confirmed and synced to the compliance knowledge base. You can now download the official PDF or perform multilingual translation."
                      : "报告已确认并同步至合规知识库。您现在可以下载正式版 PDF 或进行多语言翻译。"}
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-end gap-3 mt-6">
                <button
                  onClick={() => setIsFinalizeModalOpen(false)}
                  className="h-10 px-4 rounded-lg bg-slate-100 text-slate-700 font-bold text-sm hover:bg-slate-200 transition-colors"
                >
                  关闭
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
