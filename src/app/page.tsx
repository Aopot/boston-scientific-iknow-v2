"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Sidebar from "@/components/Sidebar";
import KnowledgeQA from "@/components/KnowledgeQA";
import DocumentGeneration from "@/components/DocumentGeneration";
import DocumentTranslation from "@/components/DocumentTranslation";
import KnowledgeManagement from "@/components/KnowledgeManagement";
import AdminConsole from "@/components/AdminConsole";
import LoginPage from "@/components/LoginPage";
import Workbench from "@/components/Workbench";
import Header from "@/components/Header";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("home");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  if (!isLoggedIn) {
    return <LoginPage onLogin={() => setIsLoggedIn(true)} />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case "home":
        return (
          <motion.div
            key="home"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="h-full"
          >
            <Workbench onNavigate={setActiveTab} />
          </motion.div>
        );
      case "qa":
        return (
          <motion.div
            key="qa"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="h-full"
          >
            <KnowledgeQA />
          </motion.div>
        );
      case "gen":
        return (
          <motion.div
            key="gen"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="h-full"
          >
            <DocumentGeneration />
          </motion.div>
        );
      case "trans":
        return (
          <motion.div
            key="trans"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="h-full"
          >
            <DocumentTranslation />
          </motion.div>
        );
      case "mgmt":
        return (
          <motion.div
            key="mgmt"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="h-full"
          >
            <KnowledgeManagement />
          </motion.div>
        );
      case "admin":
        return (
          <motion.div
            key="admin"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="h-full"
          >
            <AdminConsole />
          </motion.div>
        );
      default:
        return null;
    }
  };

  return (
    <main className="min-h-screen bg-background flex overflow-hidden">
      {/* Sidebar - Fixed width */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content - Fluid */}
      <div className="flex-1 ml-[280px] h-screen overflow-hidden flex flex-col bg-slate-50/50">
        {/* Top Navigation / Status */}
        <Header activeTab={activeTab} onLogout={() => setIsLoggedIn(false)} />

        {/* Dynamic Content Area */}
        <div className="flex-1 overflow-hidden p-12 pt-4">
          <AnimatePresence mode="wait">
            {renderContent()}
          </AnimatePresence>
        </div>
      </div>

      {/* Background Subtle Gradient */}
      <div className="fixed top-0 right-0 w-[800px] h-[800px] bg-clinical-blue/5 rounded-full blur-[120px] -mr-96 -mt-96 pointer-events-none" />
      <div className="fixed bottom-0 left-0 w-[600px] h-[600px] bg-blue-400/5 rounded-full blur-[100px] -ml-64 -mb-64 pointer-events-none" />
    </main>
  );
}
