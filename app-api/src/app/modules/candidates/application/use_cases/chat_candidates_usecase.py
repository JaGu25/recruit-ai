import re
from typing import Any

from app.modules.candidates.infrastructure.services.bedrock_service import (
    BedrockRagService,
    get_bedrock_service,
)


class ChatCandidatesUseCase:
    _STOP_TOKENS = {"cv", "resume", "curriculum", "hoja", "vida"}

    def __init__(self, bedrock_service: BedrockRagService | None = None) -> None:
        self.bedrock_service = bedrock_service or get_bedrock_service()

    def execute(self, question: str) -> Any:
        response = self.bedrock_service.chat(question)
        return self._normalize_response(response)

    def _normalize_response(self, response: Any) -> Any:
        if not isinstance(response, dict):
            return response

        candidates = response.get("candidates")
        if not isinstance(candidates, list):
            return response

        normalized_candidates: list[dict[str, Any]] = []
        seen_identifiers: set[str] = set()

        for candidate in candidates:
            if not isinstance(candidate, dict):
                continue

            normalized_candidate = candidate.copy()
            cleaned_name = self._extract_candidate_name(candidate)
            if cleaned_name:
                normalized_candidate["name"] = cleaned_name

            identifier = self._candidate_identifier(normalized_candidate)
            if identifier and identifier in seen_identifiers:
                continue
            if identifier:
                seen_identifiers.add(identifier)

            normalized_candidates.append(normalized_candidate)

        response["candidates"] = normalized_candidates
        return response

    def _candidate_identifier(self, candidate: dict[str, Any]) -> str | None:
        cv = candidate.get("cv")
        if isinstance(cv, dict):
            uri = cv.get("uri")
            if isinstance(uri, str) and uri:
                return uri
        name = candidate.get("name")
        if isinstance(name, str) and name:
            return name.lower()
        return None

    def _extract_candidate_name(self, candidate: dict[str, Any]) -> str | None:
        possible_sources = [
            candidate.get("name"),
            self._name_from_uri(candidate.get("cv")),
        ]
        for source in possible_sources:
            cleaned = self._clean_candidate_name(source)
            if cleaned:
                return cleaned
        return None

    def _name_from_uri(self, cv_data: Any) -> str | None:
        if not isinstance(cv_data, dict):
            return None
        uri = cv_data.get("uri")
        if not isinstance(uri, str) or not uri:
            return None
        filename = uri.rsplit("/", 1)[-1]
        base = filename.rsplit(".", 1)[0]
        if "_" in base:
            base = base.split("_", 1)[-1]
        return base.replace("-", " ")

    def _clean_candidate_name(self, raw: Any) -> str | None:
        if not isinstance(raw, str) or not raw.strip():
            return None

        tokens = re.split(r"[\s_]+", raw.replace("-", " ").strip())
        cleaned_tokens: list[str] = []
        for token in tokens:
            if not token:
                continue
            lower = token.lower()
            if lower in self._STOP_TOKENS:
                break
            if re.fullmatch(r"[0-9a-f]{4,}", lower):
                continue
            if token.isdigit():
                continue
            cleaned_tokens.append(token.capitalize())

        name = " ".join(cleaned_tokens).strip()
        return name or None
