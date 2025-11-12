from sqlalchemy import Column, String

from app.shared.infrastructure.database import Base


class CandidateModel(Base):
  __tablename__ = "candidates"

  id = Column(String, primary_key=True, index=True)
  document_url = Column(String, nullable=True)
