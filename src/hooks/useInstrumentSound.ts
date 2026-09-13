import { useCallback, useEffect, useRef, useState } from 'react'

/**
 * 乐器试听音效:同一时刻只播一段,再次点击或切换乐器时停下。
 * `playingId` 是正在发声的乐器 id,空闲时为 null。
 */
export function useInstrumentSound() {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [playingId, setPlayingId] = useState<string | null>(null)

  const stop = useCallback(() => {
    audioRef.current?.pause()
    audioRef.current = null
    setPlayingId(null)
  }, [])

  const toggle = useCallback(
    (id: string, src: string) => {
      if (playingId === id) {
        stop()
        return
      }
      audioRef.current?.pause()
      const audio = new Audio(src)
      audioRef.current = audio
      const release = () => {
        // 音效自然播完时只清理自己,别动后来接管的另一段音效。
        if (audioRef.current === audio) {
          audioRef.current = null
          setPlayingId(null)
        }
      }
      audio.addEventListener('ended', release)
      audio.play().catch(release)
      setPlayingId(id)
    },
    [playingId, stop],
  )

  // 卸载时兜底停声(如整页切走)。
  useEffect(() => stop, [stop])

  return { playingId, toggle, stop }
}
