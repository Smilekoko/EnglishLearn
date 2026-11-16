import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchVocabSeries, type VocabSeriesSummary } from '../api/vocabulary.ts'
import page from './Page.module.css'
import styles from './Vocabulary.module.css'

function Vocabulary() {
  const [series, setSeries] = useState<VocabSeriesSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async (signal?: AbortSignal) => {
    try {
      const data = await fetchVocabSeries(signal)
      if (signal?.aborted) return

      setSeries(data)
      setError(null)
    } catch (err) {
      if (signal?.aborted) return
      setError(err instanceof Error ? err.message : '加载失败')
    } finally {
      if (!signal?.aborted) setLoading(false)
    }
  }, [])

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

  return (
    <section>
      <h1 className={page.pageTitle}>词汇</h1>
      <p className={page.lead}>按主题分类的词库，一个系列一个入口，配中文释义和用法提示。</p>

      {loading && <div className={styles.state}>正在加载词库…</div>}

      {!loading && error && (
        <div className={styles.error}>
          <p>{error}</p>
          <button type="button" className={styles.retry} onClick={retry}>
            重试
          </button>
        </div>
      )}

      {!loading && !error && series.length === 0 && <div className={styles.state}>暂无词库。</div>}

      {!loading && !error && series.length > 0 && (
        <div className={styles.grid}>
          {series.map((item) => (
            <Link key={item.id} to={`/vocabulary/${item.id}`} className={styles.card}>
              <h2 className={styles.cardTitle}>
                {item.title}
                <span className={styles.cardEn}>{item.en}</span>
              </h2>
              <p className={styles.cardText}>{item.summary}</p>
              <span className={styles.cardMeta}>{item.wordCount} 个词 →</span>
            </Link>
          ))}
        </div>
      )}
    </section>
  )
}

export default Vocabulary
