/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
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
import { useChat, useThreadMessages, useAssistants } from "@/hooks/useApi";
import { Assistant } from "@/lib/api";
import { toast } from "sonner";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  assistantId?: number;
}

interface ChatInterfaceProps {
  assistantId: number;
  assistantName: string;
  threadId: number;
  threadDescription: string;
}

export function ChatInterface({
  assistantId,
  assistantName,
  threadId,
  threadDescription,
}: ChatInterfaceProps) {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);

  const { sendMessage, loading: chatLoading, error: chatError } = useChat();
  const { data: assistants } = useAssistants();
  const { data: threadMessages, refetch: refetchMessages } =
    useThreadMessages(threadId);

  // Find the selected assistant
  const selectedAssistant = assistants?.find(
    (assistant: Assistant) => (assistant.id || assistant.ID) === assistantId
  );

  // Convert API messages to local message format
  useEffect(() => {
    if (threadMessages && Array.isArray(threadMessages)) {
      const convertedMessages: Message[] = threadMessages
        .filter((msg: any) => msg && typeof msg === "object") // Filter out invalid messages
        .map((msg: any) => ({
          id: (msg.ID || msg.id || Date.now()).toString(),
          role: msg.Role || msg.role || "assistant",
          content: msg.Content || msg.content || "",
          timestamp: new Date(msg.CreatedAt || msg.created_at || Date.now()),
          assistantId: msg.AssistantID || msg.assistant_id,
        }))
        .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime()); // Sort by timestamp ascending
      setMessages(convertedMessages);
    } else {
      setMessages([]);
    }
  }, [threadMessages]);

  // Add welcome message when assistant is loaded and no messages exist
  useEffect(() => {
    if (
      selectedAssistant &&
      threadMessages &&
      Array.isArray(threadMessages) &&
      threadMessages.length === 0
    ) {
      const assistantGoal =
        selectedAssistant.goal ||
        selectedAssistant.Goal ||
        "I'm here to help you";
      const welcomeMessage: Message = {
        id: "welcome",
        role: "assistant",
        content: `Hello! I'm ${assistantName}. ${assistantGoal} How can I help you today?`,
        timestamp: new Date(),
        assistantId: assistantId,
      };
      setMessages([welcomeMessage]);
    }
  }, [selectedAssistant, threadMessages, assistantName, assistantId]);

  const handleSendMessage = async () => {
    if (!input.trim() || !threadId || !assistantId) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    // Optimistically add user message
    setMessages((prev: Message[]) => [...prev, userMessage]);
    const currentInput = input;
    setInput("");

    try {
      // Send message to backend using the chat API
      await sendMessage({
        thread_id: threadId,
        assistant_id: assistantId,
        prompt: currentInput,
      });

      // Refresh messages to get the latest from backend
      await refetchMessages();
    } catch (error) {
      // Remove optimistic message on error
      setMessages((prev: Message[]) =>
        prev.filter((msg: Message) => msg.id !== userMessage.id)
      );
      setInput(currentInput); // Restore input
      toast.error("Failed to send message");
      console.error("Failed to send message:", error);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Show loading state while setting up
  if (!selectedAssistant) {
    return (
      <div className="flex h-[calc(100vh-13rem)] flex-col rounded-lg border bg-background">
        <div className="flex items-center justify-center flex-1">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading assistant...</p>
          </div>
        </div>
      </div>
    );
  }

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
            <h3 className="font-medium">{assistantName}</h3>
            <p className="text-xs text-muted-foreground">{threadDescription}</p>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Assistant: {assistantName}</DropdownMenuItem>
            <DropdownMenuItem>
              Model: {selectedAssistant.model_key || selectedAssistant.ModelKey}
            </DropdownMenuItem>
            <DropdownMenuItem>Thread ID: {threadId}</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
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
                  "rounded-lg px-4 py-3 max-w-[80%]",
                  message.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
                )}
              >
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
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
            </div>
          ))}
          {chatLoading && (
            <div className="flex items-start gap-3">
              <Avatar>
                <AvatarFallback>
                  <Bot className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
              <div className="rounded-lg px-4 py-3 bg-muted">
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                  <p className="text-sm text-muted-foreground">
                    {assistantName} is thinking...
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      <Separator />

      <div className="p-4">
        <div className="flex items-end gap-2">
          <Textarea
            placeholder={`Message ${assistantName}...`}
            className="min-h-10 max-h-40 resize-none"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={chatLoading}
          />
          <Button
            size="icon"
            disabled={!input.trim() || chatLoading || !threadId || !assistantId}
            onClick={handleSendMessage}
          >
            <Send className="h-4 w-4" />
            <span className="sr-only">Send message</span>
          </Button>
        </div>
        {chatError && (
          <p className="text-sm text-destructive mt-2">{chatError}</p>
        )}
      </div>
    </div>
  );
}
