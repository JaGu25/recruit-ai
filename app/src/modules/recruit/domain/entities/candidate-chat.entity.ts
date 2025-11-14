export type CandidateCv = {
  uri?: string;
  downloadUrl?: string;
  [key: string]: unknown;
};

export type CandidateChatCandidate = {
  name: string;
  cv?: CandidateCv;
  [key: string]: unknown;
};

export type CandidateChatResponse = {
  answer?: string;
  candidates?: CandidateChatCandidate[];
  [key: string]: unknown;
};
