# from app.core.security import hash_password, verify_password


# password = "Tanmay@123"

# hashed_password = hash_password(password)

# print("\nOriginal password:")
# print(password)

# print("\nHashed password:")
# print(hashed_password)

# print("\nCorrect password:")
# print(verify_password(password, hashed_password))

# print("\nWrong password:")
# print(verify_password("WrongPassword123", hashed_password))

# from app.database.session import SessionLocal
# from app.schemas.user import UserCreate
# from app.services.auth_service import AuthService


# db = SessionLocal()

# try:
#     user_data = UserCreate(
#         full_name="Test User",
#         email="testuser@example.com",
#         password="TestPassword123",
#     )

#     user = AuthService.register_user(
#         db,
#         user_data,
#     )

#     print("\nUser created successfully!")
#     print("ID:", user.id)
#     print("Name:", user.full_name)
#     print("Email:", user.email)
#     print("Role:", user.role)
#     print("Provider:", user.provider)
#     print("Password hash:", user.hashed_password)

# finally:
#     db.close()

from app.core.security import (
    create_access_token,
    create_refresh_token,
    decode_token,
)


user_id = "61d333c7-9b9c-45a0-befe-de7462432c2a"


access_token = create_access_token(user_id)
refresh_token = create_refresh_token(user_id)


print("\nACCESS TOKEN:")
print(access_token)

print("\nREFRESH TOKEN:")
print(refresh_token)


print("\nACCESS PAYLOAD:")
print(decode_token(access_token))

print("\nREFRESH PAYLOAD:")
print(decode_token(refresh_token))