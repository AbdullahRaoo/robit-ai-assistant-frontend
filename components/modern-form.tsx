"use client"

import { useState, useRef } from "react"
import { motion, AnimatePresence, useDragControls } from "framer-motion"
import { Trash2, Zap, Sparkles, Send } from "lucide-react"

interface FormNode {
  id: string
  type: "text" | "email" | "number" | "textarea" | "select"
  label: string
  placeholder: string
  required: boolean
  position: { x: number; y: number }
  value: string
}

export function ModernForm() {
  const [nodes, setNodes] = useState<FormNode[]>([
    {
      id: "1",
      type: "text",
      label: "Full Name",
      placeholder: "Enter your full name",
      required: true,
      position: { x: 200, y: 100 },
      value: "",
    },
    {
      id: "2",
      type: "email",
      label: "Email Address",
      placeholder: "Enter your email",
      required: true,
      position: { x: 500, y: 200 },
      value: "",
    },
  ])

  const [connections, setConnections] = useState<Array<{ from: string; to: string }>>([{ from: "1", to: "2" }])

  const [activeNode, setActiveNode] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const addNode = (type: FormNode["type"]) => {
    const newNode: FormNode = {
      id: Date.now().toString(),
      type,
      label: `${type.charAt(0).toUpperCase() + type.slice(1)} Field`,
      placeholder: `Enter ${type}`,
      required: false,
      position: {
        x: Math.random() * 400 + 100,
        y: Math.random() * 300 + 150,
      },
      value: "",
    }
    setNodes([...nodes, newNode])
  }

  const removeNode = (id: string) => {
    setNodes(nodes.filter((node) => node.id !== id))
    setConnections(connections.filter((conn) => conn.from !== id && conn.to !== id))
  }

  const updateNode = (id: string, updates: Partial<FormNode>) => {
    setNodes(nodes.map((node) => (node.id === id ? { ...node, ...updates } : node)))
  }

  const updateNodePosition = (id: string, position: { x: number; y: number }) => {
    setNodes(nodes.map((node) => (node.id === id ? { ...node, position } : node)))
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    // Simulate AI processing
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsSubmitting(false)
  }

  const getNodeColor = (type: string) => {
    const colors = {
      text: "from-teal-500 to-cyan-500",
      email: "from-blue-500 to-indigo-500",
      number: "from-green-500 to-emerald-500",
      textarea: "from-purple-500 to-violet-500",
      select: "from-orange-500 to-red-500",
    }
    return colors[type as keyof typeof colors] || "from-gray-500 to-slate-500"
  }

  const DraggableNode = ({ node }: { node: FormNode }) => {
    const dragControls = useDragControls()

    return (
      <motion.div
        drag
        dragControls={dragControls}
        dragMomentum={false}
        onDrag={(_, info) => {
          updateNodePosition(node.id, {
            x: node.position.x + info.delta.x,
            y: node.position.y + info.delta.y,
          })
        }}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0, opacity: 0 }}
        whileHover={{ scale: 1.05 }}
        whileDrag={{ scale: 1.1, zIndex: 1000 }}
        className="absolute cursor-move"
        style={{
          left: node.position.x,
          top: node.position.y,
        }}
      >
        {/* Connection Point */}
        <div className="absolute -top-2 -left-2 w-4 h-4 bg-gradient-to-r from-teal-400 to-orange-400 rounded-full opacity-60" />

        {/* Node Bubble */}
        <div
          className={`relative bg-gradient-to-br ${getNodeColor(node.type)} p-1 rounded-3xl shadow-2xl backdrop-blur-sm border border-white/20`}
          onClick={() => setActiveNode(activeNode === node.id ? null : node.id)}
        >
          <div className="bg-slate-900/80 backdrop-blur-sm rounded-3xl p-6 min-w-[280px]">
            {/* Node Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 bg-gradient-to-r ${getNodeColor(node.type)} rounded-full`} />
                <span className="text-white font-medium text-sm">{node.label}</span>
                {node.required && (
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                    className="w-2 h-2 bg-red-400 rounded-full"
                  />
                )}
              </div>

              <motion.button
                onClick={(e) => {
                  e.stopPropagation()
                  removeNode(node.id)
                }}
                className="text-red-400 hover:text-red-300 opacity-0 group-hover:opacity-100 transition-opacity"
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.8 }}
              >
                <Trash2 className="w-4 h-4" />
              </motion.button>
            </div>

            {/* Input Field */}
            <div className="relative">
              {node.type === "textarea" ? (
                <textarea
                  value={node.value}
                  onChange={(e) => updateNode(node.id, { value: e.target.value })}
                  placeholder={node.placeholder}
                  className="w-full bg-slate-800/50 border border-slate-600/50 rounded-2xl px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-transparent transition-all duration-200 resize-none h-20"
                />
              ) : (
                <input
                  type={node.type}
                  value={node.value}
                  onChange={(e) => updateNode(node.id, { value: e.target.value })}
                  placeholder={node.placeholder}
                  className="w-full bg-slate-800/50 border border-slate-600/50 rounded-2xl px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-transparent transition-all duration-200"
                />
              )}

              {/* Input Glow Effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-teal-500/20 to-orange-500/20 rounded-2xl -z-10"
                animate={{
                  opacity: node.value ? [0.3, 0.6, 0.3] : 0,
                }}
                transition={{
                  duration: 2,
                  repeat: node.value ? Number.POSITIVE_INFINITY : 0,
                }}
              />
            </div>

            {/* Node Editor */}
            <AnimatePresence>
              {activeNode === node.id && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4 p-4 bg-slate-800/30 rounded-2xl border border-slate-600/30"
                >
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={node.label}
                      onChange={(e) => updateNode(node.id, { label: e.target.value })}
                      placeholder="Field label"
                      className="w-full bg-slate-700/50 border border-slate-500/50 rounded-xl px-3 py-2 text-white text-sm"
                    />
                    <input
                      type="text"
                      value={node.placeholder}
                      onChange={(e) => updateNode(node.id, { placeholder: e.target.value })}
                      placeholder="Placeholder text"
                      className="w-full bg-slate-700/50 border border-slate-500/50 rounded-xl px-3 py-2 text-white text-sm"
                    />
                    <label className="flex items-center space-x-2 text-sm text-slate-300">
                      <input
                        type="checkbox"
                        checked={node.required}
                        onChange={(e) => updateNode(node.id, { required: e.target.checked })}
                        className="rounded border-slate-500 bg-slate-600"
                      />
                      <span>Required Field</span>
                    </label>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    )
  }

  return (
    <div className="p-6 space-y-6 h-full">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
        <h3 className="text-2xl font-bold bg-gradient-to-r from-teal-400 to-orange-400 bg-clip-text text-transparent mb-2">
          AI Input Nodes
        </h3>
        <p className="text-slate-400">Create connected input nodes for AI data collection</p>
      </motion.div>

      {/* Node Type Palette */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex justify-center"
      >
        <div className="flex space-x-2 bg-slate-800/50 backdrop-blur-sm rounded-2xl p-3 border border-slate-700/50">
          {[
            { type: "text", icon: "T", color: "teal" },
            { type: "email", icon: "@", color: "blue" },
            { type: "number", icon: "#", color: "green" },
            { type: "textarea", icon: "¶", color: "purple" },
          ].map(({ type, icon, color }) => (
            <motion.button
              key={type}
              onClick={() => addNode(type as FormNode["type"])}
              className={`w-12 h-12 rounded-xl bg-gradient-to-br from-${color}-600/20 to-${color}-500/20 border border-${color}-500/30 text-${color}-400 hover:from-${color}-600/40 hover:to-${color}-500/40 transition-all duration-200 flex items-center justify-center font-bold text-lg`}
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.9 }}
            >
              {icon}
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Node Canvas */}
      <motion.div
        ref={containerRef}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="relative bg-slate-900/30 backdrop-blur-sm rounded-3xl border border-slate-700/50 overflow-hidden"
        style={{ height: "500px" }}
      >
        {/* Grid Background */}
        <div className="absolute inset-0 opacity-10">
          <svg width="100%" height="100%">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        {/* Connection Lines */}
        <svg className="absolute inset-0 pointer-events-none">
          {connections.map((connection, index) => {
            const fromNode = nodes.find((n) => n.id === connection.from)
            const toNode = nodes.find((n) => n.id === connection.to)
            if (!fromNode || !toNode) return null

            return (
              <motion.path
                key={`${connection.from}-${connection.to}`}
                d={`M ${fromNode.position.x + 140} ${fromNode.position.y + 50} Q ${(fromNode.position.x + toNode.position.x) / 2} ${fromNode.position.y - 50} ${toNode.position.x + 140} ${toNode.position.y + 50}`}
                stroke="url(#connectionGradient)"
                strokeWidth="2"
                fill="none"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1, delay: index * 0.2 }}
              />
            )
          })}
          <defs>
            <linearGradient id="connectionGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#14b8a6" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#f97316" stopOpacity="0.6" />
            </linearGradient>
          </defs>
        </svg>

        {/* Nodes */}
        <AnimatePresence>
          {nodes.map((node) => (
            <DraggableNode key={node.id} node={node} />
          ))}
        </AnimatePresence>

        {/* Floating Particles */}
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-gradient-to-r from-teal-400/30 to-orange-400/30 rounded-full"
            animate={{
              x: [0, 100, 200, 100, 0],
              y: [0, 50, 100, 150, 0],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 8 + i * 2,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
            style={{
              left: `${20 + i * 15}%`,
              top: `${30 + i * 10}%`,
            }}
          />
        ))}
      </motion.div>

      {/* AI Submit Portal */}
      <motion.div
        className="flex justify-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <motion.button
          onClick={handleSubmit}
          disabled={isSubmitting || nodes.every((node) => !node.value)}
          className="relative group"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-teal-600 to-orange-600 rounded-full blur-xl opacity-60 group-hover:opacity-80 transition-opacity" />

          <div className="relative bg-gradient-to-r from-teal-600 to-orange-600 rounded-full p-1">
            <div className="bg-slate-900 rounded-full px-8 py-4 flex items-center space-x-3">
              <motion.div
                animate={isSubmitting ? { rotate: 360 } : {}}
                transition={{ duration: 1, repeat: isSubmitting ? Number.POSITIVE_INFINITY : 0, ease: "linear" }}
              >
                {isSubmitting ? (
                  <Sparkles className="w-6 h-6 text-teal-400" />
                ) : (
                  <Zap className="w-6 h-6 text-teal-400" />
                )}
              </motion.div>

              <span className="text-white font-semibold text-lg">{isSubmitting ? "Processing..." : "Send to AI"}</span>

              <motion.div
                animate={{
                  x: isSubmitting ? [0, 5, 0] : 0,
                }}
                transition={{
                  duration: 0.5,
                  repeat: isSubmitting ? Number.POSITIVE_INFINITY : 0,
                }}
              >
                <Send className="w-5 h-5 text-orange-400" />
              </motion.div>
            </div>
          </div>

          {/* Energy Rings */}
          <AnimatePresence>
            {isSubmitting && (
              <>
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute inset-0 border-2 border-teal-400/30 rounded-full"
                    initial={{ scale: 1, opacity: 0.6 }}
                    animate={{ scale: 2 + i * 0.5, opacity: 0 }}
                    transition={{
                      duration: 2,
                      repeat: Number.POSITIVE_INFINITY,
                      delay: i * 0.4,
                    }}
                  />
                ))}
              </>
            )}
          </AnimatePresence>
        </motion.button>
      </motion.div>
    </div>
  )
}
