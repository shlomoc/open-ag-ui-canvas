"use client"

import { AppLayout } from "@/components/app-layout"
import { AgentProvider, useAgent } from "@/lib/agent-provider"
import { CopilotKit } from "@copilotkit/react-core"
import "@copilotkit/react-ui/styles.css";
import { useEffect } from "react";
import { useRouter } from 'next/navigation';
export default function Home() {
  return (
    <AgentProvider>
      <CopilotKitWrapper />
    </AgentProvider>
  )
}

function CopilotKitWrapper() {
  const { currentAgent } = useAgent()
  // const router = useRouter();
  // useEffect(() => {
  //   console.log(currentAgent)
  //   // router.push(`/?agentId=${currentAgent.id}`);
  //   router.refresh()
  // }, [currentAgent])
  return (
    <>
      <CopilotKit runtimeUrl={"/api/copilotkit?isMastra=true"} agent={currentAgent.id}
      >
        <AppLayout />
      </CopilotKit>
    </>
  )
}