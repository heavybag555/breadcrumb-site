/* eslint-disable no-console */
import { createClient } from '@sanity/client'
import { config as loadEnv } from 'dotenv'

loadEnv({ path: '.env.local' })

const projectId =
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'tl235np0'
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const token = process.env.SANITY_API_TOKEN

if (!token) {
  console.error(
    '\nMissing SANITY_API_TOKEN in .env.local.\n' +
      'Create one with Editor permissions at:\n' +
      `  https://www.sanity.io/manage/project/${projectId}/api\n` +
      '(Settings → API → Tokens → Add API token), then re-run.\n'
  )
  process.exit(1)
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: '2024-01-01',
  token,
  useCdn: false,
})

type ResourceSeed = {
  _id: string
  label: string
  url: string
  category: 'learning' | 'reading' | 'watching'
  order: number
}

const RESOURCE_SEEDS: ResourceSeed[] = [
  // ── Learning ──────────────────────────────────────────────
  {
    _id: 'resource-learning-tracy-ma-homer',
    label: 'Insights 2022 — Tracy Ma, Homer',
    url: 'https://www.youtube.com/watch?v=PCUyDxBENSA&list=LL&index=4&t=1117s',
    category: 'learning',
    order: 0,
  },
  {
    _id: 'resource-learning-gabriel-moses',
    label: 'Instagram Presents — Ask It Anyway, Gabriel Moses',
    url: 'https://youtu.be/M14ivyjYBEg?si=54DlQIA3F2WLtL48',
    category: 'learning',
    order: 1,
  },
  {
    _id: 'resource-learning-figma-config-news',
    label: 'Design at the Speed of the News — Config 2023',
    url: 'https://youtu.be/akW_l3me3UE?si=zxU2U7srEzNBum3j',
    category: 'learning',
    order: 2,
  },
  {
    _id: 'resource-learning-notion-design',
    label: "Behind the Scenes of Notion's Design",
    url: 'https://youtu.be/b00sgRR_Vc0?si=knQg_69pL_7PBRu4',
    category: 'learning',
    order: 3,
  },
  {
    _id: 'resource-learning-3-things-designers-need',
    label: '3 Things All Great Designers Need',
    url: 'https://youtu.be/YdHA6TPUORw?si=C1iec6cSwsqZc2WP',
    category: 'learning',
    order: 4,
  },

  // ── Reading ───────────────────────────────────────────────
  {
    _id: 'resource-reading-open-veins',
    label: 'Open Veins of Latin America',
    url: 'https://library.uniteddiversity.coop/More_Books_and_Reports/Open_Veins_of_Latin_America.pdf',
    category: 'reading',
    order: 0,
  },
  {
    _id: 'resource-reading-devouring-details',
    label: 'Devouring Details — Rauno',
    url: 'https://devouringdetails.com/',
    category: 'reading',
    order: 1,
  },
  {
    _id: 'resource-reading-principles-design',
    label: 'Design Principles Library',
    url: 'https://principles.design/',
    category: 'reading',
    order: 2,
  },
  {
    _id: 'resource-reading-design-poster',
    label: 'Design Reference Poster',
    url: 'https://d2w9rnfcy7mm78.cloudfront.net/7788766/original_b82a752af9469a3cb9dd41ff9e81be2b.png?1593141448?bc=0',
    category: 'reading',
    order: 3,
  },
  {
    _id: 'resource-reading-dschool-starter',
    label: 'd.school Starter Kit',
    url: 'https://dschool.stanford.edu/tools/starter-kit',
    category: 'reading',
    order: 4,
  },

  // ── Watching ──────────────────────────────────────────────
  {
    _id: 'resource-watching-mouthwash-alex-tan',
    label: 'How Mouthwash Studio Makes Creative Decisions',
    url: 'https://www.youtube.com/watch?v=w4E6jcjExXM',
    category: 'watching',
    order: 0,
  },
  {
    _id: 'resource-watching-prince-kiss',
    label: 'Prince — Kiss (Live at Paisley Park, 1999)',
    url: 'https://www.youtube.com/watch?v=CkrT9u7ms1c&list=LL&index=46',
    category: 'watching',
    order: 1,
  },
  {
    _id: 'resource-watching-forgive-yourself',
    label: 'How to Forgive Yourself — Part 2',
    url: 'https://youtu.be/udwlT0DGxTQ?si=pTBQA-jENwc8dgmT',
    category: 'watching',
    order: 2,
  },
  {
    _id: 'resource-watching-i-am-joaquin',
    label: 'I Am Joaquin (1969) — dir. Luis Valdez',
    url: 'https://youtu.be/OCVZ_rlBQR8?si=rxX6beScJKrzNFov',
    category: 'watching',
    order: 3,
  },
  {
    _id: 'resource-watching-balance-sacrifice',
    label: 'Balance & Sacrifice / Art & Time — Mickey Galvin',
    url: 'https://youtu.be/lk3Y3mjWs8c?si=ZEFFWFNXbi47yDzL',
    category: 'watching',
    order: 4,
  },
]

/* ── Preview-image resolution ────────────────────────────────
   1. If the URL is a YouTube video, use the canonical high-quality
      thumbnail derived from the video id.
   2. If the URL itself points at an image (.png/.jpg/.webp), use it.
   3. Otherwise fetch the HTML and extract <meta property="og:image">
      (or twitter:image) via regex — no HTML parser dependency.
   4. Fall back to Google's favicon service so every mention gets a
      visual component even when the site has no Open Graph image. */

function extractYouTubeId(url: string): string | null {
  try {
    const u = new URL(url)
    if (u.hostname.includes('youtu.be')) {
      return u.pathname.replace(/^\//, '').split('/')[0] || null
    }
    if (u.hostname.includes('youtube.com')) {
      const v = u.searchParams.get('v')
      if (v) return v
      const m = u.pathname.match(/\/(?:embed|shorts)\/([^/]+)/)
      if (m) return m[1]
    }
  } catch {
    // ignore
  }
  return null
}

function isImageUrl(url: string): boolean {
  return /\.(png|jpe?g|gif|webp|avif|svg)(\?|$)/i.test(url)
}

function faviconFor(url: string): string {
  try {
    const host = new URL(url).hostname
    return `https://www.google.com/s2/favicons?domain=${host}&sz=128`
  } catch {
    return ''
  }
}

async function fetchOgImage(url: string): Promise<string | null> {
  try {
    const res = await fetch(url, {
      headers: {
        // Some sites (principles.design, dschool) serve different HTML
        // to non-browser agents; masquerade as a real browser.
        'User-Agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0 Safari/537.36',
        Accept: 'text/html,*/*',
      },
      redirect: 'follow',
    })
    if (!res.ok) return null
    const html = await res.text()
    const patterns = [
      /<meta[^>]+property=["']og:image(?::url)?["'][^>]+content=["']([^"']+)["']/i,
      /<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image(?::url)?["']/i,
      /<meta[^>]+name=["']twitter:image(?::src)?["'][^>]+content=["']([^"']+)["']/i,
      /<meta[^>]+content=["']([^"']+)["'][^>]+name=["']twitter:image(?::src)?["']/i,
    ]
    for (const pattern of patterns) {
      const match = html.match(pattern)
      if (match && match[1]) {
        let out = match[1].trim()
        if (out.startsWith('//')) out = 'https:' + out
        if (out.startsWith('/')) {
          const u = new URL(url)
          out = u.origin + out
        }
        return out
      }
    }
  } catch {
    // ignore network errors
  }
  return null
}

async function resolvePreviewImage(url: string): Promise<string> {
  const youtubeId = extractYouTubeId(url)
  if (youtubeId) {
    /* mqdefault is 16:9 — crops to a clean centered square in CSS without
       the 4:3 letterboxing baked into hqdefault for many uploads. */
    return `https://i.ytimg.com/vi/${youtubeId}/mqdefault.jpg`
  }
  if (isImageUrl(url)) return url

  const og = await fetchOgImage(url)
  if (og) return og

  return faviconFor(url)
}

async function run() {
  console.log(
    `Seeding ${RESOURCE_SEEDS.length} resources into "${dataset}" (project ${projectId})...\n`
  )

  for (const seed of RESOURCE_SEEDS) {
    const previewImage = await resolvePreviewImage(seed.url)
    const doc = {
      _id: seed._id,
      _type: 'resource',
      label: seed.label,
      url: seed.url,
      previewImage,
      category: seed.category,
      order: seed.order,
    }
    await client.createOrReplace(doc)
    console.log(
      `  ✓ [${seed.category}] ${seed.label}\n      preview: ${previewImage}`
    )
  }

  console.log('\nDone. Refresh /info to see the Resources row.')
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
