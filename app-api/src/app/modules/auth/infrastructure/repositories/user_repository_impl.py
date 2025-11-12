from uuid import uuid4

from sqlalchemy.orm import Session

from app.modules.auth.domain.entities.user import User
from app.modules.auth.domain.repositories.user_repository import UserRepository
from app.modules.auth.infrastructure.models.user_model import UserModel


class UserRepositoryImpl(UserRepository):
  def __init__(self, session: Session):
    self.session = session

  def get_by_email(self, email: str) -> User | None:
    model = (
      self.session.query(UserModel)
      .filter(UserModel.email == email)
      .one_or_none()
    )
    if not model:
      return None
    return User(email=model.email, password_hash=model.password_hash)

  def create(self, email: str, password_hash: str) -> User:
    model = UserModel(id=str(uuid4()), email=email, password_hash=password_hash)
    self.session.add(model)
    self.session.commit()
    return User(email=model.email, password_hash=model.password_hash)
