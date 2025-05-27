import { useState, useEffect } from "react";
import { ChatInterface } from "@/components/chat/ChatInterface";
import { AssistantSelector } from "@/components/assistants/AssistantSelector";
import { ThreadSelector } from "@/components/threads/ThreadSelector";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageSquare, Users, MessageCircle } from "lucide-react";
import { useAssistants, useThreads } from "@/hooks/useApi";

export function ChatPage() {
  const { data: assistants, loading: assistantsLoading } = useAssistants();
  const {
    data: threads,
    loading: threadsLoading,
    error: threadsError,
    refetch: refetchThreads,
  } = useThreads();
  const [selectedAssistantId, setSelectedAssistantId] = useState<number | null>(
    null
  );
  const [selectedThreadId, setSelectedThreadId] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState("chat");

  // Set default assistant when assistants are loaded
  useEffect(() => {
    if (assistants && assistants.length > 0 && !selectedAssistantId) {
      const firstAssistantId = assistants[0].id || assistants[0].ID;
      if (firstAssistantId) {
        setSelectedAssistantId(firstAssistantId);
      }
    }
  }, [assistants, selectedAssistantId]);

  // Set default thread when threads are loaded
  useEffect(() => {
    if (threads && threads.length > 0 && !selectedThreadId) {
      setSelectedThreadId(threads[0].id);
    }
  }, [threads, selectedThreadId]);

  const selectedAssistant = assistants?.find(
    (assistant) => (assistant.id || assistant.ID) === selectedAssistantId
  );
  const selectedThread = threads?.find(
    (thread) => thread.id === selectedThreadId
  );

  // Handle successful thread creation
  const handleThreadCreated = (threadId: number) => {
    setSelectedThreadId(threadId);
    setActiveTab("chat"); // Switch to chat tab
  };

  if (assistantsLoading || threadsLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="flex items-center gap-2 text-3xl font-bold tracking-tight">
            <MessageSquare className="h-6 w-6" />
            Chat with Assistants
          </h1>
          <p className="text-muted-foreground">
            Choose an assistant and conversation thread to start chatting
          </p>
        </div>
        <div className="flex items-center justify-center py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">
              Loading assistants and conversations...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!assistants || assistants.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="flex items-center gap-2 text-3xl font-bold tracking-tight">
            <MessageSquare className="h-6 w-6" />
            Chat with Assistants
          </h1>
          <p className="text-muted-foreground">
            Choose an assistant and conversation thread to start chatting
          </p>
        </div>
        <div className="flex items-center justify-center py-8">
          <div className="text-center">
            <p className="text-muted-foreground">No assistants available</p>
            <p className="text-sm text-muted-foreground mt-1">
              Please create an assistant first in the Assistant Builder
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="flex items-center gap-2 text-3xl font-bold tracking-tight">
          <MessageSquare className="h-6 w-6" />
          Chat with Assistants
        </h1>
        <p className="text-muted-foreground">
          Choose an assistant and conversation thread to start chatting
        </p>
      </div>

      <Tabs
        defaultValue="chat"
        className="w-full"
        value={activeTab}
        onValueChange={setActiveTab}
      >
        <TabsList className="grid w-[400px] grid-cols-3">
          <TabsTrigger value="chat">Chat</TabsTrigger>
          <TabsTrigger value="assistants">Assistants</TabsTrigger>
          <TabsTrigger value="threads">Conversations</TabsTrigger>
        </TabsList>

        <TabsContent value="chat" className="mt-4">
          {selectedAssistant && selectedThread ? (
            <ChatInterface
              assistantId={(selectedAssistant.id || selectedAssistant.ID)!}
              assistantName={
                (selectedAssistant.name || selectedAssistant.Name)!
              }
              threadId={selectedThread.id}
              threadDescription={
                selectedThread.description || "Untitled Conversation"
              }
            />
          ) : (
            <div className="flex items-center justify-center py-8">
              <div className="text-center">
                <p className="text-muted-foreground">
                  Please select an assistant and conversation thread to start
                  chatting
                </p>
                {!selectedAssistant && (
                  <p className="text-sm text-muted-foreground mt-1">
                    No assistant selected
                  </p>
                )}
                {!selectedThread && (
                  <p className="text-sm text-muted-foreground mt-1">
                    No conversation thread selected
                  </p>
                )}
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="assistants" className="mt-4">
          <AssistantSelector
            onAssistantSelect={setSelectedAssistantId}
            selectedAssistantId={selectedAssistantId}
          />
        </TabsContent>

        <TabsContent value="threads" className="mt-4">
          <ThreadSelector
            onThreadSelect={setSelectedThreadId}
            selectedThreadId={selectedThreadId}
            threads={threads}
            loading={threadsLoading}
            error={threadsError}
            refetchThreads={refetchThreads}
            onThreadCreated={handleThreadCreated}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
