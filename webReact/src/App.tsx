import { NavLink, Navigate, Route, Routes } from 'react-router-dom'
import Home from './pages/Home.tsx'
import Grammar from './pages/Grammar.tsx'
import GrammarCategory from './pages/GrammarCategory.tsx'
import GrammarTopic from './pages/GrammarTopic.tsx'
import Phonetics from './pages/Phonetics.tsx'
import Vowels from './pages/Vowels.tsx'
import Consonants from './pages/Consonants.tsx'
import Vocabulary from './pages/Vocabulary.tsx'
import VocabularySeries from './pages/VocabularySeries.tsx'
import NotFound from './pages/NotFound.tsx'
import styles from './App.module.css'

const navItems = [
  { to: '/', label: '首页', end: true },
  { to: '/grammar', label: '语法', end: false },
  { to: '/phonetics', label: '音标', end: false },
  { to: '/vocabulary', label: '词汇', end: false },
]

function App() {
  return (
    <div className={styles.shell}>
      <header className={styles.header}>
        <NavLink to="/" className={styles.brand}>
          <span className={styles.brandMark} aria-hidden="true">
            EL
          </span>
          <span>EnglishLearn</span>
        </NavLink>

        <nav className={styles.nav} aria-label="主导航">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                isActive ? `${styles.navLink} ${styles.navLinkActive}` : styles.navLink
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </header>

      <main className={styles.main}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/grammar" element={<Grammar />} />
          <Route path="/grammar/:category" element={<GrammarCategory />} />
          <Route path="/grammar/:category/:topic" element={<GrammarTopic />} />
          {/* 旧地址兼容 */}
          <Route path="/grammar/noun" element={<Navigate to="/grammar/word/noun" replace />} />
          <Route path="/phonetics" element={<Phonetics />} />
          <Route path="/phonetics/vowels" element={<Vowels />} />
          <Route path="/phonetics/consonants" element={<Consonants />} />
          <Route path="/vocabulary" element={<Vocabulary />} />
          <Route path="/vocabulary/:seriesId" element={<VocabularySeries />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <footer className={styles.footer}>EnglishLearn · 语法与音标学习笔记</footer>
    </div>
  )
}

export default App
