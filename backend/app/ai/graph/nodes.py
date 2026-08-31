from langchain_core.messages import SystemMessage

from app.ai.graph.state import CareerMentorState
from app.ai.llm.groq import get_llm
from app.ai.models import IntentClassification
from app.ai.agents.career_agent import build_career_agent
from app.ai.agents.resume_agent import build_resume_agent
from app.ai.agents.roadmap_agent import build_roadmap_agent
from app.ai.agents.general_agent import build_general_agent


INTENT_SYSTEM_PROMPT = """
You are the intent classifier for an AI Career Mentor.

Classify the user's latest request into exactly one category.

Categories:

career
- Career planning
- Career transitions
- Target roles
- Skills
- Job readiness
- Professional growth

resume
- Resume analysis
- Resume improvement
- ATS optimization
- Resume content
- Resume-to-job matching
- Questions about the user's uploaded resume

roadmap
- Learning roadmap
- Skill progression
- Learning plans
- Milestones
- Weekly/monthly career plans

interview
- Interview preparation
- Interview questions
- Mock interviews
- Behavioral interviews
- Technical interviews
- Interview answers

general
- General questions that do not clearly belong to the categories above.

Return only the structured classification.
"""


def classify_intent(state: CareerMentorState):
    llm = get_llm()

    classifier = llm.with_structured_output(
        IntentClassification
    )

    user_message = state["messages"][-1].content

    result = classifier.invoke(
        [
            SystemMessage(
                content=INTENT_SYSTEM_PROMPT
            ),
            {
                "role": "user",
                "content": str(user_message),
            },
        ]
    )

    return {
        "intent": result.intent,
        "intent_confidence": result.confidence,
    }


def _agent_context(state: CareerMentorState):
    """
    Extract context that specialist agents need.

    The actual authenticated runtime context is supplied
    by the caller of the graph.
    """

    return {
        "retrieved_context": state.get(
            "retrieved_context"
        )
    }


def career_node(state: CareerMentorState, runtime):
    model = get_llm()

    agent = build_career_agent(model)

    result = agent.invoke(
        {
            "messages": state["messages"],
        },
        context=runtime.context,
    )

    return {
        "messages": result["messages"],
    }


def resume_node(state: CareerMentorState, runtime):
    model = get_llm()

    agent = build_resume_agent(model)

    result = agent.invoke(
        {
            "messages": state["messages"],
        },
        context=runtime.context,
    )

    return {
        "messages": result["messages"],
    }


def roadmap_node(state: CareerMentorState, runtime):
    model = get_llm()

    agent = build_roadmap_agent(model)

    result = agent.invoke(
        {
            "messages": state["messages"],
        },
        context=runtime.context,
    )

    return {
        "messages": result["messages"],
    }


def general_node(state: CareerMentorState, runtime):
    model = get_llm()

    agent = build_general_agent(model)

    result = agent.invoke(
        {
            "messages": state["messages"],
        },
        context=runtime.context,
    )

    return {
        "messages": result["messages"],
    }


def interview_node(state: CareerMentorState, runtime):
    """
    Interview specialization.

    Until the dedicated interview agent is introduced,
    use the general career mentor agent.

    This keeps interview requests inside the graph while
    allowing us to replace this implementation later
    without changing the graph structure.
    """

    model = get_llm()

    agent = build_general_agent(model)

    result = agent.invoke(
        {
            "messages": state["messages"],
        },
        context=runtime.context,
    )

    return {
        "messages": result["messages"],
    }