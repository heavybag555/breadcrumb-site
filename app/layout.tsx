import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Breadcrumb Studio',
  description: 'Breadcrumb Studio is an independent digital, creative, and web studio based in Los Angeles. Founded and operated by Benjamin Uribe.',
  icons: {
    icon: '/icon.svg',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

