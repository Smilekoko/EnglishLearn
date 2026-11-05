export interface GrammarExample {
  /** 英文例句 */
  en: string
  /** 中文释义 */
  zh: string
  /** 补充说明（可选） */
  note?: string
}

export interface GrammarSection {
  id: string
  /** 中文标题 */
  title: string
  /** 英文标题 */
  en: string
  /** 难度标签 */
  level: '入门' | '基础' | '进阶' | '提高'
  /** 一句话概述 */
  summary: string
  /** 规则要点 */
  points: string[]
  /** 例句 */
  examples: GrammarExample[]
}

/**
 * 名词语法，按难度从简单到难排列。
 * 当前为固定数据；后续接入管理页面后改为从接口/存储读取。
 */
export const nounGrammar: GrammarSection[] = [
  {
    id: 'countable',
    title: '可数与不可数',
    en: 'Countable & Uncountable Nouns',
    level: '入门',
    summary:
      '英语名词先分「能不能数」：能数的有单复数，不能数的没有复数、也不能直接加 a/an。这是后面所有名词用法的地基。',
    points: [
      '可数名词有单复数，可以直接跟 a/an 或数词：a book、two books。',
      '不可数名词没有复数，不能直接加 a/an，要表示数量得借助量词：a piece of advice、two bottles of water。',
      '常见不可数名词：water、money、information、advice、furniture、news、homework。',
      'many、few 修饰可数名词；much、little 修饰不可数名词；some、a lot of 两者都能用。',
    ],
    examples: [
      {
        en: 'I have two brothers and one sister.',
        zh: '我有两个兄弟和一个姐妹。',
        note: 'brother、sister 是可数名词，可以直接用数词修饰。',
      },
      {
        en: 'There is some water in the glass.',
        zh: '杯子里有些水。',
        note: 'water 不可数，用 is 而不是 are，也不能说 a water。',
      },
      {
        en: 'She gave me a piece of advice.',
        zh: '她给了我一条建议。',
        note: 'advice 不可数，计数时用 a piece of advice。',
      },
      {
        en: 'We need more information about the plan.',
        zh: '我们需要更多关于这个计划的信息。',
        note: 'information 不可数，不能说 informations。',
      },
    ],
  },
  {
    id: 'plural',
    title: '名词的复数形式',
    en: 'Plural Forms',
    level: '基础',
    summary:
      '可数名词变复数有规则变化，也有一批必须单独记的不规则形式。规则部分能推，不规则部分只能积累。',
    points: [
      '一般直接加 -s：book → books；以 s、x、sh、ch 结尾加 -es：box → boxes。',
      '辅音字母 + y 结尾，变 y 为 i 再加 -es：city → cities；元音 + y 直接加 -s：boy → boys。',
      '部分以 f / fe 结尾的变 -ves：knife → knives、leaf → leaves。',
      '不规则变化：child → children、tooth → teeth、foot → feet、mouse → mice、man → men。',
      '单复同形：sheep、deer、fish；people、police 本身就是复数。',
    ],
    examples: [
      {
        en: 'There are three boxes on the desk.',
        zh: '桌上有三个盒子。',
        note: 'box 以 x 结尾，复数加 -es。',
      },
      {
        en: 'Two children are playing in the garden.',
        zh: '两个孩子在花园里玩。',
        note: 'child 的复数是不规则的 children，不是 childs。',
      },
      {
        en: 'My mother bought two knives yesterday.',
        zh: '我妈妈昨天买了两把刀。',
        note: 'knife 以 fe 结尾，复数变 -ves。',
      },
      {
        en: 'The sheep are eating grass on the hill.',
        zh: '羊在山坡上吃草。',
        note: 'sheep 单复同形，这里 are 说明是复数。',
      },
    ],
  },
  {
    id: 'possessive',
    title: '名词所有格',
    en: 'Possessives',
    level: '进阶',
    summary:
      '表示「谁的」有两种写法：有生命的名词多用 -’s，无生命的名词多用 of。选错不会让人听不懂，但会显得不地道。',
    points: [
      '有生命的人或动物加 -’s：Tom’s bag、the dog’s tail。',
      '以 s 结尾的复数名词只加撇号：the students’ books；不以 s 结尾的复数仍加 -’s：children’s toys。',
      '无生命的名词一般用 of：the door of the room。',
      '表示时间、距离、国家、城市的名词也可以用 -’s：today’s news、two hours’ drive、China’s economy。',
      '双重所有格：a friend of mine / a friend of Tom’s，表示「其中之一」。',
    ],
    examples: [
      {
        en: 'This is Tom’s bike.',
        zh: '这是汤姆的自行车。',
        note: '人 + -’s，最基础的用法。',
      },
      {
        en: 'The students’ homework is on the teacher’s desk.',
        zh: '学生们的作业在老师的桌上。',
        note: 'students 已是复数且以 s 结尾，只加撇号；teacher 是单数，加 -’s。',
      },
      {
        en: 'The roof of the house is red.',
        zh: '这座房子的屋顶是红色的。',
        note: 'house 无生命，习惯用 of 结构。',
      },
      {
        en: 'She is a friend of my mother’s.',
        zh: '她是我妈妈的一个朋友。',
        note: '双重所有格，强调「朋友中的一个」。',
      },
    ],
  },
  {
    id: 'articles',
    title: '冠词与名词',
    en: 'Articles with Nouns',
    level: '进阶',
    summary:
      'a/an 表示「一个」，the 表示「这个/那个」，不用冠词表示「泛指」。冠词的取舍取决于听者能不能确定你指的是哪一个。',
    points: [
      'a/an 用于可数名词单数的泛指，第一次提到时常用；an 用在元音音素前：an hour、an apple。',
      'the 用于特指、独一无二或上文刚提过的事物：the sun、the book I bought。',
      '复数名词和不可数名词泛指时不用冠词：Books are useful. / Water is important.',
      '注意固定搭配：go to school（去上学）与 go to the school（去那所学校）意思不同。',
    ],
    examples: [
      {
        en: 'She is a teacher and he is an engineer.',
        zh: '她是老师，他是工程师。',
        note: '表示职业用 a/an；engineer 以元音音素开头，用 an。',
      },
      {
        en: 'I bought a book yesterday. The book is very interesting.',
        zh: '我昨天买了一本书。这本书很有意思。',
        note: '第一次提到用 a，再次提到用 the。',
      },
      {
        en: 'The sun rises in the east.',
        zh: '太阳从东方升起。',
        note: '独一无二的事物用 the。',
      },
      {
        en: 'Water is important for life.',
        zh: '水对生命很重要。',
        note: '不可数名词泛指，不加冠词。',
      },
    ],
  },
  {
    id: 'compound',
    title: '名词作定语与复合名词',
    en: 'Nouns as Modifiers',
    level: '提高',
    summary:
      '一个名词可以像形容词一样修饰另一个名词（a bus stop），两个词也可能固化成复合名词（toothbrush）。难点在复数加在哪里。',
    points: [
      '名词作定语时一般用单数：a shoe shop、two shoe shops（不是 shoes shop）。',
      '复合名词变复数只变中心词：toothbrush → toothbrushes、mother-in-law → mothers-in-law。',
      'man / woman 作定语时要跟着中心词一起变复数：a woman doctor → two women doctors。',
      '名词作定语表示材料、用途、地点：a stone wall、a coffee cup、a kitchen table。',
    ],
    examples: [
      {
        en: 'I need a new phone case.',
        zh: '我需要一个新的手机壳。',
        note: 'phone 作定语修饰 case，用单数。',
      },
      {
        en: 'There are two coffee cups on the table.',
        zh: '桌上有两个咖啡杯。',
        note: '复数只加在中心词 cups 上，coffee 不变。',
      },
      {
        en: 'She bought three toothbrushes at the supermarket.',
        zh: '她在超市买了三把牙刷。',
        note: 'toothbrush 是复合名词，复数直接加在词尾。',
      },
      {
        en: 'Two women doctors work in this hospital.',
        zh: '两位女医生在这家医院工作。',
        note: 'woman 作定语时要随中心词变复数，用 women。',
      },
    ],
  },
]
