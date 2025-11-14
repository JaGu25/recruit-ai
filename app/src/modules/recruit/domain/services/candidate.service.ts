import { candidateRepository } from "@/modules/recruit/infrastructure/repositories/candidate.repository.impl";
import type { CandidateRepository } from "@/modules/recruit/domain/repositories/candidate.repository";

export class CandidateService {
  constructor(private readonly repository: CandidateRepository) {}

  upload(files: File[]): Promise<void> {
    return this.repository.upload(files);
  }
}

export const candidateService = new CandidateService(candidateRepository);
