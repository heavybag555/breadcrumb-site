export interface Project {
  _id: string
  title: string
  subtitle: string
  href: string
  imageUrl: string | null
  tags: string[]
  order: number
}
