import { candidateRepository } from "@/modules/recruit/infrastructure/repositories/candidate.repository.impl";
import type { CandidateRepository } from "@/modules/recruit/domain/repositories/candidate.repository";
import type { CandidateChatResponse } from "@/modules/recruit/domain/entities/candidate-chat.entity";

export class CandidateService {
  constructor(private readonly repository: CandidateRepository) {}

  upload(files: File[]): Promise<void> {
    return this.repository.upload(files);
  }

  chat(message: string): Promise<CandidateChatResponse> {
    return this.repository.chat(message);
  }
}

export const candidateService = new CandidateService(candidateRepository);
