'use client'
import NavLink from "@/app/components/NavLink"
import { InstagramLogoIcon, FacebookLogoIcon, ArrowUpRightIcon } from "@phosphor-icons/react"

interface FooterNavItem {
  label: string
  href: string
}

const footerNavItems: FooterNavItem[] = [
  { label: 'HOME', href: '/' },
  { label: 'MENU', href: '/menu' },
  { label: 'RESERVATION', href: '/reservation' },
  { label: 'CONTACT', href: '/contact' },
  { label: 'CART', href: '/cart' },
]

const socialLinks = [
  { label: 'Instagram', href: 'https://instagram.com', icon: InstagramLogoIcon },
  { label: 'Facebook', href: 'https://facebook.com', icon: FacebookLogoIcon },
]

const Footer = () => {
  return (
    <footer className="border-t border-[#2A1F1C]/60 px-6 md:px-12 pt-16 pb-8 text-[#8D7E73]">
      <div className="max-w-6xl mx-auto flex flex-col gap-14">
        <div className="flex flex-col md:flex-row md:justify-between gap-10">
          <div className="flex flex-col gap-3">
            <span className="text-xl tracking-[0.3em] text-[#E8E0D8] font-serif">
              OBSIDIAN
            </span>
            <span className="text-[9px] tracking-[0.4em] text-[#6B6360] uppercase">
              Coffee Lounge
            </span>
            <p className="text-xs leading-relaxed text-[#6B6360] max-w-64 mt-2">
              Freshly roasted, locally sourced, brewed with intention.
            </p>
          </div>

          <div className="flex flex-col gap-5">
            <span className="text-[10px] tracking-[0.3em] uppercase text-[#6B6360]">
              Navigate
            </span>
            <nav className="flex flex-col gap-3">
              {footerNavItems.map((item) => (
                <NavLink
                  data-cursor-hover
                  key={item.label}
                  href={item.href}
                  className="text-xs tracking-[0.2em] text-[#8D7E73] hover:text-[#E8E0D8] transition-colors duration-300 w-fit group relative"
                >
                  {item.label}
                  <span className="absolute -bottom-1 left-0 w-full h-px bg-[#A32D1C] scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                </NavLink>
              ))}
            </nav>
          </div>

          <div className="flex flex-col gap-5">
            <span className="text-[10px] tracking-[0.3em] uppercase text-[#6B6360]">
              Follow
            </span>
            <div className="flex gap-4">
              {socialLinks.map((social) => {
                const Icon = social.icon
                return (
                  <a
                    data-cursor-hover
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="w-9 h-9 flex items-center justify-center rounded-full border border-[#2A1F1C] text-[#8D7E73] hover:text-[#E8E0D8] hover:border-[#7C1515] transition-colors duration-300"
                  >
                    <Icon size={15} />
                  </a>
                )
              })}
            </div>
          </div>
        </div>

        {/* Made-by callout: separated from the copyright line and styled as its own
            bordered block so it reads as a distinct, clickable element rather than
            fine print. */}
        <a
          href="https://portfolio-delta-eight-29.vercel.app/"
          data-cursor-hover
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center justify-between gap-4 rounded-lg border border-[#2A1F1C] px-6 py-4 hover:border-[#A32D1C] hover:bg-[#2A1F1C]/20 transition-colors duration-300"
        >
          <span className="flex items-baseline gap-2 flex-wrap">
            <span className="text-[10px] tracking-[0.2em] uppercase text-[#6B6360]">
              Site crafted by
            </span>
            <span className="text-sm tracking-widest text-[#E8E0D8] font-serif group-hover:text-[#A32D1C] transition-colors duration-300">
              AMEN ALLAH ARFAOUI
            </span>
          </span>
          <ArrowUpRightIcon
            size={16}
            className="text-[#8D7E73] group-hover:text-[#A32D1C] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300 shrink-0"
          />
        </a>

        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-6 border-t border-[#2A1F1C]/40">
          <span className="text-[10px] tracking-[0.15em] text-[#6B6360] uppercase">
            © {new Date().getFullYear()} Obsidian Coffee Lounge. All rights reserved.
          </span>
        </div>
      </div>
    </footer>
  )
}

export default Footer