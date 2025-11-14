from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_env: str = "development"
    database_url: str
    aws_access_key_id: str | None = None
    aws_secret_access_key: str | None = None
    aws_region: str | None = None
    aws_s3_bucket: str | None = None
    jwt_secret: str = "super-secret-key"
    jwt_algorithm: str = "HS256"
    jwt_access_exp_minutes: int = 15
    jwt_refresh_exp_minutes: int = 60 * 24
    admin_seed_email: str = "admin@recruit.ai"
    bedrock_region: str | None = None
    bedrock_model_arn: str | None = None
    bedrock_knowledge_base_id: str | None = None

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")


settings = Settings()
