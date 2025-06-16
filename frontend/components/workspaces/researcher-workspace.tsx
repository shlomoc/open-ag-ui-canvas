"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Search, Plus, BookOpen, ExternalLink, Lightbulb, X } from "lucide-react"
// import { MarkdownDisplay } from "../markdown-display"
import { Markdown } from "@copilotkit/react-ui"
import React from "react"
import { Progress } from "@/components/progress"
import { useCoAgent, useCoAgentStateRender } from "@copilotkit/react-core"

interface ResearcherWorkspaceProps {
  content: string
  setContent: (content: { content: string, resources: { title: string, url: string, description: string }[] }) => void
  lastMessage: string
  isAgentActive: boolean
  sources: { title: string, url: string, description: string }[]
}

function extractReportMarkdown(content: string) {
  // Remove leading {"report":" if present
  if (!content) {
    return ""
  }
  if (content.startsWith('{"report":"')) {
    content = content.slice(11);
  }
  // Remove trailing "} if present
  if (content.endsWith('"}')) {
    content = content.slice(0, -2);
  }
  // Replace escaped newlines with real newlines
  content = content.replace(/\\n/g, '\n');
  // Optionally, unescape double quotes if needed
  content = content.replace(/\\"/g, '"');
  // Optionally, unescape escaped backslashes
  content = content.replace(/\\\\/g, '\\');
  return content;
}

const ResearcherWorkspaceComponent = function ResearcherWorkspace({ content, setContent, lastMessage, isAgentActive, sources }: ResearcherWorkspaceProps) {
  // const [sources, setSources] = useState(initialSources)
  const [showAddSource, setShowAddSource] = useState(false)
  const [newSource, setNewSource] = useState({ title: "", url: "", description: "" })
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState("")
  const [workspaceContent, setWorkspaceContent] = useState("Start your research here... The agent will help you gather information, analyze findings, and structure your research.")
  const [resources, setResources] = useState<{ title: string, url: string, description: string }[]>([])

  type AgentState = {
    report: string;
    resources: { title: string; url: string; description: string }[];
    logs: any[];
  };

  const { state, setState } = useCoAgent<AgentState>({
    name: "langgraphAgent",
    initialState: {
      report: "",
      resources: [],
      logs: []
    }
  })
  useCoAgentStateRender({
    name: "langgraphAgent",
    render: ({ state }) => {
      useEffect(() => {
        if (state?.report) {
          setWorkspaceContent(state?.report)
        }
        if (state?.resources) {
          setResources(state?.resources)
        }
        console.log(state, "state");
      }, [state])

      return (
        <Progress logs={state?.logs || []} />
      )
    }
  })

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
      {/* Main Research Document */}
      <div className="lg:col-span-2 space-y-6">
        <Card className="rounded-2xl shadow-sm max-h-[calc(100vh-64px)] overflow-y-auto">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl">Research Document</CardTitle>
              {isAgentActive && (
                <Badge variant="default" className="gap-1 animate-pulse">
                  <Lightbulb className="h-3 w-3" />
                  Agent Contributing
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="h-[625px] pb-4">
            {isEditing ? (
              <textarea
                className="w-full h-[400px] border rounded p-2 text-base font-sans"
                value={editValue}
                autoFocus
                onChange={e => setEditValue(e.target.value)}
                onBlur={() => {
                  setIsEditing(false)
                  setWorkspaceContent(editValue)
                  // setContent({ content: editValue, resources: sources })
                }}
              />
            ) : (
              <div onClick={() => {
                setIsEditing(true)
                setEditValue(extractReportMarkdown(workspaceContent))
              }}
                style={{ cursor: "pointer" }}
                title="Click to edit"
              >
                <Markdown content={workspaceContent} />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Agent Suggestions */}
        {isAgentActive && lastMessage && (
          <Card className="rounded-2xl border-primary/20 bg-primary/5 shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-primary" />
                Agent Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed">{lastMessage}</p>
              <div className="mt-4 flex gap-2">
                <Button size="sm" variant="outline">
                  Apply Suggestion
                </Button>
                <Button size="sm" variant="ghost">
                  Dismiss
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Research Tools Sidebar */}
      <div className="space-y-6 lg:sticky lg:self-start">
        {/* Sources */}
        <Card className="rounded-2xl shadow-sm mr-4">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Sources</CardTitle>
              <Button size="sm" variant="outline" onClick={() => setShowAddSource((v) => !v)}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            {showAddSource && (
              <form
                className="mt-4 space-y-2"
                onSubmit={e => {
                  e.preventDefault()
                  if (newSource.title && newSource.url && newSource.description) {
                    setResources([...resources, newSource])
                    setNewSource({ title: "", url: "", description: "" })
                    setShowAddSource(false)
                  }
                }}
              >
                <input
                  className="w-full border rounded px-2 py-1 text-sm"
                  placeholder="Title"
                  value={newSource.title}
                  onChange={e => setNewSource({ ...newSource, title: e.target.value })}
                  required
                />
                <input
                  className="w-full border rounded px-2 py-1 text-sm"
                  placeholder="URL"
                  value={newSource.url}
                  onChange={e => setNewSource({ ...newSource, url: e.target.value })}
                  required
                />
                <textarea
                  className="w-full border rounded px-2 py-1 text-sm"
                  placeholder="Description"
                  value={newSource.description}
                  onChange={e => setNewSource({ ...newSource, description: e.target.value })}
                  required
                />
                <div className="flex gap-2">
                  <Button type="submit" size="sm" variant="default">Add Source</Button>
                  <Button type="button" size="sm" variant="ghost" onClick={() => setShowAddSource(false)}>Cancel</Button>
                </div>
              </form>
            )}
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[590px]">
              <div className="space-y-3">
                {resources.length === 0 ? (
                  <div className="text-center text-muted-foreground py-8">No sources to show</div>
                ) : (
                  resources.map((source, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 p-3 rounded-lg border bg-white hover:bg-muted transition-colors relative"
                    >
                      <BookOpen className="h-4 w-4 mt-1 text-muted-foreground flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium mb-2 break-words">{source.title}</p>
                        <div className="text-xs text-muted-foreground bg-muted/60 rounded-lg p-2 leading-snug shadow-inner w-full break-words">
                          {source.description}
                        </div>
                      </div>
                      <div className="flex flex-col gap-1 items-end ml-2">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-6 w-6 p-0"
                          asChild
                        >
                          <a href={source.url} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-6 w-6 p-0 text-destructive opacity-70 hover:opacity-100"
                          onClick={() => {
                            setResources(resources.filter((_, i) => i !== index))
                            setState({
                              ...state,
                              resources: resources.filter((_, i) => i !== index) as { title: string, url: string, description: string }[]
                            })  
                          }}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

       
      </div>
    </div>
  )
}

function areEqual(prevProps: ResearcherWorkspaceProps, nextProps: ResearcherWorkspaceProps) {
  return (
    prevProps.content === nextProps.content &&
    prevProps.setContent === nextProps.setContent &&
    prevProps.lastMessage === nextProps.lastMessage &&
    prevProps.isAgentActive === nextProps.isAgentActive &&
    JSON.stringify(prevProps.sources) === JSON.stringify(nextProps.sources)
  );
}

export const ResearcherWorkspace = React.memo(ResearcherWorkspaceComponent, areEqual);
