from fastapi import APIRouter, Depends, File, HTTPException, UploadFile, status
from sqlalchemy.orm import Session

from app.dependencies import get_db, get_storage_service
from app.modules.candidates.api.schemas import (
    UploadResumesResponse,
    CandidateChatRequest,
    CandidateChatResponse,
)
from app.modules.candidates.application.use_cases.create_candidate_usecase import (
    CreateCandidateUseCase,
)
from app.modules.candidates.application.use_cases.chat_candidates_usecase import (
    ChatCandidatesUseCase,
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

    return UploadResumesResponse(message="Resume upload completed successfully.")


@router.post("/chat", response_model=CandidateChatResponse)
def chat_candidates(payload: CandidateChatRequest) -> CandidateChatResponse:
    use_case = ChatCandidatesUseCase()
    try:
        answer = use_case.execute(payload.message)
    except RuntimeError as exc:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc)) from exc

    if isinstance(answer, dict):
        value = answer.get("answer")
        if not isinstance(value, str):
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Invalid response from chat service.",
            )
        return CandidateChatResponse(**answer)

    if isinstance(answer, str):
        return CandidateChatResponse(answer=answer)

    raise HTTPException(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        detail="Chat service returned an unknown response type.",
    )
