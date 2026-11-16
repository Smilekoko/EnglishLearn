import { apiGet } from './client.ts'

export interface VocabWord {
  en: string
  zh: string
  note?: string | null
}

export interface VocabCategory {
  category: string
  words: VocabWord[]
}

export interface VocabSeriesSummary {
  id: string
  title: string
  en: string
  summary: string
  wordCount: number
}

export interface VocabSeriesDetail extends VocabSeriesSummary {
  categories: VocabCategory[]
}

/** GET /api/vocabulary/series —— 所有词库系列 */
export function fetchVocabSeries(signal?: AbortSignal): Promise<VocabSeriesSummary[]> {
  return apiGet<VocabSeriesSummary[]>('/api/vocabulary/series', signal)
}

/** GET /api/vocabulary/series/{id} —— 某个系列的词条，按分类分组 */
export function fetchVocabSeriesDetail(id: string, signal?: AbortSignal): Promise<VocabSeriesDetail> {
  return apiGet<VocabSeriesDetail>(`/api/vocabulary/series/${encodeURIComponent(id)}`, signal)
}
