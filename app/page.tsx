import { getHomepageProjects } from '@/sanity/queries'
import type { Project } from '@/sanity/types'
import HomePage from './components/HomePage'

const LOCAL_PROJECTS: Project[] = [
  {
    _id: 'local-1',
    title: 'broosk.online',
    clientName: 'Broosk Saib',
    subtitle: 'Portfolio & Design',
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
    _id: 'local-2',
    title: 'daniel-derro.com',
    clientName: 'Daniel Derro',
    subtitle: 'Portfolio & Photography',
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
    order: 1,
    year: '2026',
  },
  {
    _id: 'local-3',
    title: 'giovannisotomayor.com',
    clientName: 'Giovanni Sotomayor',
    subtitle: 'Portfolio & Photography',
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
    order: 2,
    year: '2025',
  },
  {
    _id: 'local-4',
    title: 'nuvanydavid.com',
    clientName: 'Nuvany David',
    subtitle: 'Portfolio & Photography',
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
    order: 3,
    year: '2026',
  },
]

export default async function Home() {
  let projects: Project[] = []
  try {
    projects = await getHomepageProjects()
  } catch {
    // Sanity not configured yet
  }

  if (projects.length === 0) {
    projects = LOCAL_PROJECTS
  }

  return <HomePage projects={projects} />
}
