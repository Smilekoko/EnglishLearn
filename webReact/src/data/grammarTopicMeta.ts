export interface GrammarTopicMeta {
  title: string
  en: string
  lead: string
}

/** 词法下各语法主题的页面文案，key 与后端 grammar_sections.topic 对应 */
export const grammarTopicMeta: Record<string, GrammarTopicMeta> = {
  noun: {
    title: '名词',
    en: 'Noun',
    lead: '从可数性到复合名词，按难度从简单到难排列。左侧选主题，右侧看要点和例句。',
  },
  articles: {
    title: '冠词',
    en: 'Articles',
    lead: 'a/an 的选用、the 的特指、零冠词和固定搭配。',
  },
  pronouns: {
    title: '代词',
    en: 'Pronouns',
    lead: '人称、物主、反身、指示、疑问到关系代词，理清「谁、谁的、自己」。',
  },
  adjectives: {
    title: '形容词',
    en: 'Adjectives',
    lead: '位置、排序、比较级最高级，以及 -ed/-ing 的区别和介词搭配。',
  },
  adverbs: {
    title: '副词',
    en: 'Adverbs',
    lead: '方式、地点、时间、频度、程度五类副词，以及它们在句中的位置。',
  },
  tenses: {
    title: '时态',
    en: 'Tenses',
    lead: '12 个核心时态加总览和时态呼应，用「时间 × 体」的矩阵理解每个时态在说什么。',
  },
  verbs: {
    title: '动词基础',
    en: 'Verbs',
    lead: 'be 动词、及物与不及物、助动词、情态动词和短语动词。',
  },
  passive: {
    title: '被动语态',
    en: 'Passive Voice',
    lead: 'be + 过去分词的构成、各时态的被动，以及什么时候不用被动。',
  },
  nonfinite: {
    title: '非谓语动词',
    en: 'Non-finite Verbs',
    lead: '不定式、动名词、现在分词、过去分词的区别与选择。',
  },
  agreement: {
    title: '主谓一致',
    en: 'Subject-Verb Agreement',
    lead: '单复数规则、集合名词、就近原则与高频易错点。',
  },
  prepositions: {
    title: '介词',
    en: 'Prepositions',
    lead: '时间、地点、方向、方式的常用介词与固定搭配。',
  },
  conjunctions: {
    title: '连词',
    en: 'Conjunctions',
    lead: '并列、从属、关联连词，以及 although 与 but 不能连用这类高频错误。',
  },
  numerals: {
    title: '数词',
    en: 'Numerals',
    lead: '基数词、序数词、分数与小数，以及年份、日期和时刻的读法。',
  },
  sentence: {
    title: '句子成分与基本句型',
    en: 'Sentence Structure',
    lead: '先认清主语、谓语、宾语、表语、定语、状语、补语这七种句子成分，再看五种基本句型，最后按「找谓语 → 找主语 → 补宾语或表语」的顺序划分成分。',
  },
  'relative-clauses': {
    title: '定语从句',
    en: 'Relative Clauses',
    lead: '从先行词和关系词入手，依次搞定关系代词、关系副词、that 与 which 的取舍、介词提前、限制性非限制性，最后收在一致性与易错点上。',
  },
  'adverbial-clauses': {
    title: '状语从句',
    en: 'Adverbial Clauses',
    lead: '按意义分九类逐个过：时间、地点、条件、原因、目的、结果、让步、比较方式，再补省略简化和三个高频错误。',
  },
}
