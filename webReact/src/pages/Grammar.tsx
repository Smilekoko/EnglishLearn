import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import page from './Page.module.css'
import styles from './Grammar.module.css'
import { fetchGrammarCatalog, type GrammarCategorySummary } from '../api/grammar.ts'

function Grammar() {
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

  const retry = () => {
    setLoading(true)
    setError(null)
    setReloadKey((key) => key + 1)
  }

  return (
    <section>
      <h1 className={page.pageTitle}>语法</h1>
      <p className={page.lead}>按「词法」和「句法」两大类整理，每个条目配规则要点和例句。</p>

      {loading && <div className={page.state}>正在加载语法目录…</div>}

      {!loading && error && (
        <div className={page.error}>
          <p>{error}</p>
          <button type="button" className={page.retry} onClick={retry}>
            重试
          </button>
        </div>
      )}

      {!loading && !error && categories.length === 0 && <div className={page.state}>暂无语法目录。</div>}

      {!loading && !error && categories.length > 0 && (
        <div className={styles.categoryGrid}>
          {categories.map((category) => (
            <Link key={category.key} to={`/grammar/${category.key}`} className={styles.categoryCard}>
              <h2 className={styles.categoryTitle}>
                {category.title}
                <span className={styles.categoryEn}>{category.en}</span>
              </h2>
              <p className={styles.categoryText}>{category.description}</p>
              <span className={styles.categoryMeta}>{category.topics.length} 个条目 →</span>
            </Link>
          ))}
        </div>
      )}
    </section>
  )
}

export default Grammar
