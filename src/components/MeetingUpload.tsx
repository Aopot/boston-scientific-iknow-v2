"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  AudioLines,
  CheckCircle2,
  CloudUpload,
  Download,
  Loader2,
  RotateCcw,
  Sparkles,
} from "lucide-react";

type Phase = "upload" | "processing" | "result";

const phases = [
  { text: "正在分析音频特征...", durationMs: 2000 },
  { text: "正在识别发言人并校准医疗术语...", durationMs: 3000 },
  { text: "正在生成合规性纪要...", durationMs: 2000 },
] as const;

function formatFileSize(bytes: number) {
  if (!Number.isFinite(bytes) || bytes <= 0) return "0 B";
  const units = ["B", "KB", "MB", "GB"] as const;
  const exponent = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  const value = bytes / Math.pow(1024, exponent);
  const fixed = exponent === 0 ? 0 : value < 10 ? 1 : 0;
  return `${value.toFixed(fixed)} ${units[exponent]}`;
}

function isSupportedAudio(file: File) {
  const name = file.name.toLowerCase();
  const byExt = name.endsWith(".mp3") || name.endsWith(".wav");
  const byMime = file.type === "audio/mpeg" || file.type === "audio/wav" || file.type === "audio/x-wav";
  return byExt || byMime;
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export default function MeetingUpload() {
  const [phase, setPhase] = useState<Phase>("upload");
  const [file, setFile] = useState<File | null>(null);
  const [errorText, setErrorText] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [statusText, setStatusText] = useState<string>(phases[0].text);
  const [activeStageIndex, setActiveStageIndex] = useState(0);
  const [isBusy, setIsBusy] = useState(false);

  const keyDecisions = useMemo(
    () => [
      "确认 Q2 供应商周期性稽查按计划推进，风险等级维持在 L2。",
      "同意对 Polaris 系统相关 SOP 进行一次术语一致性校对与版本归档。",
      "对跨部门数据源权限执行最小权限原则，新增审计抽查频率。",
      "针对近 30 天投诉趋势，启动 CAPA 预评审并补齐根因证据链（含批次追溯与现场反馈）。",
      "对 MDR/Vigilance 报告字段进行对齐，纪要与附件统一引用同一版本的术语库与缩写映射。",
      "确认 PMS/PMCF 月度数据汇总口径，导出物包含审计字段（来源、负责人、更新时间）与数据保留策略。",
    ],
    [],
  );

  const actionItems = useMemo(
    () => [
      { who: "QA", what: "整理本次会议的合规性要点，并同步至知识库。", when: "本周五前" },
      { who: "R&D", what: "补充支架材料研究数据的来源说明与审计字段。", when: "下周二前" },
      { who: "Compliance", what: "更新术语库 v4.2 的医疗缩写映射规则。", when: "两周内" },
      { who: "Regulatory", what: "核对 MDR/Vigilance 报告模板的必填字段与引用附件清单，并给出差异点。", when: "3/15 前" },
      { who: "Supplier Quality", what: "汇总 Q2 供应商稽查计划与抽样清单，标注高风险项的复核频次。", when: "3/18 前" },
      { who: "IT/Security", what: "确认会议录音与转写文本的数据保留策略与脱敏规则（PII/患者信息）。", when: "3/20 前" },
      { who: "Clinical", what: "补充近季度 PMS/PMCF 关键指标口径说明，并提供可追溯的数据来源链接。", when: "3/22 前" },
    ],
    [],
  );

  const transcript = useMemo(
    () => [
      {
        speaker: "Kevin / QA",
        side: "left" as const,
        text: "先对齐今天的目标：把 Q2 供应商周期性稽查、投诉趋势、以及 MDR/Vigilance 的字段对齐一并定下来。",
      },
      {
        speaker: "Mia / Compliance",
        side: "right" as const,
        text: "同意。纪要里务必写清风险等级、抽查频率和数据来源版本号，审计最容易卡在一致性和可追溯性。",
      },
      {
        speaker: "Alex / R&D",
        side: "left" as const,
        text: "Polaris 系统相关 SOP 这块，我建议做一次术语一致性校对，并把版本归档流程补齐，避免不同文档里缩写不一致。",
      },
      {
        speaker: "Kevin / QA",
        side: "right" as const,
        text: "OK，关键决策之一：Polaris SOP 的术语一致性校对 + 版本归档。导出物里也要带审计字段。",
      },
      {
        speaker: "Chen / Regulatory",
        side: "left" as const,
        text: "MDR/Vigilance 模板我这边看过了，目前有两处字段口径和我们内部不一致：事件分类与时间线字段，需要对齐到最新模板。",
      },
      {
        speaker: "Mia / Compliance",
        side: "right" as const,
        text: "另外术语库 v4.2 的缩写映射要更新一下，尤其是 MDR/Vigilance 的常用缩写，避免纪要和附件引用不一致。",
      },
      {
        speaker: "Kevin / QA",
        side: "left" as const,
        text: "同意。关键决策写入：MDR/Vigilance 字段对齐 + 统一引用术语库版本。Regulatory 给我差异点清单。",
      },
      {
        speaker: "Liu / Supplier Quality",
        side: "right" as const,
        text: "供应商稽查方面，Q2 我们会按计划推进，重点供应商保持风险等级 L2，但高风险项建议把复核频次提高到每月一次抽查。",
      },
      {
        speaker: "Kevin / QA",
        side: "left" as const,
        text: "收到，关键决策：Q2 周期性稽查按计划推进，风险等级维持 L2，并新增审计抽查频率，供应商高风险项加密复核。",
      },
      {
        speaker: "Sara / Clinical",
        side: "right" as const,
        text: "PMS/PMCF 指标这块建议统一口径：投诉率、不良事件率、回访完成率都按月汇总，同时保留原始来源链接便于追溯。",
      },
      {
        speaker: "Alex / R&D",
        side: "left" as const,
        text: "投诉趋势我补充一下：近 30 天在某批次上有轻微上升，我们可以先启动 CAPA 预评审，先把根因证据链补齐。",
      },
      {
        speaker: "Mia / Compliance",
        side: "right" as const,
        text: "CAPA 相关结论不要写得太绝对，纪要里建议写“启动预评审/收集证据链”，并明确负责人和截止日期。",
      },
      {
        speaker: "Kevin / QA",
        side: "left" as const,
        text: "确认：启动 CAPA 预评审并补齐根因证据链（批次追溯+现场反馈）。同时跨部门数据源权限坚持最小权限原则。",
      },
      {
        speaker: "Wei / IT Security",
        side: "right" as const,
        text: "提醒一下：会议录音和转写里可能包含 PII/患者信息。建议导出物默认脱敏，并明确数据保留策略（30/90 天）。",
      },
      {
        speaker: "Kevin / QA",
        side: "left" as const,
        text: "OK，待办我来整理合规要点并同步到知识库；R&D 补齐来源说明；Compliance 更新术语库；Regulatory 对齐 MDR/Vigilance；IT 确认脱敏与数据保留。",
      },
    ],
    [],
  );

  const inputRef = useRef<HTMLInputElement | null>(null);
  const timersRef = useRef<number[]>([]);

  const progress = useMemo(() => {
    if (phase !== "processing") return 0;
    const steps = phases.length;
    return Math.min(100, Math.round(((activeStageIndex + 1) / steps) * 100));
  }, [activeStageIndex, phase]);

  const clearTimers = () => {
    for (const id of timersRef.current) window.clearTimeout(id);
    timersRef.current = [];
  };

  useEffect(() => {
    return () => clearTimers();
  }, []);

  const pickFile = () => {
    inputRef.current?.click();
  };

  const setSelectedFile = (selected: File | null) => {
    if (!selected) {
      setFile(null);
      setErrorText(null);
      return;
    }
    if (!isSupportedAudio(selected)) {
      setFile(null);
      setErrorText("仅支持 .mp3 或 .wav 格式的会议录音文件。");
      return;
    }
    setErrorText(null);
    setFile(selected);
  };

  const reset = () => {
    clearTimers();
    setIsBusy(false);
    setActiveStageIndex(0);
    setStatusText(phases[0].text);
    setPhase("upload");
    setFile(null);
    setErrorText(null);
  };

  const startProcessing = () => {
    if (!file || isBusy) return;
    clearTimers();
    setIsBusy(true);
    setPhase("processing");
    setActiveStageIndex(0);
    setStatusText(phases[0].text);

    let elapsed = 0;
    phases.forEach((p, idx) => {
      const id = window.setTimeout(() => {
        setActiveStageIndex(idx);
        setStatusText(p.text);
      }, elapsed);
      timersRef.current.push(id);
      elapsed += p.durationMs;
    });

    const doneId = window.setTimeout(() => {
      setPhase("result");
      setIsBusy(false);
    }, phases.reduce((sum, p) => sum + p.durationMs, 0));
    timersRef.current.push(doneId);
  };

  const decisionKeywords = useMemo(() => {
    const keywords = [
      "Q2",
      "供应商",
      "周期性稽查",
      "稽查",
      "风险等级",
      "L2",
      "Polaris",
      "SOP",
      "术语一致性",
      "术语",
      "版本归档",
      "归档",
      "最小权限",
      "权限",
      "审计",
      "抽查频率",
      "抽查",
      "投诉",
      "不良事件",
      "CAPA",
      "根因",
      "追溯",
      "MDR",
      "Vigilance",
      "PMS",
      "PMCF",
      "数据保留",
      "脱敏",
      "PII",
      "术语库",
      "缩写",
      "合规",
    ];
    return [...new Set(keywords)].sort((a, b) => b.length - a.length);
  }, []);

  const highlightRegex = useMemo(() => {
    const pattern = decisionKeywords.map(escapeRegExp).join("|");
    return new RegExp(`(${pattern})`, "gi");
  }, [decisionKeywords]);

  const renderHighlighted = (text: string) => {
    const parts = text.split(highlightRegex);
    return parts.map((part, idx) => {
      const isHit = decisionKeywords.some((k) => k.toLowerCase() === part.toLowerCase());
      if (!isHit) return part;
      return (
        <span
          key={`${part}-${idx}`}
          className="mx-0.5 px-1.5 py-0.5 rounded-md bg-amber-50 text-amber-700 border border-amber-100 font-black"
        >
          {part}
        </span>
      );
    });
  };

  const exportMinutes = () => {
    const content = [
      "# 会议纪要（AI 生成）",
      "",
      file ? `录音：${file.name}（${formatFileSize(file.size)}）` : "录音：会议录音",
      "",
      "## 关键决策",
      ...keyDecisions.map((d, i) => `${i + 1}. ${d}`),
      "",
      "## 待办事项",
      ...actionItems.map((t, i) => `${i + 1}. [${t.who}] ${t.what}（${t.when}）`),
      "",
      "## 录音转写（原文）",
      ...transcript.map((m) => `- ${m.speaker}: ${m.text}`),
      "",
      "注：AI 生成内容仅供参考，请以合规部门最终审核为准。",
      "",
    ].join("\n");

    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "meeting-minutes.txt";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="h-full flex flex-col min-h-0">
      <div className="flex-1 min-h-0 overflow-hidden">
        <AnimatePresence mode="wait">
        {phase === "upload" && (
          <motion.div
            key="upload"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
            className="h-full flex flex-col gap-6 min-h-0"
          >
            <div className="flex items-end justify-between shrink-0">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-clinical-blue/5 text-clinical-blue text-xs font-bold border border-clinical-blue/10">
                  <Sparkles size={12} className="animate-pulse" />
                  AI 会议纪要引擎
                </div>
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight">会议纪要生成</h1>
                <p className="text-slate-500 max-w-2xl">
                  专为 Boston Scientific 设计的高精度会议纪要引擎，支持自动提取关键决策与待办事项，并生成可审计的合规性纪要。
                </p>
              </div>
            </div>

            <div
              onClick={pickFile}
              onDragEnter={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsDragging(true);
              }}
              onDragOver={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsDragging(true);
              }}
              onDragLeave={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsDragging(false);
              }}
              onDrop={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsDragging(false);
                const dropped = e.dataTransfer.files?.[0] ?? null;
                setSelectedFile(dropped);
              }}
              className={`group relative flex-1 min-h-[280px] bg-white rounded-[40px] border-2 border-dashed transition-all cursor-pointer flex items-center justify-center p-10 overflow-hidden ${
                isDragging
                  ? "border-clinical-blue bg-blue-50/40"
                  : "border-slate-200 hover:border-clinical-blue/40 hover:bg-slate-50"
              }`}
            >
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute -top-24 -right-24 w-64 h-64 bg-clinical-blue/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-indigo-400/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>

              <div className="relative z-10 max-w-xl w-full flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center mb-6 group-hover:bg-blue-50 group-hover:border-blue-100 transition-all">
                  <CloudUpload size={34} className="text-slate-300 group-hover:text-clinical-blue transition-colors" />
                </div>

                <h3 className="text-xl font-bold text-slate-900 mb-2 tracking-tight">
                  上传会议录音
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed mb-6">
                  支持 .mp3 / .wav 格式，点击或拖拽上传。
                </p>

                {file ? (
                  <div className="w-full max-w-lg bg-white rounded-3xl border border-slate-200/60 shadow-sm p-5 flex items-start gap-4 text-left mb-6">
                    <div className="p-3 rounded-2xl bg-violet-50 text-violet-600 border border-violet-100">
                      <AudioLines size={22} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-slate-800 line-clamp-1">{file.name}</p>
                      <p className="text-[11px] text-slate-400 font-medium mt-1">
                        {formatFileSize(file.size)} · {file.type || "audio"}
                      </p>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedFile(null);
                        }}
                        className="mt-3 text-[11px] font-bold text-slate-400 hover:text-clinical-blue transition-colors"
                      >
                        重新选择
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-3 mb-6">
                    <div className="px-6 py-3 bg-clinical-blue text-white rounded-xl font-bold shadow-lg shadow-clinical-blue/20">
                      选择文件
                    </div>
                    <div className="px-6 py-3 bg-white border border-slate-200 text-slate-600 rounded-xl font-bold">
                      拖拽到此处
                    </div>
                  </div>
                )}

                {errorText && (
                  <div className="w-full max-w-lg px-4 py-3 rounded-2xl bg-rose-50 border border-rose-100 text-rose-600 text-xs font-bold mb-6">
                    {errorText}
                  </div>
                )}

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    startProcessing();
                  }}
                  disabled={!file}
                  className="w-full max-w-lg py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-xl shadow-slate-900/10 active:scale-[0.99]"
                >
                  开始处理
                </button>
              </div>

              <input
                ref={inputRef}
                type="file"
                accept=".mp3,.wav,audio/mpeg,audio/wav"
                className="hidden"
                onChange={(e) => setSelectedFile(e.target.files?.[0] ?? null)}
              />
            </div>
          </motion.div>
        )}

        {phase === "processing" && (
          <motion.div
            key="processing"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 0.25 }}
            className="h-full flex items-center justify-center min-h-0"
          >
            <div className="max-w-xl w-full bg-white rounded-[40px] p-12 shadow-2xl shadow-slate-200/50 border border-slate-100 flex flex-col items-center">
              <div className="relative mb-10">
                <div className="w-24 h-24 border-4 border-slate-50 rounded-full flex items-center justify-center">
                  <Loader2 size={40} className="text-clinical-blue animate-spin" />
                </div>
                <div className="absolute inset-0 border-4 border-clinical-blue rounded-full border-t-transparent animate-[spin_3s_linear_infinite]" />
              </div>

              <h3 className="text-2xl font-bold text-slate-900 tracking-tight mb-2">正在处理录音...</h3>
              <p className="text-slate-400 text-sm mb-10">{statusText}</p>

              <div className="w-full">
                <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden mb-6 relative">
                  <motion.div
                    className="h-full bg-clinical-blue shadow-[0_0_20px_rgba(0,85,150,0.35)]"
                    initial={{ width: "0%" }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.35, ease: "easeOut" }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/35 to-transparent animate-[shimmer_2s_infinite]" />
                </div>

                <div className="grid grid-cols-1 gap-3">
                  {phases.map((p, idx) => {
                    const isDone = idx < activeStageIndex;
                    const isActive = idx === activeStageIndex;
                    return (
                      <div
                        key={p.text}
                        className={`flex items-center gap-3 px-5 py-4 rounded-2xl border transition-all ${
                          isActive
                            ? "bg-blue-50/40 border-blue-100"
                            : isDone
                            ? "bg-emerald-50/40 border-emerald-100"
                            : "bg-slate-50 border-slate-100"
                        }`}
                      >
                        <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0">
                          {isDone ? (
                            <CheckCircle2 size={18} className="text-emerald-600" />
                          ) : isActive ? (
                            <Loader2 size={18} className="text-clinical-blue animate-spin" />
                          ) : (
                            <div className="w-2.5 h-2.5 rounded-full bg-slate-300" />
                          )}
                        </div>
                        <span
                          className={`text-sm font-bold tracking-tight ${
                            isActive
                              ? "text-clinical-blue"
                              : isDone
                              ? "text-emerald-700"
                              : "text-slate-500"
                          }`}
                        >
                          {p.text}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {phase === "result" && (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
            className="h-full flex flex-col gap-6 min-h-0"
          >
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 flex-1 min-h-0 overflow-hidden">
              <div className="bg-white rounded-[40px] border border-slate-200/60 shadow-sm overflow-hidden flex flex-col min-h-0">
                <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/40 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                      录音转写（原文）
                    </p>
                    <p className="text-[11px] text-slate-500 font-bold">与关键决策相关的关键词已高亮</p>
                  </div>
                  <div className="px-3 py-1 rounded-full bg-amber-50 text-amber-700 text-[10px] font-black border border-amber-100">
                    高亮关键词
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
                  {transcript.map((m, idx) => {
                    const isRight = m.side === "right";
                    return (
                      <div key={`${m.speaker}-${idx}`} className={`flex gap-3 ${isRight ? "flex-row-reverse" : ""}`}>
                        <div
                          className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-sm border ${
                            isRight
                              ? "bg-clinical-blue text-white border-clinical-blue/10"
                              : "bg-slate-100 text-slate-600 border-slate-200"
                          }`}
                        >
                          <span className="text-[11px] font-black">
                            {m.speaker.split("/")[0]?.trim().slice(0, 1) || "M"}
                          </span>
                        </div>
                        <div className={`max-w-[82%] flex flex-col gap-1.5 ${isRight ? "items-end" : ""}`}>
                          <div className="text-[10px] font-black tracking-tight text-slate-400">{m.speaker}</div>
                          <div
                            className={`p-4 rounded-2xl text-[13px] leading-snug shadow-sm border ${
                              isRight
                                ? "bg-clinical-blue text-white border-clinical-blue/10"
                                : "bg-white text-slate-800 border-slate-100"
                            }`}
                          >
                            {isRight ? (
                              <span className="[&>span]:bg-white/20 [&>span]:text-white [&>span]:border-white/30">
                                {renderHighlighted(m.text)}
                              </span>
                            ) : (
                              renderHighlighted(m.text)
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="bg-white rounded-[40px] border border-slate-200/60 shadow-sm overflow-hidden flex flex-col min-h-0">
                <div className="px-8 py-7 border-b border-slate-100 flex items-start justify-between gap-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-100">
                      <CheckCircle2 size={24} />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-xl font-black text-slate-900 tracking-tight">会议纪要已生成</h3>
                      <p className="text-xs text-slate-500">
                        {file ? `${file.name} · ${formatFileSize(file.size)}` : "会议录音解析完成"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={exportMinutes}
                      className="h-11 px-3.5 bg-clinical-blue text-white rounded-xl text-[13px] font-bold shadow-lg shadow-clinical-blue/20 hover:bg-blue-700 transition-colors flex items-center gap-1.5 whitespace-nowrap leading-none"
                    >
                      <Download size={16} />
                      导出
                    </button>

                    <button
                      type="button"
                      onClick={reset}
                      className="h-11 px-3.5 bg-slate-50 text-slate-600 rounded-xl text-[13px] font-bold border border-slate-200 hover:bg-white hover:border-clinical-blue/20 hover:text-clinical-blue transition-all flex items-center gap-1.5 whitespace-nowrap leading-none"
                    >
                      <RotateCcw size={16} />
                      重新上传
                    </button>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar">
                  <div className="p-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">关键决策</p>
                      <div className="space-y-2">
                        {keyDecisions.map((t) => (
                          <div key={t} className="px-4 py-3 rounded-2xl bg-slate-50 border border-slate-100">
                            <p className="text-[13px] font-bold text-slate-800 leading-snug">{t}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">待办事项</p>
                      <div className="space-y-2">
                        {actionItems.map((t) => (
                          <div key={t.what} className="px-4 py-3 rounded-2xl bg-white border border-slate-200/60 shadow-sm">
                            <div className="flex items-center justify-between gap-3 mb-1.5">
                              <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-clinical-blue text-[10px] font-black border border-blue-100">
                                {t.who}
                              </span>
                              <span className="text-[10px] font-bold text-slate-400">{t.when}</span>
                            </div>
                            <p className="text-[13px] font-bold text-slate-800 leading-snug">{t.what}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="px-8 py-5 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
                  <p className="text-[11px] text-slate-400 font-bold">
                    AI 生成的内容仅供参考，请以合规部门最终审核为准
                  </p>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={startProcessing}
                      className="h-10 px-4 bg-white border border-slate-200 text-slate-600 rounded-xl text-[13px] font-bold hover:bg-slate-50 transition-colors flex items-center gap-2"
                    >
                      <Loader2 size={16} className="opacity-70" />
                      重新生成
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
        </AnimatePresence>
      </div>
    </div>
  );
}
