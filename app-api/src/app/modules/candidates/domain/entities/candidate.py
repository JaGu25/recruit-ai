from __future__ import annotations

from dataclasses import dataclass
from uuid import uuid4


@dataclass(slots=True, frozen=True)
class Candidate:
  id: str
  document_url: str

  @staticmethod
  def create(document_url: str) -> "Candidate":
    return Candidate(id=str(uuid4()), document_url=document_url)
