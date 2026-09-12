import castStaffBg from '@/assets/backgrounds/cast-staff.webp'

export function IndexBackground({ veiled = false }: { veiled?: boolean }) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-0 bg-[#245956] bg-cover bg-no-repeat bg-[center_top] transition-opacity duration-500 ${
        veiled ? 'opacity-0' : 'opacity-100'
      }`}
      style={{ backgroundImage: `url(${castStaffBg})` }}
    />
  )
}
