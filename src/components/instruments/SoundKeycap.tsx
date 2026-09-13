import { MorphIcon } from 'morphicons/react'
import { Music, Music4, Pause, Play } from 'lucide'

import './SoundKeycap.css'

type SoundKeycapProps = {
  playing: boolean
  onToggle: () => void
  /** 乐器名,用于无障碍标签。 */
  name: string
}

/**
 * 键帽造型的试听按钮,配色取自站点 ink/deep/panel 的青灰系,贴住页面底色。
 * 中央播放/暂停与左上音符用 morphicons 做弹簧变形(pause⇄play、music⇄music);
 * 播放时键帽保持按下、描环转品牌青,右侧均衡条与音符特效跳动。
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
          <MorphIcon icon={playing ? Music4 : Music} size={16} strokeWidth={2} spring="snappy" reducedMotion="user" />
        </span>
        <span className="sound-keycap-icon" aria-hidden>
          <MorphIcon icon={playing ? Pause : Play} strokeWidth={2} spring="snappy" reducedMotion="user" />
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
