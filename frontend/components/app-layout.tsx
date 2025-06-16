"use client"

import { useState } from "react"
import { Workspace } from "@/components/workspace"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarProvider } from "@/components/ui/sidebar"
import type { AgentType } from "@/lib/types"
import { useCopilotChatSuggestions } from "@copilotkit/react-ui"
import { suggestions } from "@/lib/prompts"
import { usePathname } from "next/navigation"

export function AppLayout() {
  const [selectedAgent, setSelectedAgent] = useState<AgentType>("Researcher")
  const [messages, setMessages] = useState<{ role: "user" | "assistant"; content: string }[]>([
    { role: "assistant", content: "Hello! I'm your AI assistant. How can I help you today?" },
  ])

  const pathname = usePathname()

  useCopilotChatSuggestions({
    instructions : suggestions.mastra,
    available : pathname.includes("mastra") ? "enabled" : "disabled"
  })

  useCopilotChatSuggestions({
    instructions : suggestions.langgraph,
    available : pathname.includes("langgraph") ? "enabled" : "disabled"
  })

  useCopilotChatSuggestions({
    instructions : suggestions.crewai,
    available : pathname.includes("crewai") ? "enabled" : "disabled"
  })

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full overflow-hidden bg-background">
        <Workspace
          selectedAgent={selectedAgent}
          lastMessage={messages.filter((m) => m.role === "assistant").pop()?.content || ""}
        />
      </div>
    </SidebarProvider>
  )
}
