import { useState } from "react";
import { ModelCard } from "./ModelCard";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useModels } from "@/hooks/useApi";
import { Model } from "@/lib/api";

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
  const { data: models, loading, error } = useModels();

  // Convert backend models to frontend format and apply filtering
  const getFilteredModels = () => {
    if (!models || !Array.isArray(models)) return [];

    return models
      .filter((model: Model) => model && model.Key) // Filter out invalid models
      .map((model: Model) => ({
        id: model.Key,
        name: model.Key, // Use Key as the display name
        description: model.Description || "No description available",
        category:
          model.Key &&
          (model.Key.includes("fine") || model.Key.includes("custom"))
            ? "Fine-tuned"
            : "LLM",
        provider:
          model.Path && model.Path.includes("huggingface")
            ? "Hugging Face"
            : model.Path && model.Path.includes("openai")
            ? "OpenAI"
            : model.Path && model.Path.includes("anthropic")
            ? "Anthropic"
            : model.Path && model.Path.includes("meta")
            ? "Meta"
            : "Custom",
        path: model.Path || "",
      }))
      .filter((model) => {
        if (modelFilter === "all") return true;
        if (modelFilter === "llm") return model.category === "LLM";
        if (modelFilter === "fine-tuned")
          return model.category === "Fine-tuned";
        return true;
      });
  };

  const filteredModels = getFilteredModels();

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Select Model</h2>
        </div>
        <div className="flex items-center justify-center py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading models...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Select Model</h2>
        </div>
        <div className="flex items-center justify-center py-8">
          <div className="text-center">
            <p className="text-destructive mb-2">Failed to load models</p>
            <p className="text-sm text-muted-foreground">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (filteredModels.length === 0) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Select Model</h2>
          <Select
            value={modelFilter}
            onValueChange={(value: string) => setModelFilter(value)}
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
        <div className="flex items-center justify-center py-8">
          <div className="text-center">
            <p className="text-muted-foreground">No models available</p>
            <p className="text-sm text-muted-foreground mt-1">
              Try changing the filter or check if models are configured in the
              backend
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Select Model</h2>
        <Select
          value={modelFilter}
          onValueChange={(value: string) => setModelFilter(value)}
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
