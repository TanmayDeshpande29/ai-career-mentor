from langchain_core.messages import AIMessage, HumanMessage

from app.ai.context import AgentContext
from app.ai.graph.graph import graph


class AIService:

    @staticmethod
    def generate_response(
        messages: list[dict],
        user_id: str,
        conversation_id: str,
        db,
        resume_id: str | None = None,
    ) -> str:

        graph_messages = []

        for message in messages:

            if message["role"] == "user":
                graph_messages.append(
                    HumanMessage(
                        content=message["content"]
                    )
                )

            elif message["role"] == "assistant":
                graph_messages.append(
                    AIMessage(
                        content=message["content"]
                    )
                )

        # ----------------------------------------
        # Runtime context
        # ----------------------------------------

        context = AgentContext(
            user_id=str(user_id),
            conversation_id=str(conversation_id),
            db=db,
            resume_id=str(resume_id) if resume_id else None,
        )

        # ----------------------------------------
        # Invoke LangGraph
        # ----------------------------------------

        result = graph.invoke(
            {
                "messages": graph_messages,
                "intent": "",
            },
            context=context,
        )

        response = result["messages"][-1]

        return response.content