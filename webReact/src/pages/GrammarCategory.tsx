import { Link, Navigate, useParams } from 'react-router-dom'
import page from './Page.module.css'
import styles from './Grammar.module.css'
import { grammarCategories, type GrammarTopic } from '../data/grammarTopics.ts'

function TopicCard({ topic, index }: { topic: GrammarTopic; index: number }) {
  const body = (
    <>
      <span className={styles.head}>
        <span className={styles.index}>{String(index + 1).padStart(2, '0')}</span>
        <h2 className={styles.title}>
          {topic.title}
          <span className={styles.en}>{topic.en}</span>
        </h2>
      </span>
      <p className={styles.text}>{topic.text}</p>
      <span className={topic.to ? styles.status : `${styles.status} ${styles.statusPending}`}>
        {topic.to ? topic.action : '整理中'}
      </span>
    </>
  )

  if (topic.to) {
    return (
      <Link to={topic.to} className={`${styles.card} ${styles.cardLink}`}>
        {body}
      </Link>
    )
  }

  return <article className={styles.card}>{body}</article>
}

function GrammarCategoryPage() {
  const { category } = useParams<{ category: string }>()
  const data = grammarCategories.find((item) => item.key === category)

  if (!data) {
    return <Navigate to="/grammar" replace />
  }

  return (
    <section>
      <nav className={styles.breadcrumb} aria-label="面包屑">
        <Link to="/grammar">语法</Link>
        <span aria-hidden="true">/</span>
        <span>{data.title}</span>
      </nav>

      <h1 className={page.pageTitle}>{data.title}</h1>
      <p className={page.lead}>{data.description}</p>

      <div className={styles.sectionHead}>
        <h2 className={styles.sectionTitle}>
          {data.title} · {data.en}
        </h2>
        <span className={styles.count}>{data.topics.length}</span>
      </div>

      <div className={styles.grid}>
        {data.topics.map((topic, index) => (
          <TopicCard key={topic.title} topic={topic} index={index} />
        ))}
      </div>
    </section>
  )
}

export default GrammarCategoryPage
