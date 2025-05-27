import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ModelSelector } from "@/components/models/ModelSelector";
import { Bot, Save, Plus, Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  useModels,
  useCreateAssistant,
  useAssistants,
  useUpdateAssistant,
  useDeleteAssistant,
} from "@/hooks/useApi";
import { Assistant } from "@/lib/api";

interface AssistantConfig {
  name: string;
  description: string;
  instructions: string;
  modelId: string;
}

export function AssistantPage() {
  const { data: models, loading: modelsLoading } = useModels();
  const { data: assistants, refetch: refetchAssistants } = useAssistants();
  const {
    createAssistant,
    loading: createLoading,
    error: createError,
  } = useCreateAssistant();
  const {
    updateAssistant,
    loading: updateLoading,
    error: updateError,
  } = useUpdateAssistant();
  const {
    deleteAssistant,
    loading: deleteLoading,
    error: deleteError,
  } = useDeleteAssistant();

  const [selectedModelId, setSelectedModelId] = useState("");
  const [assistantConfig, setAssistantConfig] = useState<AssistantConfig>({
    name: "",
    description: "",
    instructions: "",
    modelId: "",
  });
  const [editingAssistant, setEditingAssistant] = useState<Assistant | null>(
    null
  );
  const [isEditing, setIsEditing] = useState(false);

  // Set default model when models are loaded
  useEffect(() => {
    if (models && models.length > 0 && !selectedModelId) {
      const defaultModel = models[0];
      setSelectedModelId(defaultModel.Key);
      setAssistantConfig((prev: AssistantConfig) => ({
        ...prev,
        modelId: defaultModel.Key,
      }));
    }
  }, [models, selectedModelId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setAssistantConfig((prev: AssistantConfig) => ({ ...prev, [name]: value }));
  };

  const handleModelSelect = (modelId: string) => {
    setSelectedModelId(modelId);
    setAssistantConfig((prev: AssistantConfig) => ({ ...prev, modelId }));
  };

  const handleSave = async () => {
    if (
      !assistantConfig.name ||
      !assistantConfig.instructions ||
      !selectedModelId
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      if (isEditing && editingAssistant) {
        // Update existing assistant
        await updateAssistant(editingAssistant.id || editingAssistant.ID!, {
          name: assistantConfig.name,
          goal: assistantConfig.instructions,
          model_key: selectedModelId,
        });
        toast.success("Assistant updated successfully");
      } else {
        // Create new assistant
        await createAssistant({
          name: assistantConfig.name,
          goal: assistantConfig.instructions, // Using instructions as goal
          model_key: selectedModelId,
        });

        toast.success("Assistant created successfully");
      }

      // Reset form
      setAssistantConfig({
        name: "",
        description: "",
        instructions: "",
        modelId: selectedModelId,
      });
      setIsEditing(false);
      setEditingAssistant(null);

      // Refresh assistants list
      refetchAssistants();
    } catch (error) {
      toast.error(
        isEditing ? "Failed to update assistant" : "Failed to create assistant"
      );
      console.error("Failed to save assistant:", error);
    }
  };

  const handleEdit = (assistant: Assistant) => {
    setEditingAssistant(assistant);
    setIsEditing(true);
    setAssistantConfig({
      name: assistant.name || assistant.Name || "",
      description: "", // Description not available in current API
      instructions: assistant.goal || assistant.Goal || "",
      modelId: assistant.model_key || assistant.ModelKey || "",
    });
    setSelectedModelId(assistant.model_key || assistant.ModelKey || "");
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditingAssistant(null);
    setAssistantConfig({
      name: "",
      description: "",
      instructions: "",
      modelId: selectedModelId,
    });
  };

  const handleDelete = async (assistant: Assistant) => {
    if (
      !confirm(
        `Are you sure you want to delete "${assistant.name || assistant.Name}"?`
      )
    ) {
      return;
    }

    try {
      await deleteAssistant(assistant.id || assistant.ID!);
      toast.success("Assistant deleted successfully");
      refetchAssistants();
    } catch (error) {
      toast.error("Failed to delete assistant");
      console.error("Failed to delete assistant:", error);
    }
  };

  const selectedModel = models?.find((model) => model.Key === selectedModelId);

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
        <TabsList className="grid w-[400px] grid-cols-3">
          <TabsTrigger value="config">Configuration</TabsTrigger>
          <TabsTrigger value="models">Choose Model</TabsTrigger>
          <TabsTrigger value="existing">Existing Assistants</TabsTrigger>
        </TabsList>

        <TabsContent value="config" className="mt-4 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>
                {isEditing
                  ? `Edit Assistant: ${
                      editingAssistant?.name || editingAssistant?.Name
                    }`
                  : "Assistant Details"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {isEditing && (
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
                  <p className="text-sm text-blue-800">
                    You are editing an existing assistant. Make your changes and
                    click "Update Assistant" to save.
                  </p>
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
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
                <Label htmlFor="instructions">Instructions *</Label>
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
                {modelsLoading ? (
                  <div className="flex items-center gap-2 rounded-md border p-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                    <span className="text-muted-foreground">
                      Loading models...
                    </span>
                  </div>
                ) : selectedModel ? (
                  <div className="flex items-center gap-2 rounded-md border p-2">
                    <span className="font-medium">{selectedModel.Name}</span>
                    <span className="text-xs text-muted-foreground">
                      {selectedModel.Key}
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 rounded-md border p-2">
                    <span className="text-muted-foreground">
                      No model selected
                    </span>
                  </div>
                )}
              </div>
              {(createError || updateError) && (
                <div className="text-sm text-destructive">
                  {createError || updateError}
                </div>
              )}
              <div className="flex gap-2">
                <Button
                  className="flex-1"
                  onClick={handleSave}
                  disabled={
                    !assistantConfig.name ||
                    !assistantConfig.instructions ||
                    !selectedModelId ||
                    createLoading ||
                    updateLoading
                  }
                >
                  {createLoading || updateLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                      {isEditing ? "Updating..." : "Creating..."}
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      {isEditing ? "Update Assistant" : "Save Assistant"}
                    </>
                  )}
                </Button>
                {isEditing && (
                  <Button
                    variant="outline"
                    onClick={handleCancelEdit}
                    disabled={createLoading || updateLoading}
                  >
                    Cancel
                  </Button>
                )}
              </div>
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
                  Feature coming soon - integrate with backend file upload
                </p>
                <Button variant="outline" className="mt-4" disabled>
                  Browse Files
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="models" className="mt-4">
          <ModelSelector
            onModelSelect={handleModelSelect}
            selectedModelId={selectedModelId}
          />
        </TabsContent>

        <TabsContent value="existing" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Existing Assistants</CardTitle>
            </CardHeader>
            <CardContent>
              {assistants && assistants.length > 0 ? (
                <div className="space-y-4">
                  {assistants.map((assistant: Assistant) => (
                    <div
                      key={assistant.id || assistant.ID}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div>
                        <h3 className="font-medium">
                          {assistant.name || assistant.Name}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {assistant.goal || assistant.Goal}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Model: {assistant.model_key || assistant.ModelKey}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(assistant)}
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(assistant)}
                          disabled={deleteLoading}
                        >
                          {deleteLoading ? (
                            <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-current mr-1"></div>
                          ) : (
                            <Trash2 className="h-4 w-4 mr-1" />
                          )}
                          Delete
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Bot className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">
                    No assistants created yet
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Create your first assistant using the Configuration tab
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
