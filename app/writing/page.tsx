import { getWritings } from '@/sanity/queries'
import WritingPage, {
  type WritingBlock,
  type WritingEntry,
} from '../components/WritingPage'

export default async function Writing() {
  const writings = await getWritings()

  const entries: WritingEntry[] = writings.map((w) => ({
    id: w._id,
    title: w.title,
    description: w.description ?? '',
    date: w.date,
    imageUrl: w.imageUrl ?? null,
    text: (w.text ?? undefined) as WritingBlock[] | undefined,
  }))

  return <WritingPage entries={entries} />
}
