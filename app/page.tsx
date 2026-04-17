import { getHomepageProjects } from '@/sanity/queries'
import type { Project } from '@/sanity/types'
import HomePage from './components/HomePage'

export default async function Home() {
  let projects: Project[] = []
  try {
    projects = await getHomepageProjects()
  } catch {
    // Sanity not configured yet — render with empty project slots
  }

  return <HomePage projects={projects} />
}
