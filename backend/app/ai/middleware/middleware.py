from langchain.agents.middleware import (
    ModelCallLimitMiddleware,
)


def build_model_limit_middleware():

    return ModelCallLimitMiddleware(
        thread_limit=8,
        run_limit=8,
        exit_behavior="end",
    )