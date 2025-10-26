import { forwardRef } from "react";
import { Card } from "@/modules/shared/ui/card";

export type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

type ChatContentProps = {
  messages: Message[];
};

export const ChatContent = forwardRef<HTMLDivElement, ChatContentProps>(
  ({ messages }, ref) => {
    return (
      <div
        className="w-full max-w-2xl overflow-y-auto px-4 py-6 flex flex-col gap-4"
        style={{ height: "calc(100vh - 90px)" }}
      >
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex ${
              m.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <Card
              className={`px-4 py-3 max-w-[80%] wrap-break-word shadow-sm ${
                m.role === "user"
                  ? "bg-primary text-primary-foreground rounded-br-none"
                  : "bg-muted rounded-bl-none"
              }`}
            >
              {m.content}
            </Card>
          </div>
        ))}
        <div ref={ref} />
      </div>
    );
  }
);
