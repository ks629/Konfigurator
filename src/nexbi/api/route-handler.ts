import { getPersona } from '../personas';
import type { AiChatRequest, PersonaId } from '../engine/types';

interface NexbiApiOptions {
  apiKey: string;
  model?: string;
  maxTokens?: number;
  allowedPersonas?: PersonaId[];
}

const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 20;
const RATE_WINDOW = 60 * 60 * 1000; // 1 hour

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW });
    return true;
  }

  if (entry.count >= RATE_LIMIT) return false;

  entry.count++;
  return true;
}

export function createNexbiChatHandler(options: NexbiApiOptions) {
  return async function POST(req: Request) {
    try {
      const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
        || req.headers.get('x-real-ip')
        || 'unknown';

      if (!checkRateLimit(ip)) {
        return Response.json(
          { error: 'Rate limit exceeded. Try again later.' },
          { status: 429 },
        );
      }

      const body: AiChatRequest = await req.json();

      if (!body.message || !body.persona) {
        return Response.json(
          { error: 'Missing required fields: message, persona' },
          { status: 400 },
        );
      }

      if (options.allowedPersonas && !options.allowedPersonas.includes(body.persona)) {
        return Response.json(
          { error: 'Persona not allowed for this endpoint' },
          { status: 403 },
        );
      }

      const persona = getPersona(body.persona);
      const systemPrompt = persona.systemPrompt || 'Jesteś NEXBI — asystentem NEXBE. Odpowiadaj po polsku, krótko i konkretnie.';

      const messages = [
        ...(body.history || []).slice(-5).map(m => ({
          role: m.sender === 'nexbi' ? 'assistant' : 'user',
          content: m.text,
        })),
        { role: 'user', content: body.message },
      ];

      const anthropicResponse = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': options.apiKey,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: options.model || 'claude-3-haiku-20240307',
          max_tokens: options.maxTokens || 300,
          system: systemPrompt,
          messages,
        }),
      });

      if (!anthropicResponse.ok) {
        const errorText = await anthropicResponse.text();
        console.error('Anthropic API error:', errorText);
        return Response.json(
          { error: 'AI service unavailable' },
          { status: 502 },
        );
      }

      const data = await anthropicResponse.json();
      const answerText = data.content?.[0]?.text || 'Przepraszam, nie udało mi się odpowiedzieć.';

      return Response.json({
        answer: answerText,
        emotion: 'curious',
        followUp: undefined,
        suggestExpert: true,
      });
    } catch (error) {
      console.error('NEXBI chat error:', error);
      return Response.json(
        { error: 'Internal server error' },
        { status: 500 },
      );
    }
  };
}
