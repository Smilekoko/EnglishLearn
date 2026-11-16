import { Link } from 'react-router-dom'
import { syntaxCategory, wordCategory } from '../data/grammarTopics.ts'
import { vowels } from '../data/vowels.ts'
import styles from './Home.module.css'

const sections = [
  {
    to: '/phonetics',
    title: '音标',
    en: 'Phonetics',
    text: '20 个元音、28 个辅音，配合示例单词和发音，练习准确口型。',
    meta: `${vowels.length} 个元音 →`,
  },
  {
    to: '/grammar/word',
    title: '词法',
    en: 'Parts of Speech',
    text: '名词、冠词、代词、形容词、副词、时态、非谓语动词……按词性逐条整理。',
    meta: `${wordCategory.topics.length} 个条目 →`,
  },
  {
    to: '/grammar/syntax',
    title: '句法',
    en: 'Syntax',
    text: '基本句型、定语从句、状语从句、名词性从句、虚拟语气与特殊句式。',
    meta: `${syntaxCategory.topics.length} 个条目 →`,
  },
  {
    to: '/vocabulary',
    title: '词汇',
    en: 'Vocabulary',
    text: '日期数字单位、日常高频词……按主题分系列的词库，配释义和用法提示。',
    meta: '按系列分类 →',
  },
]

function Home() {
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
