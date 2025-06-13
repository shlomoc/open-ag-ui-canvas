"use client"

import type React from "react"

import { useState } from "react"
import { Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { AgentSelector } from "@/components/agent-selector"
import type { AgentType } from "@/lib/types"
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail } from "@/components/ui/sidebar"
import { CopilotChat } from "@copilotkit/react-ui"

interface AppSidebarProps {
  messages: { role: "user" | "assistant"; content: string }[]
  addMessage: (message: string) => void
  selectedAgent: AgentType
  setSelectedAgent: (agent: AgentType) => void
}

export function AppSidebar({ messages, addMessage, selectedAgent, setSelectedAgent }: AppSidebarProps) {


  return (
    <>
      <div className="h-full rounded-xl">
        <CopilotChat
          className="h-full rounded-xl border-l-2 border-muted-foreground/20"
          Input={({onSend, inProgress}) => {
            const [input, setInput] = useState("")
            return (<>
              <div className="space-y-5 px-4 py-2">
                <AgentSelector />

                <form className="flex flex-col gap-3">
                  <Textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type your message..."
                    className="min-h-[80px] resize-none rounded-xl border-muted-foreground/20 p-3"
                  />
                  <Button disabled={inProgress} 
                  onClick={(e) => {
                    e.preventDefault()
                    onSend(input)
                    setInput("")
                  }} className="self-end rounded-xl px-5">
                    <Send className="mr-2 h-4 w-4" />
                    Send
                  </Button>
                </form>
              </div>
            </>)
          }}
        />
      </div>

      {/* <SidebarFooter className="border-t p-6">

      </SidebarFooter> */}

      <SidebarRail />
    </>
  )
}
