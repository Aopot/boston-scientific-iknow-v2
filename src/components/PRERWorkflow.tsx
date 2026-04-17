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
  Activity
} from "lucide-react";

interface PRERWorkflowProps {
  onBack: () => void;
}

const steps = [
  { 
    id: 1, 
    title: "上传进口注册证", 
    desc: "NMPA Registration Certificate", 
    requirement: "PDF", 
    icon: FileText,
    details: "进口医疗器械注册证，是产品在中国合法上市销售的“身份证”，包含产品名称、注册人、有效期、适用范围等关键信息。"
  },
  { 
    id: 2, 
    title: "上传中文说明书", 
    desc: "Instructions for Use (IFU)", 
    requirement: "PDF", 
    icon: FileText,
    details: "产品中文说明书，包含使用方法、禁忌、不良反应、警示信息等，是 PRER 风险评估的重要依据之一。"
  },
  { 
    id: 3, 
    title: "上传不良事件汇总表", 
    desc: "Adverse Events Summary", 
    requirement: "XLSX", 
    icon: FileSpreadsheet,
    details: "报告周期内不良事件汇总表，记录国内外所有上报的不良反应/事件数据，是 PRER 风险分析的核心数据来源。"
  },
  { 
    id: 4, 
    title: "上传召回事件报告", 
    desc: "Recall Event Report", 
    requirement: "PDF", 
    icon: Activity,
    details: "如报告周期内发生过产品召回，用于说明召回原因、范围与处理措施，是 PRER 风险控制措施的重要内容。"
  },
  { 
    id: 5, 
    title: "预览并生成报告", 
    desc: "Final Review & Generate", 
    requirement: "DOC 输出", 
    icon: CheckCircle2,
    details: "基于上传文件，AI 自动整合数据并生成 PRER 主报告，支持预览与下载。"
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
  const finalStep = steps.length;
  const previewVerifyTimerRef = useRef<number | null>(null);

  const handleMockUpload = () => {
    if (currentStep === finalStep || isUploading) return;
    
    setIsUploading(true);
    
    setTimeout(() => {
      setIsUploading(false);
      setIsStepReady(true);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 1000);
    }, 1500);
  };

  const goToStep = (step: number) => {
    if (previewVerifyTimerRef.current) {
      window.clearTimeout(previewVerifyTimerRef.current);
      previewVerifyTimerRef.current = null;
    }

    setCurrentStep(step);
    setIsStepReady(false);
    setShowToast(false);
    setIsHovered(false);

    if (step === finalStep) {
      setHasScrolledToBottom(false);
      setIsPreviewVerified(false);
      setIsFinalizeModalOpen(false);
      setIsEnglishReport(false);
      previewVerifyTimerRef.current = window.setTimeout(() => {
        setIsPreviewVerified(true);
      }, 1200);
    } else {
      setIsPreviewVerified(false);
      setHasScrolledToBottom(false);
      setIsFinalizeModalOpen(false);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      goToStep(currentStep - 1);
    }
  };

  const handleConfirmContinue = () => {
    if (currentStep === finalStep || isUploading) return;

    if (!isStepReady) {
      handleMockUpload();
      return;
    }

    goToStep(Math.min(currentStep + 1, finalStep));
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
    return () => {
      if (previewVerifyTimerRef.current) {
        window.clearTimeout(previewVerifyTimerRef.current);
      }
    };
  }, []);

  const handlePreviewScroll = () => {
    const el = previewScrollRef.current;
    if (!el) return;

    const threshold = 24;
    const isAtBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - threshold;
    if (isAtBottom) setHasScrolledToBottom(true);
  };

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
              {currentStep === finalStep 
                ? "数据整合已完成，您可以预览并下载最终的 PRER 报告。"
                : `正在进行第 ${currentStep} 步：${steps[currentStep-1].title}。`}
            </p>
            <p className="text-[10px] text-slate-400 italic leading-relaxed">
              {currentStep === finalStep 
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
            {currentStep < finalStep ? (
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
                      Step {currentStep} / {finalStep}
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
                <div className="px-10 py-6 border-b border-slate-100 bg-slate-50/30 flex items-start justify-between gap-8">
                  <div className="flex items-center gap-5">
                    <div className="p-3 bg-clinical-blue text-white rounded-[18px] shadow-lg shadow-clinical-blue/20">
                      <FileText size={28} />
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h2 className="text-xl font-black text-slate-900 tracking-tight">
                          {isEnglishReport
                            ? "Periodic Risk Evaluation Report"
                            : "射频消融导管定期风险评价报告"}
                        </h2>
                        <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-700 text-[10px] font-black uppercase tracking-widest">
                          {isEnglishReport ? "OFFICIAL DRAFT" : "Official Draft"}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-xs font-bold text-slate-400">
                        <span>{isEnglishReport ? "Report No.: 1st" : "第 1 次报告"}</span>
                        <span className="w-1 h-1 bg-slate-200 rounded-full" />
                        <span>{isEnglishReport ? "Submitted: Nov 28, 2025" : "报告提交时间：2025年11月28日"}</span>
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
                  className="flex-1 overflow-y-auto p-8 custom-scrollbar space-y-6 min-h-0"
                >
                  <section className="space-y-8">
                    <div className="text-center space-y-1">
                      <div className="text-xl font-black text-slate-900 tracking-tight">
                        {isEnglishReport ? "Periodic Risk Evaluation Report" : "射频消融导管定期风险评价报告"}
                      </div>
                      <div className="text-[13px] font-bold text-slate-500">
                        {isEnglishReport ? "1st Report" : "第 1 次报告"}
                      </div>
                    </div>

                    <div className="rounded-2xl border border-slate-200/70 overflow-hidden bg-white shadow-sm">
                      <table className="w-full text-sm border-collapse">
                        <tbody className="divide-y divide-slate-100">
                          <tr className="divide-x divide-slate-100">
                            <td className="w-44 bg-slate-50 px-4 py-3 text-slate-500 font-bold">
                              {isEnglishReport ? "Reporting Period" : "报告期"}
                            </td>
                            <td className="px-4 py-3 text-slate-800 font-bold">
                              {isEnglishReport ? "Jan 1, 2022 – Feb 28, 2025" : "2022年01月01日至2025年2月28日"}
                            </td>
                            <td className="w-44 bg-slate-50 px-4 py-3 text-slate-500 font-bold">
                              {isEnglishReport ? "Submission Date" : "报告提交时间"}
                            </td>
                            <td className="px-4 py-3 text-slate-800 font-bold">
                              {isEnglishReport ? "Nov 28, 2025" : "2025年11月28日"}
                            </td>
                          </tr>
                          <tr className="divide-x divide-slate-100">
                            <td className="bg-slate-50 px-4 py-3 text-slate-500 font-bold">
                              {isEnglishReport ? "Domestic Sales (This Period)" : "本期国内销量"}
                            </td>
                            <td className="px-4 py-3 text-slate-800 font-bold">
                              {isEnglishReport ? "3,000 units" : "3000 个"}
                            </td>
                            <td className="bg-slate-50 px-4 py-3 text-slate-500 font-bold">
                              {isEnglishReport ? "Overseas Sales (This Period)" : "本期境外销量"}
                            </td>
                            <td className="px-4 py-3 text-slate-800 font-bold">
                              {isEnglishReport ? "8,000 units" : "8000 个"}
                            </td>
                          </tr>
                          <tr className="divide-x divide-slate-100">
                            <td className="bg-slate-50 px-4 py-3 text-slate-500 font-bold">
                              {isEnglishReport ? "Adverse Event Reports (This Period)" : "本期不良事件报告数量"}
                            </td>
                            <td className="px-4 py-3 text-slate-800 font-bold">
                              {isEnglishReport ? "1 cases" : "1 例"}
                            </td>
                            <td className="bg-slate-50 px-4 py-3 text-slate-500 font-bold">
                              {isEnglishReport ? "Report Type" : "报告类别"}
                            </td>
                            <td className="px-4 py-3 text-slate-800 font-bold">
                              {isEnglishReport ? "Initial Registration / Renewal" : "首次注册 / 延续注册"}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    <div className="rounded-2xl border border-slate-200/70 overflow-hidden bg-white shadow-sm">
                      <table className="w-full text-sm border-collapse">
                        <tbody className="divide-y divide-slate-100">
                          <tr className="divide-x divide-slate-100">
                            <td className="w-44 bg-slate-50 px-4 py-3 text-slate-500 font-bold">
                              {isEnglishReport ? "Approval Date (Registration/Record)" : "产品注册/备案批准时间"}
                            </td>
                            <td className="px-4 py-3 text-slate-700 font-bold">
                              {isEnglishReport ? "Jul 21, 2021" : "2021年07月21日"}
                            </td>
                            <td className="w-44 bg-slate-50 px-4 py-3 text-slate-500 font-bold">
                              {isEnglishReport ? "Company" : "企业名称"}
                            </td>
                            <td className="px-4 py-3 text-slate-700 font-bold">
                              {isEnglishReport ? "Boston Scientific International MedicalCo., Ltd." : "波科国际公司"}
                            </td>
                          </tr>
                          <tr className="divide-x divide-slate-100">
                            <td className="bg-slate-50 px-4 py-3 text-slate-500 font-bold">
                              {isEnglishReport ? "Unified Social Credit Code" : "社会信用代码"}
                            </td>
                            <td className="px-4 py-3 text-slate-700 font-bold">913100006073791417</td>
                            <td className="bg-slate-50 px-4 py-3 text-slate-500 font-bold">
                              {isEnglishReport ? "Address" : "联系地址"}
                            </td>
                            <td className="px-4 py-3 text-slate-700 font-bold">
                              {isEnglishReport
                                ? " No. 763 Mengzi Rd., Huangpu District, Shanghai"
                                : "上海市黄浦区蒙自路763号"}
                            </td>
                          </tr>
                          <tr className="divide-x divide-slate-100">
                            <td className="bg-slate-50 px-4 py-3 text-slate-500 font-bold">
                              {isEnglishReport ? "Postal Code" : "邮编"}
                            </td>
                            <td className="px-4 py-3 text-slate-700 font-bold">200023</td>
                            <td className="bg-slate-50 px-4 py-3 text-slate-500 font-bold">
                              {isEnglishReport ? "Fax" : "传真"}
                            </td>
                            <td className="px-4 py-3 text-slate-700 font-bold">021-xxxxxx</td>
                          </tr>
                          <tr className="divide-x divide-slate-100">
                            <td className="bg-slate-50 px-4 py-3 text-slate-500 font-bold">
                              {isEnglishReport ? "Product Safety Department" : "负责产品安全的部门"}
                            </td>
                            <td className="px-4 py-3 text-slate-700 font-bold">
                              {isEnglishReport ? "Quality" : "质量部"}
                            </td>
                            <td className="bg-slate-50 px-4 py-3 text-slate-500 font-bold">
                              {isEnglishReport ? "Responsible Person" : "负责人"}
                            </td>
                            <td className="px-4 py-3 text-slate-700 font-bold">
                              {isEnglishReport ? "J Wang" : "汪经理"}
                            </td>
                          </tr>
                          <tr className="divide-x divide-slate-100">
                            <td className="bg-slate-50 px-4 py-3 text-slate-500 font-bold">
                              {isEnglishReport ? "Mobile" : "手机"}
                            </td>
                            <td className="px-4 py-3 text-slate-700 font-bold">181xxxxxxx</td>
                            <td className="bg-slate-50 px-4 py-3 text-slate-500 font-bold">
                              {isEnglishReport ? "Telephone" : "固定电话"}
                            </td>
                            <td className="px-4 py-3 text-slate-700 font-bold">021-xxxxxx</td>
                          </tr>
                          <tr className="divide-x divide-slate-100">
                            <td className="bg-slate-50 px-4 py-3 text-slate-500 font-bold">
                              {isEnglishReport ? "Email" : "电子邮箱"}
                            </td>
                            <td className="px-4 py-3 text-slate-700 font-bold" colSpan={3}>xxxx.wang@bsci.com</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    <div className="rounded-2xl border border-amber-100 bg-amber-50/40 px-6 py-5">
                      <div className="text-sm font-black text-amber-800 mb-2">
                        {isEnglishReport ? "Confidential Notice" : "机密公告"}
                      </div>
                      <div className="text-[13px] leading-relaxed text-amber-900/80 space-y-1">
                        {isEnglishReport ? (
                          <>
                            <div>This report and all attached forms or annexes may contain confidential information and are intended only for the designated recipient.</div>
                            <div>Ownership of this report and all attached forms or annexes belongs to Boston Scientific International Medical Trading (Shanghai) Co., Ltd.</div>
                            <div>If you are not the intended recipient, you must not review, disseminate, distribute, copy, or otherwise use this report or any of its attachments.</div>
                          </>
                        ) : (
                          <>
                            <div>本报告及所有附表或者附件可能包含机密信息，仅收件人才可使用。</div>
                            <div>本报告及所有附表或者附件的所有权均属于波科国际医疗贸易（上海）有限公司。</div>
                            <div>如果收件人为非指定的接收者，禁止浏览、传播、分发、拷贝或者以其他方式使用本报告及所有附表或者附件。</div>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="text-[13px] text-slate-600 leading-relaxed">
                      {isEnglishReport
                        ? "*Note: To maintain continuity of PRER data, the start date of this reporting period is the end date of the previous PRER for the prior certificate (NMPA Reg. No. 20173775044)."
                        : "*注：为保持 PRER 数据的连续，本次报告周期的起始日期为该注册证旧证（国械注进20173775044）的定期风险评价报告的截止日期。"}
                    </div>

                    <div className="rounded-2xl border border-slate-200/70 bg-white overflow-hidden shadow-sm">
                      <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/40">
                        <div className="text-sm font-black text-slate-800">
                          {isEnglishReport ? "Table of Contents" : "目录"}
                        </div>
                      </div>
                      <div className="p-6">
                        <table className="w-full text-[13px] border-collapse">
                          <tbody className="divide-y divide-slate-100">
                            {[
                              isEnglishReport
                                ? ["1. Basic Product Information", "1"]
                                : ["1. 产品基本信息", "1"],
                              isEnglishReport
                                ? ["2. Domestic & Overseas Marketing Status", "2"]
                                : ["2. 国内外上市情况", "2"],
                              isEnglishReport
                                ? ["2.1 Summary Table of Marketing Status", "2"]
                                : ["2.1 国内外上市情况汇总表", "2"],
                              isEnglishReport
                                ? ["2.2 Requirements at Time of Approval", "2"]
                                : ["2.2 产品批准上市时提出的有关要求", "2"],
                              isEnglishReport
                                ? ["2.3 Differences in Indications (Intended Use)", "2"]
                                : ["2.3 适用范围（预期用途）差异", "2"],
                              isEnglishReport
                                ? ["3. Previous Risk Control Measures", "2"]
                                : ["3. 既往风险控制措施", "2"],
                              isEnglishReport
                                ? ["4. Adverse Event Information", "3"]
                                : ["4. 不良事件报告信息", "3"],
                              isEnglishReport
                                ? ["4.1 Individual Adverse Event Cases", "3"]
                                : ["4.1 个例不良事件报告", "3"],
                              isEnglishReport
                                ? ["4.2 Summary Table of Individual Cases", "3"]
                                : ["4.2 个例不良事件报告汇总表", "3"],
                              isEnglishReport
                                ? ["4.3 Cluster Adverse Events", "4"]
                                : ["4.3 群体不良事件", "4"],
                              isEnglishReport
                                ? ["5. Other Risk Information", "4"]
                                : ["5. 其他风险信息", "4"],
                              isEnglishReport
                                ? ["5.1 Literature Review Related to Product Risks", "4"]
                                : ["5.1 产品风险相关的文献资料研究", "4"],
                              isEnglishReport
                                ? ["5.2 Product Risk Evaluation", "4"]
                                : ["5.2 产品风险评价", "4"],
                              isEnglishReport
                                ? ["5.3 Key Monitoring Reports", "4"]
                                : ["5.3 重点监测报告", "4"],
                              isEnglishReport
                                ? ["5.4 Re-evaluation Reports", "4"]
                                : ["5.4 再评价报告", "4"],
                              isEnglishReport
                                ? ["6. Product Risk Analysis", "4"]
                                : ["6. 产品风险分析", "4"],
                              isEnglishReport
                                ? ["6.1 Adverse Event Incidence Rate", "4"]
                                : ["6.1 不良事件发生率", "4"],
                              isEnglishReport
                                ? ["6.2 Causes and Actions for Adverse Events", "5"]
                                : ["6.2 不良事件发生原因及措施", "5"],
                              isEnglishReport
                                ? ["6.3 Comprehensive Risk Analysis", "5"]
                                : ["6.3 综合风险分析", "5"],
                              isEnglishReport
                                ? ["7. Conclusion", "5"]
                                : ["7. 评价结论", "5"],
                              isEnglishReport
                                ? ["8. Appendices", "6"]
                                : ["8. 附件", "6"],
                            ].map(([name, page]) => (
                              <tr key={name} className="divide-x divide-slate-100">
                                <td className="py-2 pr-4 text-slate-700 font-bold">{name}</td>
                                <td className="py-2 pl-4 text-right text-slate-500 font-bold w-20">{page}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    <div className="space-y-4 pt-2">
                      <div className="text-base font-black text-slate-900">
                        {isEnglishReport ? "1. Basic Product Information" : "1. 产品基本信息"}
                      </div>
                      <div className="rounded-2xl border border-slate-200/70 overflow-hidden bg-white shadow-sm">
                        <table className="w-full text-sm border-collapse">
                          <tbody className="divide-y divide-slate-100">
                            <tr className="divide-x divide-slate-100">
                              <td className="w-52 bg-slate-50 px-4 py-3 text-slate-500 font-bold">
                                {isEnglishReport ? "Medical Device Name" : "医疗器械名称"}
                              </td>
                              <td className="px-4 py-3 text-slate-700 font-bold">
                                <div>{isEnglishReport ? "Radiofrequency Ablation Catheter" : "射频消融导管"}</div>
                                <div className="text-[12px] text-slate-500 font-bold mt-1">HABIB EndoHPB</div>
                              </td>
                            </tr>
                            <tr className="divide-x divide-slate-100">
                              <td className="bg-slate-50 px-4 py-3 text-slate-500 font-bold">
                                {isEnglishReport ? "Model and/or Specification" : "型号和/或者规格"}
                              </td>
                              <td className="px-4 py-3 text-slate-700 font-bold">M00500070</td>
                            </tr>
                            <tr className="divide-x divide-slate-100">
                              <td className="bg-slate-50 px-4 py-3 text-slate-500 font-bold">
                                {isEnglishReport ? "Registration Certificate No." : "注册证编号"}
                              </td>
                              <td className="px-4 py-3 text-slate-700 font-bold">国械注进20173015044</td>
                            </tr>
                            <tr className="divide-x divide-slate-100">
                              <td className="bg-slate-50 px-4 py-3 text-slate-500 font-bold">
                                {isEnglishReport ? "Structure and Components" : "结构及组成"}
                              </td>
                              <td className="px-4 py-3 text-slate-700 font-bold">
                                {isEnglishReport
                                  ? "The product consists of a catheter, electrodes, wires, a handle, and a Y-connector. It is a non-hydrated, single-use catheter sterilized by ethylene oxide (EO), with a shelf life of three years."
                                  : "产品由导管、电极、电线、手柄和 Y 型连接器组成。产品为非水合性导管，一次性使用，环氧乙烷灭菌，有效期三年。"}
                              </td>
                            </tr>
                            <tr className="divide-x divide-slate-100">
                              <td className="bg-slate-50 px-4 py-3 text-slate-500 font-bold">
                                {isEnglishReport ? "Main Materials" : "主要组成成分"}
                              </td>
                              <td className="px-4 py-3 text-slate-700 font-bold">
                                {isEnglishReport ? "Not specified in the registration certificate" : "注册证未体现"}
                              </td>
                            </tr>
                            <tr className="divide-x divide-slate-100">
                              <td className="bg-slate-50 px-4 py-3 text-slate-500 font-bold">
                                {isEnglishReport ? "Intended Use" : "适用范围（预期用途）"}
                              </td>
                              <td className="px-4 py-3 text-slate-700 font-bold">
                                {isEnglishReport
                                  ? "Used with the RITA 1500X RF generator to coagulate tissue during gastrointestinal and digestive tract procedures (including biliary and pancreatic ducts). Model M00500070 is used endoscopically."
                                  : "产品与 RITA 1500X 射频发生器配合使用，用于在胃肠道、消化道（包括胆胰管）手术中对组织进行凝固。M00500070 经内窥镜使用。"}
                              </td>
                            </tr>
                            <tr className="divide-x divide-slate-100">
                              <td className="bg-slate-50 px-4 py-3 text-slate-500 font-bold">
                                {isEnglishReport ? "Shelf Life" : "有效期"}
                              </td>
                              <td className="px-4 py-3 text-slate-700 font-bold">
                                {isEnglishReport ? "Three years" : "有效期三年"}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </section>
                </div>

                <div className="px-10 py-4 bg-slate-50/60 border-t border-slate-100 flex items-center justify-end shrink-0 mt-auto">
                  <button
                    onClick={() => setIsFinalizeModalOpen(true)}
                    disabled={!isPreviewVerified && !hasScrolledToBottom}
                    className="h-10 px-6 rounded-lg bg-clinical-blue text-white font-bold text-sm flex items-center gap-2 shadow-lg shadow-clinical-blue/20 hover:bg-blue-700 transition-all active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <CheckCircle2 size={18} />
                    {isEnglishReport ? "Confirm & Finalize" : "确认并完成报告编制"}
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
