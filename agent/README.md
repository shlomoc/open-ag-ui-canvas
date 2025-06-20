# Agent Backend for AGUI Protocol Demo

This directory contains the Python FastAPI backend that implements the agent logic for the Research Canvas and Planner Canvas applications.

## Agent Components

- **Research Canvas**: Implemented using LangGraph
- **Planner Canvas**: Implemented using CrewAI

## Setup

Please refer to the main [README.md](../README.md) in the root directory for complete setup instructions.

### Quick Start

1. Install dependencies:
```bash
poetry install
```

2. Create a `.env` file in this directory with required API keys:
```
OPENAI_API_KEY=your_openai_api_key
TAVILY_API_KEY=your_tavily_api_key
```

Note: You'll also need to create a separate `.env` file in the frontend directory. See the main README for details.

3. Run the agent server:
```bash
poetry run python main.py
```

This will start the FastAPI server on port 8000 that powers both the Research Canvas (LangGraph) and Planner Canvas (CrewAI) applications.

---

## Contributing

Feel free to open issues or pull requests for improvements, bug fixes, or new features!

---

## License

[MIT](LICENSE) (or specify your license here)

---

**Note:** This is a demo repository. For production use, review security, environment variables, and deployment best practices.
