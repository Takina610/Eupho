import { memo } from 'react'
import { CharacterProfile } from '@/components/character-profile/CharacterProfile'
import { IndexBackground } from '@/components/fullpage/IndexBackground'
import { Section } from '@/components/fullpage/Section'
import { TargetCursor } from '@/components/target-cursor/TargetCursor'

// 部员页文案区的有效框:徽章/缩略图卡这类带边框或完整子盒的按整体包裹,
// 纯文本块贴文字内容,且命中判定以有效框为准(指针必须在可视范围内)
const MEMBER_TARGET_SELECTOR = [
  '.cp__kicker-path',
  '.cp__kicker-title',
  '.cp__name-en',
  '.cp__name',
  '.cp__badge',
  '.cp__cv-label',
  '.cp__cv',
  '.cp__synopsis',
  '.cp__thumb',
].join(', ')

export const MembersSection = memo(function MembersSection() {
  return (
    <Section id="members" className="relative text-[#f2fafa]">
      <TargetCursor
        targetSelector={MEMBER_TARGET_SELECTOR}
        boundsSelector="#members"
        spinDuration={2.4}
        hoverDuration={0.25}
        parallaxOn={false}
        cursorColor="#f2fafa"
        cursorColorOnTarget="#fff830"
      />
      <IndexBackground />
      <h2 className="sr-only">北宇治高校吹奏乐部 部员</h2>
      <div className="relative flex min-h-0 w-full flex-1">
        <CharacterProfile />
      </div>
    </Section>
  )
})
