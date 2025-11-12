from datetime import datetime, timedelta, timezone
from typing import Any, Dict

import jwt

from app.config.settings import settings


def _create_token(data: Dict[str, Any], expires_delta: timedelta) -> str:
  to_encode = data.copy()
  expire = datetime.now(timezone.utc) + expires_delta
  to_encode.update({"exp": expire})
  return jwt.encode(to_encode, settings.jwt_secret, algorithm=settings.jwt_algorithm)


def create_access_token(subject: str) -> str:
  return _create_token(
    {"sub": subject, "type": "access"},
    timedelta(minutes=settings.jwt_access_exp_minutes),
  )


def create_refresh_token(subject: str) -> str:
  return _create_token(
    {"sub": subject, "type": "refresh"},
    timedelta(minutes=settings.jwt_refresh_exp_minutes),
  )


def decode_token(token: str) -> Dict[str, Any]:
  return jwt.decode(token, settings.jwt_secret, algorithms=[settings.jwt_algorithm])
