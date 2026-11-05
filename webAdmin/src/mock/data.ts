/** 前端演示数据。后端接入后由 /api/grammar 与 /api/vowels 提供。 */

export interface GrammarRow {
  key: string
  title: string
  en: string
  level: string
  examples: number
}

export const grammarRows: GrammarRow[] = [
  { key: 'countable', title: '可数与不可数', en: 'Countable & Uncountable Nouns', level: '入门', examples: 4 },
  { key: 'plural', title: '名词的复数形式', en: 'Plural Forms', level: '基础', examples: 4 },
  { key: 'possessive', title: '名词所有格', en: 'Possessives', level: '进阶', examples: 4 },
  { key: 'articles', title: '冠词与名词', en: 'Articles with Nouns', level: '进阶', examples: 4 },
  { key: 'compound', title: '名词作定语与复合名词', en: 'Nouns as Modifiers', level: '提高', examples: 4 },
]

export interface VowelRow {
  key: string
  symbol: string
  label: string
  word: string
  audio: string
}

export const vowelRows: VowelRow[] = [
  { key: 'ɪ', symbol: 'ɪ', label: '短元音', word: 'sit', audio: 'vowel_ih.mp3' },
  { key: 'e', symbol: 'e', label: '短元音', word: 'bed', audio: 'vowel_e.mp3' },
  { key: 'æ', symbol: 'æ', label: '短元音', word: 'cat', audio: 'vowel_ae.mp3' },
  { key: 'ʌ', symbol: 'ʌ', label: '短元音', word: 'cup', audio: 'vowel_uh.mp3' },
  { key: 'ɒ', symbol: 'ɒ', label: '短元音', word: 'dog', audio: 'vowel_oh.mp3' },
  { key: 'iː', symbol: 'iː', label: '长元音', word: 'see', audio: 'vowel_ee.mp3' },
  { key: 'ɜː', symbol: 'ɜː', label: '长元音', word: 'bird', audio: 'vowel_er.mp3' },
  { key: 'ɑː', symbol: 'ɑː', label: '长元音', word: 'car', audio: 'vowel_ah.mp3' },
  { key: 'ɔː', symbol: 'ɔː', label: '长元音', word: 'door', audio: 'vowel_aw.mp3' },
  { key: 'uː', symbol: 'uː', label: '长元音', word: 'blue', audio: 'vowel_oo.mp3' },
  { key: 'ʊ', symbol: 'ʊ', label: '其他单元音', word: 'put', audio: 'vowel_u.mp3' },
  { key: 'ə', symbol: 'ə', label: '其他单元音', word: 'about', audio: 'vowel_schwa.mp3' },
  { key: 'eɪ', symbol: 'eɪ', label: '合口双元音', word: 'day', audio: 'vowel_ay.mp3' },
  { key: 'aɪ', symbol: 'aɪ', label: '合口双元音', word: 'time', audio: 'vowel_ai.mp3' },
  { key: 'ɔɪ', symbol: 'ɔɪ', label: '合口双元音', word: 'boy', audio: 'vowel_oy.mp3' },
  { key: 'aʊ', symbol: 'aʊ', label: '合口双元音', word: 'now', audio: 'vowel_au.mp3' },
  { key: 'əʊ', symbol: 'əʊ', label: '合口双元音', word: 'go', audio: 'vowel_ou.mp3' },
  { key: 'ɪə', symbol: 'ɪə', label: '集中双元音', word: 'here', audio: 'vowel_ia.mp3' },
  { key: 'eə', symbol: 'eə', label: '集中双元音', word: 'hair', audio: 'vowel_ea.mp3' },
  { key: 'ʊə', symbol: 'ʊə', label: '集中双元音', word: 'tour', audio: 'vowel_ua.mp3' },
]
