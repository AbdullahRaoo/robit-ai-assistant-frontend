"use client"

import { motion } from "framer-motion"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ModernForm } from "@/components/modern-form"
import { CodeEditor } from "@/components/code-editor"
import { DocumentEditor } from "@/components/document-editor"

interface SidePanelProps {
  content: "form" | "code" | "document" | null
  onClose: () => void
}

export function SidePanel({ content, onClose }: SidePanelProps) {
  const renderContent = () => {
    switch (content) {
      case "form":
        return <ModernForm />
      case "code":
        return <CodeEditor />
      case "document":
        return <DocumentEditor />
      default:
        return null
    }
  }

  return (
    <motion.div
      initial={{ x: "100%", opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: "100%", opacity: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="w-[70%] bg-slate-900/95 backdrop-blur-lg border-l border-slate-700/50 flex flex-col"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-slate-700/50">
        <h2 className="text-xl font-semibold text-white capitalize">{content} Workspace</h2>
        <Button
          onClick={onClose}
          variant="ghost"
          size="sm"
          className="text-slate-400 hover:text-white hover:bg-slate-800"
        >
          <X className="w-5 h-5" />
        </Button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">{renderContent()}</div>
    </motion.div>
  )
}
