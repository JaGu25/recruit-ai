from contextlib import asynccontextmanager

from fastapi import FastAPI

from app.dependencies import engine
from app.modules.auth.api.routers import router as auth_router
from app.modules.auth.infrastructure.middleware.auth_middleware import (
  CandidateAuthMiddleware,
)
from app.modules.auth.infrastructure.models import user_model as _  # noqa: F401
from app.modules.candidates.api.routers import router as candidates_router
from app.modules.candidates.infrastructure.models import candidate_model as _  # noqa: F401
from app.shared.infrastructure.database import Base


@asynccontextmanager
async def lifespan(_: FastAPI):
  Base.metadata.create_all(bind=engine)
  yield


app = FastAPI(title="Recruit-AI Backend", version="0.1.0", lifespan=lifespan)
app.add_middleware(CandidateAuthMiddleware)
app.include_router(auth_router)
app.include_router(candidates_router)
