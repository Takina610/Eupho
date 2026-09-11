import castStaffBg from '@/assets/backgrounds/cast-staff.webp'

export function IndexBackground() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 bg-[#245956] bg-cover bg-no-repeat bg-[center_top]"
      style={{ backgroundImage: `url(${castStaffBg})` }}
    />
  )
}
