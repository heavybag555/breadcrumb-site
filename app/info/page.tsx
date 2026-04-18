import { getResourcesByCategory } from '@/sanity/queries'
import type { ResourcesByCategory } from '@/sanity/types'
import InfoPage from '../components/InfoPage'

export default async function Info() {
  const resources: ResourcesByCategory = await getResourcesByCategory()
  return <InfoPage resources={resources} />
}
