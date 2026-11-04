import { Link } from 'react-router-dom'
import styles from './Page.module.css'

function NotFound() {
  return (
    <section>
      <h1 className={styles.pageTitle}>页面不存在</h1>
      <p className={styles.lead}>这个地址还没有内容，可能链接已经失效。</p>
      <Link to="/">← 返回首页</Link>
    </section>
  )
}

export default NotFound
