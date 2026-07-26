"""
all the configurations like databases, api keys , qdrant url , all will be stored here later.
"""


from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME:str =  "Ai Career Mentor"
    VERSION:str = "1.0.0"


settings = Settings()