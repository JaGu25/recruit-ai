from app.modules.auth.domain.repositories.user_repository import UserRepository
from app.shared.infrastructure.security import jwt_service, passwords


class LoginUseCase:
  def __init__(self, repository: UserRepository):
    self.repository = repository

  def execute(self, email: str, password: str) -> dict:
    user = self.repository.get_by_email(email)
    if not user or not passwords.verify_password(password, user.password_hash):
      raise ValueError("Invalid credentials")

    access_token = jwt_service.create_access_token(user.email)
    refresh_token = jwt_service.create_refresh_token(user.email)
    return {
      "access_token": access_token,
      "refresh_token": refresh_token,
      "token_type": "bearer",
    }
