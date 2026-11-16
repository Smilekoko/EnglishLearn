import { useCallback, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { fetchVocabSeriesDetail, type VocabSeriesDetail } from '../api/vocabulary.ts'
import page from './Page.module.css'
import styles from './VocabularySeries.module.css'

function VocabularySeriesView({ seriesId }: { seriesId: string }) {
  const [detail, setDetail] = useState<VocabSeriesDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(
    async (signal?: AbortSignal) => {
      try {
        const data = await fetchVocabSeriesDetail(seriesId, signal)
        if (signal?.aborted) return

        setDetail(data)
        setError(null)
      } catch (err) {
        if (signal?.aborted) return
        setError(err instanceof Error ? err.message : '加载失败')
      } finally {
        if (!signal?.aborted) setLoading(false)
      }
    },
    [seriesId],
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

  return (
    <section>
      <nav className={styles.breadcrumb} aria-label="面包屑">
        <Link to="/vocabulary">词汇</Link>
        <span aria-hidden="true">/</span>
        <span>{detail?.title ?? '词库'}</span>
      </nav>

      {loading && <div className={styles.state}>正在加载词库…</div>}

      {!loading && error && (
        <div className={styles.error}>
          <p>{error}</p>
          <button type="button" className={styles.retry} onClick={retry}>
            重试
          </button>
        </div>
      )}

      {!loading && !error && detail && (
        <>
          <h1 className={page.pageTitle}>
            {detail.title}
            <span className={styles.titleEn}>{detail.en}</span>
          </h1>
          <p className={page.lead}>{detail.summary}</p>
          <p className={styles.meta}>
            {detail.wordCount} 个词 · {detail.categories.length} 个分类
          </p>

          <div className={styles.categories}>
            {detail.categories.map((group) => (
              <section key={group.category} className={styles.category}>
                <header className={styles.categoryHead}>
                  <h2 className={styles.categoryTitle}>{group.category}</h2>
                  <span className={styles.categoryCount}>{group.words.length}</span>
                </header>

                <div className={styles.words}>
                  {group.words.map((word) => (
                    <div key={`${group.category}-${word.en}`} className={styles.word}>
                      <span className={styles.wordEn}>{word.en}</span>
                      <span className={styles.wordZh}>{word.zh}</span>
                      {word.note ? <span className={styles.wordNote}>{word.note}</span> : null}
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </>
      )}
    </section>
  )
}

function VocabularySeries() {
  const { seriesId = '' } = useParams<{ seriesId: string }>()

  // key 保证切换系列时重置加载状态
  return <VocabularySeriesView key={seriesId} seriesId={seriesId} />
}

export default VocabularySeries
