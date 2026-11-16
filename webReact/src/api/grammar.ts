import { apiGet } from './client.ts'

export interface GrammarExample {
  en: string
  zh: string
  note?: string | null
}

export interface GrammarSection {
  id: string
  topic: string
  title: string
  en: string
  level: string
  summary: string
  points: string[]
  examples: GrammarExample[]
}

/** GET /api/grammar?topic=xxx —— 某个主题下的语法条目，按难度排序 */
export function fetchGrammarSections(topic: string, signal?: AbortSignal): Promise<GrammarSection[]> {
  const query = topic ? `?topic=${encodeURIComponent(topic)}` : ''
  return apiGet<GrammarSection[]>(`/api/grammar${query}`, signal)
}
