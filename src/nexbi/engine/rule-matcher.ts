import type { KnowledgeEntry } from './types';

export interface MatchResult {
  entry: KnowledgeEntry;
  score: number;
  confidence: 'high' | 'medium' | 'low';
}

const HIGH_THRESHOLD = 6;
const LOW_THRESHOLD = 2;

function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

export function findBestMatch(
  query: string,
  knowledge: KnowledgeEntry[],
): MatchResult | null {
  const normalizedQuery = normalize(query);

  let bestMatch: KnowledgeEntry | null = null;
  let bestScore = 0;

  for (const entry of knowledge) {
    let score = 0;
    for (const keyword of entry.keywords) {
      const normalizedKeyword = normalize(keyword);
      if (normalizedQuery.includes(normalizedKeyword)) {
        score += normalizedKeyword.length;
      }
    }
    if (score > bestScore) {
      bestScore = score;
      bestMatch = entry;
    }
  }

  if (!bestMatch || bestScore < LOW_THRESHOLD) {
    return null;
  }

  return {
    entry: bestMatch,
    score: bestScore,
    confidence: bestScore >= HIGH_THRESHOLD ? 'high' : 'medium',
  };
}
