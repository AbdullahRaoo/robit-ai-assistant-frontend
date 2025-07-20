"use client"

import { useState } from "react"
import { ChatArea } from "@/components/chat-area"
import { SidePanel } from "@/components/side-panel"
import { Header } from "@/components/header"
import { AnimatePresence } from "framer-motion"

export default function RobitAssistant() {
  const [sidePanelOpen, setSidePanelOpen] = useState(false)
  const [sidePanelContent, setSidePanelContent] = useState<"form" | "code" | "document" | null>(null)

  const openSidePanel = (content: "form" | "code" | "document") => {
    setSidePanelContent(content)
    setSidePanelOpen(true)
  }

  const closeSidePanel = () => {
    setSidePanelOpen(false)
    setTimeout(() => setSidePanelContent(null), 300)
  }

  return (
    <div className="h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-teal-900 flex flex-col overflow-hidden">
      <Header />

      <div className="flex-1 flex relative">
        <ChatArea sidePanelOpen={sidePanelOpen} onOpenSidePanel={openSidePanel} />

        <AnimatePresence>
          {sidePanelOpen && <SidePanel content={sidePanelContent} onClose={closeSidePanel} />}
        </AnimatePresence>
      </div>
    </div>
  )
}
