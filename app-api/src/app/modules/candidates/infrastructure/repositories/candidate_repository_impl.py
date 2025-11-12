from sqlalchemy.orm import Session

from app.modules.candidates.domain.entities.candidate import Candidate
from app.modules.candidates.domain.repositories.candidate_repository import (
  CandidateRepository,
)
from app.modules.candidates.infrastructure.models.candidate_model import (
  CandidateModel,
)


class CandidateRepositoryImpl(CandidateRepository):
  def __init__(self, session: Session):
    self.session = session

  def save(self, candidate: Candidate) -> Candidate:
    model = CandidateModel(
      id=candidate.id,
      document_url=candidate.document_url,
    )
    self.session.merge(model)
    self.session.commit()
    return candidate
