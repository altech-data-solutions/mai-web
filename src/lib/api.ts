/* eslint-disable @typescript-eslint/no-explicit-any */
import { getApiUrl, REQUEST_CONFIG, ENDPOINTS } from '@/config/api';

// Types based on backend API
export interface Model {
  Key: string;
  Path: string;
  Description?: string;
}

export interface Assistant {
  id: number;
  name: string;
  goal: string;
  model_key: string;
  created_at?: string;
  // Keep the old format for backward compatibility
  ID?: number;
  Name?: string;
  Goal?: string;
  ModelKey?: string;
  CreatedAt?: string;
}

export interface Thread {
  id: number;
  description: string | null;
  created_at: string;
}

export interface Message {
  ID: number;
  ThreadID: number;
  Role: 'user' | 'assistant';
  Content: string;
  AssistantID?: number;
  CreatedAt: string;
}

export interface ChatRequest {
  thread_id: number;
  assistant_id?: number;
  assistant_name?: string;
  prompt: string;
}

export interface ChatResponse {
  reply: string;
}

// API client class
class ApiClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = getApiUrl();
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const config: RequestInit = {
      ...REQUEST_CONFIG,
      ...options,
      headers: {
        ...REQUEST_CONFIG.headers,
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage = `HTTP error! status: ${response.status}`;
        
        try {
          const errorJson = JSON.parse(errorText);
          errorMessage = errorJson.detail || errorJson.message || errorMessage;
        } catch {
          // If not JSON, use the text as error message
          errorMessage = errorText || errorMessage;
        }
        
        throw new Error(errorMessage);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`API request failed: ${endpoint}`, error);
      
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Unable to connect to the backend server. Please check if the server is running.');
      }
      
      throw error;
    }
  }

  // Models API
  async getModels(): Promise<Model[]> {
    return this.request<Model[]>(ENDPOINTS.MODELS);
  }

  // Assistants API
  async getAssistants(): Promise<Assistant[]> {
    return this.request<Assistant[]>(ENDPOINTS.ASSISTANTS);
  }

  async getAssistant(id: number): Promise<Assistant> {
    return this.request<Assistant>(`${ENDPOINTS.ASSISTANTS}/${id}`);
  }

  async createAssistant(data: {
    name: string;
    goal: string;
    model_key: string;
  }): Promise<Assistant> {
    return this.request<Assistant>(ENDPOINTS.ASSISTANTS, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateAssistant(
    id: number,
    data: Partial<{
      name: string;
      goal: string;
      model_key: string;
    }>
  ): Promise<Assistant> {
    return this.request<Assistant>(`${ENDPOINTS.ASSISTANTS}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteAssistant(id: number): Promise<{ success: boolean }> {
    return this.request<{ success: boolean }>(`${ENDPOINTS.ASSISTANTS}/${id}`, {
      method: 'DELETE',
    });
  }

  // Threads API
  async getThreads(): Promise<Thread[]> {
    return this.request<Thread[]>(ENDPOINTS.THREADS);
  }

  async getThread(id: number): Promise<Thread> {
    return this.request<Thread>(`${ENDPOINTS.THREADS}/${id}`);
  }

  async createThread(description?: string): Promise<Thread> {
    return this.request<Thread>(ENDPOINTS.THREADS, {
      method: 'POST',
      body: JSON.stringify({ description }),
    });
  }

  async updateThread(id: number, description: string): Promise<Thread> {
    return this.request<Thread>(`${ENDPOINTS.THREADS}/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ description }),
    });
  }

  async deleteThread(id: number): Promise<{ success: boolean }> {
    return this.request<{ success: boolean }>(`${ENDPOINTS.THREADS}/${id}`, {
      method: 'DELETE',
    });
  }

  // Messages API
  async getThreadMessages(threadId: number): Promise<Message[]> {
    return this.request<Message[]>(`${ENDPOINTS.THREADS}/${threadId}/messages`);
  }

  // Chat API
  async sendChatMessage(request: ChatRequest): Promise<ChatResponse> {
    return this.request<ChatResponse>(ENDPOINTS.CHAT, {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  // Fine-tuning API
  async startFineTune(data: {
    base_model_id: string;
    new_model_name: string;
    file: File;
  }): Promise<any> {
    const formData = new FormData();
    formData.append('base_model_id', data.base_model_id);
    formData.append('new_model_name', data.new_model_name);
    formData.append('file', data.file);

    const url = `${this.baseUrl}${ENDPOINTS.FINETUNE}`;
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        body: formData,
        credentials: 'include' as RequestCredentials,
        // Don't set Content-Type header - let browser set it for FormData
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage = `HTTP error! status: ${response.status}`;
        
        try {
          const errorJson = JSON.parse(errorText);
          errorMessage = errorJson.detail || errorJson.message || errorMessage;
        } catch {
          errorMessage = errorText || errorMessage;
        }
        
        throw new Error(errorMessage);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`API request failed: ${ENDPOINTS.FINETUNE}`, error);
      throw error;
    }
  }
}

// Export singleton instance
export const apiClient = new ApiClient();

// Export individual API functions for convenience
export const {
  getModels,
  getAssistants,
  getAssistant,
  createAssistant,
  updateAssistant,
  deleteAssistant,
  getThreads,
  getThread,
  createThread,
  updateThread,
  deleteThread,
  getThreadMessages,
  sendChatMessage,
  startFineTune,
} = apiClient; 