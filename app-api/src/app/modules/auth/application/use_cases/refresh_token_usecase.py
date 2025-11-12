from app.shared.infrastructure.security import jwt_service


class RefreshTokenUseCase:
  def execute(self, refresh_token: str) -> dict:
    decoded = jwt_service.decode_token(refresh_token)
    if decoded.get("type") != "refresh":
      raise ValueError("Invalid refresh token")

    subject = decoded.get("sub")
    if not subject:
      raise ValueError("Invalid refresh token")

    access_token = jwt_service.create_access_token(subject)
    new_refresh_token = jwt_service.create_refresh_token(subject)
    return {
      "access_token": access_token,
      "refresh_token": new_refresh_token,
      "token_type": "bearer",
    }
