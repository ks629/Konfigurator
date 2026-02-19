import { createNexbiChatHandler } from '@/nexbi/api/route-handler';

const handler = createNexbiChatHandler({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
  model: process.env.NEXBI_MODEL || 'claude-3-haiku-20240307',
  maxTokens: 300,
  allowedPersonas: ['konfigurator'],
});

export const POST = handler;
