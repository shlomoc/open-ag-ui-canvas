# How CopilotKit AGUI is Implemented

CopilotKit AGUI is implemented through a combination of frontend and backend components that work together to create interactive agent-driven UIs:

## Frontend Implementation

### React Hooks for Agent Integration:
- **useCoAgent**: Used in the researcher workspace to create and manage agent state
- **useCoAgentStateRender**: Renders UI components based on agent state changes
- **useCopilotAction**: Defines actions that agents can perform (used in planner workspace)
- **useCopilotReadable**: Exposes data to agents (used in planner workspace)

### Component Structure:
- Each canvas (Research, Planner, Haiku) has its own workspace component
- These components handle UI rendering and state management
- They communicate with backend agents through CopilotKit hooks

## Backend Implementation

### Agent Registration:
- **CopilotKitSDK** initializes and registers different agent types
- **LangGraphAgent** for the Research Canvas (using LangGraph)
- **CrewAIAgent** for the Planner Canvas (using CrewAI)

### State Management and Communication:
- **copilotkit_emit_state**: Sends state updates from backend to frontend
- **copilotkit_stream**: Streams responses from LLMs to the frontend
- Agents can access frontend-defined actions via `self.state.copilotkit.actions`

### API Integration:
- FastAPI endpoint (`/copilotkit`) handles agent communication
- Agents use OpenAI and Tavily APIs for language processing and web search

## Role in the Architecture

### Bridge Between UI and AI:
- CopilotKit AGUI serves as the protocol layer between the frontend UI components and backend AI agents
- It handles bidirectional communication, state synchronization, and action execution

### Agent Orchestration:
- Different agent frameworks (LangGraph, CrewAI, Mastra) are unified under a common interface
- Each canvas demonstrates a different agent implementation pattern

### State Synchronization:
- The frontend maintains UI state that can be read and modified by agents
- The backend maintains agent state that can be rendered in the UI
- CopilotKit handles the synchronization between these states

## Extending the Demo to Another Use Case

To extend this demo to a new use case, you could follow these steps:

### Create a New Canvas Component:
- Create a new workspace component in `frontend/components/workspaces/`
- Implement the UI for your specific use case
- Use appropriate CopilotKit hooks based on your needs:
  - `useCoAgent` for state management
  - `useCopilotAction` to define actions
  - `useCopilotReadable` to expose data

### Implement a Backend Agent:
- Choose an agent framework (LangGraph, CrewAI, or other)
- Create a new agent file in the `agent/` directory
- Implement the agent logic using CopilotKit helpers like `copilotkit_emit_state`

### Register the Agent:
- Add your agent to the `CopilotKitSDK` initialization in `main.py`
- Connect it to the appropriate frontend component

### Example Use Case: Document Summarizer:
- **Frontend**: Create a document upload interface with summary display
- **Backend**: Implement a LangGraph agent that processes documents and generates summaries
- **Actions**: Define actions like "summarize", "extract key points", "generate questions"
- **State**: Track document content, summaries, and extraction progress

The modular architecture makes it easy to add new canvases without modifying existing ones. Each canvas can have its own specialized agent while sharing the common CopilotKit AGUI protocol for communication.