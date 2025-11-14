import { candidateService } from "@/modules/recruit/domain/services/candidate.service";
import type { CandidateChatResponse } from "@/modules/recruit/domain/entities/candidate-chat.entity";

export class ChatCandidatesUseCase {
  async execute(message: string): Promise<CandidateChatResponse> {
    return candidateService.chat(message);
  }
}
