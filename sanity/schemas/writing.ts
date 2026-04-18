const writing = {
  name: 'writing',
  title: 'Writing',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
      description: 'Short summary shown in the writing index.',
    },
    {
      name: 'image',
      title: 'Image',
      type: 'image',
      options: { hotspot: true },
      description: 'Cover image for the piece.',
    },
    {
      name: 'date',
      title: 'Date',
      type: 'date',
      options: { dateFormat: 'YYYY-MM-DD' },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'text',
      title: 'Text',
      type: 'array',
      of: [{ type: 'block' }],
      description: 'Full body of the writing piece.',
    },
    {
      name: 'order',
      title: 'Display Order',
      type: 'number',
      description: 'Optional manual override. Otherwise sorted by date desc.',
    },
  ],
  orderings: [
    {
      title: 'Date, newest first',
      name: 'dateDesc',
      by: [{ field: 'date', direction: 'desc' }],
    },
    {
      title: 'Display Order',
      name: 'displayOrder',
      by: [{ field: 'order', direction: 'asc' }],
    },
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'date',
      media: 'image',
    },
  },
}

export default writing
