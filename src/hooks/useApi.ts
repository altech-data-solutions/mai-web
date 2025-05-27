/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useCallback } from 'react';
import {
  // Model,
  // Assistant,
  // Thread,
  // Message,
  ChatRequest,
  apiClient,
} from '@/lib/api';

// Generic hook for API state management
function useApiState<T>(
  apiCall: () => Promise<T>,
  dependencies: any[] = []
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiCall();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, dependencies);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}

// Models hooks
export function useModels() {
  return useApiState(() => apiClient.getModels());
}

// Assistants hooks
export function useAssistants() {
  return useApiState(() => apiClient.getAssistants());
}

export function useAssistant(id: number | null) {
  return useApiState(
    () => (id ? apiClient.getAssistant(id) : Promise.resolve(null)),
    [id]
  );  
}

export function useCreateAssistant() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createAssistant = useCallback(async (data: {
    name: string;
    goal: string;
    model_key: string;
  }) => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiClient.createAssistant(data);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create assistant';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { createAssistant, loading, error };
}

export function useUpdateAssistant() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateAssistant = useCallback(async (
    id: number,
    data: Partial<{
      name: string;
      goal: string;
      model_key: string;
    }>
  ) => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiClient.updateAssistant(id, data);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update assistant';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { updateAssistant, loading, error };
}

export function useDeleteAssistant() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteAssistant = useCallback(async (id: number) => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiClient.deleteAssistant(id);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete assistant';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { deleteAssistant, loading, error };
}

// Threads hooks
export function useThreads() {
  return useApiState(() => apiClient.getThreads());
}

export function useThread(id: number | null) {
  return useApiState(
    () => (id ? apiClient.getThread(id) : Promise.resolve(null)),
    [id]
  );
}

export function useCreateThread() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createThread = useCallback(async (description?: string) => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiClient.createThread(description);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create thread';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { createThread, loading, error };
}

// Messages hooks
export function useThreadMessages(threadId: number | null) {
  return useApiState(
    () => (threadId ? apiClient.getThreadMessages(threadId) : Promise.resolve([])),
    [threadId]
  );
}

// Chat hook
export function useChat() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = useCallback(async (request: ChatRequest) => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiClient.sendChatMessage(request);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to send message';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { sendMessage, loading, error };
}

// Fine-tuning hook
export function useFineTune() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startFineTune = useCallback(async (data: {
    base_model_id: string;
    new_model_name: string;
    file: File;
  }) => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiClient.startFineTune(data);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to start fine-tuning';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { startFineTune, loading, error };
} 