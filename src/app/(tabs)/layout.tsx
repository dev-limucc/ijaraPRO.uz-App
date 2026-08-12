'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function TabsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  const tabs = [
    { href: '/home', label: 'Home', icon: '🏠' },
    { href: '/search', label: 'Search', icon: '🔍' },
    { href: '/saved', label: 'Saved', icon: '❤️' },
    { href: '/requests', label: 'Requests', icon: '📋' },
    { href: '/account', label: 'Account', icon: '👤' },
  ]

  // Don't show tabs on create page
  if (pathname === '/create') {
    return <main className="flex-1 overflow-y-auto">{children}</main>
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <main className="flex-1 overflow-y-auto pb-20">{children}</main>
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40">
        <div className="flex justify-around py-2">
          {tabs.map((tab) => (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex flex-col items-center py-2 px-4 min-w-[60px] ${
                pathname === tab.href
                  ? 'text-teal-500'
                  : 'text-gray-500'
              }`}
            >
              <span className="text-2xl">{tab.icon}</span>
              <span className="text-xs mt-1">{tab.label}</span>
            </Link>
          ))}
        </div>
      </nav>
    </div>
  )
}

