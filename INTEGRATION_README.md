# MAI Frontend-Backend Integration

This document describes the integration between the MAI frontend (mai-web) and backend (mai) applications.

## Overview

The frontend has been successfully integrated with the backend API to provide real-time functionality for:

- **Model Management**: Fetch and display available AI models from the backend
- **Assistant Management**: Create, view, and manage AI assistants
- **Chat Interface**: Real-time chat with AI models through assistants
- **Thread Management**: Organize conversations in threads
- **Fine-tuning**: Upload training data and start fine-tuning processes

## Architecture

### Frontend Components Updated

1. **API Layer** (`src/lib/api.ts`)

   - Centralized API client with TypeScript interfaces
   - Error handling and retry logic
   - Support for all backend endpoints

2. **React Hooks** (`src/hooks/useApi.ts`)

   - Custom hooks for state management
   - Loading states and error handling
   - Automatic data fetching and caching

3. **Configuration** (`src/config/api.ts`)

   - Environment-based API URL configuration
   - Request configuration and endpoints

4. **Updated Components**:
   - `ChatInterface`: Real chat with backend AI models
   - `ModelSelector`: Displays actual models from backend
   - `AssistantPage`: Create and manage assistants
   - `FineTunePage`: Upload files and start fine-tuning
   - `ChatPage`: Model selection and chat interface

## Setup Instructions

### 1. Backend Setup

First, ensure your backend (mai) is running:

```bash
cd ../mai
pip install -r requirements.txt
python main.py
```

The backend should be running on `http://localhost:8000` by default.

### 2. Frontend Configuration

Update the API URL if your backend runs on a different port:

**Option A: Environment Variable**
Create a `.env` file in the frontend root:

```env
VITE_API_URL=http://localhost:8000
```

**Option B: Direct Configuration**
Edit `src/config/api.ts`:

```typescript
export const API_CONFIG = {
  BASE_URL: "http://your-backend-url:port",
  // ...
};
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Start Frontend

```bash
npm run dev
```

## Features Integrated

### 1. Model Management

- **Backend Endpoint**: `GET /models`
- **Frontend**: Dynamically loads and displays available models
- **Components**: `ModelSelector`, `ChatPage`

### 2. Assistant Management

- **Backend Endpoints**:
  - `GET /assistants` - List assistants
  - `POST /assistants` - Create assistant
  - `PUT /assistants/{id}` - Update assistant
  - `DELETE /assistants/{id}` - Delete assistant
- **Frontend**: Full CRUD operations for assistants
- **Components**: `AssistantPage`

### 3. Chat System

- **Backend Endpoints**:
  - `POST /chat` - Send chat message
  - `GET /threads` - List threads
  - `POST /threads` - Create thread
  - `GET /threads/{id}/messages` - Get thread messages
- **Frontend**: Real-time chat interface with thread management
- **Components**: `ChatInterface`, `ChatPage`

### 4. Fine-tuning

- **Backend Endpoint**: `POST /finetune`
- **Frontend**: File upload and fine-tuning initiation
- **Components**: `FineTunePage`

## API Integration Details

### Error Handling

- Network errors are caught and displayed to users
- Backend error messages are parsed and shown
- Loading states prevent multiple requests
- Retry logic for failed requests

### State Management

- React hooks manage API state
- Automatic refetching after mutations
- Optimistic updates for better UX
- Error boundaries for graceful failures

### Type Safety

- Full TypeScript interfaces for all API responses
- Type-safe API client methods
- Compile-time error checking

## Usage Examples

### Creating an Assistant

1. Navigate to "Build Assistant" page
2. Fill in assistant name and instructions
3. Select a model from the backend
4. Click "Save Assistant"
5. Assistant is created via `POST /assistants`

### Chatting with Models

1. Navigate to "Chat with Assistants" page
2. Select a model (loaded from `GET /models`)
3. Start typing messages
4. Messages are sent via `POST /chat` with thread management

### Fine-tuning Models

1. Navigate to "Fine-tune & Deploy" page
2. Enter new model name
3. Select base model
4. Upload training file
5. Start fine-tuning via `POST /finetune`

## Environment Variables

| Variable       | Description      | Default                 |
| -------------- | ---------------- | ----------------------- |
| `VITE_API_URL` | Backend API URL  | `http://localhost:8000` |
| `NODE_ENV`     | Environment mode | `development`           |

## Troubleshooting

### Common Issues

1. **"Unable to connect to backend server"**

   - Check if backend is running on correct port
   - Verify API URL in configuration
   - Check for CORS issues

2. **"No models available"**

   - Ensure backend has models configured
   - Check backend database connection
   - Verify `/models` endpoint returns data

3. **Chat not working**
   - Ensure assistants are created
   - Check if selected model exists in backend
   - Verify thread creation is working

### Debug Mode

Enable debug logging by opening browser console. All API requests and responses are logged.

## Development Notes

### Adding New API Endpoints

1. Add endpoint to `src/config/api.ts`:

```typescript
export const ENDPOINTS = {
  // existing endpoints...
  NEW_ENDPOINT: "/new-endpoint",
} as const;
```

2. Add method to API client (`src/lib/api.ts`):

```typescript
async newMethod(): Promise<ResponseType> {
  return this.request<ResponseType>(ENDPOINTS.NEW_ENDPOINT);
}
```

3. Create React hook (`src/hooks/useApi.ts`):

```typescript
export function useNewFeature() {
  return useApiState(() => apiClient.newMethod());
}
```

4. Use in components:

```typescript
const { data, loading, error } = useNewFeature();
```

### Backend API Requirements

The frontend expects the backend to:

- Return JSON responses
- Use standard HTTP status codes
- Include CORS headers for development
- Follow the API schema defined in the types

## Next Steps

Potential improvements:

- Real-time updates with WebSockets
- File upload progress tracking
- Advanced error recovery
- Caching strategies
- Authentication integration
- Pagination for large datasets

## Support

For issues related to:

- **Frontend**: Check browser console for errors
- **Backend**: Check backend logs and database connection
- **Integration**: Verify API endpoints match between frontend and backend
