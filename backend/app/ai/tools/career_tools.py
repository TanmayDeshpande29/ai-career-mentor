from langchain.tools import tool, ToolRuntime

from app.ai.context import AgentContext
from app.models.career_profiles import CareerProfile
from app.repositories.careerprofile_repositories import (
    CareerProfileRepository,
)


@tool
def get_career_profile(
    runtime: ToolRuntime[AgentContext],
) -> dict:
    """
    Retrieve the authenticated user's career profile.

    Use this when the user asks about their current role,
    experience, target role, target location, skills,
    education, certifications, goals, or professional bio.
    """

    user_id = runtime.context.user_id

    profile = CareerProfileRepository.get_by_user_id(
        runtime.context.db,
        user_id,
    )

    if not profile:
        return {
            "found": False,
            "message": "Career profile has not been created.",
        }

    return {
        "found": True,
        "current_role": profile.current_role,
        "experience_years": (
            float(profile.experience_years)
            if profile.experience_years is not None
            else None
        ),
        "target_role": profile.target_role,
        "target_location": profile.target_location,
        "skills": profile.skills,
        "education": profile.education,
        "certifications": profile.certifications,
        "career_goals": profile.career_goals,
        "bio": profile.bio,
    }


@tool
def update_career_profile(
    current_role: str | None = None,
    target_role: str | None = None,
    target_location: str | None = None,
    career_goals: str | None = None,
    bio: str | None = None,
    runtime: ToolRuntime[AgentContext] = None,
) -> str:
    """
    Update the authenticated user's career profile.

    This tool performs a database mutation and therefore requires
    human approval through HumanInTheLoopMiddleware.
    """

    if runtime is None:
        raise RuntimeError("Runtime context unavailable.")

    profile = CareerProfileRepository.get_by_user_id(
        runtime.context.db,
        runtime.context.user_id,
    )

    if not profile:
        return "Career profile does not exist."

    updates = {
        "current_role": current_role,
        "target_role": target_role,
        "target_location": target_location,
        "career_goals": career_goals,
        "bio": bio,
    }

    for field, value in updates.items():
        if value is not None:
            setattr(profile, field, value)

    CareerProfileRepository.update(
        runtime.context.db,
        profile,
    )

    return "Career profile updated successfully."