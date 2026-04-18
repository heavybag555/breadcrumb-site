export interface Project {
  _id: string
  _type: 'project'
  title: string
  clientName?: string
  subtitle: string
  medium?: string
  process?: string
  bio?: string
  stack?: string[]
  domain?: string
  href: string
  imageUrl: string | null
  imageUrls?: string[]
  tags: string[]
  order: number
  year?: string
}

export interface PhotoEntry {
  url: string
  wide?: boolean
}

export interface PhotoProject {
  _id: string
  _type: 'photoProject'
  title: string
  medium: string
  location?: string
  year?: string
  tags?: string[]
  imageUrl: string | null
  imageUrls?: string[]
  imageEntries?: PhotoEntry[]
  order: number
}

export type WorkItem = Project | PhotoProject

export type ResourceCategory = 'learning' | 'reading' | 'watching'

export interface Resource {
  _id: string
  _type: 'resource'
  label: string
  url: string
  previewImage?: string | null
  category: ResourceCategory
  order?: number
}

export interface ResourcesByCategory {
  learning: Resource[]
  reading: Resource[]
  watching: Resource[]
}
