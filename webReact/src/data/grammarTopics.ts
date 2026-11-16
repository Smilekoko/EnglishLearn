export interface GrammarTopic {
  title: string
  en: string
  text: string
  /** 已有详情页时才填，否则显示「整理中」 */
  to?: string
  action?: string
}

export interface GrammarCategory {
  key: 'word' | 'syntax'
  title: string
  en: string
  description: string
  topics: GrammarTopic[]
}

const detailLink = (category: 'word' | 'syntax', slug: string, count = 5) => ({
  to: `/grammar/${category}/${slug}`,
  action: `${count} 个主题 →`,
})

const detail = (slug: string, count = 5) => detailLink('word', slug, count)

export const wordCategory: GrammarCategory = {
  key: 'word',
  title: '词法',
  en: 'Parts of Speech',
  description: '十类词各自的用法：名词、冠词、代词、形容词、副词、动词、时态、介词等。',
  topics: [
    {
      title: '名词',
      en: 'Noun',
      text: '可数性、单复数、所有格、冠词搭配、复合名词。',
      ...detail('noun'),
    },
    {
      title: '冠词',
      en: 'Articles',
      text: 'a/an 的选用、the 的用法、零冠词与固定搭配。',
      ...detail('articles'),
    },
    {
      title: '代词',
      en: 'Pronouns',
      text: '人称、物主、反身、指示、疑问与关系代词。',
      ...detail('pronouns'),
    },
    {
      title: '形容词',
      en: 'Adjectives',
      text: '位置与顺序、比较级和最高级、-ed 与 -ing 的区别。',
      ...detail('adjectives'),
    },
    {
      title: '副词',
      en: 'Adverbs',
      text: '分类、在句中的位置、比较级、与形容词的区分。',
      ...detail('adverbs'),
    },
    {
      title: '时态',
      en: 'Tenses',
      text: '总览 + 12 个核心时态 + 时态呼应，按「时间 × 体」系统梳理。',
      ...detail('tenses', 14),
    },
    {
      title: '动词基础',
      en: 'Verbs',
      text: 'be 动词、实义动词、助动词、情态动词、短语动词。',
      ...detail('verbs'),
    },
    {
      title: '被动语态',
      en: 'Passive Voice',
      text: '构成方式、各时态的被动、by 短语、不用被动的场景。',
      ...detail('passive'),
    },
    {
      title: '非谓语动词',
      en: 'Non-finite Verbs',
      text: '不定式、动名词、现在分词与过去分词。',
      ...detail('nonfinite'),
    },
    {
      title: '主谓一致',
      en: 'Subject-Verb Agreement',
      text: '单复数规则、集合名词、就近原则与特殊结构。',
      ...detail('agreement'),
    },
    {
      title: '介词',
      en: 'Prepositions',
      text: '时间、地点、方向，以及常见固定搭配。',
      ...detail('prepositions'),
    },
    {
      title: '连词',
      en: 'Conjunctions',
      text: '并列连词、从属连词、关联词的使用。',
      ...detail('conjunctions'),
    },
    {
      title: '数词',
      en: 'Numerals',
      text: '基数词、序数词、分数与小数、年份与时刻的读法。',
      ...detail('numerals'),
    },
  ],
}

export const syntaxCategory: GrammarCategory = {
  key: 'syntax',
  title: '句法',
  en: 'Syntax',
  description: '句子怎么搭：基本句型、各类从句、虚拟语气与特殊句式。',
  topics: [
    {
      title: '句子成分与基本句型',
      en: 'Sentence Structure',
      text: '主语、谓语、宾语、表语、定语、状语、补语，五种基本句型与划分顺序。',
      ...detailLink('syntax', 'sentence', 7),
    },
    {
      title: '定语从句',
      en: 'Relative Clauses',
      text: 'who/which/that、whose、关系副词、介词提前、限制性与非限制性。',
      ...detailLink('syntax', 'relative-clauses', 9),
    },
    {
      title: '状语从句',
      en: 'Adverbial Clauses',
      text: '时间、地点、条件、原因、目的、结果、让步、比较方式，以及省略与易错点。',
      ...detailLink('syntax', 'adverbial-clauses', 10),
    },
    { title: '名词性从句', en: 'Noun Clauses', text: '主语、宾语、表语、同位语从句。' },
    { title: '虚拟语气', en: 'Subjunctive Mood', text: '与现在/过去/将来事实相反、wish、建议与要求。' },
    { title: '倒装', en: 'Inversion', text: '完全倒装、部分倒装、only 与否定词开头的倒装。' },
    { title: '强调句', en: 'Cleft Sentences', text: 'It is ... that 结构、what 从句强调。' },
    { title: '省略与替代', en: 'Ellipsis & Substitution', text: '并列句中的省略、so/neither、do so。' },
    { title: '直接引语与间接引语', en: 'Reported Speech', text: '时态后移、人称与时间状语的变化。' },
    { title: '疑问句与否定句', en: 'Questions & Negation', text: '特殊疑问句、反义疑问句、否定转移。' },
  ],
}

export const grammarCategories = [wordCategory, syntaxCategory]
