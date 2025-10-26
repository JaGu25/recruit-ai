import { useState, useRef, useEffect } from "react";
import { Button } from "@/modules/shared/ui/button";
import { Input } from "@/modules/shared/ui/input";
import { Send } from "lucide-react";
import {
  ChatContent,
  type Message,
} from "@/modules/recruit/ui/pages/chat/components/ChatContent";

const ChatPage = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: crypto.randomUUID(),
      role: "assistant",
      content:
        "👋 Hello! I'm Recruit-AI. You can ask me anything about the uploaded CVs.",
    },
  ]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSend = () => {
    if (!input.trim()) return;

    const newMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: input,
    };

    setMessages((prev) => [...prev, newMessage]);

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: "I'll analyze your CV data soon. (Simulated response)",
        },
      ]);
      scrollToBottom();
    }, 700);

    setInput("");
  };

  useEffect(() => {
    scrollToBottom();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <div className="flex-1 flex justify-center">
        <ChatContent messages={messages} ref={messagesEndRef} />
      </div>

      <footer className="bg-background p-4 border-t border-border">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="max-w-2xl mx-auto w-full"
        >
          <div className="flex items-center gap-2 bg-card border border-border rounded-full shadow-sm px-4 py-2">
            <Input
              placeholder="Message Recruit-AI..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-sm"
            />
            <Button
              type="submit"
              size="icon"
              className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full"
              disabled={!input.trim()}
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
