import { sanityClient } from './client'
import type { Project } from './types'

const PROJECT_FIELDS = `
  _id,
  title,
  clientName,
  subtitle,
  process,
  bio,
  stack,
  domain,
  href,
  "imageUrl": images[0].asset->url,
  "imageUrls": images[].asset->url,
  tags,
  order,
  year
`

export async function getHomepageProjects(): Promise<Project[]> {
  const client = sanityClient()
  return client.fetch<Project[]>(
    `*[_type == "project"] | order(order asc) { ${PROJECT_FIELDS} }`
  )
}
