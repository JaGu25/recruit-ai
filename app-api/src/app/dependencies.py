from collections.abc import Generator
from functools import lru_cache

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.config.settings import settings
from app.shared.infrastructure.storage.file_storage import (
  FileStorageService,
  S3FileStorageService,
)

engine = create_engine(settings.database_url, future=True)
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)


def get_db() -> Generator:
  db = SessionLocal()
  try:
    yield db
  finally:
    db.close()


@lru_cache
def get_storage_service() -> FileStorageService:
  if not settings.aws_s3_bucket:
    raise RuntimeError("AWS_S3_BUCKET is not configured")

  return S3FileStorageService(bucket=settings.aws_s3_bucket, region=settings.aws_region)
