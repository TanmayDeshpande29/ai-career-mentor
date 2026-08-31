from langchain_core.messages import AIMessage, HumanMessage

from app.ai.graph.graph import graph


class AIService:

    @staticmethod
    def generate_response(
        messages: list[dict],
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

        result = graph.invoke(
            {
                "messages": graph_messages,
                "intent": "",
            }
        )

        response = result["messages"][-1]

        return response.content