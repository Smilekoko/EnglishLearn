import { Link } from 'react-router-dom'
import page from './Page.module.css'
import styles from './Grammar.module.css'
import { grammarCategories } from '../data/grammarTopics.ts'

function Grammar() {
  return (
    <section>
      <h1 className={page.pageTitle}>语法</h1>
      <p className={page.lead}>按「词法」和「句法」两大类整理，每个条目配规则要点和例句。</p>

      <div className={styles.categoryGrid}>
        {grammarCategories.map((category) => (
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
    </section>
  )
}

export default Grammar
