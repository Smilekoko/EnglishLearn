import { useEffect, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import page from './Page.module.css'
import styles from './Grammar.module.css'
import { fetchGrammarCatalog, type GrammarCategorySummary, type GrammarTopicSummary } from '../api/grammar.ts'

function TopicCard({
  topic,
  index,
  categoryKey,
}: {
  topic: GrammarTopicSummary
  index: number
  categoryKey: string
}) {
  const hasSections = topic.sectionCount > 0
  const body = (
    <>
      <span className={styles.head}>
        <span className={styles.index}>{String(index + 1).padStart(2, '0')}</span>
        <h2 className={styles.title}>
          {topic.title}
          <span className={styles.en}>{topic.en}</span>
        </h2>
      </span>
      <p className={styles.text}>{topic.cardText}</p>
      <span className={hasSections ? styles.status : `${styles.status} ${styles.statusPending}`}>
        {hasSections ? `${topic.sectionCount} 个主题 →` : '整理中'}
      </span>
    </>
  )

  if (hasSections) {
    return (
      <Link to={`/grammar/${categoryKey}/${topic.key}`} className={`${styles.card} ${styles.cardLink}`}>
        {body}
      </Link>
    )
  }

  return <article className={styles.card}>{body}</article>
}

function GrammarCategoryPage() {
  const { category = '' } = useParams<{ category: string }>()
  const [categories, setCategories] = useState<GrammarCategorySummary[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    const controller = new AbortController()
    fetchGrammarCatalog(controller.signal)
      .then((data) => {
        if (controller.signal.aborted) return
        setCategories(data)
      })
      .catch((err: unknown) => {
        if (controller.signal.aborted) return
        setError(err instanceof Error ? err.message : '加载失败')
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false)
      })
    return () => controller.abort()
  }, [reloadKey])

  const data = categories.find((item) => item.key === category)

  const retry = () => {
    setLoading(true)
    setError(null)
    setReloadKey((key) => key + 1)
  }

  if (loading) {
    return <div className={page.state}>正在加载语法目录…</div>
  }

  if (error) {
    return (
      <div className={page.error}>
        <p>{error}</p>
        <button type="button" className={page.retry} onClick={retry}>
          重试
        </button>
      </div>
    )
  }

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
          <TopicCard key={topic.key} topic={topic} index={index} categoryKey={data.key} />
        ))}
      </div>
    </section>
  )
}

export default GrammarCategoryPage
