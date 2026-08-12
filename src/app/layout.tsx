import type { Metadata } from 'next'
import './globals.css'
import { AuthProvider } from '@/contexts/AuthContext'

export const metadata: Metadata = {
  title: 'Ijarachi - Rental App',
  description: 'Find and list rental properties',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="uz">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  )
}

