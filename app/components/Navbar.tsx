'use client'

import Link from "next/link"
import { useState } from "react";

interface NavItem {
  label: string;
  href: string;
}

const navItems: NavItem[] = [
  { label: 'HOME', href: '/' },
  { label: 'MENU', href: '/menu' },
  { label: 'RESERVATION', href: '/reservation' },
  { label: 'CONTACT', href: '/contact' },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const toggleMenu = (): void => setIsOpen(!isOpen);
  const closeMenu = (): void => setIsOpen(false);

  return (
    <header className="w-full bg-[#0E0D0B] z-40 flex items-center justify-between px-6 py-6 md:px-12 md:py-6 border-b border-[#2A1F1C]/40">
      <Link href="/" className="flex flex-col items-start group" data-cursor-hover>
        <span className="text-lg md:text-xl tracking-[0.3em] text-[#E8E0D8] group-hover:text-[#7C1515] transition-colors duration-300">
          OBSIDIAN
        </span>
        <span className="text-[9px] tracking-[0.45em] text-[#6B6360] uppercase mt-0.5">
          Coffee Lounge
        </span>
      </Link>
      <nav className="hidden md:flex items-center space-x-12">
        {navItems.map((link) => (
          <Link
            key={link.label}
            href={link.href}
            className="text-xs tracking-[0.25em] text-[#6B6360] hover:text-[#E8E0D8] transition-colors duration-300"
            data-cursor-hover
          >
            {link.label}
          </Link>
        ))}
      </nav>
      <div className="hidden md:flex items-center space-x-6">
        <Link
          href="/login"
          data-cursor-hover
          className="text-[11px] tracking-[0.2em] text-[#6B6360] hover:text-[#E8E0D8] flex items-center space-x-2 transition-colors duration-300"
        >
          <svg
            className="w-4 h-4 text-[#7C1515]"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
          </svg>
          <span>ONLY WORKERS</span>
        </Link>
        <Link
          href="/reservation"
          data-cursor-hover
          className="text-[10px] tracking-[0.25em] text-[#E8E0D8] border border-[#7C1515] px-5 py-2.5 rounded-sm hover:bg-[#7C1515] transition-all duration-300 ease-out"
        >
          RESERVE A TABLE
        </Link>
      </div>
      <button
        onClick={toggleMenu}
        aria-label="Toggle navigation menu"
        className="md:hidden p-2 text-[#E8E0D8] hover:text-[#7C1515] transition-colors focus:outline-none"
      >
        {isOpen ? (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9h16.5m-16.5 6.75h16.5" />
          </svg>
        )}
      </button>
      <div
        className={`fixed inset-y-0 right-0 w-full bg-[#0D0907] border-l border-[#2A1F1C]/80 shadow-2xl z-50 transform transition-transform duration-500 ease-in-out md:hidden flex flex-col p-8 ${isOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
      >
        <div className="flex items-center justify-between pb-6 border-b border-[#2A1F1C]">
          <div className="flex flex-col">
            <span className="text-sm tracking-[0.3em] text-[#E8E0D8]">
              OBSIDIAN
            </span>
            <span className="text-[8px] tracking-[0.3em] text-[#6B6360] uppercase mt-0.5">
              Lounge Space
            </span>
          </div>
          <button
            onClick={closeMenu}
            className="p-2 text-[#6B6360] hover:text-[#E8E0D8] transition-colors focus:outline-none"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <nav className="flex flex-col space-y-8 py-10">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              onClick={closeMenu}
              className="text-sm tracking-[0.3em] text-[#6B6360] hover:text-[#E8E0D8] transition-colors duration-300"
            >
              {item.label}
            </a>
          ))}
        </nav>
        <div className="space-y-4 pt-6 border-t border-[#2A1F1C]">
          <Link
            href="/login"
            onClick={closeMenu}
            className="w-full py-4 bg-[#2A1F1C]/40 border border-[#2A1F1C] hover:border-[#7C1515] flex items-center justify-center space-x-3 text-xs tracking-[0.2em] text-[#E8E0D8] transition-colors rounded-sm"
          >
            <svg className="w-4 h-4 text-[#7C1515]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
            </svg>
            <span>ONLY WORKERS</span>
          </Link>
          <Link
            href="#reserve"
            onClick={closeMenu}
            className="w-full py-4 bg-[#7C1515] text-[#E8E0D8] flex items-center justify-center text-xs tracking-[0.2em] hover:bg-[#8B1A1A] transition-colors rounded-sm shadow-lg shadow-black/40"
          >
            RESERVE A TABLE
          </Link>
        </div>
      </div>

    </header>
  )
}

export default Navbar