import { useState, useRef, useEffect } from "react";
import { Send } from "lucide-react";

import { Button } from "@/modules/shared/ui/button";
import { Input } from "@/modules/shared/ui/input";
import {
  ChatContent,
  type Message,
} from "@/modules/recruit/ui/pages/chat/components/ChatContent";
import { ChatCandidatesUseCase } from "@/modules/recruit/application/use-cases/chat-candidates.usecase";
import type { CandidateChatCandidate } from "@/modules/recruit/domain/entities/candidate-chat.entity";
import { useErrorDialog } from "@/app/providers/error-dialog-context";
import { buildDownloadUrl } from "@/modules/shared/utils/build-download-url";

const INITIAL_MESSAGE: Message = {
  id: crypto.randomUUID(),
  role: "assistant",
  content: "👋 Hello! I'm Recruit-AI. Ask me anything about the uploaded CVs.",
};

const ChatPage = () => {
  const { showError } = useErrorDialog();
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const normalizeCandidates = (
    candidates?: CandidateChatCandidate[]
  ): CandidateChatCandidate[] | undefined => {
    if (!Array.isArray(candidates) || candidates.length === 0) {
      return undefined;
    }

    return candidates.map((candidate) => {
      if (!candidate.cv?.downloadUrl) {
        return candidate;
      }

      return {
        ...candidate,
        cv: {
          ...candidate.cv,
          downloadUrl: buildDownloadUrl(candidate.cv.downloadUrl),
        },
      };
    });
  };

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed || isSending) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: trimmed,
    };

    const pendingResponse: Message = {
      id: crypto.randomUUID(),
      role: "assistant",
      content: "",
      isLoading: true,
    };

    setMessages((prev) => [...prev, userMessage, pendingResponse]);
    setInput("");
    setIsSending(true);

    const useCase = new ChatCandidatesUseCase();

    try {
      const response = await useCase.execute(trimmed);
      setMessages((prev) =>
        prev.map((message) =>
          message.id === pendingResponse.id
            ? {
                ...message,
                isLoading: false,
                content:
                  response.answer ||
                  "I couldn't find an answer. Please refine your question.",
                candidates: normalizeCandidates(response.candidates),
              }
            : message
        )
      );
    } catch (error) {
      setMessages((prev) => prev.filter((message) => message.id !== pendingResponse.id));
      showError(
        error instanceof Error
          ? error.message
          : "Unable to reach the chat service. Please try again."
      );
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <div className="flex-1 flex justify-center">
        <ChatContent messages={messages} ref={messagesEndRef} />
      </div>

      <footer className="bg-background p-4 border-t border-border">
        <form
          onSubmit={(event) => {
            event.preventDefault();
            void handleSend();
          }}
          className="max-w-2xl mx-auto w-full"
        >
          <div className="flex items-center gap-2 bg-card border border-border rounded-full shadow-sm px-4 py-2">
            <Input
              placeholder="Message Recruit-AI..."
              value={input}
              onChange={(event) => setInput(event.target.value)}
              className="flex-1 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-sm"
              disabled={isSending}
            />
            <Button
              type="submit"
              size="icon"
              className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full"
              disabled={!input.trim() || isSending}
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </form>
      </footer>
    </div>
  );
};

export default ChatPage;
