import { api } from "@/app/config/api";
import type { CandidateRepository } from "@/modules/recruit/domain/repositories/candidate.repository";
import type { CandidateChatResponse } from "@/modules/recruit/domain/entities/candidate-chat.entity";

export class CandidateRepositoryImpl implements CandidateRepository {
  async upload(files: File[]): Promise<void> {
    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));

    await api.post("/candidates", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  }

  async chat(message: string): Promise<CandidateChatResponse> {
    const { data } = await api.post<CandidateChatResponse>("/candidates/chat", {
      message,
    });
    return data;
  }
}

export const candidateRepository = new CandidateRepositoryImpl();
