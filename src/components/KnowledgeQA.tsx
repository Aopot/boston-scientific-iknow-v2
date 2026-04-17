"use client";

import { useState, useRef, useEffect } from "react";
import { Send, FileText, ChevronRight, MessageSquare, Bot, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Message {
  id: string;
  type: "user" | "ai";
  content: string;
  sources?: string[];
}

let messageIdSeed = 1;
const nextMessageId = () => `m-${messageIdSeed++}`;

export default function KnowledgeQA() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "ai",
      content:
        "您好，我是 Boston Scientific AI 助手。\n有什么我可以帮助您的吗？\n可直接点击上方示例问题快速生成回答。",
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [typingMessageId, setTypingMessageId] = useState<string | null>(null);
  const [typingVersion, setTypingVersion] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const typingTimerRef = useRef<number | null>(null);

  const demoQAs = [
    {
      id: "q1",
      typeLabel: "检索",
      question: "新版《医疗器械质量生产规范》中哪些条款和供应商相关？",
      answer:
        "以下为 2025 版《医疗器械生产质量管理规范》中所有与供应商直接相关的条款，按章节与条款号列出：\n\n第八章 采购与原材料管理\n第五十九条：企业应当建立采购控制程序，确保采购的原材料或者服务符合规定要求，且不低于法律、法规、规章和强制性标准相关要求。\n第六十一条：企业应当建立供应商审核制度，明确供应商选择、评价和再评价准则和方法，根据审核评价结果建立合格供应商名单。应当结合产品质量风险、原材料用量以及对产品质量影响程度，决定是否对供应商进行现场审核。\n第六十三条：企业应当与关键供应商签订质量协议，明确采购原材料或者服务的技术要求、验收标准和双方质量责任。企业应当建立关键供应商质量档案。\n第六十八条：企业应当评估供应商关键原材料变更对产品质量影响的范围和程度，必要时采取相应措施。",
      sources: [
        "《医疗器械生产质量管理规范（2025版）》第八章 采购与原材料管理",
        "条款：第五十九条 / 第六十一条 / 第六十三条 / 第六十八条",
      ],
    },
    {
      id: "q2",
      typeLabel: "对比",
      question: "请对比新版管理规范和公司现行的供应商相关文件，列出一致和不一致的条款",
      answer:
        "1）第五十九条（采购控制）\n对应内部文件：\n- 《采购与物料验收管理程序》\n一致：文件明确建立采购控制程序，确保采购原材料/服务符合法规、强制性标准及公司规定要求，与规范核心要求匹配。\n不一致：文件未明确对供应商开展定期综合评价的具体频次、评价维度；也未规定供应商存在重大缺陷时的中止采购流程及对应的风险评估要求。\n\n2）外协加工方管理（供应商统一管理口径）\n对应内部文件：\n- 《外协加工方管理规定》（文件编号示例：SOP-116）\n不一致：文件仅单独规定外协加工方管理要求，未将其纳入供应商统一管理体系；与其他供应商管理要求的衔接不清晰，未体现与新版规范要求的统一口径。\n\n建议补齐项（落地到制度条款层面）：\n- 增加“供应商定期综合评价”的周期、维度与分级（合格/限期整改/不合格）\n- 增加“重大缺陷处置与中止采购 + 风险评估”闭环流程\n- 将外协加工方纳入统一的供应商管理体系（选择/评价/再评价/质量协议/档案一致）",
      sources: [
        "《医疗器械生产质量管理规范（2025版）》第八章 采购与原材料管理",
        "内部文件：采购与物料验收管理程序",
        "内部文件：外协加工方管理规定（示例：SOP-116）",
      ],
    },
    {
      id: "q3",
      typeLabel: "总结",
      question: "如何对《供应商管理规程》进行修改以符合新版《医疗器械质量管理规范》？",
      answer:
        "结合新版《医疗器械生产质量管理规范》第六十二条要求，针对《供应商管理规程》中缺失的相关内容，建议在“供应商评价与管控”章节新增以下条款（可直接嵌入）：\n\nA. 供应商定期综合评价\n公司应对所有合格供应商开展定期综合评价，评价周期至少每年一次。重点评价维度包括但不限于：\n- 供货质量合格率\n- 交付及时性\n- 技术支持能力\n- 合规资质有效性\n- 质量问题整改闭环情况\n评价结果分为：合格 / 限期整改 / 不合格。\n评价记录需统一归档至供应商质量档案，作为供应商续用、升级或降级的核心依据。\n\nB. 重大缺陷处置与风险评估\n当供应商出现重大质量缺陷（包括但不限于：供货物料不合格、违反质量协议、资质失效、生产工艺重大变更未告知等）时：\n1. 立即中止该供应商的采购合作。\n2. 由采购部门联合质量部门开展专项风险评估，分析缺陷对产品质量、生产进度及合规性的影响，形成风险评估报告。\n3. 根据评估结果制定专项整改要求并告知供应商。\n4. 供应商完成整改后提交整改验证资料，经质量部门审核合格后方可恢复采购合作。\n5. 对无法完成有效整改或整改后仍无法满足规范及公司要求的供应商：从合格供应商名单中移除，终止合作并留存记录。\n\n需要我帮你把这些修订内容整理成表格版本，方便你快速更新文件吗？",
      sources: [
        "《医疗器械生产质量管理规范（2025版）》供应商管理相关条款",
        "条款：第六十二条（供应商评价与管控）",
        "内部文件：供应商管理规程",
      ],
    },
  ] as const;

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages.length, isTyping, typingVersion]);

  useEffect(() => {
    return () => {
      if (typingTimerRef.current) {
        window.clearInterval(typingTimerRef.current);
      }
    };
  }, []);

  const getDemoByInput = (text: string) => {
    const normalized = text.replace(/\s+/g, "");
    const byExact = demoQAs.find((d) => d.question.replace(/\s+/g, "") === normalized);
    if (byExact) return byExact;
    if (normalized.includes("哪些条款") && normalized.includes("供应商")) return demoQAs[0];
    if (normalized.includes("对比") || normalized.includes("一致") || normalized.includes("不一致")) return demoQAs[1];
    if (normalized.includes("如何") && (normalized.includes("修改") || normalized.includes("修订"))) return demoQAs[2];
    return null;
  };

  const startTypewriter = (fullText: string, sources?: string[]) => {
    if (typingTimerRef.current) {
      window.clearInterval(typingTimerRef.current);
      typingTimerRef.current = null;
    }

    const id = nextMessageId();
    setTypingMessageId(id);
    setTypingVersion((v) => v + 1);

    setMessages((prev) => [
      ...prev,
      {
        id,
        type: "ai",
        content: "",
      },
    ]);

    let cursor = 0;
    const total = fullText.length;
    const chunkSize = total > 1400 ? 3 : total > 900 ? 2 : 1;
    const intervalMs = total > 1400 ? 12 : total > 900 ? 14 : 16;

    typingTimerRef.current = window.setInterval(() => {
      cursor = Math.min(total, cursor + chunkSize);
      const next = fullText.slice(0, cursor);

      setMessages((prev) =>
        prev.map((m) => (m.id === id ? { ...m, content: next } : m)),
      );
      setTypingVersion((v) => v + 1);

      if (cursor >= total) {
        if (typingTimerRef.current) {
          window.clearInterval(typingTimerRef.current);
          typingTimerRef.current = null;
        }
        setMessages((prev) =>
          prev.map((m) => (m.id === id ? { ...m, content: fullText, sources } : m)),
        );
        setIsTyping(false);
        setTypingMessageId(null);
      }
    }, intervalMs);
  };

  const pushDemo = (demoId: (typeof demoQAs)[number]["id"]) => {
    if (isTyping) return;
    const demo = demoQAs.find((d) => d.id === demoId);
    if (!demo) return;

    const userMsg: Message = { id: nextMessageId(), type: "user", content: demo.question };
    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);
    window.setTimeout(() => {
      startTypewriter(`类型：${demo.typeLabel}\n\n${demo.answer}`, [...demo.sources]);
    }, 450);
  };

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;
    const text = input;
    const userMsg: Message = { id: nextMessageId(), type: "user", content: text };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    const demo = getDemoByInput(text);
    window.setTimeout(() => {
      if (demo) {
        startTypewriter(`类型：${demo.typeLabel}\n\n${demo.answer}`, [...demo.sources]);
        return;
      }
      startTypewriter(
        "当前为演示模式：我已内置 3 个示例问答（内容检索 / 文档对比 / 推理总结）。\n你可以直接点击上方示例问题，或在输入框里粘贴示例问题来查看对应答案。",
      );
    }, 450);
  };

  return (
    <div className="h-full flex flex-col bg-white rounded-3xl shadow-sm border border-slate-200/60 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-clinical-blue rounded-xl text-white shadow-md shadow-clinical-blue/20">
            <MessageSquare size={20} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">知识库问答 (RAG)</h2>
            <p className="text-xs text-slate-500">基于本地私有化医学文献库的精准问答</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="px-3 py-1.5 rounded-full bg-blue-50 text-clinical-blue text-[11px] font-bold border border-blue-100">
            医疗级可信度 99.8%
          </div>
        </div>
      </div>

      <div className="px-6 py-3 border-b border-slate-100 bg-white flex items-center gap-3 overflow-x-auto">
        {demoQAs.map((d) => (
          <button
            key={d.id}
            onClick={() => pushDemo(d.id)}
            disabled={isTyping}
            className="shrink-0 px-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-700 hover:bg-white hover:border-clinical-blue/20 hover:text-clinical-blue transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">
              {d.typeLabel}
            </div>
            <div className="text-sm font-bold tracking-tight">
              {d.question.replace("新版", "Q")}
            </div>
          </button>
        ))}
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth">
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex gap-4 ${msg.type === "user" ? "flex-row-reverse" : ""}`}
            >
              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-sm ${
                msg.type === "ai" 
                  ? "bg-clinical-blue text-white" 
                  : "bg-slate-100 text-slate-600 border border-slate-200"
              }`}>
                {msg.type === "ai" ? <Bot size={20} /> : <User size={20} />}
              </div>
              <div className={`max-w-[70%] flex flex-col gap-2 ${msg.type === "user" ? "items-end" : ""}`}>
                <div className={`p-5 rounded-2xl text-[15px] leading-relaxed shadow-sm whitespace-pre-wrap ${
                  msg.type === "ai" 
                    ? "bg-white border border-slate-100 text-slate-800" 
                    : "bg-clinical-blue text-white shadow-clinical-blue/10"
                }`}>
                  {msg.content}
                </div>
                
                {msg.sources && (
                  <div className="flex flex-col gap-2 mt-2">
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 ml-1">
                      <FileText size={12} />
                      引用来源 (RAG Sources)
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {msg.sources.map((source, i) => (
                        <button
                          key={i}
                          className="px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-[11px] text-slate-600 hover:bg-white hover:border-clinical-blue hover:text-clinical-blue transition-all flex items-center gap-2 group shadow-sm active:scale-95"
                        >
                          <span className="w-1 h-1 rounded-full bg-clinical-blue/40 group-hover:bg-clinical-blue" />
                          [{i + 1}] {source}
                          <ChevronRight size={10} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {isTyping && !typingMessageId && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-4">
            <div className="w-10 h-10 rounded-2xl bg-clinical-blue text-white flex items-center justify-center">
              <Bot size={20} />
            </div>
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 flex gap-1.5 items-center">
              <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:-0.3s]" />
              <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:-0.15s]" />
              <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce" />
            </div>
          </motion.div>
        )}
      </div>

      {/* Input */}
      <div className="p-4 bg-white border-t border-slate-100">
        <div className="relative max-w-none mx-auto">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="请输入您的问题，例如：'如何准备手术包？'..."
            className="w-full pl-6 pr-14 py-4 rounded-2xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-clinical-blue/20 focus:border-clinical-blue transition-all text-[15px] placeholder:text-slate-400"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-3 rounded-xl bg-clinical-blue text-white hover:bg-blue-700 transition-colors disabled:opacity-30 disabled:cursor-not-allowed shadow-lg shadow-clinical-blue/20"
          >
            <Send size={20} />
          </button>
        </div>
        <p className="text-center text-[11px] text-slate-400 mt-3 flex items-center justify-center gap-1.5">
          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
          AI 生成的内容仅供参考，请以官方临床手册为准
        </p>
      </div>
    </div>
  );
}
