import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ModelSelector } from "@/components/models/ModelSelector";
import { MODELS } from "@/lib/constants";
import { Bot, Save, Plus } from "lucide-react";
import { toast } from "sonner";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

interface AssistantConfig {
  name: string;
  description: string;
  instructions: string;
  modelId: string;
}

export function AssistantPage() {
  const [selectedModelId, setSelectedModelId] = useState(MODELS[0].id);
  const [assistantConfig, setAssistantConfig] = useState<AssistantConfig>({
    name: "",
    description: "",
    instructions: "",
    modelId: selectedModelId,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setAssistantConfig((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    // Here you would actually save the assistant configuration
    // This is just a mock for the demo
    toast.success("Assistant created successfully");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="flex items-center gap-2 text-3xl font-bold tracking-tight">
          <Bot className="h-6 w-6" />
          Build Assistant
        </h1>
        <p className="text-muted-foreground">
          Create a custom AI assistant with specific capabilities
        </p>
      </div>

      <Tabs defaultValue="config" className="w-full">
        <TabsList className="grid w-[400px] grid-cols-2">
          <TabsTrigger value="config">Configuration</TabsTrigger>
          <TabsTrigger value="models">Choose Model</TabsTrigger>
        </TabsList>

        <TabsContent value="config" className="mt-4 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Assistant Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="My Assistant"
                  value={assistantConfig.name}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  name="description"
                  placeholder="A brief description of what the assistant does"
                  value={assistantConfig.description}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="instructions">Instructions</Label>
                <Textarea
                  id="instructions"
                  name="instructions"
                  placeholder="Detailed instructions for the assistant..."
                  className="min-h-32"
                  value={assistantConfig.instructions}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label>Selected Model</Label>
                <div className="flex items-center gap-2 rounded-md border p-2">
                  <span className="font-medium">
                    {MODELS.find((m) => m.id === selectedModelId)?.name}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {selectedModelId}
                  </span>
                </div>
              </div>
              <Button
                className="mt-4 w-full"
                onClick={handleSave}
                disabled={
                  !assistantConfig.name ||
                  !assistantConfig.instructions ||
                  !selectedModelId
                }
              >
                <Save className="mr-2 h-4 w-4" />
                Save Assistant
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Knowledge Files</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8">
                <Plus className="mb-2 h-8 w-8 text-muted-foreground" />
                <p className="mb-1 text-sm font-medium">
                  Upload Knowledge Files
                </p>
                <p className="text-xs text-muted-foreground">
                  Drag and drop files or click to browse
                </p>
                <Button variant="outline" className="mt-4">
                  Browse Files
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="models" className="mt-4">
          <ModelSelector
            onModelSelect={(id) => {
              setSelectedModelId(id);
              setAssistantConfig((prev) => ({ ...prev, modelId: id }));
            }}
            selectedModelId={selectedModelId}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}