import { cn } from '@/lib/utils'
import Image from 'next/image'
import Link from 'next/link'

export function LotusMark({ className }: { className?: string }) {
  return (
    <Image
      src="/images/logo-small.png"
      alt="LotusRise Logo"
      width={52}
      height={44}
      className={cn('h-11 w-auto object-contain', className)}
      priority
    />
  )
}

export function LotusLogo({
  className,
  textClass,
}: {
  className?: string
  textClass?: string
}) {
  return (
    <Link href="/" className={cn('flex items-center gap-2.5', className)}>
      <LotusMark />
      <div className="leading-none">
        <span
          className={cn(
            'font-heading text-xl font-extrabold tracking-tight text-ink',
            textClass,
          )}
        >
          LotusRise
        </span>
        <span className="block text-[0.6rem] font-semibold tracking-[0.4em] text-gold">
          GLOBAL
        </span>
      </div>
    </Link>
  )
}
