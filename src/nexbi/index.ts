// Components
export { default as NexbiCharacter } from './components/NexbiCharacter';
export { default as NexbiProvider, useNexbi } from './components/NexbiProvider';
export { default as NexbiWidget } from './components/NexbiWidget';

// Engine
export { findBestMatch } from './engine/rule-matcher';
export { processMessage } from './engine/message-processor';
export { callAiFallback } from './engine/ai-fallback';

// Types
export type {
  NexbiEmotion,
  NexbiCostume,
  PersonaId,
  NexbiConfig,
  PersonaConfig,
  KnowledgeEntry,
  ChatMessage,
  QuickSuggestion,
  LeadData,
  AiChatRequest,
  AiChatResponse,
} from './engine/types';

// Personas
export { getPersona, konfiguratorPersona, handlowiecPersona, contractPersona, arkuszPersona } from './personas';

// Knowledge
export { SHARED_KNOWLEDGE } from './knowledge/shared-base';
export { KONFIGURATOR_KNOWLEDGE } from './knowledge/konfigurator-advisor';
export { HANDLOWIEC_KNOWLEDGE } from './knowledge/handlowiec-assistant';
export { CONTRACT_KNOWLEDGE } from './knowledge/contract-assistant';
export { ARKUSZ_KNOWLEDGE } from './knowledge/arkusz-installer';

// API
export { createNexbiChatHandler } from './api/route-handler';
