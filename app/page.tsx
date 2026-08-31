import { getWorkItems, getResourcesByCategory } from '@/sanity/queries'
import type { Project, PhotoProject, WorkItem } from '@/sanity/types'
import HomePage from './components/HomePage'

export const revalidate = 60

const LOCAL_WORK_ITEMS: WorkItem[] = [
  {
    _id: 'local-nayeli-yazmin',
    _type: 'project',
    title: 'nayeliyazmin.com',
    clientName: 'Nayeli Yazmin',
    subtitle: 'Portfolio & Art',
    medium: 'web',
    bio: 'Multidisciplinary artist and scholar whose work is informed by her familial archive, found photography, and Chicana visual culture.',
    stack: ['Next.js', 'Are.na'],
    domain: 'nayeliyazmin.com',
    href: 'https://nayeliyazmin.com',
    imageUrl: '/nayeliyazmin.com-portfolio-art-2026/1.png',
    imageUrls: ['/nayeliyazmin.com-portfolio-art-2026/1.png'],
    tags: ['portfolio', 'art'],
    order: -3,
    year: '2026',
  },
  {
    _id: 'local-rgl-practice',
    _type: 'project',
    title: 'rglpractice.com',
    clientName: 'RGL',
    subtitle: 'Architecture & Research',
    medium: 'web',
    bio: 'New York–based architecture and research practice building spaces that exist ecologically, culturally, socially, and physically.',
    stack: ['Next.js', 'Sanity'],
    domain: 'rglpractice.com',
    href: 'https://rglpractice.com',
    imageUrl: '/rglpractice.com-architecture-research-2026/1.png',
    imageUrls: ['/rglpractice.com-architecture-research-2026/1.png'],
    tags: ['architecture', 'research'],
    order: -2,
    year: '2026',
  },
  {
    _id: 'local-sound-sent',
    _type: 'project',
    title: 'sound-sent.com',
    clientName: 'Soundsent',
    subtitle: 'Record Label & Media',
    medium: 'web',
    bio: 'Los Angeles–based record label, media organization, and brand.',
    stack: ['Next.js', 'Are.na'],
    domain: 'sound-sent.com',
    href: 'https://sound-sent.com',
    imageUrl: '/sound-sent.com-record-label-2026/1.png',
    imageUrls: ['/sound-sent.com-record-label-2026/1.png'],
    tags: ['music', 'brand'],
    order: -1,
    year: '2026',
  },
  {
    _id: 'local-1',
    _type: 'project',
    title: 'broosk.online',
    clientName: 'Broosk Saib',
    subtitle: 'Portfolio & Design',
    medium: 'web',
    bio: 'Kurdish-Swedish creative director and designer working at the intersection of fashion, music, and digital culture.',
    stack: ['Next.js', 'React', 'Sanity'],
    domain: 'broosk.online',
    href: 'https://broosk.online',
    imageUrl: '/broosk.online-portfolio-design-2026/1.png',
    imageUrls: [
      '/broosk.online-portfolio-design-2026/1.png',
      '/broosk.online-portfolio-design-2026/2.png',
      '/broosk.online-portfolio-design-2026/3.png',
    ],
    tags: ['portfolio', 'design'],
    order: 0,
    year: '2026',
  },
  {
    _id: 'local-photo-1',
    _type: 'photoProject',
    title: 'CC Buchanan',
    medium: 'photo',
    location: 'Catalina',
    year: '2025',
    tags: ['portrait'],
    imageUrl: '/Photo/CC Buchanan, Catalina, 2025/000394490012.jpg',
    imageUrls: [
      '/Photo/CC Buchanan, Catalina, 2025/000394490012.jpg',
      '/Photo/CC Buchanan, Catalina, 2025/000394490015.jpg',
      '/Photo/CC Buchanan, Catalina, 2025/000394490016.jpg',
    ],
    imageEntries: [
      { url: '/Photo/CC Buchanan, Catalina, 2025/000394490012.jpg', wide: false },
      { url: '/Photo/CC Buchanan, Catalina, 2025/000394490015.jpg', wide: false },
      { url: '/Photo/CC Buchanan, Catalina, 2025/000394490016.jpg', wide: false },
    ],
    order: 1,
  },
  {
    _id: 'local-2',
    _type: 'project',
    title: 'daniel-derro.com',
    clientName: 'Daniel Derro',
    subtitle: 'Portfolio & Photography',
    medium: 'web',
    bio: 'Los Angeles–based photographer specializing in editorial, portrait, and documentary work.',
    stack: ['Next.js', 'React'],
    domain: 'daniel-derro.com',
    href: 'https://daniel-derro.com',
    imageUrl: '/daniel-derro.com-portfolio-photo-2026/1.png',
    imageUrls: [
      '/daniel-derro.com-portfolio-photo-2026/1.png',
      '/daniel-derro.com-portfolio-photo-2026/2.png',
    ],
    tags: ['portfolio', 'photo'],
    order: 2,
    year: '2026',
  },
  {
    _id: 'local-photo-2',
    _type: 'photoProject',
    title: 'James',
    medium: 'photo',
    location: 'Mid City',
    year: '2024',
    tags: ['portrait'],
    imageUrl: '/Photo/James, Mid City, 2024/000020710032.jpg',
    imageUrls: [
      '/Photo/James, Mid City, 2024/000020710032.jpg',
      '/Photo/James, Mid City, 2024/000020710037.jpg',
    ],
    imageEntries: [
      { url: '/Photo/James, Mid City, 2024/000020710032.jpg', wide: false },
      { url: '/Photo/James, Mid City, 2024/000020710037.jpg', wide: false },
    ],
    order: 3,
  },
  {
    _id: 'local-3',
    _type: 'project',
    title: 'giovannisotomayor.com',
    clientName: 'Giovanni Sotomayor',
    subtitle: 'Portfolio & Photography',
    medium: 'web',
    bio: 'Photographer and visual storyteller capturing moments across landscapes and intimate portraits.',
    stack: ['Next.js', 'React', 'Sanity'],
    domain: 'giovannisotomayor.com',
    href: 'https://giovannisotomayor.com',
    imageUrl: '/giovannisotomayor.com-portfolio-photo-2025/1.png',
    imageUrls: [
      '/giovannisotomayor.com-portfolio-photo-2025/1.png',
      '/giovannisotomayor.com-portfolio-photo-2025/2.png',
      '/giovannisotomayor.com-portfolio-photo-2025/3.png',
    ],
    tags: ['portfolio', 'photo'],
    order: 4,
    year: '2025',
  },
  {
    _id: 'local-photo-3',
    _type: 'photoProject',
    title: 'Savedher',
    medium: 'photo',
    location: 'Koreatown',
    year: '2025',
    tags: ['portrait'],
    imageUrl: '/Photo/Savedher, Koreatown, 2025/000403380002.jpg',
    imageUrls: [
      '/Photo/Savedher, Koreatown, 2025/000403380002.jpg',
      '/Photo/Savedher, Koreatown, 2025/000403380004.jpg',
      '/Photo/Savedher, Koreatown, 2025/000403380005.jpg',
      '/Photo/Savedher, Koreatown, 2025/000403380006.jpg',
      '/Photo/Savedher, Koreatown, 2025/000403380007.jpg',
      '/Photo/Savedher, Koreatown, 2025/000403380012.jpg',
      '/Photo/Savedher, Koreatown, 2025/000403380016.jpg',
    ],
    imageEntries: [
      { url: '/Photo/Savedher, Koreatown, 2025/000403380002.jpg', wide: false },
      { url: '/Photo/Savedher, Koreatown, 2025/000403380004.jpg', wide: false },
      { url: '/Photo/Savedher, Koreatown, 2025/000403380005.jpg', wide: false },
      { url: '/Photo/Savedher, Koreatown, 2025/000403380006.jpg', wide: false },
      { url: '/Photo/Savedher, Koreatown, 2025/000403380007.jpg', wide: false },
      { url: '/Photo/Savedher, Koreatown, 2025/000403380012.jpg', wide: false },
      { url: '/Photo/Savedher, Koreatown, 2025/000403380016.jpg', wide: false },
    ],
    order: 5,
  },
  {
    _id: 'local-4',
    _type: 'project',
    title: 'nuvanydavid.com',
    clientName: 'Nuvany David',
    subtitle: 'Portfolio & Photography',
    medium: 'web',
    bio: 'Dominican-American photographer whose work explores identity, community, and belonging.',
    stack: ['Next.js', 'React'],
    domain: 'nuvanydavid.com',
    href: 'https://nuvanydavid.com',
    imageUrl: '/nuvanydavid.com-portfolio-photo-2026/1.png',
    imageUrls: [
      '/nuvanydavid.com-portfolio-photo-2026/1.png',
      '/nuvanydavid.com-portfolio-photo-2026/2.png',
      '/nuvanydavid.com-portfolio-photo-2026/3.png',
    ],
    tags: ['portfolio', 'photo'],
    order: 6,
    year: '2026',
  },
]

export default async function Home() {
  let items: WorkItem[] = []
  try {
    items = await getWorkItems()
  } catch {
    // Sanity not configured yet
  }

  if (items.length === 0) {
    items = LOCAL_WORK_ITEMS
  } else {
    const existingDomains = new Set(
      items
        .filter((item): item is Project => item._type === 'project')
        .map((item) => item.domain)
        .filter(Boolean),
    )
    const missingWeb = LOCAL_WORK_ITEMS.filter(
      (item): item is Project =>
        item._type === 'project' &&
        !!item.domain &&
        !existingDomains.has(item.domain),
    )
    if (missingWeb.length > 0) {
      items = [...items, ...missingWeb].sort((a, b) => a.order - b.order)
    }

    const hasPhotos = items.some((item) => item._type === 'photoProject')
    if (!hasPhotos) {
      const webItems = items
      const localPhotos = LOCAL_WORK_ITEMS.filter(
        (item) => item._type === 'photoProject',
      )
      const merged: WorkItem[] = []
      let wi = 0
      let pi = 0
      while (wi < webItems.length || pi < localPhotos.length) {
        if (wi < webItems.length) merged.push(webItems[wi++])
        if (pi < localPhotos.length) merged.push(localPhotos[pi++])
      }
      items = merged
    }
  }

  let resources = await getResourcesByCategory()

  return <HomePage projects={items} resources={resources} />
}
