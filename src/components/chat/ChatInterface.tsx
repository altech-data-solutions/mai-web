import React, { useState } from "react";
import { Send, User, Bot, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface ChatInterfaceProps {
  modelId: string;
  modelName: string;
}

export function ChatInterface({ modelId, modelName }: ChatInterfaceProps) {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: `Hello! I'm ${modelName}. How can I help you today?`,
      timestamp: new Date(),
    },
  ]);

  const handleSendMessage = () => {
    if (!input.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    // Simulate AI response
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: `This is a simulated response from ${modelName} (${modelId}). In a real application, this would be an API call to the language model service.`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
    }, 1000);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex h-[calc(100vh-13rem)] flex-col rounded-lg border bg-background">
      <div className="flex items-center justify-between border-b p-4">
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarFallback>
              <Bot className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-medium">{modelName}</h3>
            <p className="text-xs text-muted-foreground">{modelId}</p>
          </div>
        </div>
        <Button variant="ghost" size="icon">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex items-start gap-3",
                message.role === "user" && "justify-end"
              )}
            >
              {message.role === "assistant" && (
                <Avatar>
                  <AvatarFallback>
                    <Bot className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
              )}
              <div
                className={cn(
                  "rounded-lg px-4 py-3",
                  message.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
                )}
              >
                <p className="text-sm">{message.content}</p>
                <time className="mt-1 text-xs opacity-70">
                  {message.timestamp.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </time>
              </div>
              {message.role === "user" && (
                <Avatar>
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback>
                    <User className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
              )}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 opacity-0 hover:opacity-100 group-hover:opacity-100"
                  >
                    <MoreVertical className="h-4 w-4" />
                    <span className="sr-only">More options</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Copy</DropdownMenuItem>
                  <DropdownMenuItem>Share</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ))}
        </div>
      </ScrollArea>

      <Separator />

      <div className="p-4">
        <div className="flex items-end gap-2">
          <Textarea
            placeholder="Type your message..."
            className="min-h-10 max-h-40 resize-none"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <Button
            size="icon"
            disabled={!input.trim()}
            onClick={handleSendMessage}
          >
            <Send className="h-4 w-4" />
            <span className="sr-only">Send message</span>
          </Button>
        </div>
      </div>
    </div>
  );
}