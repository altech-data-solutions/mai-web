import React from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ModelCardProps {
  id: string;
  name: string;
  description: string;
  category: string;
  provider: string;
  isSelected?: boolean;
  onSelect?: (id: string) => void;
  className?: string;
}

export function ModelCard({
  id,
  name,
  description,
  category,
  provider,
  isSelected,
  onSelect,
  className,
}: ModelCardProps) {
  return (
    <Card
      className={cn(
        "transition-all hover:shadow-md",
        isSelected && "ring-2 ring-primary",
        className
      )}
    >
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-semibold">{name}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{description}</p>
          </div>
          <Badge
            variant={category === "Fine-tuned" ? "secondary" : "outline"}
            className="ml-2"
          >
            {category}
          </Badge>
        </div>
        <div className="mt-4">
          <Badge variant="outline">{provider}</Badge>
        </div>
      </CardContent>
      <CardFooter className="border-t p-4">
        <Button
          variant={isSelected ? "default" : "outline"}
          size="sm"
          className="ml-auto"
          onClick={() => onSelect?.(id)}
        >
          {isSelected ? "Selected" : "Select"}
        </Button>
      </CardFooter>
    </Card>
  );
}