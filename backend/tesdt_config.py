from app.core.config import settings

print("DB_HOST:", settings.DB_HOST)
print("DB_PORT:", settings.DB_PORT)
print("DB_NAME:", settings.DB_NAME)
print("DB_USER:", settings.DB_USER)
print("DB_PASSWORD:", "*" * len(settings.DB_PASSWORD))