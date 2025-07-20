"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Send, Sparkles, Code, FileText, FormInput } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Message {
  id: string
  type: "user" | "assistant"
  content: string
  timestamp: Date
}

interface ChatAreaProps {
  sidePanelOpen: boolean
  onOpenSidePanel: (content: "form" | "code" | "document") => void
}

export function ChatArea({ sidePanelOpen, onOpenSidePanel }: ChatAreaProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "assistant",
      content: "Hello! I'm Robit, your AI assistant. How can I help you today?",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)

  const sendMessage = async () => {
    if (!input.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: input,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsTyping(true)

    // Simulate AI response
    setTimeout(() => {
      const responses = [
        "I can help you create forms, code, or documents. What would you like to work on?",
        "Let me assist you with that. I'll open a workspace for better collaboration.",
        "Great question! I'll provide a detailed response in the side panel.",
      ]

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        content: responses[Math.floor(Math.random() * responses.length)],
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, assistantMessage])
      setIsTyping(false)
    }, 2000)
  }

  return (
    <motion.div
      className={`flex flex-col transition-all duration-500 ease-in-out ${sidePanelOpen ? "w-[30%]" : "w-full"}`}
      layout
    >
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] ${
                  message.type === "user"
                    ? "bg-gradient-to-r from-teal-600 to-teal-500"
                    : "bg-slate-800/80 backdrop-blur-sm border border-slate-700/50"
                } rounded-2xl px-4 py-3 shadow-lg`}
              >
                <p className="text-white">{message.content}</p>
                <p className="text-xs text-slate-300 mt-1">{message.timestamp.toLocaleTimeString()}</p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Typing Indicator */}
        <AnimatePresence>
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex justify-start"
            >
              <div className="bg-slate-800/80 backdrop-blur-sm border border-slate-700/50 rounded-2xl px-4 py-3">
                <div className="flex space-x-1">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      className="w-2 h-2 bg-teal-400 rounded-full"
                      animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.5, 1, 0.5],
                      }}
                      transition={{
                        duration: 1,
                        repeat: Number.POSITIVE_INFINITY,
                        delay: i * 0.2,
                      }}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Quick Actions */}
      <motion.div className="px-6 py-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
        <div className="flex space-x-2 mb-4">
          <Button
            onClick={() => onOpenSidePanel("form")}
            variant="outline"
            size="sm"
            className="bg-slate-800/50 border-teal-500/30 text-teal-400 hover:bg-teal-500/20"
          >
            <FormInput className="w-4 h-4 mr-2" />
            Create Form
          </Button>
          <Button
            onClick={() => onOpenSidePanel("code")}
            variant="outline"
            size="sm"
            className="bg-slate-800/50 border-orange-500/30 text-orange-400 hover:bg-orange-500/20"
          >
            <Code className="w-4 h-4 mr-2" />
            Generate Code
          </Button>
          <Button
            onClick={() => onOpenSidePanel("document")}
            variant="outline"
            size="sm"
            className="bg-slate-800/50 border-purple-500/30 text-purple-400 hover:bg-purple-500/20"
          >
            <FileText className="w-4 h-4 mr-2" />
            Create Document
          </Button>
        </div>
      </motion.div>

      {/* Input Area */}
      <motion.div
        className="p-6 bg-slate-900/50 backdrop-blur-lg border-t border-slate-700/50"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <div className="flex space-x-4">
          <div className="flex-1 relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Ask Robit anything..."
              className="w-full bg-slate-800/80 backdrop-blur-sm border border-slate-600/50 rounded-2xl px-6 py-4 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500/50 transition-all duration-200"
            />
            <motion.div
              className="absolute right-4 top-1/2 transform -translate-y-1/2"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Sparkles className="w-5 h-5 text-teal-400" />
            </motion.div>
          </div>

          <motion.button
            onClick={sendMessage}
            disabled={!input.trim()}
            className="bg-gradient-to-r from-teal-600 to-teal-500 hover:from-teal-500 hover:to-teal-400 disabled:from-slate-600 disabled:to-slate-500 text-white rounded-2xl px-6 py-4 transition-all duration-200 disabled:cursor-not-allowed"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Send className="w-5 h-5" />
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  )
}
