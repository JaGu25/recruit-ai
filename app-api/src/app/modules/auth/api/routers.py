from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.dependencies import get_db
from app.modules.auth.api.schemas import LoginRequest, RefreshRequest, TokenResponse
from app.modules.auth.application.use_cases.login_use_case import LoginUseCase
from app.modules.auth.application.use_cases.refresh_token_usecase import (
  RefreshTokenUseCase,
)
from app.modules.auth.infrastructure.repositories.user_repository_impl import (
  UserRepositoryImpl,
)

router = APIRouter(prefix="/auth", tags=["auth"])


def get_user_repository(db: Session = Depends(get_db)):
  return UserRepositoryImpl(db)


@router.post("/login", response_model=TokenResponse)
def login(payload: LoginRequest, repo=Depends(get_user_repository)) -> TokenResponse:
  use_case = LoginUseCase(repo)
  try:
    tokens = use_case.execute(payload.email, payload.password)
  except ValueError as exc:
    raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=str(exc)) from exc
  return TokenResponse(**tokens)


@router.post("/refresh", response_model=TokenResponse)
def refresh(payload: RefreshRequest) -> TokenResponse:
  use_case = RefreshTokenUseCase()
  try:
    tokens = use_case.execute(payload.refresh_token)
  except ValueError as exc:
    raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=str(exc)) from exc
  return TokenResponse(**tokens)
