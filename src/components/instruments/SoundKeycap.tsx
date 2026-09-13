import './SoundKeycap.css'

type SoundKeycapProps = {
  playing: boolean
  onToggle: () => void
  /** 乐器名,用于无障碍标签。 */
  name: string
}

/**
 * 键帽造型的试听按钮。播放时键帽保持按下、描环转品牌青,
 * 右侧出现跳动的均衡条与上浮的音符特效。
 */
export function SoundKeycap({ playing, onToggle, name }: SoundKeycapProps) {
  return (
    <div className="sound-keycap-wrap" data-playing={playing}>
      <button
        type="button"
        className="sound-keycap"
        onClick={onToggle}
        aria-pressed={playing}
        aria-label={playing ? `停止播放${name}的声音` : `播放${name}的声音`}
      >
        <span className="sound-keycap-letter" aria-hidden>
          ♪
        </span>
        <span className="sound-keycap-icon" aria-hidden>
          {playing ? (
            <svg viewBox="0 0 14 14" fill="currentColor">
              <rect x="3" y="2.5" width="3" height="9" rx="0.6" />
              <rect x="8" y="2.5" width="3" height="9" rx="0.6" />
            </svg>
          ) : (
            <svg viewBox="0 0 14 14" fill="currentColor">
              <path d="M4.4 2.6v8.8L11.8 7z" />
            </svg>
          )}
        </span>
      </button>
      <span className="sound-eq" aria-hidden>
        <i />
        <i />
        <i />
        <i />
        <i />
      </span>
      <span className="sound-notes" aria-hidden>
        <i>♪</i>
        <i>♫</i>
        <i>♪</i>
      </span>
    </div>
  )
}
