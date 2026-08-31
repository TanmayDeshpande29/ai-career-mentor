from langchain.agents import create_agent
from langchain.agents.middleware import (
    SummarizationMiddleware,
)

from app.ai.context import AgentContext
from app.ai.prompts import GENERAL_AGENT_PROMPT
from app.core.config import settings


def build_general_agent(model,checkpointer=None):

    return create_agent(
        model=model,
        tools=[],
        system_prompt=GENERAL_AGENT_PROMPT,
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