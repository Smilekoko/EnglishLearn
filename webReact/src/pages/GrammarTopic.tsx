import { useEffect, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import {
  fetchGrammarCatalog,
  fetchGrammarSections,
  type GrammarCategorySummary,
  type GrammarSection,
  type GrammarTopicSummary,
} from '../api/grammar.ts'
import { fetchVocabSeriesByTopic, type VocabSeriesSummary } from '../api/vocabulary.ts'
import styles from './GrammarTopic.module.css'

interface TopicPage {
  category: GrammarCategorySummary
  topic: GrammarTopicSummary
  sections: GrammarSection[]
  relatedSeries: VocabSeriesSummary[]
}

function GrammarTopicView({ categoryKey, topicKey }: { categoryKey: string; topicKey: string }) {
  const [page, setPage] = useState<TopicPage | null>(null)
  const [activeId, setActiveId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    const controller = new AbortController()

    Promise.all([
      fetchGrammarCatalog(controller.signal),
      fetchGrammarSections(topicKey, controller.signal),
      // 「相关词库」只是锦上添花，接口挂了不影响正文
      fetchVocabSeriesByTopic(topicKey, controller.signal).catch(() => []),
    ])
      .then(([catalog, sections, relatedSeries]) => {
        if (controller.signal.aborted) return
        const category = catalog.find((item) => item.key === categoryKey)
        const topic = category?.topics.find((item) => item.key === topicKey)
        if (!category || !topic) {
          setNotFound(true)
          return
        }
        setPage({ category, topic, sections, relatedSeries })
        setActiveId((current) =>
          current && sections.some((section) => section.id === current) ? current : (sections[0]?.id ?? null),
        )
      })
      .catch((err: unknown) => {
        if (controller.signal.aborted) return
        setError(err instanceof Error ? err.message : '加载失败')
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false)
      })

    return () => controller.abort()
  }, [categoryKey, topicKey, reloadKey])

  const retry = () => {
    setLoading(true)
    setError(null)
    setNotFound(false)
    setReloadKey((key) => key + 1)
  }

  if (loading) {
    return <div className={styles.state}>正在加载语法数据…</div>
  }

  if (error) {
    return (
      <div className={styles.error}>
        <p>{error}</p>
        <button type="button" className={styles.retry} onClick={retry}>
          重试
        </button>
      </div>
    )
  }

  if (notFound || !page) {
    return <Navigate to="/grammar/word" replace />
  }

  const { category, topic, sections, relatedSeries } = page
  const active = sections.find((section) => section.id === activeId) ?? sections[0] ?? null
  const intro = topic.lead ?? topic.cardText ?? ''

  return (
    <section>
      <nav className={styles.breadcrumb} aria-label="面包屑">
        <Link to="/grammar">语法</Link>
        <span aria-hidden="true">/</span>
        <Link to={`/grammar/${category.key}`}>{category.title}</Link>
        <span aria-hidden="true">/</span>
        <span>{topic.title}</span>
      </nav>

      <h1 className={styles.pageTitle}>{topic.title}</h1>
      <p className={styles.lead}>{active ? `共 ${sections.length} 个主题。${intro}` : intro}</p>

      {!active && <div className={styles.state}>暂无语法数据。</div>}

      {active && (
        <div className={styles.layout}>
          <aside className={styles.sidebar} aria-label={`${topic.title}语法列表`}>
            <p className={styles.sidebarTitle}>语法列表</p>
            {sections.map((section, index) => {
              const isActive = section.id === active.id
              return (
                <button
                  key={section.id}
                  type="button"
                  className={isActive ? `${styles.item} ${styles.itemActive}` : styles.item}
                  onClick={() => setActiveId(section.id)}
                  aria-current={isActive ? 'true' : undefined}
                >
                  <span className={styles.index}>{String(index + 1).padStart(2, '0')}</span>
                  <span className={styles.itemBody}>
                    <span className={styles.itemTitle}>{section.title}</span>
                    <span className={styles.itemEn}>{section.en}</span>
                  </span>
                  <span className={isActive ? `${styles.level} ${styles.levelActive}` : styles.level}>
                    {section.level}
                  </span>
                </button>
              )
            })}
          </aside>

          <article className={styles.detail}>
            <header className={styles.detailHead}>
              <h2 className={styles.detailTitle}>{active.title}</h2>
              <span className={styles.detailEn}>{active.en}</span>
              <p className={styles.summary}>{active.summary}</p>
            </header>

            <section className={styles.block}>
              <h3 className={styles.blockTitle}>规则要点</h3>
              <ul className={styles.points}>
                {active.points.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            </section>

            <section className={styles.block}>
              <h3 className={styles.blockTitle}>例句</h3>
              <ol className={styles.examples}>
                {active.examples.map((example) => (
                  <li key={example.en} className={styles.example}>
                    <p className={styles.exampleEn}>{example.en}</p>
                    <p className={styles.exampleZh}>{example.zh}</p>
                    {example.note && <p className={styles.exampleNote}>{example.note}</p>}
                  </li>
                ))}
              </ol>
            </section>

            {relatedSeries.length > 0 && (
              <section className={styles.block}>
                <h3 className={styles.blockTitle}>相关词库</h3>
                <ul className={styles.relatedList}>
                  {relatedSeries.map((series) => (
                    <li key={series.id}>
                      <Link to={`/vocabulary/${series.id}`} className={styles.relatedLink}>
                        {series.title}（{series.wordCount} 词）
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </article>
        </div>
      )}
    </section>
  )
}

function GrammarTopic() {
  const { category = '', topic = '' } = useParams<{ category: string; topic: string }>()

  // key 保证切换主题时重置加载状态和左侧选中项
  return <GrammarTopicView key={`${category}/${topic}`} categoryKey={category} topicKey={topic} />
}

export default GrammarTopic
