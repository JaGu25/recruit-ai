from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
  app_env: str = "development"
  database_url: str
  aws_access_key_id: str | None = None
  aws_secret_access_key: str | None = None
  aws_region: str | None = None
  aws_s3_bucket: str | None = None

  model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")


settings = Settings()
