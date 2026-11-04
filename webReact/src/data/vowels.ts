export type VowelKind = 'monophthong' | 'diphthong'

export interface VowelExample {
  word: string
  ipa: string
}

export interface Vowel {
  /** 音标符号，不含两侧的斜杠 */
  symbol: string
  kind: VowelKind
  /** 分类标签：短元音 / 长元音 / 其他单元音 / 合口双元音 / 集中双元音 */
  label: string
  /** 音频文件名，位于 public/audio/ 下 */
  audio: string
  /** 发音要点 */
  tip: string
  examples: VowelExample[]
}

/** 20 个元音：12 个单元音 + 8 个双元音 */
export const vowels: Vowel[] = [
  {
    symbol: 'ɪ',
    kind: 'monophthong',
    label: '短元音',
    audio: 'vowel_ih.mp3',
    tip: '口微开，短促，似"衣"但更松',
    examples: [
      { word: 'sit', ipa: '/sɪt/' },
      { word: 'big', ipa: '/bɪɡ/' },
      { word: 'with', ipa: '/wɪð/' },
    ],
  },
  {
    symbol: 'e',
    kind: 'monophthong',
    label: '短元音',
    audio: 'vowel_e.mp3',
    tip: '似"诶"，口半开，短促',
    examples: [
      { word: 'bed', ipa: '/bed/' },
      { word: 'ten', ipa: '/ten/' },
      { word: 'met', ipa: '/met/' },
    ],
  },
  {
    symbol: 'æ',
    kind: 'monophthong',
    label: '短元音',
    audio: 'vowel_ae.mp3',
    tip: '口张大，舌尖抵下齿，似"哎"',
    examples: [
      { word: 'cat', ipa: '/kæt/' },
      { word: 'bag', ipa: '/bæɡ/' },
      { word: 'hand', ipa: '/hænd/' },
    ],
  },
  {
    symbol: 'ʌ',
    kind: 'monophthong',
    label: '短元音',
    audio: 'vowel_uh.mp3',
    tip: '似"啊"，口自然半开',
    examples: [
      { word: 'cup', ipa: '/kʌp/' },
      { word: 'mum', ipa: '/mʌm/' },
      { word: 'sun', ipa: '/sʌn/' },
    ],
  },
  {
    symbol: 'ɒ',
    kind: 'monophthong',
    label: '短元音',
    audio: 'vowel_oh.mp3',
    tip: '似"哦"，圆唇，短促',
    examples: [
      { word: 'dog', ipa: '/dɒɡ/' },
      { word: 'box', ipa: '/bɒks/' },
      { word: 'hot', ipa: '/hɒt/' },
    ],
  },
  {
    symbol: 'iː',
    kind: 'monophthong',
    label: '长元音',
    audio: 'vowel_ee.mp3',
    tip: '似"衣"，唇形扁平，音长拉长',
    examples: [
      { word: 'see', ipa: '/siː/' },
      { word: 'tea', ipa: '/tiː/' },
      { word: 'sleep', ipa: '/sliːp/' },
    ],
  },
  {
    symbol: 'ɜː',
    kind: 'monophthong',
    label: '长元音',
    audio: 'vowel_er.mp3',
    tip: '似"额"，舌位居中',
    examples: [
      { word: 'bird', ipa: '/bɜːd/' },
      { word: 'her', ipa: '/hɜː/' },
      { word: 'work', ipa: '/wɜːk/' },
    ],
  },
  {
    symbol: 'ɑː',
    kind: 'monophthong',
    label: '长元音',
    audio: 'vowel_ah.mp3',
    tip: '似"啊"，口大张，长音',
    examples: [
      { word: 'car', ipa: '/kɑː/' },
      { word: 'class', ipa: '/klɑːs/' },
      { word: 'heart', ipa: '/hɑːt/' },
    ],
  },
  {
    symbol: 'ɔː',
    kind: 'monophthong',
    label: '长元音',
    audio: 'vowel_aw.mp3',
    tip: '似"哦"，圆唇，长音',
    examples: [
      { word: 'door', ipa: '/dɔː/' },
      { word: 'for', ipa: '/fɔː/' },
      { word: 'ball', ipa: '/bɔːl/' },
    ],
  },
  {
    symbol: 'uː',
    kind: 'monophthong',
    label: '长元音',
    audio: 'vowel_oo.mp3',
    tip: '似"乌"，双唇收圆前突',
    examples: [
      { word: 'blue', ipa: '/bluː/' },
      { word: 'too', ipa: '/tuː/' },
      { word: 'moon', ipa: '/muːn/' },
    ],
  },
  {
    symbol: 'ʊ',
    kind: 'monophthong',
    label: '其他单元音',
    audio: 'vowel_u.mp3',
    tip: '似"乌"但更松，短促',
    examples: [
      { word: 'put', ipa: '/pʊt/' },
      { word: 'book', ipa: '/bʊk/' },
      { word: 'wood', ipa: '/wʊd/' },
    ],
  },
  {
    symbol: 'ə',
    kind: 'monophthong',
    label: '其他单元音',
    audio: 'vowel_schwa.mp3',
    tip: '轻读央元音（schwa），最常见',
    examples: [
      { word: 'about', ipa: '/əˈbaʊt/' },
      { word: 'teacher', ipa: '/ˈtiːtʃə/' },
      { word: 'paper', ipa: '/ˈpeɪpə/' },
    ],
  },
  {
    symbol: 'eɪ',
    kind: 'diphthong',
    label: '合口双元音',
    audio: 'vowel_ay.mp3',
    tip: '由 /e/ 滑向 /ɪ/，似"诶~"',
    examples: [
      { word: 'day', ipa: '/deɪ/' },
      { word: 'name', ipa: '/neɪm/' },
      { word: 'rain', ipa: '/reɪn/' },
    ],
  },
  {
    symbol: 'aɪ',
    kind: 'diphthong',
    label: '合口双元音',
    audio: 'vowel_ai.mp3',
    tip: '由 /a/ 滑向 /ɪ/，似"爱"',
    examples: [
      { word: 'time', ipa: '/taɪm/' },
      { word: 'my', ipa: '/maɪ/' },
      { word: 'light', ipa: '/laɪt/' },
    ],
  },
  {
    symbol: 'ɔɪ',
    kind: 'diphthong',
    label: '合口双元音',
    audio: 'vowel_oy.mp3',
    tip: '由 /ɔ/ 滑向 /ɪ/，似"哦伊"',
    examples: [
      { word: 'boy', ipa: '/bɔɪ/' },
      { word: 'toy', ipa: '/tɔɪ/' },
      { word: 'voice', ipa: '/vɔɪs/' },
    ],
  },
  {
    symbol: 'aʊ',
    kind: 'diphthong',
    label: '合口双元音',
    audio: 'vowel_au.mp3',
    tip: '由 /a/ 滑向 /ʊ/，似"傲"',
    examples: [
      { word: 'now', ipa: '/naʊ/' },
      { word: 'house', ipa: '/haʊs/' },
      { word: 'cow', ipa: '/kaʊ/' },
    ],
  },
  {
    symbol: 'əʊ',
    kind: 'diphthong',
    label: '合口双元音',
    audio: 'vowel_ou.mp3',
    tip: '由 /ə/ 滑向 /ʊ/，似"欧"',
    examples: [
      { word: 'go', ipa: '/ɡəʊ/' },
      { word: 'nose', ipa: '/nəʊz/' },
      { word: 'boat', ipa: '/bəʊt/' },
    ],
  },
  {
    symbol: 'ɪə',
    kind: 'diphthong',
    label: '集中双元音',
    audio: 'vowel_ia.mp3',
    tip: '由 /ɪ/ 滑向 /ə/，似"衣额"连读',
    examples: [
      { word: 'here', ipa: '/hɪə/' },
      { word: 'near', ipa: '/nɪə/' },
      { word: 'idea', ipa: '/aɪˈdɪə/' },
    ],
  },
  {
    symbol: 'eə',
    kind: 'diphthong',
    label: '集中双元音',
    audio: 'vowel_ea.mp3',
    tip: '由 /e/ 滑向 /ə/，似"诶额"连读',
    examples: [
      { word: 'hair', ipa: '/heə/' },
      { word: 'care', ipa: '/keə/' },
      { word: 'where', ipa: '/weə/' },
    ],
  },
  {
    symbol: 'ʊə',
    kind: 'diphthong',
    label: '集中双元音',
    audio: 'vowel_ua.mp3',
    tip: '由 /ʊ/ 滑向 /ə/，似"乌额"连读',
    examples: [
      { word: 'tour', ipa: '/tʊə/' },
      { word: 'poor', ipa: '/pʊə/' },
      { word: 'sure', ipa: '/ʃʊə/' },
    ],
  },
]

export const monophthongs = vowels.filter((vowel) => vowel.kind === 'monophthong')
export const diphthongs = vowels.filter((vowel) => vowel.kind === 'diphthong')
