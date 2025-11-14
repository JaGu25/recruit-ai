import json
from typing import Optional, List, Dict

import boto3
from botocore.exceptions import BotoCoreError, ClientError

from app.config.settings import settings


class BedrockRagService:
    def __init__(self) -> None:
        self._enabled = bool(
            settings.bedrock_region
            and settings.bedrock_model_arn
            and settings.bedrock_knowledge_base_id
        )
        self._client: Optional[boto3.client] = None

        if self._enabled:
            self._client = boto3.client(
                "bedrock-agent-runtime",
                region_name=settings.bedrock_region,
            )

    def chat(self, question: str) -> dict:
        if not self._enabled or not self._client:
            raise RuntimeError("Bedrock RAG service is not configured")

        model_arn = settings.bedrock_model_arn

        try:
            response = self._client.retrieve_and_generate(
                input={"text": question},
                retrieveAndGenerateConfiguration={
                    "type": "KNOWLEDGE_BASE",
                    "knowledgeBaseConfiguration": {
                        "knowledgeBaseId": settings.bedrock_knowledge_base_id,
                        "modelArn": model_arn,
                    },
                },
            )

            output = response.get("output", {})
            text = output.get("text", "").strip() or "No response returned by Bedrock RAG."

            citations = response.get("citations", [])
            candidates: List[Dict] = []

            for citation in citations:
                for ref in citation.get("retrievedReferences", []):
                    uri = ref.get("location", {}).get("s3Location", {}).get("uri")

                    if not uri:
                        continue

                    filename = uri.split("/")[-1]

                    name = (
                        filename.replace(".pdf", "")
                        .replace("_", " ")
                        .replace("-", " ")
                        .title()
                    )

                    candidates.append({
                        "name": name,
                        "cv": {
                            "uri": uri,
                            "downloadUrl": f"/api/candidates/download?uri={uri}"
                        }
                    })

            return {
                "answer": text,
                "candidates": candidates,
            }

        except (BotoCoreError, ClientError) as exc:
            print(f"❌ Failed to contact Bedrock service: {exc}")
            raise RuntimeError("Failed to contact Bedrock service") from exc


def get_bedrock_service() -> BedrockRagService:
    return BedrockRagService()
