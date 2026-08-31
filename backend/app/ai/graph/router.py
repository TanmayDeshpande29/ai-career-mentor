from app.ai.graph.state import CareerMentorState


def route_intent(state: CareerMentorState) -> str:
    intent = state.get("intent")

    allowed_intents = {
        "career",
        "resume",
        "roadmap",
        "interview",
        "general",
    }

    if intent not in allowed_intents:
        return "general"

    return intent