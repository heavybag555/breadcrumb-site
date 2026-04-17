import type { Metadata } from 'next'
import './globals.css'
import SmoothScroll from './components/SmoothScroll'
import HeaderNav from './components/HeaderNav'

export const metadata: Metadata = {
  title: '2U4U Studio',
  description:
    '2U4U Studio is an independent digital, creative, and web studio based in Los Angeles. Founded and operated by Benjamin Uribe.',
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
      <body>
        <SmoothScroll />
        <HeaderNav />
        {children}
      </body>
    </html>
  )
}
