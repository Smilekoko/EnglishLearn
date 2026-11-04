import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { diphthongs, monophthongs, type Vowel } from '../data/vowels.ts'
import styles from './Vowels.module.css'

const AUDIO_BASE = `${import.meta.env.BASE_URL}audio/`

function PlayIcon() {
  return (
    <svg viewBox="0 0 12 12" width="11" height="11" aria-hidden="true">
      <path d="M3.6 2.1v7.8L10 6z" fill="currentColor" />
    </svg>
  )
}

function StopIcon() {
  return (
    <svg viewBox="0 0 12 12" width="11" height="11" aria-hidden="true">
      <rect x="3" y="3" width="6" height="6" rx="1.2" fill="currentColor" />
    </svg>
  )
}

/** 一个复用的 <audio> 播放器；同一时间只播放一条 */
function createPlayer() {
  const audio = new Audio()

  return {
    play(src: string, onStop: () => void) {
      audio.pause()
      audio.src = src
      audio.currentTime = 0
      audio.onended = onStop
      audio.onerror = onStop
      return audio.play()
    },
    stop() {
      audio.pause()
      audio.currentTime = 0
    },
  }
}

function useVowelPlayer() {
  const [player] = useState(createPlayer)
  const [playing, setPlaying] = useState<string | null>(null)
  // 每次点击自增，用于丢弃过期的 play() 回调（连点或播放失败时不会误清状态）
  const tokenRef = useRef(0)

  useEffect(
    () => () => {
      tokenRef.current += 1
      player.stop()
    },
    [player],
  )

  const toggle = (vowel: Vowel) => {
    if (playing === vowel.symbol) {
      tokenRef.current += 1
      player.stop()
      setPlaying(null)
      return
    }

    // 先亮起按钮，音频真正开始播放前就有反馈
    const token = ++tokenRef.current
    setPlaying(vowel.symbol)

    const clearIfCurrent = () => {
      if (tokenRef.current === token) setPlaying(null)
    }

    player
      .play(`${AUDIO_BASE}${vowel.audio}`, clearIfCurrent)
      .catch(clearIfCurrent)
  }

  return { playing, toggle }
}

function VowelCard({
  vowel,
  isPlaying,
  onPlay,
}: {
  vowel: Vowel
  isPlaying: boolean
  onPlay: (vowel: Vowel) => void
}) {
  const [primary, ...others] = vowel.examples

  return (
    <article className={styles.card}>
      <div className={styles.cardHead}>
        <span className={styles.symbol}>/{vowel.symbol}/</span>
        <button
          type="button"
          className={isPlaying ? `${styles.play} ${styles.playing}` : styles.play}
          onClick={() => onPlay(vowel)}
          aria-label={isPlaying ? `停止播放 /${vowel.symbol}/` : `播放 /${vowel.symbol}/ 的发音`}
          aria-pressed={isPlaying}
        >
          {isPlaying ? <StopIcon /> : <PlayIcon />}
        </button>
        <span className={styles.badge}>{vowel.label}</span>
      </div>

      <p className={styles.primaryWord}>
        {primary.word}
        <span className={styles.ipa}>{primary.ipa}</span>
      </p>

      <p className={styles.tip}>{vowel.tip}</p>

      {others.length > 0 && (
        <p className={styles.moreWords}>
          {others.map((example) => (
            <span key={example.word} className={styles.moreWord}>
              {example.word}
              <span className={styles.moreIpa}>{example.ipa}</span>
            </span>
          ))}
        </p>
      )}
    </article>
  )
}

function Vowels() {
  const { playing, toggle } = useVowelPlayer()

  return (
    <section>
      <nav className={styles.breadcrumb} aria-label="面包屑">
        <Link to="/phonetics">音标</Link>
        <span aria-hidden="true">/</span>
        <span>元音</span>
      </nav>

      <h1 className={styles.pageTitle}>元音</h1>
      <p className={styles.lead}>
        共 20 个：12 个单元音、8 个双元音。单元音守住口型和长短，双元音注意滑动方向。
        点卡片上的播放键可以听发音。
      </p>

      <h2 className={styles.sectionTitle}>
        单元音<span className={styles.count}>12</span>
      </h2>
      <div className={styles.grid}>
        {monophthongs.map((vowel) => (
          <VowelCard
            key={vowel.symbol}
            vowel={vowel}
            isPlaying={playing === vowel.symbol}
            onPlay={toggle}
          />
        ))}
      </div>

      <h2 className={styles.sectionTitle}>
        双元音<span className={styles.count}>8</span>
      </h2>
      <div className={styles.grid}>
        {diphthongs.map((vowel) => (
          <VowelCard
            key={vowel.symbol}
            vowel={vowel}
            isPlaying={playing === vowel.symbol}
            onPlay={toggle}
          />
        ))}
      </div>

      <Link to="/phonetics" className={styles.back}>
        ← 返回音标
      </Link>
    </section>
  )
}

export default Vowels
