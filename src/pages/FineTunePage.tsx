import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ModelSelector } from "@/components/models/ModelSelector";
import { Settings, Upload, Play, Plus, FileText } from "lucide-react";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useModels, useFineTune } from "@/hooks/useApi";
import { Model } from "@/lib/api";

export function FineTunePage() {
  const { data: models, loading: modelsLoading } = useModels();
  const {
    startFineTune,
    loading: fineTuneLoading,
    error: fineTuneError,
  } = useFineTune();

  const [selectedModelId, setSelectedModelId] = useState("");
  const [modelName, setModelName] = useState("");
  const [description, setDescription] = useState("");
  const [epochs, setEpochs] = useState(3);
  const [batchSize, setBatchSize] = useState(8);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Set default model when models are loaded
  useEffect(() => {
    if (models && models.length > 0 && !selectedModelId) {
      // Find a base model (not fine-tuned)
      const baseModel =
        models.find(
          (model: Model) =>
            !model.Key.includes("fine") && !model.Key.includes("custom")
        ) || models[0];
      setSelectedModelId(baseModel.Key);
    }
  }, [models, selectedModelId]);

  const baseModels =
    models?.filter(
      (model: Model) =>
        !model.Key.includes("fine") && !model.Key.includes("custom")
    ) || [];

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      const allowedTypes = [".csv", ".jsonl", ".txt", ".json"];
      const fileExtension = "." + file.name.split(".").pop()?.toLowerCase();

      if (!allowedTypes.includes(fileExtension)) {
        toast.error(
          "Invalid file type. Please upload CSV, JSONL, TXT, or JSON files."
        );
        return;
      }

      setSelectedFile(file);
      toast.success(`File selected: ${file.name}`);
    }
  };

  const handleStartTraining = async () => {
    if (!modelName.trim()) {
      toast.error("Please enter a model name");
      return;
    }

    if (!selectedModelId) {
      toast.error("Please select a base model");
      return;
    }

    if (!selectedFile) {
      toast.error("Please select a training file");
      return;
    }

    try {
      toast.info("Starting fine-tuning process...", {
        description: "This may take some time depending on your data size",
      });

      await startFineTune({
        base_model_id: selectedModelId,
        new_model_name: modelName,
        file: selectedFile,
      });

      toast.success("Fine-tuning started successfully!", {
        description: "You will be notified when the process is complete",
      });

      // Reset form
      setModelName("");
      setDescription("");
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      toast.error("Failed to start fine-tuning");
      console.error("Fine-tuning error:", error);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="flex items-center gap-2 text-3xl font-bold tracking-tight">
          <Settings className="h-6 w-6" />
          Fine-tune & Deploy
        </h1>
        <p className="text-muted-foreground">
          Train custom models on your data and deploy them for use
        </p>
      </div>

      <Tabs defaultValue="fine-tune" className="w-full">
        <TabsList className="grid w-[400px] grid-cols-2">
          <TabsTrigger value="fine-tune">Fine-tune</TabsTrigger>
          <TabsTrigger value="select-base">Select Base Model</TabsTrigger>
        </TabsList>

        <TabsContent value="fine-tune" className="mt-4 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Fine-tuning Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="model-name">New Model Name *</Label>
                <Input
                  id="model-name"
                  placeholder="my-custom-model"
                  value={modelName}
                  onChange={(e) => setModelName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="base-model">Base Model *</Label>
                {modelsLoading ? (
                  <div className="flex items-center gap-2 rounded-md border p-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                    <span className="text-muted-foreground">
                      Loading models...
                    </span>
                  </div>
                ) : (
                  <Select
                    value={selectedModelId}
                    onValueChange={setSelectedModelId}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select base model" />
                    </SelectTrigger>
                    <SelectContent>
                      {baseModels.map((model: Model) => (
                        <SelectItem key={model.Key} value={model.Key}>
                          {model.Key}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe what this fine-tuned model is specialized for..."
                  className="min-h-20"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Training Parameters</Label>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="epochs">Epochs</Label>
                    <Input
                      id="epochs"
                      type="number"
                      value={epochs}
                      onChange={(e) => setEpochs(Number(e.target.value))}
                      min={1}
                      max={10}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="batch-size">Batch Size</Label>
                    <Input
                      id="batch-size"
                      type="number"
                      value={batchSize}
                      onChange={(e) => setBatchSize(Number(e.target.value))}
                      min={1}
                      max={32}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Training Data</CardTitle>
            </CardHeader>
            <CardContent>
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv,.jsonl,.txt,.json"
                onChange={handleFileChange}
                style={{ display: "none" }}
              />

              <div
                className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={handleFileSelect}
              >
                <Upload className="mb-2 h-8 w-8 text-muted-foreground" />
                <p className="mb-1 text-sm font-medium">Upload Training Data</p>
                <p className="text-xs text-muted-foreground">
                  Accepts CSV, JSONL, TXT, or JSON files
                </p>
                <Button variant="outline" className="mt-4" type="button">
                  <Plus className="mr-2 h-4 w-4" />
                  Select Files
                </Button>
              </div>

              {selectedFile && (
                <div className="mt-4 p-3 bg-muted rounded-lg">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    <span className="text-sm font-medium">
                      {selectedFile.name}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      ({(selectedFile.size / 1024).toFixed(1)} KB)
                    </span>
                  </div>
                </div>
              )}

              {fineTuneError && (
                <div className="mt-4 text-sm text-destructive">
                  {fineTuneError}
                </div>
              )}

              <Button
                className="mt-6 w-full"
                onClick={handleStartTraining}
                disabled={
                  fineTuneLoading ||
                  !modelName ||
                  !selectedModelId ||
                  !selectedFile
                }
              >
                {fineTuneLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                    Starting Fine-tuning...
                  </>
                ) : (
                  <>
                    <Play className="mr-2 h-4 w-4" />
                    Start Fine-tuning
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="select-base" className="mt-4">
          <ModelSelector
            onModelSelect={setSelectedModelId}
            selectedModelId={selectedModelId}
            filter="llm"
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
