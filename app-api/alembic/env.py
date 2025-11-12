from __future__ import annotations

import os
import sys
from pathlib import Path

from alembic import context
from sqlalchemy import engine_from_config, pool
from sqlalchemy.engine import Connection

BASE_DIR = Path(__file__).resolve().parents[1]
SRC_DIR = BASE_DIR / "src"

for path in {BASE_DIR, SRC_DIR}:
  if path.exists():
    sys.path.append(str(path))

from app.config.settings import settings  # noqa: E402
from app.shared.infrastructure.database import Base  # noqa: E402

config = context.config
config.set_main_option("sqlalchemy.url", settings.database_url)
target_metadata = Base.metadata


def run_migrations_offline() -> None:
  url = config.get_main_option("sqlalchemy.url")
  context.configure(
    url=url,
    target_metadata=target_metadata,
    literal_binds=True,
    compare_type=True,
  )

  with context.begin_transaction():
    context.run_migrations()


def run_migrations_online() -> None:
  connectable = engine_from_config(
    config.get_section(config.config_ini_section, {}),
    prefix="sqlalchemy.",
    poolclass=pool.NullPool,
  )

  with connectable.connect() as connection:
    context.configure(connection=connection, target_metadata=target_metadata, compare_type=True)

    with context.begin_transaction():
      context.run_migrations()


if context.is_offline_mode():
  run_migrations_offline()
else:
  run_migrations_online()
