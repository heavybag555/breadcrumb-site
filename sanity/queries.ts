import { sanityClient } from './client'
import type { Project, PhotoProject, WorkItem } from './types'

const PROJECT_FIELDS = `
  _id,
  _type,
  title,
  clientName,
  subtitle,
  medium,
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

const PHOTO_PROJECT_FIELDS = `
  _id,
  _type,
  title,
  medium,
  location,
  year,
  tags,
  "imageUrl": images[0].image.asset->url,
  "imageUrls": images[].image.asset->url,
  "imageEntries": images[]{ "url": image.asset->url, wide },
  order
`

export async function getHomepageProjects(): Promise<Project[]> {
  const client = sanityClient()
  return client.fetch<Project[]>(
    `*[_type == "project"] | order(order asc) { ${PROJECT_FIELDS} }`
  )
}

export async function getWorkItems(): Promise<WorkItem[]> {
  const client = sanityClient()
  return client.fetch<WorkItem[]>(
    `*[_type in ["project", "photoProject"]] | order(order asc) {
      _type == "project" => { ${PROJECT_FIELDS} },
      _type == "photoProject" => { ${PHOTO_PROJECT_FIELDS} }
    }`
  )
}
