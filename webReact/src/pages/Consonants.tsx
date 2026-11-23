import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import page from './Page.module.css'
import { fetchConsonants, type Consonant, type ConsonantKind } from '../api/consonants.ts'
import styles from './Consonants.module.css'

/** 固定分组顺序，避免依赖后端排序 */
const KIND_ORDER: ConsonantKind[] = [
  'plosive',
  'fricative',
  'affricate',
  'nasal',
  'lateral',
  'approximant',
]

function ConsonantCard({ consonant }: { consonant: Consonant }) {
  return (
    <article className={styles.card}>
      <div className={styles.cardHead}>
        <span className={styles.symbol}>/{consonant.symbol}/</span>
        <span className={styles.badge}>{consonant.label}</span>
      </div>

      <p className={styles.primaryWord}>
        {consonant.word}
        {consonant.wordIpa && <span className={styles.ipa}>{consonant.wordIpa}</span>}
      </p>

      {consonant.tip && <p className={styles.tip}>{consonant.tip}</p>}

      {consonant.examples.length > 0 && (
        <p className={styles.moreWords}>
          {consonant.examples.map((example) => (
            <span key={example.word} className={styles.moreWord}>
              {example.word}
              {example.ipa && <span className={styles.moreIpa}>{example.ipa}</span>}
            </span>
          ))}
        </p>
      )}
    </article>
  )
}

function Consonants() {
  const [consonants, setConsonants] = useState<Consonant[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    const controller = new AbortController()
    fetchConsonants(controller.signal)
      .then((data) => {
        if (controller.signal.aborted) return
        setConsonants(data)
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

  const groups = KIND_ORDER.map((kind) => ({
    kind,
    label: consonants.find((item) => item.kind === kind)?.label ?? '',
    items: consonants.filter((item) => item.kind === kind),
  })).filter((group) => group.items.length > 0)

  const summary = groups.map((group) => `${group.items.length} 个${group.label}`).join('、')

  return (
    <section>
      <nav className={styles.breadcrumb} aria-label="面包屑">
        <Link to="/phonetics">音标</Link>
        <span aria-hidden="true">/</span>
        <span>辅音</span>
      </nav>

      <h1 className={styles.pageTitle}>辅音</h1>
      <p className={styles.lead}>
        {loading || error || groups.length === 0
          ? '按爆破音、摩擦音、破擦音、鼻音、边音和半元音分组，逐个给出例词与发音要点。'
          : `共 ${consonants.length} 个：${summary}。按分组逐个对照口型和发音要点。`}
      </p>

      {loading && <div className={page.state}>正在加载辅音数据…</div>}

      {!loading && error && (
        <div className={page.error}>
          <p>{error}</p>
          <button type="button" className={page.retry} onClick={retry}>
            重试
          </button>
        </div>
      )}

      {!loading && !error && consonants.length === 0 && <div className={page.state}>暂无辅音数据。</div>}

      {!loading &&
        !error &&
        groups.map((group) => (
          <div key={group.kind}>
            <h2 className={styles.sectionTitle}>
              {group.label}
              <span className={styles.count}>{group.items.length}</span>
            </h2>
            <div className={styles.grid}>
              {group.items.map((consonant) => (
                <ConsonantCard key={consonant.symbol} consonant={consonant} />
              ))}
            </div>
          </div>
        ))}

      <Link to="/phonetics" className={styles.back}>
        ← 返回音标
      </Link>
    </section>
  )
}

export default Consonants
