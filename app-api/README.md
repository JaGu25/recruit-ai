# 🧠 Recruit-AI Backend

Backend service for Recruit-AI built with **FastAPI**, **PostgreSQL** and following **Clean Architecture** practices.

## 🚀 Project Structure

```
src/
├── app/
│   ├── main.py
│   ├── dependencies.py
│   ├── config/
│   │   └── settings.py
│   ├── shared/
│   │   ├── domain/
│   │   └── infrastructure/
│   ├── modules/
│   │   └── candidates/
│   │       ├── domain/
│   │       │   ├── entities/
│   │       │   │   └── candidate.py
│   │       │   ├── repositories/
│   │       │   │   └── candidate_repository.py
│   │       ├── application/
│   │       │   └── use_cases/
│   │       │       └── create_candidate_usecase.py
│   │       ├── infrastructure/
│   │       │   ├── models/
│   │       │   │   └── candidate_model.py
│   │       │   ├── repositories/
│   │       │   │   └── candidate_repository_impl.py
│   │       └── api/
│   │           ├── routers.py
│   │           └── schemas.py
│   └── tests/
│       ├── unit/
│       └── integration/
├── Dockerfile
├── docker-compose.yml
├── pyproject.toml
├── .env.example
└── README.md
```

## ⚙️ Environment

Copy `.env.example` to `.env` and adjust values as necessary.

```
DATABASE_URL=postgresql+psycopg2://postgres:postgres@db:5432/recruitai
APP_ENV=development
```

## 🐳 Docker

```
docker-compose up --build
docker-compose run backend pytest
```

The API will be available at `http://localhost:8000` and docs at `http://localhost:8000/docs`.

### Storage configuration

By default, uploaded resumes are stored locally under `storage/uploads/`. To use Amazon S3 instead, set `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_REGION`, and `AWS_S3_BUCKET` in your `.env`.
