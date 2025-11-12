"""initial schema for candidates and users

Revision ID: initial_schema
Revises: 
Create Date: 2025-02-14 00:01:00.000000
"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy import inspect


revision = "initial_schema"
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
  bind = op.get_bind()
  inspector = inspect(bind)
  tables = inspector.get_table_names()

  if "candidates" not in tables:
    op.create_table(
      "candidates",
      sa.Column("id", sa.String(), primary_key=True),
      sa.Column("document_url", sa.String(), nullable=True),
    )
  else:
    columns = {column["name"] for column in inspector.get_columns("candidates")}
    if "document_url" not in columns:
      with op.batch_alter_table("candidates") as batch_op:
        batch_op.add_column(sa.Column("document_url", sa.String(), nullable=True))
    unique_constraints = {uc["name"] for uc in inspector.get_unique_constraints("candidates")}
    if "candidates_email_key" in unique_constraints:
      with op.batch_alter_table("candidates") as batch_op:
        batch_op.drop_constraint("candidates_email_key", type_="unique")
    for obsolete_column in ("name", "email"):
      if obsolete_column in columns:
        with op.batch_alter_table("candidates") as batch_op:
          batch_op.drop_column(obsolete_column)

  if "users" not in tables:
    op.create_table(
      "users",
      sa.Column("id", sa.String(), primary_key=True),
      sa.Column("email", sa.String(), nullable=False),
      sa.Column("password_hash", sa.String(), nullable=False),
    )
    op.create_unique_constraint("uq_users_email", "users", ["email"])
  else:
    unique_constraints = {uc["name"] for uc in inspector.get_unique_constraints("users")}
    if "uq_users_email" not in unique_constraints:
      op.create_unique_constraint("uq_users_email", "users", ["email"])


def downgrade() -> None:
  bind = op.get_bind()
  inspector = inspect(bind)

  if "users" in inspector.get_table_names():
    op.drop_table("users")

  if "candidates" in inspector.get_table_names():
    op.drop_table("candidates")
