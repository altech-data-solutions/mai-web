export const APP_NAME = "MAI.ai";

export const NAVIGATION_ITEMS = [
  {
    title: "Home",
    href: "/",
    icon: "home",
  },
  {
    title: "Chat with Models",
    href: "/chat",
    icon: "message-square",
  },
  {
    title: "Build Assistant",
    href: "/assistant",
    icon: "bot",
  },
  {
    title: "Fine-tune & Deploy",
    href: "/fine-tune",
    icon: "settings",
  },
];

export const MODELS = [
  {
    id: "gpt-4",
    name: "GPT-4",
    description: "Most capable model for complex tasks",
    category: "LLM",
    provider: "OpenAI",
  },
  {
    id: "claude-3",
    name: "Claude 3",
    description: "Balanced model with strong reasoning",
    category: "LLM",
    provider: "Anthropic",
  },
  {
    id: "llama-3",
    name: "Llama 3",
    description: "Open-source model with broad capabilities",
    category: "LLM",
    provider: "Meta",
  },
  {
    id: "custom-legal",
    name: "Legal Assistant",
    description: "Fine-tuned for legal document analysis",
    category: "Fine-tuned",
    provider: "Custom",
  },
  {
    id: "custom-medical",
    name: "Medical Assistant",
    description: "Specialized for medical information",
    category: "Fine-tuned",
    provider: "Custom",
  },
];