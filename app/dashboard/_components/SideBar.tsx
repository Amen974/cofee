'use client'

import Link from "next/link"
import { ScrollText, CalendarCheck, BookOpen, LucideIcon, Settings } from "lucide-react";
import { usePathname } from "next/navigation";
import { useStoreStatus } from "@/lib/hooks/useStoreStatus";
import { useTableCount } from "@/lib/hooks/useTableCount";

interface NavItem {
  readonly href: string;
  readonly label: string;
  readonly icon: LucideIcon;
  readonly badgeType?: 'pending' | 'confirmed';
}

const SideBar = () => {
  const pathname = usePathname()
  const { isOpen, toggle } = useStoreStatus()
  const pendingCount = useTableCount('orders', 'pending')
  const confirmedReservationsCount = useTableCount('reservations', 'confirmed')

  const navItems: readonly NavItem[] = [
    {
      href: '/dashboard/live-orders',
      label: 'Live Orders',
      icon: ScrollText,
      badgeType: 'pending',
    },
    {
      href: '/dashboard/live-reservations',
      label: 'Live Reservations',
      icon: CalendarCheck,
      badgeType: 'confirmed',
    },
    {
      href: '/dashboard/menu',
      label: 'Menu',
      icon: BookOpen,
    },
    {
      href: '/dashboard/restaurant_settings',
      label: 'Restaurant Settings',
      icon: Settings,
    },
  ];

  const getBadgeCount = (badgeType?: string): number | null => {
    switch (badgeType) {
      case 'pending':
        return pendingCount;
      case 'confirmed':
        return confirmedReservationsCount;
      default:
        return null;
    }
  };

  const isActive = (href: string): boolean => pathname === href;

  const getNavItemClasses = (href: string): string => {
    const baseClasses = 'flex gap-1 py-4 pl-2 rounded-lg active:scale-95 cursor-pointer relative';
    const activeClasses = isActive(href)
      ? 'bg-red-700 border border-neutral-800'
      : 'hover:text-red-700';
    return `${baseClasses} ${activeClasses}`;
  };

  const getBadgeClasses = (href: string): string => {
    const baseClasses = 'px-1.5 absolute right-4 rounded-full text-sm';
    const activeClasses = isActive(href)
      ? 'bg-white text-red-700'
      : 'text-white';
    return `${baseClasses} ${activeClasses}`;
  };

  return (
    <aside className="flex-col min-h-screen text-sm transition-all duration-300 w-70 py-10 px-4 bg-black text-white border-r border-neutral-800 relative hidden md:flex">
      {navItems.map((item) => {
        const Icon = item.icon;
        const badgeCount = getBadgeCount(item.badgeType);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={getNavItemClasses(item.href)}
          >
            <Icon size={18} />
            <span>{item.label}</span>
            {badgeCount !== null && (
              <span className={getBadgeClasses(item.href)}>
                {badgeCount}
              </span>
            )}
          </Link>
        );
      })}

      <div className="flex border border-neutral-800 p-2 rounded-xl items-center absolute bottom-5 w-[90%]">
        <div className="flex flex-col flex-1">
          <span className="uppercase">Store Status</span>
          <span>{isOpen ? 'Open' : 'Close'}</span>
        </div>
        <button
          onClick={toggle}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${isOpen ? 'bg-red-700' : 'bg-neutral-800'
            }`}
        >
          <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isOpen ? 'translate-x-6' : 'translate-x-1'
            }`} />
        </button>
      </div>
    </aside>
  )
}

export default SideBar