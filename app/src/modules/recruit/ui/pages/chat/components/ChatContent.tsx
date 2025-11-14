import { forwardRef, useState, type ReactNode } from "react";
import { Loader2 } from "lucide-react";

import { Card } from "@/modules/shared/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/modules/shared/ui/tooltip";
import type { CandidateChatCandidate } from "@/modules/recruit/domain/entities/candidate-chat.entity";
import { ModalPreviewCv } from "@/modules/recruit/ui/pages/chat/components/ModalPreviewCv";
import { downloadFileWithAuth } from "@/modules/shared/utils/download-file";

export type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  candidates?: CandidateChatCandidate[];
  isLoading?: boolean;
};

type ChatContentProps = {
  messages: Message[];
};

type CandidateNameButtonProps = {
  candidate: CandidateChatCandidate;
  onPreview: (candidate: CandidateChatCandidate) => void;
};

const CandidateNameButton = ({
  candidate,
  onPreview,
}: CandidateNameButtonProps) => (
  <Tooltip>
    <TooltipTrigger asChild>
      <button
        type="button"
        className="font-bold text-primary cursor-pointer underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 rounded-sm px-0.5"
        onClick={() => onPreview(candidate)}
      >
        {candidate.name}
      </button>
    </TooltipTrigger>
    <TooltipContent>Preview CV</TooltipContent>
  </Tooltip>
);

const escapeRegExp = (value: string) =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const highlightCandidateNames = (
  content: string,
  candidates: CandidateChatCandidate[] | undefined,
  onPreviewCandidate: (candidate: CandidateChatCandidate) => void
): ReactNode => {
  if (!candidates?.length) {
    return content;
  }

  const candidateMap = new Map<string, CandidateChatCandidate>();
  candidates.forEach((candidate) => {
    if (candidate.name) {
      candidateMap.set(candidate.name.trim().toLowerCase(), candidate);
    }
  });

  if (!candidateMap.size) {
    return content;
  }

  const pattern = Array.from(candidateMap.keys())
    .sort((a, b) => b.length - a.length)
    .map(escapeRegExp)
    .join("|");
  const regex = new RegExp(`(${pattern})`, "gi");

  return content.split(regex).map((segment, index) => {
    const candidate = candidateMap.get(segment.toLowerCase().trim());
    if (candidate) {
      return (
        <CandidateNameButton
          key={`candidate-${candidate.name}-${index}`}
          candidate={candidate}
          onPreview={onPreviewCandidate}
        />
      );
    }
    return <span key={`text-${index}`}>{segment}</span>;
  });
};

type MessageBubbleProps = {
  message: Message;
  onPreviewCandidate: (candidate: CandidateChatCandidate) => void;
  onDownloadCandidate: (url: string, candidateName?: string) => Promise<void>;
};

const MessageBubble = ({ message, onPreviewCandidate }: MessageBubbleProps) => {
  const isUser = message.role === "user";
  const highlightedContent =
    !isUser && !message.isLoading
      ? highlightCandidateNames(
          message.content,
          message.candidates,
          onPreviewCandidate
        )
      : message.content;

  return (
    <Card
      className={`px-4 py-3 max-w-[80%] shadow-sm space-y-3 ${
        isUser
          ? "bg-primary text-primary-foreground rounded-br-none"
          : "bg-muted rounded-bl-none"
      }`}
    >
      {message.isLoading ? (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          Recruit-AI is thinking...
        </div>
      ) : (
        <>
          <p className="whitespace-pre-wrap break-words text-sm sm:text-base">
            {highlightedContent}
          </p>
        </>
      )}
    </Card>
  );
};

export const ChatContent = forwardRef<HTMLDivElement, ChatContentProps>(
  ({ messages }, ref) => {
    const [previewCandidate, setPreviewCandidate] =
      useState<CandidateChatCandidate | null>(null);

    const handlePreviewCandidate = (candidate: CandidateChatCandidate) => {
      setPreviewCandidate(candidate);
    };

    const handleDownloadCandidate = async (
      url: string,
      candidateName?: string
    ) => {
      try {
        await downloadFileWithAuth(url, candidateName);
      } catch (error) {
        console.error("Failed to download candidate CV", error);
      }
    };

    return (
      <>
        <div
          className="w-full max-w-2xl overflow-y-auto px-4 py-6 flex flex-col gap-4"
          style={{ height: "calc(100vh - 90px)" }}
        >
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <MessageBubble
                message={message}
                onPreviewCandidate={handlePreviewCandidate}
                onDownloadCandidate={handleDownloadCandidate}
              />
            </div>
          ))}
          <div ref={ref} />
        </div>

        <ModalPreviewCv
          open={Boolean(previewCandidate)}
          onOpenChange={(open) => {
            if (!open) {
              setPreviewCandidate(null);
            }
          }}
          candidateName={previewCandidate?.name}
          downloadUrl={previewCandidate?.cv?.downloadUrl}
          fileUri={previewCandidate?.cv?.uri}
        />
      </>
    );
  }
);
