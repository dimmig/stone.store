'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Bot, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useChat } from 'ai/react';
import { cn } from '@/lib/utils';

const springTransition = {
  type: "spring",
  stiffness: 300,
  damping: 25
};

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const {
    input,
    handleInputChange,
    handleSubmit: originalHandleSubmit,
    messages: chatMessages,
    isLoading: isStreaming,
  } = useChat({
    api: '/api/chat/messages',
    body: { sessionId }
  });

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [chatMessages]);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  const createNewSession = async () => {
    try {
      const response = await fetch('/api/chat/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: 'New Chat' }),
      });
      if (!response.ok) return null;
      const data = await response.json();
      setSessionId(data.id);
      return data.id;
    } catch {
      return null;
    }
  };

  const handleOpenChat = async () => {
    if (!sessionId) {
      const newSessionId = await createNewSession();
      if (!newSessionId) return;
    }
    setIsOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    if (!sessionId) {
      const newSessionId = await createNewSession();
      if (!newSessionId) return;
      setSessionId(newSessionId);
    }
    
    await originalHandleSubmit(e);
  };

  return (
    <>
      <motion.button
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleOpenChat}
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[60] flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-full bg-black text-white shadow-lg hover:bg-black/90 transition-colors duration-200"
      >
        <MessageSquare className="h-5 w-5 sm:h-6 sm:w-6" />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0, transition: springTransition }}
            exit={{ opacity: 0, y: 20, transition: { duration: 0.2 } }}
            className="fixed bottom-20 right-4 sm:bottom-24 sm:right-6 z-50 w-full max-w-[calc(100vw-32px)] sm:max-w-[400px] bg-white shadow-2xl rounded-3xl border border-black/5"
          >
            <div className="flex items-center justify-between p-4 bg-black sm:rounded-t-3xl">
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0 w-9 h-9 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
                  <Bot className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-white">Stone Store AI</h3>
                  <p className="text-[11px] text-white/70">AI Assistant</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="h-8 w-8 rounded-full text-white hover:bg-white/10"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <ScrollArea 
              ref={scrollRef} 
              className="h-[min(65vh,450px)] px-4 py-4 overflow-y-auto scrollbar-thin scrollbar-thumb-black/10 scrollbar-track-transparent"
            >
              <div className="space-y-4">
                {chatMessages.map((message, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className={cn(
                      'flex items-end gap-2',
                      message.role === 'user' ? 'justify-end' : 'justify-start'
                    )}
                  >
                    {message.role === 'assistant' && (
                      <div className="flex-shrink-0 w-6 h-6 mb-1 rounded-full bg-black flex items-center justify-center">
                        <Bot className="h-3.5 w-3.5 text-white" />
                      </div>
                    )}
                    <div
                      className={cn(
                        'rounded-2xl px-3 py-2 text-sm shadow-sm max-w-[85%]',
                        message.role === 'user'
                          ? 'bg-black text-white rounded-br-sm'
                          : 'bg-zinc-100 rounded-bl-sm text-black'
                      )}
                    >
                      <p className="leading-relaxed whitespace-pre-wrap break-words">
                        {message.content}
                      </p>
                    </div>
                    {message.role === 'user' && (
                      <div className="flex-shrink-0 w-6 h-6 mb-1 rounded-full bg-black flex items-center justify-center">
                        <User className="h-3.5 w-3.5 text-white" />
                      </div>
                    )}
                  </motion.div>
                ))}
                {isStreaming && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-end gap-2"
                  >
                    <div className="flex-shrink-0 w-6 h-6 mb-1 rounded-full bg-black flex items-center justify-center">
                      <Bot className="h-3.5 w-3.5 text-white" />
                    </div>
                    <div className="bg-zinc-100 rounded-2xl rounded-tl-sm px-3 py-2 shadow-sm">
                      <div className="flex gap-1">
                        {[0, 1, 2].map((i) => (
                          <motion.div
                            key={i}
                            animate={{ scale: [0.5, 1, 0.5], opacity: [0.3, 0.6, 0.3] }}
                            transition={{ 
                              repeat: Infinity,
                              duration: 1,
                              delay: i * 0.2,
                              ease: "easeInOut"
                            }}
                            className="w-1.5 h-1.5 rounded-full bg-black/40"
                          />
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </ScrollArea>

            <div className="border-t border-black/5 p-4 bg-white sm:rounded-b-3xl">
              <form onSubmit={handleSubmit} className="relative">
                <Input
                  ref={inputRef}
                  value={input}
                  onChange={handleInputChange}
                  placeholder="Type your message..."
                  disabled={isStreaming}
                  className="pr-12 rounded-full border-zinc-200 focus:border-black focus:ring-black placeholder-zinc-400 bg-zinc-50 text-sm"
                />
                <Button
                  type="submit"
                  disabled={isStreaming || !input.trim()}
                  className="absolute right-1 top-1 h-7 w-7 rounded-full bg-black p-0 hover:bg-black/90 disabled:bg-zinc-300 transition-colors duration-200"
                >
                  <Send className="h-3.5 w-3.5 text-white" />
                </Button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
} 