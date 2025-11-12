from app.modules.candidates.domain.entities.candidate import Candidate
from app.modules.candidates.domain.repositories.candidate_repository import (
  CandidateRepository,
)


class CreateCandidateUseCase:
  def __init__(self, repository: CandidateRepository):
    self.repository = repository

  def execute(self, document_url: str) -> Candidate:
    candidate = Candidate.create(document_url=document_url)
    return self.repository.save(candidate)
