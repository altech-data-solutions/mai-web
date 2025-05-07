import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { ModelSelector } from "@/components/models/ModelSelector";
import { MODELS } from "@/lib/constants";
import { Settings, Upload, Play, Plus } from "lucide-react";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

export function FineTunePage() {
  const [selectedModelId, setSelectedModelId] = useState(MODELS[0].id);
  const [trainingProgress, setTrainingProgress] = useState(0);
  const [isTraining, setIsTraining] = useState(false);

  const baseModels = MODELS.filter(model => model.category === "LLM");

  const handleStartTraining = () => {
    setIsTraining(true);
    setTrainingProgress(0);
    
    toast.info("Fine-tuning started", {
      description: "This process may take some time",
    });
    
    // Simulate training progress
    const interval = setInterval(() => {
      setTrainingProgress((prev) => {
        const newValue = prev + 10;
        if (newValue >= 100) {
          clearInterval(interval);
          setIsTraining(false);
          toast.success("Fine-tuning completed successfully!");
          return 100;
        }
        return newValue;
      });
    }, 1000);
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
                <Label htmlFor="model-name">New Model Name</Label>
                <Input
                  id="model-name"
                  placeholder="my-custom-model"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="base-model">Base Model</Label>
                <Select defaultValue={baseModels[0].id}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select base model" />
                  </SelectTrigger>
                  <SelectContent>
                    {baseModels.map(model => (
                      <SelectItem key={model.id} value={model.id}>
                        {model.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe what this fine-tuned model is specialized for..."
                  className="min-h-20"
                />
              </div>
              <div className="space-y-2">
                <Label>Training Parameters</Label>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="epochs">Epochs</Label>
                    <Input id="epochs" type="number" defaultValue={3} min={1} max={10} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="batch-size">Batch Size</Label>
                    <Input id="batch-size" type="number" defaultValue={8} min={1} max={32} />
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
              <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8">
                <Upload className="mb-2 h-8 w-8 text-muted-foreground" />
                <p className="mb-1 text-sm font-medium">
                  Upload Training Data
                </p>
                <p className="text-xs text-muted-foreground">
                  Accepts CSV, JSONL, or TXT files
                </p>
                <Button variant="outline" className="mt-4">
                  <Plus className="mr-2 h-4 w-4" />
                  Select Files
                </Button>
              </div>

              {isTraining && (
                <div className="mt-6 space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Training Progress</Label>
                    <span className="text-xs font-medium">{trainingProgress}%</span>
                  </div>
                  <Progress value={trainingProgress} />
                </div>
              )}

              <Button
                className="mt-6 w-full"
                onClick={handleStartTraining}
                disabled={isTraining}
              >
                <Play className="mr-2 h-4 w-4" />
                {isTraining ? "Training..." : "Start Fine-tuning"}
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