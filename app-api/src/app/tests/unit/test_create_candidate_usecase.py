from app.modules.candidates.application.use_cases.create_candidate_usecase import (
  CreateCandidateUseCase,
)
from app.modules.candidates.domain.entities.candidate import Candidate


class InMemoryRepo:
  def __init__(self):
    self.items: list[Candidate] = []

  def save(self, candidate: Candidate) -> Candidate:
    self.items.append(candidate)
    return candidate

def test_create_candidate_success():
  repo = InMemoryRepo()
  usecase = CreateCandidateUseCase(repo)

  result = usecase.execute("https://files/cv.pdf")

  assert result.document_url == "https://files/cv.pdf"
  assert len(repo.items) == 1
