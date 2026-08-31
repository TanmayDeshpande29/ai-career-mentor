from langchain.agents import create_agent
from langchain.agents.middleware import SummarizationMiddleware

from app.ai.context import AgentContext
from app.ai.prompts import RESUME_AGENT_PROMPT
from app.ai.tools.resume_tools import search_user_resume
from app.core.config import settings


def build_resume_agent(model, checkpointer=None):

    return create_agent(
        model=model,

        tools=[
            search_user_resume,
        ],

        system_prompt=RESUME_AGENT_PROMPT,

        context_schema=AgentContext,

        checkpointer=checkpointer,

        middleware=[
            SummarizationMiddleware(
                model=model,

                trigger=(
                    "messages",
                    settings.AI_SUMMARY_TRIGGER_MESSAGES,
                ),

                keep=(
                    "messages",
                    settings.AI_SUMMARY_KEEP_MESSAGES,
                ),
            ),
        ],
    )