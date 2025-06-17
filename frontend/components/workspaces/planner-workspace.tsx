"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Calendar, Plus, Target, Users, Lightbulb } from "lucide-react"
import { useCoAgent, useCopilotAction, useCopilotReadable } from "@copilotkit/react-core"
import { useCopilotChat } from "@copilotkit/react-core"
import { v4 as uuidv4 } from 'uuid';
import moment from "moment"


interface PlannerWorkspaceProps {
  content: string
  setContent: (content: string) => void
  lastMessage: string
  isAgentActive: boolean
  setIsAgentActive: (active: boolean) => void
}

const initialTasks = [
  { id: uuidv4(), title: "Define project scope", completed: true, priority: "High", assignee: "You" },
  { id: uuidv4(), title: "Research market requirements", completed: false, priority: "High", assignee: "Agent" },
  { id: uuidv4(), title: "Create wireframes", completed: false, priority: "Medium", assignee: "You" },
  { id: uuidv4(), title: "Set up development environment", completed: false, priority: "Low", assignee: "Agent" },
]


export function PlannerWorkspace({ content, setContent, lastMessage, isAgentActive, setIsAgentActive }: PlannerWorkspaceProps) {
  const [tasks, setTasks] = useState([
    {
      projectName: "Launch MVP",
      isSelected: true,
      due: moment(new Date()).format("MMM D, YYYY"),
      teamCount: 3,
      tasks: initialTasks
    }
  ])

  // const [selectedProject, setSelectedProject] = useState(tasks[0])

  const [newTask, setNewTask] = useState("")

  const [showProjectForm, setShowProjectForm] = useState(false)
  const [newProject, setNewProject] = useState({
    projectName: "",
    due: "",
    teamCount: 1,
    tasks: []
  })
  const [formError, setFormError] = useState("")

  const addTask = () => {
    if (newTask.trim()) {
      setTasks(tasks.map((project) => (project.isSelected ? { ...project, tasks: [...project.tasks, { id: uuidv4(), title: newTask, priority: "Medium", assignee: "You", completed: false }] } : project)))
      setNewTask("")
    }
  }

  useCopilotReadable({
    description: "This is the all the tasks in the project plan",
    value: JSON.stringify(tasks.find((project) => project.isSelected)?.tasks),
    available: "enabled"
  })

  useCopilotAction({
    name: "addTask",
    available: "remote",
    description: "Add a new task to the project plan",
    parameters: [
      {
        name: "items",
        type: "object[]",
        attributes: [
          {
            name: "task",
            type: "string",
            description: "The task to add to the project plan"
          },
          {
            name: "priority",
            type: "string",
            description: "The priority of the task",
            enum: ["High", "Medium", "Low"]
          }
        ]
      }
    ],
    handler({ items }: { items: { task: string, priority: string }[] }) {
      console.log("Adding task:", items)
      const newTasks = items.map((item) => ({
        id: uuidv4(),
        title: item.task,
        isSelected: false,
        priority: item.priority,
        assignee: "Agent",
        completed: false
      }))

      
      setTasks(tasks.map((project) => (project.isSelected ? { ...project, tasks: [...project.tasks, ...newTasks] } : project)))


    }
  })

  useCopilotAction({
    name: "addProject",
    available: "remote",
    description: "Add a new project to the project plan",
    parameters: [
      {
        name: "project",
        type: "object",
        attributes: [
          {
            name: "projectName",
            type: "string",
            description: "The name of the project to add to the project plan"
          },
          {
            name: "due",
            type: "string",
            description: "The due date of the project",
          },
          {
            name: "teamCount",
            type: "number",
            description: "The number of team members for the project"
          },
          {
            name: "tasks",
            type: "object[]",
            attributes: [
              {
                name: "task",
                type: "string",
                description: "The task to add to the project"
              },
              {
                name: "priority",
                type: "string",
                description: "The priority of the task",
                enum: ["High", "Medium", "Low"]
              }
            ]
          }
        ]
      }
    ],
    handler({ project }: { project: { projectName: string, due: string, teamCount: number, tasks: { task: string, priority: string }[] } }) {
      console.log("Adding project:", project)
      
      setTasks(
        [...tasks.map((task) => ({ ...task, isSelected: false })), {
          projectName: project.projectName,
          isSelected: true,
          due: moment(project.due).format("MMM D, YYYY"),
          teamCount: project.teamCount,
          tasks: project.tasks.map((task) => ({
            id: uuidv4(),
            title: task.task,
            priority: task.priority,
            assignee: "Agent",
            completed: false
          }))
        }
        ]
      )
    }
  })

  useCopilotAction({
    name: "completeOrUncompleteTask",
    available: "remote",
    description: "Complete or uncomplete a task",
    parameters: [
      {
        name: "id",
        type: "string",
        description: `The id of the task to complete or uncomplete. This is the entire task like : ${JSON.stringify(tasks.find((project) => project.isSelected)?.tasks)}`
      }
    ],
    handler({ id }: { id: string }) {
      
      console.log("Completing task:", id)
      toggleTask(id)
    }
  })


  const toggleTask = (id: string) => {
    debugger
    setTasks(tasks.map((project) => (project.isSelected ? { ...project, tasks: project.tasks.map((task) => (task.id == id ? { ...task, completed: !task.completed } : task)) } : project)))
  }

  return (
    // <main className="h-screen">
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-full min-h-0">
      {/* Main Planning Board */}
      <div className="lg:col-span-2 space-y-6 h-full flex flex-col min-h-0">
        <Card className="rounded-2xl shadow-sm h-full flex flex-col">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl">{tasks.find((project) => project.isSelected)?.projectName}</CardTitle>
              {isAgentActive && (
                <Badge variant="default" className="gap-1 animate-pulse">
                  <Lightbulb className="h-3 w-3" />
                  Agent Planning
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="pb-4 flex-1 min-h-0 h-full overflow-auto">
            <div className="space-y-4">
              <div className="flex gap-2">
                <Input
                  className="focus-visible:ring-0"
                  value={newTask}
                  onChange={(e) => setNewTask(e.target.value)}
                  placeholder="Add a new task..."
                  onKeyPress={(e) => e.key === "Enter" && addTask()}
                />
                <Button onClick={addTask}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              <ScrollArea className="flex-1 min-h-0">
                <div className="space-y-3">
                  {tasks.find((project) => project.isSelected)?.tasks.map((task) => (
                    <div key={task.id} className="flex items-center gap-3 p-4 rounded-lg border">
                      <Checkbox checked={task.completed} onCheckedChange={() => toggleTask(task.id)} />
                      <div className="flex-1">
                        <p
                          className={`text-sm font-medium ${task.completed ? "line-through text-muted-foreground" : ""}`}
                        >
                          {task.title}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge
                            variant={
                              task.priority === "High"
                                ? "destructive"
                                : task.priority === "Medium"
                                  ? "default"
                                  : "secondary"
                            }
                            className="text-xs"
                          >
                            {task.priority}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {task.assignee}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </CardContent>
        </Card>

        {/* Agent Suggestions */}
        {/* {isAgentActive && lastMessage && (
          <Card className="rounded-2xl border-primary/20 bg-primary/5 shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-primary" />
                Agent Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed">{lastMessage}</p>
              <div className="mt-4 flex gap-2">
                <Button size="sm" variant="outline">
                  Add to Plan
                </Button>
                <Button size="sm" variant="ghost">
                  Dismiss
                </Button>
              </div>
            </CardContent>
          </Card>
        )} */}
      </div>

      {/* Planning Tools Sidebar */}
      <div className="flex flex-col h-full min-h-0 space-y-6 overflow-auto">
        {showProjectForm ? (
          <Card className="rounded-2xl shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">Create New Project</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                placeholder="Project Name"
                value={newProject.projectName}
                onChange={e => setNewProject({ ...newProject, projectName: e.target.value })}
              />
              <Input
                type="date"
                value={newProject.due}
                onChange={e => setNewProject({ ...newProject, due: e.target.value })}
              />
              <Input
                type="number"
                min={1}
                placeholder="Team Count"
                value={newProject.teamCount}
                onChange={e => setNewProject({ ...newProject, teamCount: Number(e.target.value) })}
              />
              {formError && <div className="text-red-500 text-sm">{formError}</div>}
              <div className="flex gap-2">
                <Button
                  onClick={() => {
                    // Validation
                    if (!newProject.projectName.trim()) {
                      setFormError("Project name is required");
                      return;
                    }
                    if (!newProject.due) {
                      setFormError("Due date is required");
                      return;
                    }
                    if (!newProject.teamCount || newProject.teamCount < 1) {
                      setFormError("Team count must be at least 1");
                      return;
                    }
                    // Add project
                    setTasks([
                      ...tasks,
                      {
                        ...newProject,
                        isSelected: false,
                        due: moment(newProject.due).format("MMM D, YYYY"),
                        tasks: []
                      }
                    ]);
                    setShowProjectForm(false);
                    setFormError("");
                    setNewProject({ projectName: "", due: "", teamCount: 1, tasks: [] });
                  }}
                >
                  Create
                </Button>
                <Button variant="ghost" onClick={() => { setShowProjectForm(false); setFormError(""); }}>
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="rounded-2xl shadow-sm flex flex-col h-1/3 min-h-64 max-h-96">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Project List</CardTitle>
                <Button size="icon" variant="ghost" onClick={() => setShowProjectForm(true)}>
                  <Plus className="h-5 w-5" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-2 flex-1 flex flex-col min-h-0">
              <ScrollArea className="flex-1 min-h-0">
                <div className="space-y-2">
                  {tasks.map((project) => (
                    <Button
                      key={project.projectName + Math.random()}
                      variant="outline"
                      className={`w-full justify-start gap-2 ${project.isSelected ? "bg-gray-100" : ""}`}
                      onClick={() => setTasks(tasks.map((task) => (task.projectName == project.projectName ? { ...task, isSelected: true } : { ...task, isSelected: false })))}
                    >
                      <Calendar className="h-4 w-4" />
                      {project.projectName}
                      {project.isSelected && (
                        <span className="ml-auto text-lg text-black">●</span>
                      )}
                    </Button>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        )}


        {/* Project Overview */}
        <Card className="rounded-2xl shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">Project Overview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">Goal: {tasks.find((project) => project.isSelected)?.projectName}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">Due: {tasks.find((project) => project.isSelected)?.due}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">Team: {tasks.find((project) => project.isSelected)?.teamCount} members</span>
            </div>
          </CardContent>
        </Card>

        {/* Progress */}
        <Card className="rounded-2xl shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span>Completed</span>
                <span>
                  {tasks.find((project) => project.isSelected)?.tasks.filter((t) => t.completed).length}/{tasks.find((project) => project.isSelected)?.tasks.length}
                </span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all"
                  style={{
                    width: `${(() => {
                      const selected = tasks.find((project) => project.isSelected);
                      if (!selected || !selected.tasks.length) return 0;
                      return (selected.tasks.filter((t) => t.completed).length / selected.tasks.length) * 100;
                    })()}%`
                  }}
                />
              </div>
            </div>
          </CardContent>
        </Card>


      </div>
    </div>
    // </main>
  )
}
