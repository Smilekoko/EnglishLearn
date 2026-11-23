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

/** 词库系列关联的语法主题，用于详情页的「相关语法」跳转 */
export interface VocabRelated {
  topic: string
  /** word / syntax，用来拼路由 */
  category: string
  title: string
  reason: string | null
}

export interface VocabSeriesDetail extends VocabSeriesSummary {
  categories: VocabCategory[]
  related: VocabRelated[]
}

/** GET /api/vocabulary/series —— 所有词库系列 */
export function fetchVocabSeries(signal?: AbortSignal): Promise<VocabSeriesSummary[]> {
  return apiGet<VocabSeriesSummary[]>('/api/vocabulary/series', signal)
}

/** GET /api/vocabulary/series/{id} —— 某个系列的词条，按分类分组 */
export function fetchVocabSeriesDetail(id: string, signal?: AbortSignal): Promise<VocabSeriesDetail> {
  return apiGet<VocabSeriesDetail>(`/api/vocabulary/series/${encodeURIComponent(id)}`, signal)
}

/** GET /api/vocabulary/related?topic=xxx —— 反查关联了某个语法主题的词库系列 */
export function fetchVocabSeriesByTopic(topic: string, signal?: AbortSignal): Promise<VocabSeriesSummary[]> {
  return apiGet<VocabSeriesSummary[]>(`/api/vocabulary/related?topic=${encodeURIComponent(topic)}`, signal)
}
