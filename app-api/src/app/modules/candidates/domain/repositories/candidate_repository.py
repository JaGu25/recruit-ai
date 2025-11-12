from typing import Protocol

from app.modules.candidates.domain.entities.candidate import Candidate


class CandidateRepository(Protocol):
  def save(self, candidate: Candidate) -> Candidate:
    raise NotImplementedError
