from functools import lru_cache

from langchain.tools import tool, ToolRuntime

from app.ai.context import AgentContext
from app.ai.rag.retriever import ResumeRetriever


@lru_cache(maxsize=1)
def get_retriever() -> ResumeRetriever:
    return ResumeRetriever()


@tool
def search_user_resume(
    query: str,
    runtime: ToolRuntime[AgentContext],
) -> str:
    """
    Search the authenticated user's uploaded resume.

    Use this whenever the user asks about information that should
    come from their actual resume, such as skills, experience,
    projects, education, certifications, achievements, or
    resume-to-job matching.
    """

    resume_id = runtime.context.resume_id

    if not resume_id:
        return "No active resume is available for retrieval."

    return get_retriever().retrieve(
        user_id=runtime.context.user_id,
        resume_id=resume_id,
        query=query,
    )