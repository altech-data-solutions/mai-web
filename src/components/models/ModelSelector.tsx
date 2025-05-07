import React, { useState } from "react";
import { MODELS } from "@/lib/constants";
import { ModelCard } from "./ModelCard";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ModelSelectorProps {
  onModelSelect: (modelId: string) => void;
  selectedModelId?: string;
  filter?: "all" | "llm" | "fine-tuned";
}

export function ModelSelector({
  onModelSelect,
  selectedModelId,
  filter = "all",
}: ModelSelectorProps) {
  const [modelFilter, setModelFilter] = useState<string>(filter);

  const filteredModels = MODELS.filter((model) => {
    if (modelFilter === "all") return true;
    if (modelFilter === "llm") return model.category === "LLM";
    if (modelFilter === "fine-tuned") return model.category === "Fine-tuned";
    return true;
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Select Model</h2>
        <Select
          value={modelFilter}
          onValueChange={(value) => setModelFilter(value)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter models" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Models</SelectItem>
            <SelectItem value="llm">Base LLMs</SelectItem>
            <SelectItem value="fine-tuned">Fine-tuned Models</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredModels.map((model) => (
          <ModelCard
            key={model.id}
            id={model.id}
            name={model.name}
            description={model.description}
            category={model.category}
            provider={model.provider}
            isSelected={selectedModelId === model.id}
            onSelect={onModelSelect}
          />
        ))}
      </div>
    </div>
  );
}