import { useState } from "react";
import { ThreadCard } from "@/components/threads/ThreadCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, MessageCircle } from "lucide-react";
import { useCreateThread } from "@/hooks/useApi";
import { Thread } from "@/lib/api";
import { toast } from "sonner";

interface ThreadSelectorProps {
  onThreadSelect: (threadId: number) => void;
  selectedThreadId?: number | null;
  threads?: Thread[] | null;
  loading?: boolean;
  error?: string | null;
  refetchThreads: () => Promise<void>;
  onThreadCreated?: (threadId: number) => void;
}

export function ThreadSelector({
  onThreadSelect,
  selectedThreadId,
  threads,
  loading,
  error,
  refetchThreads,
  onThreadCreated,
}: ThreadSelectorProps) {
  const { createThread, loading: creating } = useCreateThread();
  const [newThreadDescription, setNewThreadDescription] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);

  const handleCreateThread = async () => {
    if (!newThreadDescription.trim()) {
      toast.error("Please enter a description for the conversation");
      return;
    }

    try {
      const newThread = await createThread(newThreadDescription);
      setNewThreadDescription("");
      setShowCreateForm(false);
      onThreadSelect(newThread.id);
      await refetchThreads();
      toast.success("Conversation created successfully");
      if (onThreadCreated) {
        onThreadCreated(newThread.id);
      }
    } catch (error) {
      toast.error("Failed to create conversation");
      console.error("Failed to create thread:", error);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Select Conversation</h2>
        </div>
        <div className="flex items-center justify-center py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading conversations...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Select Conversation</h2>
        </div>
        <div className="flex items-center justify-center py-8">
          <div className="text-center">
            <p className="text-destructive mb-2">
              Failed to load conversations
            </p>
            <p className="text-sm text-muted-foreground">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Select Conversation</h2>
        <Button
          onClick={() => setShowCreateForm(!showCreateForm)}
          size="sm"
          variant="outline"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Conversation
        </Button>
      </div>

      {showCreateForm && (
        <div className="p-4 border rounded-lg bg-muted/50 space-y-3">
          <Input
            placeholder="Enter conversation description..."
            value={newThreadDescription}
            onChange={(e) => setNewThreadDescription(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleCreateThread();
              }
            }}
          />
          <div className="flex gap-2">
            <Button
              onClick={handleCreateThread}
              disabled={creating || !newThreadDescription.trim()}
              size="sm"
            >
              {creating ? "Creating..." : "Create"}
            </Button>
            <Button
              onClick={() => {
                setShowCreateForm(false);
                setNewThreadDescription("");
              }}
              variant="outline"
              size="sm"
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      {!threads || threads.length === 0 ? (
        <div className="flex items-center justify-center py-8">
          <div className="text-center">
            <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No conversations yet</p>
            <p className="text-sm text-muted-foreground mt-1">
              Create your first conversation to get started
            </p>
          </div>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {threads.map((thread: Thread) => (
            <ThreadCard
              key={thread.id}
              id={thread.id}
              description={thread.description || "Untitled Conversation"}
              createdAt={thread.created_at}
              isSelected={selectedThreadId === thread.id}
              onSelect={onThreadSelect}
            />
          ))}
        </div>
      )}
    </div>
  );
}
