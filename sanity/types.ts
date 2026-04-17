export interface Project {
  _id: string
  title: string
  clientName?: string
  subtitle: string
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
