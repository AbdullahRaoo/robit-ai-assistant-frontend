"use client"

import { motion } from "framer-motion"
import { FileText, Download, Share } from "lucide-react"
import { Button } from "@/components/ui/button"

export function DocumentEditor() {
  return (
    <div className="p-6 space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
        <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
          Document Creator
        </h3>
        <p className="text-slate-400">Create and edit documents with AI assistance</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-slate-800/50 backdrop-blur-sm rounded-3xl p-6 border border-slate-700/50"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <FileText className="w-5 h-5 text-purple-400" />
            <span className="text-white font-medium">Untitled Document</span>
          </div>
          <div className="flex space-x-2">
            <Button size="sm" variant="outline" className="border-blue-500/30 text-blue-400 bg-transparent">
              <Share className="w-4 h-4 mr-2" />
              Share
            </Button>
            <Button size="sm" variant="outline" className="border-green-500/30 text-green-400 bg-transparent">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        <div className="bg-slate-900/80 rounded-2xl p-6 min-h-[400px]">
          <textarea
            placeholder="Start writing your document..."
            className="w-full h-full bg-transparent text-white placeholder-slate-400 resize-none focus:outline-none"
            defaultValue="# Welcome to Robit Document Editor

This is a modern document editor with AI assistance. You can:

- Write and format text
- Generate content with AI
- Export to various formats
- Collaborate in real-time

Start typing to begin your document..."
          />
        </div>
      </motion.div>
    </div>
  )
}
