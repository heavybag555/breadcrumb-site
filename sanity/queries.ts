import { sanityClient } from './client'
import type {
  Project,
  PhotoProject,
  WorkItem,
  Resource,
  ResourcesByCategory,
  Writing,
} from './types'

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

const RESOURCE_FIELDS = `
  _id,
  _type,
  label,
  url,
  previewImage,
  category,
  order
`

export async function getResources(): Promise<Resource[]> {
  const client = sanityClient()
  return client.fetch<Resource[]>(
    `*[_type == "resource"] | order(category asc, order asc) { ${RESOURCE_FIELDS} }`
  )
}

export async function getResourcesByCategory(): Promise<ResourcesByCategory> {
  let resources: Resource[] = []
  try {
    resources = await getResources()
  } catch {
    // Sanity not configured or unreachable — return empty buckets.
  }

  const buckets: ResourcesByCategory = {
    learning: [],
    reading: [],
    watching: [],
  }
  for (const r of resources) {
    if (r.category && buckets[r.category]) {
      buckets[r.category].push(r)
    }
  }
  return buckets
}

const WRITING_FIELDS = `
  _id,
  _type,
  title,
  description,
  "imageUrl": image.asset->url,
  date,
  text,
  order
`

export async function getWritings(): Promise<Writing[]> {
  try {
    const client = sanityClient()
    return await client.fetch<Writing[]>(
      `*[_type == "writing"] | order(coalesce(order, 9999) asc, date desc) {
        ${WRITING_FIELDS}
      }`
    )
  } catch {
    // Sanity not configured or unreachable — return empty list.
    return []
  }
}
