/* eslint-disable no-console */
import { createClient } from '@sanity/client'
import { readFileSync } from 'node:fs'
import { basename, resolve } from 'node:path'
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

/* ── Web project seeds ── */

type SeedProject = {
  _id: string
  _type: 'project'
  title: string
  clientName: string
  subtitle: string
  medium: string
  bio: string
  stack: string[]
  domain: string
  href: string
  tags: string[]
  order: number
  year: string
  images: string[]
}

const WEB_SEEDS: SeedProject[] = [
  {
    _id: 'project-broosk-online',
    _type: 'project',
    title: 'broosk.online',
    clientName: 'Broosk Saib',
    subtitle: 'Portfolio & Design',
    medium: 'web',
    bio: 'Kurdish-Swedish creative director and designer working at the intersection of fashion, music, and digital culture.',
    stack: ['Next.js', 'React', 'Sanity'],
    domain: 'broosk.online',
    href: 'https://broosk.online',
    tags: ['portfolio', 'design'],
    order: 0,
    year: '2026',
    images: [
      'public/broosk.online-portfolio-design-2026/1.png',
      'public/broosk.online-portfolio-design-2026/2.png',
      'public/broosk.online-portfolio-design-2026/3.png',
    ],
  },
  {
    _id: 'project-daniel-derro',
    _type: 'project',
    title: 'daniel-derro.com',
    clientName: 'Daniel Derro',
    subtitle: 'Portfolio & Photography',
    medium: 'web',
    bio: 'Los Angeles–based photographer specializing in editorial, portrait, and documentary work.',
    stack: ['Next.js', 'React'],
    domain: 'daniel-derro.com',
    href: 'https://daniel-derro.com',
    tags: ['portfolio', 'photo'],
    order: 2,
    year: '2026',
    images: [
      'public/daniel-derro.com-portfolio-photo-2026/1.png',
      'public/daniel-derro.com-portfolio-photo-2026/2.png',
    ],
  },
  {
    _id: 'project-giovanni-sotomayor',
    _type: 'project',
    title: 'giovannisotomayor.com',
    clientName: 'Giovanni Sotomayor',
    subtitle: 'Portfolio & Photography',
    medium: 'web',
    bio: 'Photographer and visual storyteller capturing moments across landscapes and intimate portraits.',
    stack: ['Next.js', 'React', 'Sanity'],
    domain: 'giovannisotomayor.com',
    href: 'https://giovannisotomayor.com',
    tags: ['portfolio', 'photo'],
    order: 4,
    year: '2025',
    images: [
      'public/giovannisotomayor.com-portfolio-photo-2025/1.png',
      'public/giovannisotomayor.com-portfolio-photo-2025/2.png',
      'public/giovannisotomayor.com-portfolio-photo-2025/3.png',
    ],
  },
  {
    _id: 'project-nuvany-david',
    _type: 'project',
    title: 'nuvanydavid.com',
    clientName: 'Nuvany David',
    subtitle: 'Portfolio & Photography',
    medium: 'web',
    bio: 'Dominican-American photographer whose work explores identity, community, and belonging.',
    stack: ['Next.js', 'React'],
    domain: 'nuvanydavid.com',
    href: 'https://nuvanydavid.com',
    tags: ['portfolio', 'photo'],
    order: 6,
    year: '2026',
    images: [
      'public/nuvanydavid.com-portfolio-photo-2026/1.png',
      'public/nuvanydavid.com-portfolio-photo-2026/2.png',
      'public/nuvanydavid.com-portfolio-photo-2026/3.png',
    ],
  },
]

/* ── Photo project seeds ── */

type SeedPhotoProject = {
  _id: string
  _type: 'photoProject'
  title: string
  medium: string
  location: string
  year: string
  tags: string[]
  order: number
  images: { path: string; wide: boolean }[]
}

const PHOTO_SEEDS: SeedPhotoProject[] = [
  {
    _id: 'photo-cc-buchanan',
    _type: 'photoProject',
    title: 'CC Buchanan',
    medium: 'photo',
    location: 'Catalina',
    year: '2025',
    tags: ['portrait'],
    order: 1,
    images: [
      { path: 'public/Photo/CC Buchanan, Catalina, 2025/000394490012.jpg', wide: false },
      { path: 'public/Photo/CC Buchanan, Catalina, 2025/000394490015.jpg', wide: false },
      { path: 'public/Photo/CC Buchanan, Catalina, 2025/000394490016.jpg', wide: false },
    ],
  },
  {
    _id: 'photo-james',
    _type: 'photoProject',
    title: 'James',
    medium: 'photo',
    location: 'Mid City',
    year: '2024',
    tags: ['portrait'],
    order: 3,
    images: [
      { path: 'public/Photo/James, Mid City, 2024/000020710032.jpg', wide: false },
      { path: 'public/Photo/James, Mid City, 2024/000020710037.jpg', wide: false },
    ],
  },
  {
    _id: 'photo-savedher',
    _type: 'photoProject',
    title: 'Savedher',
    medium: 'photo',
    location: 'Koreatown',
    year: '2025',
    tags: ['portrait'],
    order: 5,
    images: [
      { path: 'public/Photo/Savedher, Koreatown, 2025/000403380002.jpg', wide: false },
      { path: 'public/Photo/Savedher, Koreatown, 2025/000403380004.jpg', wide: false },
      { path: 'public/Photo/Savedher, Koreatown, 2025/000403380005.jpg', wide: false },
      { path: 'public/Photo/Savedher, Koreatown, 2025/000403380006.jpg', wide: false },
      { path: 'public/Photo/Savedher, Koreatown, 2025/000403380007.jpg', wide: false },
      { path: 'public/Photo/Savedher, Koreatown, 2025/000403380012.jpg', wide: false },
      { path: 'public/Photo/Savedher, Koreatown, 2025/000403380016.jpg', wide: false },
    ],
  },
]

async function uploadImage(filePath: string) {
  const abs = resolve(filePath)
  const buffer = readFileSync(abs)
  const filename = basename(abs)
  console.log(`  ↑ uploading ${filename}`)
  const asset = await client.assets.upload('image', buffer, { filename })
  return {
    _type: 'image',
    _key: asset._id.replace(/[^a-zA-Z0-9]/g, '').slice(0, 12),
    asset: { _type: 'reference', _ref: asset._id },
  }
}

async function run() {
  const totalCount = WEB_SEEDS.length + PHOTO_SEEDS.length
  console.log(
    `Seeding ${totalCount} items (${WEB_SEEDS.length} web + ${PHOTO_SEEDS.length} photo) into "${dataset}" (project ${projectId})...\n`
  )

  for (const seed of WEB_SEEDS) {
    console.log(`→ [Web] ${seed.clientName} (${seed.title})`)
    const images = []
    for (const p of seed.images) {
      images.push(await uploadImage(p))
    }

    const doc = {
      _id: seed._id,
      _type: seed._type,
      title: seed.title,
      clientName: seed.clientName,
      subtitle: seed.subtitle,
      medium: seed.medium,
      bio: seed.bio,
      stack: seed.stack,
      domain: seed.domain,
      href: seed.href,
      tags: seed.tags,
      order: seed.order,
      year: seed.year,
      images,
    }

    await client.createOrReplace(doc)
    console.log(`  ✓ saved ${seed._id}\n`)
  }

  for (const seed of PHOTO_SEEDS) {
    console.log(`→ [Photo] ${seed.title} — ${seed.location}, ${seed.year}`)
    const images = []
    for (const entry of seed.images) {
      const uploaded = await uploadImage(entry.path)
      images.push({
        _type: 'photoEntry',
        _key: uploaded._key,
        image: {
          _type: 'image',
          asset: uploaded.asset,
        },
        wide: entry.wide,
      })
    }

    const doc = {
      _id: seed._id,
      _type: seed._type,
      title: seed.title,
      medium: seed.medium,
      location: seed.location,
      year: seed.year,
      tags: seed.tags,
      order: seed.order,
      images,
    }

    await client.createOrReplace(doc)
    console.log(`  ✓ saved ${seed._id}\n`)
  }

  console.log('Done. Refresh /studio to see all projects.')
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
