import type { CandidateChatResponse } from "@/modules/recruit/domain/entities/candidate-chat.entity";

export interface CandidateRepository {
  upload(files: File[]): Promise<void>;
  chat(message: string): Promise<CandidateChatResponse>;
}
