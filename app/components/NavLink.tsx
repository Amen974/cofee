'use client'

import Link, { LinkProps } from 'next/link'
import { usePathname } from 'next/navigation'
import { useNavigationStore } from '@/lib/store/useNavigationStore'
import { ComponentProps } from 'react'

type NavLinkProps = LinkProps & ComponentProps<'a'>

export default function NavLink({ children, onClick, href, ...props }: NavLinkProps) {
  const setNavigating = useNavigationStore(s => s.setNavigating)
  const pathname = usePathname()

  return (
    <Link
      {...props}
      href={href}
      onClick={(e) => {
        const targetPath = typeof href === 'string' ? href : pathname
        if (targetPath !== pathname) {
          setNavigating(true)
        }
        onClick?.(e)
      }}
    >
      {children}
    </Link>
  )
}