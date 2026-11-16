import { useCallback, useEffect, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { fetchGrammarSections, type GrammarSection } from '../api/grammar.ts'
import { grammarCategories, type GrammarCategory } from '../data/grammarTopics.ts'
import { grammarTopicMeta, type GrammarTopicMeta } from '../data/grammarTopicMeta.ts'
import styles from './GrammarTopic.module.css'

function GrammarTopicView({
  topic,
  meta,
  category,
}: {
  topic: string
  meta: GrammarTopicMeta
  category: GrammarCategory
}) {
  const [sections, setSections] = useState<GrammarSection[]>([])
  const [activeId, setActiveId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(
    async (signal?: AbortSignal) => {
      try {
        const data = await fetchGrammarSections(topic, signal)
        if (signal?.aborted) return

        setSections(data)
        setError(null)
        setActiveId((current) =>
          current && data.some((section) => section.id === current) ? current : (data[0]?.id ?? null),
        )
      } catch (err) {
        if (signal?.aborted) return
        setError(err instanceof Error ? err.message : '加载失败')
      } finally {
        if (!signal?.aborted) setLoading(false)
      }
    },
    [topic],
  )

  useEffect(() => {
    const controller = new AbortController()
    // 数据在 await 之后才落地，不会在渲染期同步触发重渲染
    // eslint-disable-next-line react/set-state-in-effect
    void load(controller.signal)
    return () => controller.abort()
  }, [load])

  const retry = () => {
    setLoading(true)
    setError(null)
    void load()
  }

  const active = sections.find((section) => section.id === activeId) ?? sections[0] ?? null

  return (
    <section>
      <nav className={styles.breadcrumb} aria-label="面包屑">
        <Link to="/grammar">语法</Link>
        <span aria-hidden="true">/</span>
        <Link to={`/grammar/${category.key}`}>{category.title}</Link>
        <span aria-hidden="true">/</span>
        <span>{meta.title}</span>
      </nav>

      <h1 className={styles.pageTitle}>{meta.title}</h1>
      <p className={styles.lead}>
        {active ? `共 ${sections.length} 个主题。${meta.lead}` : meta.lead}
      </p>

      {loading && <div className={styles.state}>正在加载语法数据…</div>}

      {!loading && error && (
        <div className={styles.error}>
          <p>{error}</p>
          <button type="button" className={styles.retry} onClick={retry}>
            重试
          </button>
        </div>
      )}

      {!loading && !error && !active && <div className={styles.state}>暂无语法数据。</div>}

      {!loading && !error && active && (
        <div className={styles.layout}>
          <aside className={styles.sidebar} aria-label={`${meta.title}语法列表`}>
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
          </article>
        </div>
      )}
    </section>
  )
}

function GrammarTopic() {
  const { category: categoryKey = '', topic = '' } = useParams<{ category: string; topic: string }>()
  const meta = grammarTopicMeta[topic]
  const category = grammarCategories.find((item) => item.key === categoryKey)

  if (!meta || !category) {
    return <Navigate to="/grammar/word" replace />
  }

  // key 保证切换主题时重置加载状态和左侧选中项
  return <GrammarTopicView key={`${category.key}/${topic}`} topic={topic} meta={meta} category={category} />
}

export default GrammarTopic
