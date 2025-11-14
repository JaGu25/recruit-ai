import { candidateService } from "@/modules/recruit/domain/services/candidate.service";

export class UploadCandidatesUseCase {
  async execute(files: File[]): Promise<void> {
    return candidateService.upload(files);
  }
}
