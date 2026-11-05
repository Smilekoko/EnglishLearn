import { Link } from 'react-router-dom'
import styles from './Page.module.css'

const topics = [
  {
    title: '名词 Noun',
    text: '可数性、单复数、所有格、冠词搭配、复合名词，按难度分 5 个主题。',
    to: '/grammar/noun',
    action: '查看名词语法 →',
  },
  {
    title: '形容词 Adjective',
    text: '分类与功能、位置与顺序、比较级和最高级、常见搭配与易错点。',
  },
  {
    title: '副词 Adverb',
    text: '分类、在句中的位置、比较级与最高级、与形容词的区分。',
  },
]

function Grammar() {
  return (
    <section>
      <h1 className={styles.pageTitle}>语法</h1>
      <p className={styles.lead}>按词法、句法归类整理英语语法，每个主题配规则要点和例句。</p>

      <div className={styles.list}>
        {topics.map((topic) =>
          topic.to ? (
            <Link key={topic.title} to={topic.to} className={`${styles.item} ${styles.itemLink}`}>
              <h2>{topic.title}</h2>
              <p>{topic.text}</p>
              <span className={styles.itemAction}>{topic.action}</span>
            </Link>
          ) : (
            <article key={topic.title} className={styles.item}>
              <h2>
                {topic.title}
                <span className={styles.badge}>整理中</span>
              </h2>
              <p>{topic.text}</p>
            </article>
          ),
        )}
      </div>
    </section>
  )
}

export default Grammar
