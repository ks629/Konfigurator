import { findBestMatch } from './rule-matcher';
import { callAiFallback } from './ai-fallback';
import type { KnowledgeEntry, ChatMessage, PersonaId, AiChatResponse } from './types';

interface ProcessOptions {
  knowledge: KnowledgeEntry[];
  fallbackMessage: KnowledgeEntry;
  persona: PersonaId;
  history: Pick<ChatMessage, 'text' | 'sender'>[];
  enableAiFallback: boolean;
  apiEndpoint: string;
  confidenceThreshold: number;
}

interface ProcessResult {
  answer: string;
  emotion: KnowledgeEntry['emotion'];
  followUp?: string;
  scrollTarget?: string;
  showLeadPrompt?: boolean;
  suggestConfigurator?: boolean;
  source: 'rule' | 'ai' | 'fallback';
}

export async function processMessage(
  query: string,
  options: ProcessOptions,
): Promise<ProcessResult> {
  const match = findBestMatch(query, options.knowledge);

  if (match && match.confidence === 'high') {
    return {
      answer: match.entry.answer,
      emotion: match.entry.emotion,
      followUp: match.entry.followUp,
      scrollTarget: match.entry.scrollTarget,
      showLeadPrompt: match.entry.showLeadPrompt,
      suggestConfigurator: match.entry.suggestConfigurator,
      source: 'rule',
    };
  }

  if (match && match.confidence === 'medium' && !options.enableAiFallback) {
    return {
      answer: match.entry.answer,
      emotion: match.entry.emotion,
      followUp: match.entry.followUp,
      scrollTarget: match.entry.scrollTarget,
      showLeadPrompt: match.entry.showLeadPrompt,
      suggestConfigurator: match.entry.suggestConfigurator,
      source: 'rule',
    };
  }

  if (options.enableAiFallback && (!match || match.score < options.confidenceThreshold)) {
    try {
      const aiResponse: AiChatResponse = await callAiFallback(
        {
          message: query,
          persona: options.persona,
          history: options.history.slice(-5),
        },
        options.apiEndpoint,
      );
      return {
        answer: aiResponse.answer,
        emotion: aiResponse.emotion,
        followUp: aiResponse.followUp,
        suggestConfigurator: aiResponse.suggestExpert,
        source: 'ai',
      };
    } catch {
      // AI failed, fall through to rule match or fallback
    }
  }

  if (match) {
    return {
      answer: match.entry.answer,
      emotion: match.entry.emotion,
      followUp: match.entry.followUp,
      scrollTarget: match.entry.scrollTarget,
      showLeadPrompt: match.entry.showLeadPrompt,
      suggestConfigurator: match.entry.suggestConfigurator,
      source: 'rule',
    };
  }

  return {
    answer: options.fallbackMessage.answer,
    emotion: options.fallbackMessage.emotion,
    followUp: options.fallbackMessage.followUp,
    scrollTarget: options.fallbackMessage.scrollTarget,
    showLeadPrompt: options.fallbackMessage.showLeadPrompt,
    suggestConfigurator: options.fallbackMessage.suggestConfigurator,
    source: 'fallback',
  };
}
