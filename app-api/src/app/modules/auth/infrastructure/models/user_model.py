from sqlalchemy import Column, String

from app.shared.infrastructure.database import Base


class UserModel(Base):
  __tablename__ = "users"

  id = Column(String, primary_key=True)
  email = Column(String, unique=True, nullable=False, index=True)
  password_hash = Column(String, nullable=False)
