from fastapi import Request
from fastapi.responses import JSONResponse
from jwt import PyJWTError
from starlette.middleware.base import BaseHTTPMiddleware

from app.shared.infrastructure.security import jwt_service


class CandidateAuthMiddleware(BaseHTTPMiddleware):
  def __init__(self, app):
    super().__init__(app)

  async def dispatch(self, request: Request, call_next):
    if request.url.path.startswith("/candidates"):
      auth_header = request.headers.get("Authorization")
      if not auth_header or not auth_header.lower().startswith("bearer "):
        return JSONResponse({"detail": "Authentication required"}, status_code=401)

      token = auth_header.split(" ", 1)[1]
      try:
        payload = jwt_service.decode_token(token)
        if payload.get("type") != "access":
          raise ValueError("Invalid access token")
        request.state.user_email = payload.get("sub")
      except (PyJWTError, ValueError):
        return JSONResponse({"detail": "Invalid or expired token"}, status_code=401)

    return await call_next(request)
