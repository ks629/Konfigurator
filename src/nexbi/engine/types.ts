export type NexbiEmotion = 'happy' | 'curious' | 'teaching' | 'excited' | 'sleeping' | 'waving' | 'thinking';

export type NexbiCostume = 'none' | 'doradca' | 'naukowiec' | 'inzynier' | 'superhero' | 'ekolog' | 'nauczyciel';

export type PersonaId = 'konfigurator' | 'handlowiec' | 'contract' | 'arkusz' | 'landing' | 'mojprad';

export interface KnowledgeEntry {
  keywords: string[];
  question: string;
  answer: string;
  emotion: NexbiEmotion;
  followUp: string;
  scrollTarget?: string;
  showLeadPrompt?: boolean;
  suggestConfigurator?: boolean;
}

export interface ChatMessage {
  id: string;
  text: string;
  sender: 'nexbi' | 'user';
  emotion?: NexbiEmotion;
  costume?: NexbiCostume;
  followUp?: string;
  scrollTarget?: string;
  suggestions?: QuickSuggestion[];
  suggestConfigurator?: boolean;
}

export interface QuickSuggestion {
  label: string;
  icon: string;
}

export interface LeadData {
  phone: string;
  name?: string;
  consent: boolean;
  persona: PersonaId;
  timestamp: string;
}

export interface LeadFormField {
  name: string;
  type: 'text' | 'tel' | 'email';
  placeholder: string;
  required: boolean;
}

export interface NexbiConfig {
  persona: PersonaId;
  subtitle?: string;
  greeting: string;
  suggestions: QuickSuggestion[];
  fallbackMessage: KnowledgeEntry;
  leadPromptMessages: string[];
  inputPlaceholder?: string;
  bubbleText?: string;
  bubbleDelay?: number;
  position?: 'bottom-right' | 'bottom-left';
  enableLeadForm?: boolean;
  leadFormFields?: LeadFormField[];
  enableScrollTo?: boolean;
  enableSuggestConfigurator?: boolean;
  phoneNumber?: string;
  configuratorUrl?: string;
  apiEndpoint?: string;
  enableAiFallback?: boolean;
  confidenceThreshold?: number;
  maxAiCallsPerSession?: number;
  systemPrompt?: string;
  dynamicCostumes?: boolean;
  defaultCostume?: NexbiCostume;
  onLeadSubmit?: (lead: LeadData) => Promise<void>;
  onMessage?: (message: ChatMessage) => void;
  onOpen?: () => void;
  onClose?: () => void;
}

export interface PersonaConfig extends NexbiConfig {
  knowledge: KnowledgeEntry[];
}

export interface AiChatRequest {
  message: string;
  persona: PersonaId;
  history: Pick<ChatMessage, 'text' | 'sender'>[];
}

export interface AiChatResponse {
  answer: string;
  emotion: NexbiEmotion;
  followUp?: string;
  suggestExpert?: boolean;
}
