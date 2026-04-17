import { sanityClient } from './client'
import type { Project } from './types'

const PROJECT_FIELDS = `
  _id,
  title,
  subtitle,
  href,
  "imageUrl": image.asset->url,
  tags,
  order
`

export async function getHomepageProjects(): Promise<Project[]> {
  const client = sanityClient()
  return client.fetch<Project[]>(
    `*[_type == "project"] | order(order asc) { ${PROJECT_FIELDS} }`
  )
}
