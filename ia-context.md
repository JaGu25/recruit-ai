# Recruit-AI – Context Overview

This document summarizes the architecture and functional scope of both the front-end (`app/`) and back-end (`app-api/`) codebases. Use it as a reference when designing new features or reasoning about existing ones.

---

## Front-End (`app/`)

- **Tech Stack**: React 19 (with TypeScript), Vite 7, TanStack Router, React Hook Form, Zod, Tailwind-based design system, Vitest/Testing Library for validation.
- **Architecture**: Clean Architecture + DDD concepts applied within the UI layer. Modules encapsulate pages, components, hooks, and services around a bounded context (e.g., `auth`, `recruit`, `shared`).
- **Routing**: Defined under `src/app/router/` (e.g., `auth.route.tsx`, `recruit.route.tsx`, `root-route.tsx`). Each route ties into module-specific layouts or pages.
- **State & Forms**: React Hook Form with schema validation (Zod) for user input, particularly in authentication flows. Logic remains inside module boundaries to keep UIs declarative.
- **UI Composition**: Reusable shadcn-inspired components live under `src/modules/shared/ui/`. Utility helpers like `cn` standardize class merging.
- **Extensibility**: To add a feature, create or extend a module (domain-driven), introduce UI components plus hooks, and wire them into the router. Testing follows the same module locality principle (units + integration where needed).

---

## Back-End (`app-api/`)

- **Tech Stack**: FastAPI, SQLAlchemy ORM, Alembic migrations, PostgreSQL, PyJWT, Passlib (PBKDF2-SHA256), Boto3 for S3 uploads, Pytest/httpx for tests.
- **Architecture**: Clean Architecture + Hexagonal + DDD. Every module follows the same structure:
  - `domain/` – Entities and repository interfaces (pure domain logic).
  - `application/use_cases/` – Interactors orchestrating domain behavior.
  - `infrastructure/` – Adapters (SQLAlchemy models, repository implementations, middleware, storage, security utilities).
  - `api/` – FastAPI routers and schemas as I/O boundaries.
- **Modules**:
  - **Auth** – Handles login and refresh token issuance, JWT signing, middleware enforcement, and user persistence (`users` table). Includes a seeding script to bootstrap admin credentials.
  - **Candidates** – Accepts authenticated multipart uploads, streams CVs to S3, stores document URLs, and ensures access tokens via middleware.
- **Shared Infrastructure**: Database engine/session creation, JWT utilities, password hashing helpers, file storage services (S3), and dependency injection live in `app/shared`.
- **Migrations & Seeding**: Alembic keeps schemas in sync; scripts (e.g., `scripts/seed_user.py`) rely on the same Clean Architecture boundaries to create initial data.
- **Extensibility**: New functionality starts at the domain layer (entities + contracts), then application use-cases, followed by infrastructure adapters, and finally API routers. Tests exist at both unit (use-case) and integration (httpx + DB override) levels.

---

## Interaction Model

1. Front-end authentication screens call `/auth/login` to acquire JWTs.
2. Authenticated UI flows include the access token in headers when calling `/candidates`.
3. Back-end middleware validates tokens before executing candidate use cases.

Both applications share the same design philosophy: isolate domain logic, explicitly model ports/adapters, and keep framework-specific code at the edges. This alignment makes it easier to reason about changes across the stack and ensures a predictable path for feature work.
