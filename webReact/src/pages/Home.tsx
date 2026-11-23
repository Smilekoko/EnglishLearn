import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchGrammarCatalog } from '../api/grammar.ts'
import { fetchVowels } from '../api/vowels.ts'
import { fetchConsonants } from '../api/consonants.ts'
import styles from './Home.module.css'

interface Counts {
  word?: number
  syntax?: number
  vowels?: number
  consonants?: number
}

function Home() {
  const [counts, setCounts] = useState<Counts>({})

  useEffect(() => {
    const controller = new AbortController()
    Promise.all([
      fetchGrammarCatalog(controller.signal),
      fetchVowels(controller.signal),
      fetchConsonants(controller.signal),
    ])
      .then(([catalog, vowels, consonants]) => {
        if (controller.signal.aborted) return
        setCounts({
          word: catalog.find((category) => category.key === 'word')?.topics.length,
          syntax: catalog.find((category) => category.key === 'syntax')?.topics.length,
          vowels: vowels.length,
          consonants: consonants.length,
        })
      })
      // 首页统计只是装饰，接口挂了就退化成「查看」文案，不挡住入口
      .catch(() => undefined)
    return () => controller.abort()
  }, [])

  const phoneticMeta =
    counts.vowels === undefined || counts.consonants === undefined
      ? '查看音标 →'
      : `${counts.vowels} 个元音 + ${counts.consonants} 个辅音 →`

  const sections = [
    {
      to: '/phonetics',
      title: '音标',
      en: 'Phonetics',
      text: '元音与辅音逐个拆解，配合示例单词，练准口型和舌位。',
      meta: phoneticMeta,
    },
    {
      to: '/grammar/word',
      title: '词法',
      en: 'Parts of Speech',
      text: '名词、冠词、代词、形容词、副词、时态、非谓语动词……按词性逐条整理。',
      meta: counts.word === undefined ? '查看词法 →' : `${counts.word} 个条目 →`,
    },
    {
      to: '/grammar/syntax',
      title: '句法',
      en: 'Syntax',
      text: '基本句型、定语从句、状语从句、名词性从句、虚拟语气与特殊句式。',
      meta: counts.syntax === undefined ? '查看句法 →' : `${counts.syntax} 个条目 →`,
    },
    {
      to: '/vocabulary',
      title: '词汇',
      en: 'Vocabulary',
      text: '日期数字单位、日常高频词……按主题分系列的词库，配释义和用法提示。',
      meta: '按系列分类 →',
    },
  ]

  return (
    <>
      <section className={styles.hero}>
        <p className={styles.eyebrow}>English Learning</p>
        <h1 className={styles.title}>把语法、音标和词汇讲清楚</h1>
        <p className={styles.lead}>
          从词法、句法到音标和词汇，按主题整理英语学习要点，每个条目配规则、例句和发音。
        </p>
      </section>

      <div className={styles.grid}>
        {sections.map((section) => (
          <Link key={section.to} to={section.to} className={styles.card}>
            <h2 className={styles.cardTitle}>
              {section.title}
              <span className={styles.cardEn}>{section.en}</span>
            </h2>
            <p className={styles.cardText}>{section.text}</p>
            <span className={styles.cardAction}>{section.meta}</span>
          </Link>
        ))}
      </div>
    </>
  )
}

export default Home
