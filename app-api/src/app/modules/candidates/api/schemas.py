from typing import Any

from pydantic import BaseModel, ConfigDict


class UploadResumesResponse(BaseModel):
    message: str


class CandidateChatRequest(BaseModel):
    message: str


class CandidateChatResponse(BaseModel):
    answer: str
    candidates: list[dict[str, Any]] | None = None
    model_config = ConfigDict(extra="allow")
