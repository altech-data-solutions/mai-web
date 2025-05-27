import { useState } from "react";
import { AssistantCard } from "./AssistantCard";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAssistants } from "@/hooks/useApi";
import { Assistant } from "@/lib/api";

interface AssistantSelectorProps {
  onAssistantSelect: (assistantId: number) => void;
  selectedAssistantId?: number | null;
}

export function AssistantSelector({
  onAssistantSelect,
  selectedAssistantId,
}: AssistantSelectorProps) {
  const { data: assistants, loading, error } = useAssistants();

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Select Assistant</h2>
        </div>
        <div className="flex items-center justify-center py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading assistants...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Select Assistant</h2>
        </div>
        <div className="flex items-center justify-center py-8">
          <div className="text-center">
            <p className="text-destructive mb-2">Failed to load assistants</p>
            <p className="text-sm text-muted-foreground">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!assistants || assistants.length === 0) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Select Assistant</h2>
        </div>
        <div className="flex items-center justify-center py-8">
          <div className="text-center">
            <p className="text-muted-foreground">No assistants available</p>
            <p className="text-sm text-muted-foreground mt-1">
              Create an assistant first in the Assistant Builder
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Select Assistant</h2>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {assistants.map((assistant: Assistant) => (
          <AssistantCard
            key={assistant.id || assistant.ID}
            id={assistant.id || assistant.ID}
            name={assistant.name || assistant.Name}
            goal={assistant.goal || assistant.Goal}
            modelKey={assistant.model_key || assistant.ModelKey}
            isSelected={selectedAssistantId === (assistant.id || assistant.ID)}
            onSelect={onAssistantSelect}
          />
        ))}
      </div>
    </div>
  );
}
