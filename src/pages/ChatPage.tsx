import React, { useState } from "react";
import { ChatInterface } from "@/components/chat/ChatInterface";
import { ModelSelector } from "@/components/models/ModelSelector";
import { MODELS } from "@/lib/constants";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageSquare } from "lucide-react";

export function ChatPage() {
  const [selectedModelId, setSelectedModelId] = useState(MODELS[0].id);
  const selectedModel = MODELS.find((model) => model.id === selectedModelId) || MODELS[0];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="flex items-center gap-2 text-3xl font-bold tracking-tight">
          <MessageSquare className="h-6 w-6" />
          Chat with Models
        </h1>
        <p className="text-muted-foreground">
          Choose an AI model and start a conversation
        </p>
      </div>

      <Tabs defaultValue="chat" className="w-full">
        <TabsList className="grid w-[400px] grid-cols-2">
          <TabsTrigger value="chat">Chat</TabsTrigger>
          <TabsTrigger value="models">Models</TabsTrigger>
        </TabsList>

        <TabsContent value="chat" className="mt-4">
          <ChatInterface 
            modelId={selectedModel.id} 
            modelName={selectedModel.name} 
          />
        </TabsContent>

        <TabsContent value="models" className="mt-4">
          <ModelSelector
            onModelSelect={setSelectedModelId}
            selectedModelId={selectedModelId}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}