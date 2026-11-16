import { apiGet } from './client.ts'

export type VowelKind = 'monophthong' | 'diphthong'

export interface VowelWord {
  word: string
  ipa: string | null
}

export interface Vowel {
  symbol: string
  kind: VowelKind
  /** 分类标签：短元音 / 长元音 / 其他单元音 / 合口双元音 / 集中双元音 */
  label: string
  /** 音频文件名，位于 public/audio/ 下 */
  audio: string
  /** 主例词 */
  word: string
  wordIpa: string | null
  /** 发音要点 */
  tip: string | null
  /** 补充例词 */
  examples: VowelWord[]
}

/** GET /api/vowels —— 20 个元音，按 sortOrder 排序 */
export function fetchVowels(signal?: AbortSignal): Promise<Vowel[]> {
  return apiGet<Vowel[]>('/api/vowels', signal)
}
