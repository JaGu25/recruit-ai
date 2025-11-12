from dataclasses import dataclass


@dataclass(slots=True, frozen=True)
class User:
  email: str
  password_hash: str
