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

Set `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_REGION`, and `AWS_S3_BUCKET` in your `.env` to enable resume uploads to Amazon S3.

### Database migrations

Run migrations any time the schema changes:

```
cd app-api
alembic upgrade head
docker-compose run backend alembic upgrade head
```

### Seed default admin user

```
docker-compose run --rm backend python scripts/seed_user.py
```

- Creates (if necessary) the admin user defined via `ADMIN_SEED_EMAIL` (default `admin@recruit.ai`).
- Password defaults to `123456` and is hashed with PBKDF2-SHA256 before storing. Update it after initial login in production environments.

## 🔐 Services Overview (Swagger-style)

### Auth Service
| Endpoint | Method | Auth | Description |
| --- | --- | --- | --- |
| `/auth/login` | `POST` | None | Exchanges user credentials for an access + refresh token pair. |
| `/auth/refresh` | `POST` | None | Rotates a valid refresh token and emits a new token pair. |

**Schemas**

`POST /auth/login`
```jsonc
// Request Body
{
  "email": "admin@recruit.ai",
  "password": "123456"
}

// 200 Response
{
  "access_token": "<JWT access token>",
  "refresh_token": "<JWT refresh token>",
  "token_type": "bearer"
}
```
- Credentials are matched against the users stored in the database (seeded via the command above).
- Tokens are signed with HS256 using `JWT_SECRET`; expirations are controlled by `JWT_ACCESS_EXP_MINUTES` and `JWT_REFRESH_EXP_MINUTES`.

`POST /auth/refresh`
```jsonc
// Request Body
{
  "refresh_token": "<JWT refresh token>"
}

// 200 Response
{
  "access_token": "<new access token>",
  "refresh_token": "<new refresh token>",
  "token_type": "bearer"
}
```
- Fails with `401` if the token is missing, expired, or not a refresh token.

### Candidates Service
| Endpoint | Method | Auth | Description |
| --- | --- | --- | --- |
| `/candidates` | `POST` | `Bearer <access_token>` | Uploads one or multiple resumes (CVs). Each document is persisted to S3 and the resulting URL is stored in the DB. |

`POST /candidates`
```
Content-Type: multipart/form-data
Authorization: Bearer <access_token>

files: cv_es.pdf (application/pdf)
files: cv_en.pdf (application/pdf)
```
```jsonc
// 201 Response
{
  "message": "Resume upload completed successfully."
}
```
- At least one `files` field is required; validation errors return `400`.
- The middleware `CandidateAuthMiddleware` blocks every `/candidates` request that lacks a valid bearer token.

> **Workflow Tip:**
> 1. Call `/auth/login` to obtain tokens.
> 2. Include the access token in the `Authorization` header.
> 3. Upload resumes via `/candidates`.
> 4. When the access token expires, call `/auth/refresh` and repeat.
