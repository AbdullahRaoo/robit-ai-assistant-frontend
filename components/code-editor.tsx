"use client"

import { motion } from "framer-motion"
import { Code, Play, Save } from "lucide-react"
import { Button } from "@/components/ui/button"

export function CodeEditor() {
  return (
    <div className="p-6 space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
        <h3 className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent mb-2">
          Code Generator
        </h3>
        <p className="text-slate-400">Generate and edit code with AI assistance</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-slate-800/50 backdrop-blur-sm rounded-3xl p-6 border border-slate-700/50"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Code className="w-5 h-5 text-orange-400" />
            <span className="text-white font-medium">main.tsx</span>
          </div>
          <div className="flex space-x-2">
            <Button size="sm" variant="outline" className="border-orange-500/30 text-orange-400 bg-transparent">
              <Play className="w-4 h-4 mr-2" />
              Run
            </Button>
            <Button size="sm" variant="outline" className="border-green-500/30 text-green-400 bg-transparent">
              <Save className="w-4 h-4 mr-2" />
              Save
            </Button>
          </div>
        </div>

        <div className="bg-slate-900/80 rounded-2xl p-4 font-mono text-sm">
          <div className="text-slate-400">
            <span className="text-purple-400">import</span> <span className="text-blue-400">React</span>{" "}
            <span className="text-purple-400">from</span> <span className="text-green-400">'react'</span>
          </div>
          <div className="text-slate-400 mt-2">
            <span className="text-purple-400">function</span> <span className="text-yellow-400">App</span>
            <span className="text-slate-300">()</span> <span className="text-slate-300">{"{"}</span>
          </div>
          <div className="text-slate-400 ml-4 mt-1">
            <span className="text-purple-400">return</span> <span className="text-slate-300">{"("}</span>
          </div>
          <div className="text-slate-400 ml-8 mt-1">
            <span className="text-red-400">{"<div>"}</span>
            <span className="text-white">Hello, Robit!</span>
            <span className="text-red-400">{"</div>"}</span>
          </div>
          <div className="text-slate-400 ml-4 mt-1">
            <span className="text-slate-300">{")"}</span>
          </div>
          <div className="text-slate-400 mt-1">
            <span className="text-slate-300">{"}"}</span>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
