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

/** 目录里的一个主题，sectionCount 由后端统计语法条目得出 */
export interface GrammarTopicSummary {
  key: string
  title: string
  en: string
  cardText: string | null
  lead: string | null
  sectionCount: number
}

export interface GrammarCategorySummary {
  key: string
  title: string
  en: string
  description: string | null
  topics: GrammarTopicSummary[]
}

/** GET /api/grammar?topic=xxx —— 某个主题下的语法条目，按难度排序 */
export function fetchGrammarSections(topic: string, signal?: AbortSignal): Promise<GrammarSection[]> {
  const query = topic ? `?topic=${encodeURIComponent(topic)}` : ''
  return apiGet<GrammarSection[]>(`/api/grammar${query}`, signal)
}

/** GET /api/grammar/topics —— 语法目录：大类、主题、每个主题的节数 */
export function fetchGrammarCatalog(signal?: AbortSignal): Promise<GrammarCategorySummary[]> {
  return apiGet<GrammarCategorySummary[]>('/api/grammar/topics', signal)
}
