import { Link } from 'react-router-dom'
import styles from './Home.module.css'

const sections = [
  {
    to: '/grammar',
    title: '语法',
    text: '名词、形容词、副词等词法专题，逐篇整理定义、分类与常见用法。',
    action: '进入语法 →',
  },
  {
    to: '/phonetics',
    title: '音标',
    text: '20 个元音、28 个辅音，配合示例单词和发音，练习准确口型。',
    action: '进入音标 →',
  },
]

function Home() {
  return (
    <>
      <section className={styles.hero}>
        <p className={styles.eyebrow}>English Learning</p>
        <h1 className={styles.title}>把语法和音标，讲清楚</h1>
        <p className={styles.lead}>
          这里整理英语学习中的语法要点和音标练习。站点正在从静态页面迁移到 React，
          内容会按专题陆续补上。
        </p>
      </section>

      <div className={styles.grid}>
        {sections.map((section) => (
          <Link key={section.to} to={section.to} className={styles.card}>
            <h2 className={styles.cardTitle}>{section.title}</h2>
            <p className={styles.cardText}>{section.text}</p>
            <span className={styles.cardAction}>{section.action}</span>
          </Link>
        ))}
      </div>
    </>
  )
}

export default Home
