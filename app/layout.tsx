import type { Metadata } from 'next'
import './globals.css'
import { geistSans } from './fonts'
import HeaderNav from './components/HeaderNav'
import PageTransition from './components/PageTransition'

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') ?? 'https://2u4u.studio'

const SITE_NAME = '2u4u Studio'
const TITLE_SEP = ' › '
const SITE_DESCRIPTION =
  'Web, Photo, and Interaction Studio based in Los Angeles, CA.'
const OG_IMAGE = '/images/benuribe.jpg'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME}${TITLE_SEP}Web, Photo & Interaction Studio in Los Angeles`,
    template: `%s${TITLE_SEP}${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: [
    'Web design',
    'Web development',
    'Photography',
    'Interaction design',
    'Design studio',
    'Los Angeles',
    'Creative studio',
    'Benjamin Uribe',
    '2u4u Studio',
  ],
  authors: [{ name: 'Benjamin Uribe', url: SITE_URL }],
  creator: 'Benjamin Uribe',
  publisher: '2u4u Studio',
  category: 'design',
  alternates: {
    canonical: '/',
  },
  icons: {
    icon: '/icon.svg',
  },
  openGraph: {
    type: 'website',
    url: SITE_URL,
    siteName: SITE_NAME,
    title: `${SITE_NAME}${TITLE_SEP}Web, Photo & Interaction Studio`,
    description: SITE_DESCRIPTION,
    locale: 'en_US',
    images: [
      {
        url: OG_IMAGE,
        width: 1919,
        height: 1535,
        alt: 'Benjamin Uribe — 2u4u Studio',
        type: 'image/jpeg',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SITE_NAME}${TITLE_SEP}Web, Photo & Interaction Studio`,
    description: SITE_DESCRIPTION,
    images: [OG_IMAGE],
    creator: '@2u4u.studio',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
}

const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: SITE_NAME,
  alternateName: '2u4u Studio',
  description: SITE_DESCRIPTION,
  url: SITE_URL,
  image: `${SITE_URL}${OG_IMAGE}`,
  logo: `${SITE_URL}/icon.svg`,
  email: '2you4youstudio@gmail.com',
  founder: {
    '@type': 'Person',
    name: 'Benjamin Uribe',
  },
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Los Angeles',
    addressRegion: 'CA',
    addressCountry: 'US',
  },
  areaServed: 'Worldwide',
  sameAs: ['https://www.instagram.com/2u4u.studio/'],
  knowsAbout: [
    'Web design',
    'Web development',
    'Photography',
    'Interaction design',
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={geistSans.variable}>
      <body className={geistSans.className}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationJsonLd),
          }}
        />
        <HeaderNav />
        <PageTransition>{children}</PageTransition>
      </body>
    </html>
  )
}
