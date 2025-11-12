import os

from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

TEST_DATABASE_URL = os.environ.get("TEST_DATABASE_URL", "sqlite+pysqlite:///:memory:")

os.environ["DATABASE_URL"] = TEST_DATABASE_URL

from app.dependencies import get_db, get_storage_service  # noqa: E402
from app.main import app  # noqa: E402
from app.modules.candidates.infrastructure.models.candidate_model import (  # noqa: E402
  CandidateModel,
)
from app.shared.infrastructure.database import Base  # noqa: E402


class FakeStorage:
  def __init__(self):
    self.uploaded = []

  def upload_file(self, file_data: bytes, filename: str, content_type: str | None = None) -> str:
    self.uploaded.append((filename, file_data, content_type))
    return f"https://files.test/{filename}"


connect_args: dict[str, object] = {}
engine_kwargs: dict[str, object] = {}

if TEST_DATABASE_URL.startswith("sqlite"):
  connect_args["check_same_thread"] = False
  if TEST_DATABASE_URL.endswith(":memory:"):
    engine_kwargs["poolclass"] = StaticPool

engine = create_engine(TEST_DATABASE_URL, connect_args=connect_args, **engine_kwargs)
TestingSessionLocal = sessionmaker(bind=engine, autocommit=False, autoflush=False)

Base.metadata.create_all(bind=engine)


def override_get_db():
  db = TestingSessionLocal()
  try:
    yield db
  finally:
    db.close()


fake_storage = FakeStorage()


def override_storage():
  return fake_storage


app.dependency_overrides[get_db] = override_get_db
app.dependency_overrides[get_storage_service] = override_storage

client = TestClient(app)


def test_create_candidate_endpoint():
  fake_storage.uploaded.clear()
  with TestingSessionLocal() as cleanup_session:
    cleanup_session.query(CandidateModel).delete()
    cleanup_session.commit()

  files = [("files", ("cv.pdf", b"resume content", "application/pdf"))]

  response = client.post("/candidates", files=files)

  assert response.status_code == 201
  data = response.json()
  assert data["message"] == "Resume upload completed successfully."
  assert len(fake_storage.uploaded) == 1
  with TestingSessionLocal() as session:
    records = session.query(CandidateModel).all()
    assert len(records) == 1
    assert records[0].document_url == "https://files.test/cv.pdf"
