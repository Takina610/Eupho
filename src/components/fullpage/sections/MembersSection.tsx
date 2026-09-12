import { memo } from 'react'
import { CharacterProfile } from '@/components/character-profile/CharacterProfile'
import { IndexBackground } from '@/components/fullpage/IndexBackground'
import { Section } from '@/components/fullpage/Section'

export const MembersSection = memo(function MembersSection() {
  return (
    <Section id="members" className="relative text-[#f2fafa]">
      <IndexBackground />
      <h2 className="sr-only">北宇治高校吹奏乐部 部员</h2>
      <div className="relative flex min-h-0 w-full flex-1">
        <CharacterProfile />
      </div>
    </Section>
  )
})
