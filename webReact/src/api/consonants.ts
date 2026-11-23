import { apiGet } from './client.ts'

/** 辅音分组：爆破音 / 摩擦音 / 破擦音 / 鼻音 / 边音 / 半元音 */
export type ConsonantKind = 'plosive' | 'fricative' | 'affricate' | 'nasal' | 'lateral' | 'approximant'

export interface ConsonantWord {
  word: string
  ipa: string | null
}

export interface Consonant {
  symbol: string
  kind: ConsonantKind
  /** 中文分组名，直接用作小节标题 */
  label: string
  /** 音频文件名；暂时为空，前端不显示播放按钮 */
  audio: string | null
  /** 主例词 */
  word: string
  wordIpa: string | null
  /** 发音要点 */
  tip: string | null
  /** 补充例词 */
  examples: ConsonantWord[]
}

/** GET /api/consonants —— 28 个辅音，按 sortOrder 排序 */
export function fetchConsonants(signal?: AbortSignal): Promise<Consonant[]> {
  return apiGet<Consonant[]>('/api/consonants', signal)
}
