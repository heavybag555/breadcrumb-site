import { createClient, type SanityClient } from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'

let _client: SanityClient | null = null

export function sanityClient(): SanityClient {
  if (_client) return _client

  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
  if (!projectId) {
    throw new Error('NEXT_PUBLIC_SANITY_PROJECT_ID is not set')
  }

  _client = createClient({
    projectId,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production',
    apiVersion: '2024-01-01',
    useCdn: true,
    token: process.env.SANITY_API_TOKEN,
  })

  return _client
}

const builder = () => imageUrlBuilder(sanityClient())

export function urlFor(source: any) {
  return builder().image(source)
}
