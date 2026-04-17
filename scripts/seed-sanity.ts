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

type SeedProject = {
  _id: string
  title: string
  clientName: string
  subtitle: string
  bio: string
  stack: string[]
  domain: string
  href: string
  tags: string[]
  order: number
  year: string
  images: string[]
}

const SEEDS: SeedProject[] = [
  {
    _id: 'project-broosk-online',
    title: 'broosk.online',
    clientName: 'Broosk Saib',
    subtitle: 'Portfolio & Design',
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
    title: 'daniel-derro.com',
    clientName: 'Daniel Derro',
    subtitle: 'Portfolio & Photography',
    bio: 'Los Angeles–based photographer specializing in editorial, portrait, and documentary work.',
    stack: ['Next.js', 'React'],
    domain: 'daniel-derro.com',
    href: 'https://daniel-derro.com',
    tags: ['portfolio', 'photo'],
    order: 1,
    year: '2026',
    images: [
      'public/daniel-derro.com-portfolio-photo-2026/1.png',
      'public/daniel-derro.com-portfolio-photo-2026/2.png',
    ],
  },
  {
    _id: 'project-giovanni-sotomayor',
    title: 'giovannisotomayor.com',
    clientName: 'Giovanni Sotomayor',
    subtitle: 'Portfolio & Photography',
    bio: 'Photographer and visual storyteller capturing moments across landscapes and intimate portraits.',
    stack: ['Next.js', 'React', 'Sanity'],
    domain: 'giovannisotomayor.com',
    href: 'https://giovannisotomayor.com',
    tags: ['portfolio', 'photo'],
    order: 2,
    year: '2025',
    images: [
      'public/giovannisotomayor.com-portfolio-photo-2025/1.png',
      'public/giovannisotomayor.com-portfolio-photo-2025/2.png',
      'public/giovannisotomayor.com-portfolio-photo-2025/3.png',
    ],
  },
  {
    _id: 'project-nuvany-david',
    title: 'nuvanydavid.com',
    clientName: 'Nuvany David',
    subtitle: 'Portfolio & Photography',
    bio: 'Dominican-American photographer whose work explores identity, community, and belonging.',
    stack: ['Next.js', 'React'],
    domain: 'nuvanydavid.com',
    href: 'https://nuvanydavid.com',
    tags: ['portfolio', 'photo'],
    order: 3,
    year: '2026',
    images: [
      'public/nuvanydavid.com-portfolio-photo-2026/1.png',
      'public/nuvanydavid.com-portfolio-photo-2026/2.png',
      'public/nuvanydavid.com-portfolio-photo-2026/3.png',
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
  console.log(
    `Seeding ${SEEDS.length} projects into "${dataset}" (project ${projectId})...\n`
  )

  for (const seed of SEEDS) {
    console.log(`→ ${seed.clientName} (${seed.title})`)
    const images = []
    for (const path of seed.images) {
      images.push(await uploadImage(path))
    }

    const doc = {
      _id: seed._id,
      _type: 'project',
      title: seed.title,
      clientName: seed.clientName,
      subtitle: seed.subtitle,
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

  console.log('Done. Refresh /studio to see the projects.')
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
