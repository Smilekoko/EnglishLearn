import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import page from './Page.module.css'
import { fetchVowels, type Vowel } from '../api/vowels.ts'
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
        {vowel.word}
        {vowel.wordIpa && <span className={styles.ipa}>{vowel.wordIpa}</span>}
      </p>

      {vowel.tip && <p className={styles.tip}>{vowel.tip}</p>}

      {vowel.examples.length > 0 && (
        <p className={styles.moreWords}>
          {vowel.examples.map((example) => (
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

function Vowels() {
  const { playing, toggle } = useVowelPlayer()
  const [vowels, setVowels] = useState<Vowel[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    const controller = new AbortController()
    fetchVowels(controller.signal)
      .then((data) => {
        if (controller.signal.aborted) return
        setVowels(data)
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

  const monophthongs = vowels.filter((vowel) => vowel.kind === 'monophthong')
  const diphthongs = vowels.filter((vowel) => vowel.kind === 'diphthong')

  return (
    <section>
      <nav className={styles.breadcrumb} aria-label="面包屑">
        <Link to="/phonetics">音标</Link>
        <span aria-hidden="true">/</span>
        <span>元音</span>
      </nav>

      <h1 className={styles.pageTitle}>元音</h1>
      <p className={styles.lead}>
        {loading || error
          ? '单元音守住口型和长短，双元音注意滑动方向。点卡片上的播放键可以听发音。'
          : `共 ${vowels.length} 个：${monophthongs.length} 个单元音、${diphthongs.length} 个双元音。单元音守住口型和长短，双元音注意滑动方向。点卡片上的播放键可以听发音。`}
      </p>

      {loading && <div className={page.state}>正在加载元音数据…</div>}

      {!loading && error && (
        <div className={page.error}>
          <p>{error}</p>
          <button type="button" className={page.retry} onClick={retry}>
            重试
          </button>
        </div>
      )}

      {!loading && !error && vowels.length === 0 && <div className={page.state}>暂无元音数据。</div>}

      {!loading && !error && monophthongs.length > 0 && (
        <>
          <h2 className={styles.sectionTitle}>
            单元音<span className={styles.count}>{monophthongs.length}</span>
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
        </>
      )}

      {!loading && !error && diphthongs.length > 0 && (
        <>
          <h2 className={styles.sectionTitle}>
            双元音<span className={styles.count}>{diphthongs.length}</span>
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
        </>
      )}

      <Link to="/phonetics" className={styles.back}>
        ← 返回音标
      </Link>
    </section>
  )
}

export default Vowels
