import { Link } from 'react-router-dom'
import styles from './Page.module.css'

const sections = [
  {
    title: '元音（20 个）',
    text: '12 个单元音（含长短元音）+ 8 个双元音，逐个给出例词与发音要点。',
    to: '/phonetics/vowels',
    action: '查看 20 个元音 →',
  },
  {
    title: '辅音（28 个）',
    text: '按爆破音、摩擦音、破擦音、鼻音、边音和半元音分组练习。',
  },
]

function Phonetics() {
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
