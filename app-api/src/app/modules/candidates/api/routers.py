from fastapi import APIRouter, Depends, File, HTTPException, UploadFile, status
from sqlalchemy.orm import Session

from app.dependencies import get_db, get_storage_service
from app.modules.candidates.api.schemas import UploadResumesResponse
from app.modules.candidates.application.use_cases.create_candidate_usecase import (
  CreateCandidateUseCase,
)
from app.modules.candidates.infrastructure.repositories.candidate_repository_impl import (
  CandidateRepositoryImpl,
)
from app.shared.infrastructure.storage.file_storage import FileStorageService

router = APIRouter(prefix="/candidates", tags=["candidates"])


@router.post(
  "",
  response_model=UploadResumesResponse,
  status_code=status.HTTP_201_CREATED,
)
async def create_candidate(
  files: list[UploadFile] | None = File(None),
  db: Session = Depends(get_db),
  storage: FileStorageService = Depends(get_storage_service),
) -> UploadResumesResponse:
  if not files:
    raise HTTPException(
      status_code=status.HTTP_400_BAD_REQUEST,
      detail="At least one resume file is required.",
    )
  resume_urls: list[str] = []

  repository = CandidateRepositoryImpl(db)
  use_case = CreateCandidateUseCase(repository)

  if files:
    for file in files:
      content = await file.read()
      url = storage.upload_file(content, file.filename, file.content_type)
      resume_urls.append(url)
      use_case.execute(document_url=url)

  if not resume_urls:
    raise HTTPException(
      status_code=status.HTTP_400_BAD_REQUEST,
      detail="No resume files could be processed.",
    )

  return UploadResumesResponse(
    message="Resume upload completed successfully."
  )
