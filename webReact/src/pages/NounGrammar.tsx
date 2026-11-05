import { useState } from 'react'
import { Link } from 'react-router-dom'
import { nounGrammar } from '../data/nounGrammar.ts'
import styles from './NounGrammar.module.css'

function NounGrammar() {
  const [activeId, setActiveId] = useState(nounGrammar[0].id)
  const active = nounGrammar.find((section) => section.id === activeId) ?? nounGrammar[0]

  return (
    <section>
      <nav className={styles.breadcrumb} aria-label="面包屑">
        <Link to="/grammar">语法</Link>
        <span aria-hidden="true">/</span>
        <span>名词</span>
      </nav>

      <h1 className={styles.pageTitle}>名词</h1>
      <p className={styles.lead}>
        从可数性到复合名词，共 {nounGrammar.length} 个主题，按难度从简单到难排列。左侧选主题，右侧看要点和例句。
      </p>

      <div className={styles.layout}>
        <aside className={styles.sidebar} aria-label="名词语法列表">
          <p className={styles.sidebarTitle}>语法列表</p>
          {nounGrammar.map((section, index) => {
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
    </section>
  )
}

export default NounGrammar
