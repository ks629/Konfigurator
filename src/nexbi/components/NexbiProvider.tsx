'use client';

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { NexbiConfig, ChatMessage, NexbiEmotion, NexbiCostume } from '../engine/types';

interface NexbiContextValue {
  config: NexbiConfig;
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
  messages: ChatMessage[];
  addMessage: (msg: ChatMessage) => void;
  currentEmotion: NexbiEmotion;
  setEmotion: (emotion: NexbiEmotion) => void;
  currentCostume: NexbiCostume;
  setCostume: (costume: NexbiCostume) => void;
  isTyping: boolean;
  setIsTyping: (v: boolean) => void;
  hasInteracted: boolean;
  setHasInteracted: (v: boolean) => void;
  showLeadForm: boolean;
  setShowLeadForm: (v: boolean) => void;
  leadSubmitted: boolean;
  setLeadSubmitted: (v: boolean) => void;
  aiCallCount: number;
  incrementAiCalls: () => void;
}

const NexbiContext = createContext<NexbiContextValue | null>(null);

export function useNexbi() {
  const ctx = useContext(NexbiContext);
  if (!ctx) throw new Error('useNexbi must be used within NexbiProvider');
  return ctx;
}

interface Props {
  config: NexbiConfig;
  children: ReactNode;
}

export default function NexbiProvider({ config, children }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentEmotion, setCurrentEmotion] = useState<NexbiEmotion>('happy');
  const [currentCostume, setCurrentCostume] = useState<NexbiCostume>(config.defaultCostume ?? 'none');
  const [isTyping, setIsTyping] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [leadSubmitted, setLeadSubmitted] = useState(false);
  const [aiCallCount, setAiCallCount] = useState(0);

  const open = useCallback(() => {
    setIsOpen(true);
    setHasInteracted(true);
    config.onOpen?.();
  }, [config]);

  const close = useCallback(() => {
    setIsOpen(false);
    config.onClose?.();
  }, [config]);

  const toggle = useCallback(() => {
    if (isOpen) close();
    else open();
  }, [isOpen, open, close]);

  const addMessage = useCallback((msg: ChatMessage) => {
    setMessages(prev => [...prev, msg]);
    config.onMessage?.(msg);
  }, [config]);

  const setEmotion = useCallback((emotion: NexbiEmotion) => {
    setCurrentEmotion(emotion);
  }, []);

  const setCostume = useCallback((costume: NexbiCostume) => {
    setCurrentCostume(costume);
  }, []);

  const incrementAiCalls = useCallback(() => {
    setAiCallCount(prev => prev + 1);
  }, []);

  return (
    <NexbiContext.Provider value={{
      config,
      isOpen,
      open,
      close,
      toggle,
      messages,
      addMessage,
      currentEmotion,
      setEmotion,
      currentCostume,
      setCostume,
      isTyping,
      setIsTyping,
      hasInteracted,
      setHasInteracted,
      showLeadForm,
      setShowLeadForm,
      leadSubmitted,
      setLeadSubmitted,
      aiCallCount,
      incrementAiCalls,
    }}>
      {children}
    </NexbiContext.Provider>
  );
}
