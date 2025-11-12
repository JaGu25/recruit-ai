"""Seed a default admin user."""

from pathlib import Path
import sys

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

BASE_DIR = Path(__file__).resolve().parents[1]
SRC_DIR = BASE_DIR / "src"
for path in {BASE_DIR, SRC_DIR}:
  if path.exists():
    sys.path.append(str(path))

from app.config.settings import settings  # noqa: E402
from app.modules.auth.infrastructure.repositories.user_repository_impl import (  # noqa: E402
  UserRepositoryImpl,
)
from app.shared.infrastructure.security import passwords  # noqa: E402

DEFAULT_PASSWORD = "123456"


def main() -> None:
  engine = create_engine(settings.database_url)
  SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)
  session = SessionLocal()
  try:
    repository = UserRepositoryImpl(session)
    existing = repository.get_by_email(settings.admin_seed_email)
    if existing:
      print(f"User {settings.admin_seed_email} already exists. Skipping seed.")
      return

    password_hash = passwords.hash_password(DEFAULT_PASSWORD)
    repository.create(settings.admin_seed_email, password_hash)
    print(
      f"Seeded user {settings.admin_seed_email} with password '{DEFAULT_PASSWORD}'. Please change it in production."
    )
  finally:
    session.close()


if __name__ == "__main__":
  main()
