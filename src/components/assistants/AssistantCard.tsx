import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bot, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface AssistantCardProps {
  id: number;
  name: string;
  goal: string;
  modelKey: string;
  isSelected: boolean;
  onSelect: (id: number) => void;
}

export function AssistantCard({
  id,
  name,
  goal,
  modelKey,
  isSelected,
  onSelect,
}: AssistantCardProps) {
  return (
    <Card
      className={cn(
        "cursor-pointer transition-all hover:shadow-md",
        isSelected && "ring-2 ring-primary"
      )}
      onClick={() => onSelect(id)}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-primary" />
            <CardTitle className="text-base">{name}</CardTitle>
          </div>
          {isSelected && <Check className="h-4 w-4 text-primary" />}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-muted-foreground line-clamp-2">{goal}</p>
        <div className="flex items-center justify-between">
          <Badge variant="secondary" className="text-xs">
            {modelKey}
          </Badge>
          <Button
            size="sm"
            variant={isSelected ? "default" : "outline"}
            onClick={(e) => {
              e.stopPropagation();
              onSelect(id);
            }}
          >
            {isSelected ? "Selected" : "Select"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
