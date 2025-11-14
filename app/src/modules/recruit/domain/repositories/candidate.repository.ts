export interface CandidateRepository {
  upload(files: File[]): Promise<void>;
}
