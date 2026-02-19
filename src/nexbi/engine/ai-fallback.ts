import type { AiChatRequest, AiChatResponse, NexbiEmotion } from './types';

export async function callAiFallback(
  request: AiChatRequest,
  endpoint: string,
): Promise<AiChatResponse> {
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  });

  if (!res.ok) {
    throw new Error(`NEXBI AI error: ${res.status}`);
  }

  const data = await res.json();

  return {
    answer: data.answer || 'Przepraszam, nie udało mi się przetworzyć odpowiedzi.',
    emotion: (data.emotion as NexbiEmotion) || 'curious',
    followUp: data.followUp,
    suggestExpert: data.suggestExpert,
  };
}
