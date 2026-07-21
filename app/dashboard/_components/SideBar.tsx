'use client'

import { ScrollIcon, CalendarCheckIcon, BookOpenIcon, GearIcon, type Icon } from "@phosphor-icons/react";
import { usePathname } from "next/navigation";
import { useStoreStatus } from "@/lib/hooks/useStoreStatus";
import { useTableCount } from "@/lib/hooks/useTableCount";
import NavLink from "@/app/components/NavLink";

interface NavItem {
  readonly href: string;
  readonly label: string;
  readonly icon: Icon;
  readonly badgeType?: 'orders' | 'reservations';
}

const SideBar = () => {
  const pathname = usePathname()
  const { isOpen, toggle } = useStoreStatus()
  const pendingOrdersCount = useTableCount('orders', 'pending')
  const pendingReservationsCount = useTableCount('reservations', 'pending')

  const navItems: readonly NavItem[] = [
    {
      href: '/dashboard/live-orders',
      label: 'Live Orders',
      icon: ScrollIcon,
      badgeType: 'orders',
    },
    {
      href: '/dashboard/live-reservations',
      label: 'Live Reservations',
      icon: CalendarCheckIcon,
      badgeType: 'reservations',
    },
    {
      href: '/dashboard/menu',
      label: 'Menu',
      icon: BookOpenIcon,
    },
    {
      href: '/dashboard/restaurant_settings',
      label: 'Restaurant Settings',
      icon: GearIcon,
    },
  ];

  const getBadgeCount = (badgeType?: string): number | null => {
    switch (badgeType) {
      case 'orders':
        return pendingOrdersCount;
      case 'reservations':
        return pendingReservationsCount;
      default:
        return null;
    }
  };

  const isActive = (href: string): boolean => pathname === href;

  const getNavItemClasses = (href: string): string => {
    const baseClasses = 'flex items-center gap-3 py-3 px-3 rounded-xs active:scale-[0.98] cursor-pointer relative transition-colors duration-300 text-xs tracking-[0.15em] uppercase';
    const activeClasses = isActive(href)
      ? 'bg-[#9a2d1e] text-white'
      : 'text-[#8D7E73] hover:text-[#A32D1C] hover:bg-[#8D7E73]/10';
    return `${baseClasses} ${activeClasses}`;
  };

  const getBadgeClasses = (href: string): string => {
    const baseClasses = 'ml-auto min-w-5 px-1.5 py-0.5 rounded-full text-[0.625rem] leading-none flex items-center justify-center';
    const activeClasses = isActive(href)
      ? 'bg-white text-[#9a2d1e]'
      : 'bg-[#8D7E73]/20 text-[#8D7E73]';
    return `${baseClasses} ${activeClasses}`;
  };

  const shortLabels: Record<string, string> = {
    'Live Orders': 'Orders',
    'Live Reservations': 'Reservations',
    'Menu': 'Menu',
    'Restaurant Settings': 'Settings',
  };

  return (
    <>
    <aside className="flex-col fixed text-sm transition-all duration-300 w-64 py-8 px-4 text-[#8D7E73] border-r border-[#8D7E73]/20 hidden md:flex">
      <div className="mb-8 px-3">
        <h1 className="text-2xl text-[#A32D1C] leading-none">Dashboard</h1>
        <p className="text-[0.625rem] tracking-[0.25em] uppercase mt-1 text-[#8D7E73]/70">
          Staff Console
        </p>
      </div>

      <nav className="flex flex-col gap-1 mb-5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const badgeCount = getBadgeCount(item.badgeType);
          return (
            <NavLink
              key={item.href}
              href={item.href}
              data-cursor-hover
              className={getNavItemClasses(item.href)}
            >
              <Icon size={16} />
              <span>{item.label}</span>
              {badgeCount !== null && badgeCount > 0 && (
                <span className={getBadgeClasses(item.href)}>
                  {badgeCount}
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>

      <div className="flex border border-[#8D7E73]/20 p-3 rounded-xs items-center bg-[#1b1816]">
        <div className="flex flex-col flex-1">
          <span className="text-[0.625rem] tracking-[0.25em] uppercase text-[#8D7E73]/70">Store Status</span>
          <span className={`text-sm ${isOpen ? 'text-[#A32D1C]' : 'text-[#8D7E73]'}`}>
            {isOpen ? 'Open' : 'Closed'}
          </span>
        </div>
        <button
          onClick={toggle}
          data-cursor-hover
          aria-label="Toggle store status"
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-100 cursor-pointer ${isOpen ? 'bg-[#9a2d1e]' : 'bg-[#8D7E73]/30'
            }`}
        >
          <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-100 ${isOpen ? 'translate-x-6' : 'translate-x-1'
            }`} />
        </button>
      </div>
    </aside>

    <nav className="fixed bottom-0 inset-x-0 z-40 flex items-stretch justify-evenly h-16 bg-[#0E0D0B] border-t border-[#8D7E73]/20 md:hidden">
        {navItems.map((item) => {
          const Icon = item.icon;
          const badgeCount = getBadgeCount(item.badgeType);
          const active = isActive(item.href);
          return (
            <NavLink
              key={item.href}
              href={item.href}
              data-cursor-hover
              className={`relative flex flex-1 flex-col items-center justify-center gap-1 text-[0.625rem] tracking-widest uppercase transition-colors duration-300 ${active ? 'text-[#A32D1C]' : 'text-[#8D7E73]'
                }`}
            >
              <span className="relative">
                <Icon size={20} />
                {badgeCount !== null && badgeCount > 0 && (
                  <span className="absolute -top-1.5 -right-2 min-w-4 px-1 h-4 rounded-full bg-[#9a2d1e] text-white text-[0.55rem] leading-4 text-center">
                    {badgeCount}
                  </span>
                )}
              </span>
              <span>{shortLabels[item.label] ?? item.label}</span>
            </NavLink>
          );
        })}
      </nav>
    </>
  )
}

export default SideBar