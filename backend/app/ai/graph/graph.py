from langgraph.graph import StateGraph, START, END

from app.ai.graph.state import CareerMentorState
from app.ai.graph.nodes import (
    classify_intent,
    career_node,
    resume_node,
    roadmap_node,
    interview_node,
    general_node,
)
from app.ai.graph.router import route_intent


def build_graph():
    builder = StateGraph(CareerMentorState)

    # ============================================================
    # Nodes
    # ============================================================

    builder.add_node(
        "classify_intent",
        classify_intent,
    )

    builder.add_node(
        "career_agent",
        career_node,
    )

    builder.add_node(
        "resume_agent",
        resume_node,
    )

    builder.add_node(
        "roadmap_agent",
        roadmap_node,
    )

    builder.add_node(
        "interview_agent",
        interview_node,
    )

    builder.add_node(
        "general_agent",
        general_node,
    )

    # ============================================================
    # START
    # ============================================================

    builder.add_edge(
        START,
        "classify_intent",
    )

    # ============================================================
    # Conditional routing
    # ============================================================

    builder.add_conditional_edges(
        "classify_intent",
        route_intent,
        {
            "career": "career_agent",
            "resume": "resume_agent",
            "roadmap": "roadmap_agent",
            "interview": "interview_agent",
            "general": "general_agent",
        },
    )

    # ============================================================
    # END
    # ============================================================

    builder.add_edge(
        "career_agent",
        END,
    )

    builder.add_edge(
        "resume_agent",
        END,
    )

    builder.add_edge(
        "roadmap_agent",
        END,
    )

    builder.add_edge(
        "interview_agent",
        END,
    )

    builder.add_edge(
        "general_agent",
        END,
    )

    return builder.compile()


graph = build_graph()