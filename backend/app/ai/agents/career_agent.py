from langchain.agents import create_agent
from langchain.agents.middleware import (
    HumanInTheLoopMiddleware,
    SummarizationMiddleware
)

from app.ai.prompts import CAREER_AGENT_PROMPT
from app.ai.context import AgentContext
from app.ai.state import CareerMentorState
from app.ai.tools.career_tools import (
    get_career_profile,
    update_career_profile
)

from app.core.config import settings

def build_career_agent(model,checkpointer=None):

    return create_agent(
        model=model,
        tools=[
            get_career_profile,
            update_career_profile,
        ],
        system_prompt=CAREER_AGENT_PROMPT,
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
            HumanInTheLoopMiddleware(
                interrupt_on={
                    "update_career_profile": {
                        "allowed_decisions": [
                            "approve",
                            "edit",
                            "reject",
                        ]
                    }
                }
            ),
        ],
    )