import { getResourcesByCategory } from '@/sanity/queries'
import type { ResourcesByCategory } from '@/sanity/types'
import ResourcesPage from '../components/ResourcesPage'

export const revalidate = 60

export default async function Resources() {
  const resources: ResourcesByCategory = await getResourcesByCategory()
  return <ResourcesPage resources={resources} />
}
