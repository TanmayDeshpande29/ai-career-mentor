from langchain.agents import create_agent
from langchain.agents.middleware import (
    SummarizationMiddleware,
)

from app.ai.context import AgentContext
from app.ai.prompts import ROADMAP_AGENT_PROMPT
from app.ai.tools.roadmap_tools import (
    get_current_roadmap,
)
from app.core.config import settings


def build_roadmap_agent(model,checkpointer=None):

    return create_agent(
        model=model,
        tools=[
            get_current_roadmap,
        ],
        system_prompt=ROADMAP_AGENT_PROMPT,
        context_schema=AgentContext,
        checkpointer=checkpointer,
        middleware=[
            SummarizationMiddleware(
                model=model,
                trigger={
                    "messages": settings.AI_SUMMARY_TRIGGER_MESSAGES
                },
                keep={
                    "messages": settings.AI_SUMMARY_KEEP_MESSAGES
                },
            ),
        ],
    )