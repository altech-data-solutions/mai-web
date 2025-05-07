import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { APP_NAME } from "@/lib/constants";
import { Braces, ArrowRight, MessageSquare, Bot, Settings } from "lucide-react";
import { Link } from "react-router-dom";

export function HomePage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center text-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Welcome to {APP_NAME}
          </h1>
          <p className="text-muted-foreground">
            Your all-in-one AI platform for chat, assistant building, and model
            fine-tuning
          </p>
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-end">
          <Button asChild>
            <Link to="/chat">
              Start a Conversation
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="transition-all hover:shadow-md">
          <CardHeader className="flex flex-row items-center gap-2 pb-2">
            <MessageSquare className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">Chat with Models</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Choose from a variety of AI models to have conversations and get
              answers to your questions.
            </p>
            <Button asChild variant="outline" className="mt-4 w-full">
              <Link to="/chat">
                Go to Chat
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="transition-all hover:shadow-md">
          <CardHeader className="flex flex-row items-center gap-2 pb-2">
            <Bot className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">Build Assistant</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Create custom AI assistants with specific capabilities,
              instructions, and knowledge.
            </p>
            <Button asChild variant="outline" className="mt-4 w-full">
              <Link to="/assistant">
                Build Now
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="transition-all hover:shadow-md">
          <CardHeader className="flex flex-row items-center gap-2 pb-2">
            <Settings className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">Fine-tune Models</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Train and customize AI models on your specific data to improve
              performance for your use case.
            </p>
            <Button asChild variant="outline" className="mt-4 w-full">
              <Link to="/fine-tune">
                Start Fine-tuning
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Braces className="h-5 w-5" />
            Getting Started
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-lg border p-4">
                <h3 className="mb-2 font-medium">Quick Start Guide</h3>
                <p className="text-sm text-muted-foreground">
                  Learn the basics of {APP_NAME} in our comprehensive getting
                  started guide.
                </p>
                <Button variant="link" className="mt-2 h-auto p-0">
                  Read the guide
                </Button>
              </div>
              <div className="rounded-lg border p-4">
                <h3 className="mb-2 font-medium">API Documentation</h3>
                <p className="text-sm text-muted-foreground">
                  Explore our API documentation to integrate {APP_NAME} with
                  your applications.
                </p>
                <Button variant="link" className="mt-2 h-auto p-0">
                  View API docs
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
