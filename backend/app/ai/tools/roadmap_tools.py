from langchain.tools import tool, ToolRuntime

from app.ai.context import AgentContext


@tool
def get_current_roadmap(
    runtime: ToolRuntime[AgentContext],
) -> str:
    """
    Retrieve the user's current career roadmap.

    This tool is currently a safe placeholder until the exact
    roadmap persistence schema is wired into the AI tool layer.
    """

    return (
        "Roadmap tool is available, but the roadmap persistence "
        "adapter has not yet been connected to the AI layer."
    )