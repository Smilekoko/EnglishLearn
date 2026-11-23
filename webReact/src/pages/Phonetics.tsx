import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import styles from './Page.module.css'
import { fetchVowels } from '../api/vowels.ts'
import { fetchConsonants } from '../api/consonants.ts'

interface VowelStats {
  total: number
  mono: number
  diph: number
}

function Phonetics() {
  const [stats, setStats] = useState<VowelStats | null>(null)
  const [consonantCount, setConsonantCount] = useState<number | null>(null)

  useEffect(() => {
    const controller = new AbortController()

    fetchVowels(controller.signal)
      .then((vowels) => {
        if (controller.signal.aborted) return
        setStats({
          total: vowels.length,
          mono: vowels.filter((vowel) => vowel.kind === 'monophthong').length,
          diph: vowels.filter((vowel) => vowel.kind === 'diphthong').length,
        })
      })
      // 计数只是辅助信息，接口挂了就退化成不带数字的文案
      .catch(() => undefined)

    fetchConsonants(controller.signal)
      .then((consonants) => {
        if (controller.signal.aborted) return
        setConsonantCount(consonants.length)
      })
      .catch(() => undefined)

    return () => controller.abort()
  }, [])

  const sections = [
    {
      title: stats ? `元音（${stats.total} 个）` : '元音',
      text: stats
        ? `${stats.mono} 个单元音（含长短元音）+ ${stats.diph} 个双元音，逐个给出例词与发音要点。`
        : '单元音与双元音逐个给出例词与发音要点。',
      to: '/phonetics/vowels',
      action: stats ? `查看 ${stats.total} 个元音 →` : '查看元音 →',
    },
    {
      title: consonantCount === null ? '辅音' : `辅音（${consonantCount} 个）`,
      text: '按爆破音、摩擦音、破擦音、鼻音、边音和半元音分组，逐个给出例词与发音要点。',
      to: '/phonetics/consonants',
      action: consonantCount === null ? '查看辅音 →' : `查看 ${consonantCount} 个辅音 →`,
    },
  ]

  return (
    <section>
      <h1 className={styles.pageTitle}>音标</h1>
      <p className={styles.lead}>音标是发音的地基：先认准口型和舌位，再用例词巩固。</p>

      <div className={styles.list}>
        {sections.map((section) =>
          section.to ? (
            <Link key={section.title} to={section.to} className={`${styles.item} ${styles.itemLink}`}>
              <h2>{section.title}</h2>
              <p>{section.text}</p>
              <span className={styles.itemAction}>{section.action}</span>
            </Link>
          ) : (
            <article key={section.title} className={styles.item}>
              <h2>
                {section.title}
                <span className={styles.badge}>整理中</span>
              </h2>
              <p>{section.text}</p>
            </article>
          ),
        )}
      </div>
    </section>
  )
}

export default Phonetics
