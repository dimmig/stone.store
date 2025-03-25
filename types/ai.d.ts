declare module 'ai/react' {
  import { ChangeEvent, FormEvent } from 'react';

  interface ChatMessage {
    role: 'user' | 'assistant';
    content: string;
  }

  interface UseChatOptions {
    api: string;
    body?: Record<string, any>;
    onFinish?: (message: ChatMessage) => void;
    onError?: (error: Error) => void;
  }

  interface UseChatReturn {
    messages: ChatMessage[];
    input: string;
    handleInputChange: (e: ChangeEvent<HTMLInputElement>) => void;
    handleSubmit: (e: FormEvent<HTMLFormElement>) => void;
    isLoading: boolean;
    setMessages: (messages: ChatMessage[]) => void;
  }

  export function useChat(options: UseChatOptions): UseChatReturn;
} 