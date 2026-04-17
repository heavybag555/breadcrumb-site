import { createClient, type SanityClient } from '@sanity/client'

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
  })

  return _client
}
