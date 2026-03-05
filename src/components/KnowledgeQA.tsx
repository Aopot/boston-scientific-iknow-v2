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

export default function KnowledgeQA() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "ai",
      content: "您好，我是 Boston Scientific AI 助手。您可以询问有关手术规范、设备手册或合规报告的相关问题。",
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: Message = { id: Date.now().toString(), type: "user", content: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content: "根据《Surgical Manual v2.0》第 14 章的规定，在进行导管介入手术时，必须确保环境压力维持在标准范围。此外，建议在手术前 15 分钟进行设备自检，以确保传感器的精确度。",
        sources: ["Surgical Manual v2.0", "Safety Protocol #142", "Device Compliance 2024"],
      };
      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div className="h-full flex flex-col bg-white rounded-3xl shadow-sm border border-slate-200/60 overflow-hidden">
      {/* Header */}
      <div className="px-8 py-6 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
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

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-8 scroll-smooth">
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
                <div className={`p-5 rounded-2xl text-[15px] leading-relaxed shadow-sm ${
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
        
        {isTyping && (
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
      <div className="p-6 bg-white border-t border-slate-100">
        <div className="relative max-w-4xl mx-auto">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="请输入您的问题，例如：'如何准备手术包？'..."
            className="w-full pl-6 pr-14 py-5 rounded-2xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-clinical-blue/20 focus:border-clinical-blue transition-all text-[15px] placeholder:text-slate-400"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-3 rounded-xl bg-clinical-blue text-white hover:bg-blue-700 transition-colors disabled:opacity-30 disabled:cursor-not-allowed shadow-lg shadow-clinical-blue/20"
          >
            <Send size={20} />
          </button>
        </div>
        <p className="text-center text-[11px] text-slate-400 mt-4 flex items-center justify-center gap-1.5">
          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
          AI 生成的内容仅供参考，请以官方临床手册为准
        </p>
      </div>
    </div>
  );
}
