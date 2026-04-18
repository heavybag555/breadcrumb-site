const resource = {
  name: 'resource',
  title: 'Resource',
  type: 'document',
  fields: [
    {
      name: 'label',
      title: 'Label',
      type: 'string',
      description: 'Display text for the link (e.g. "Rauno.me", "Refactoring UI")',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'url',
      title: 'URL',
      type: 'url',
      description: 'Destination link (opens in a new tab).',
      validation: (Rule: any) =>
        Rule.required().uri({ scheme: ['http', 'https', 'mailto'] }),
    },
    {
      name: 'previewImage',
      title: 'Preview Image URL',
      type: 'string',
      description:
        'Thumbnail shown next to the link. Auto-filled from YouTube / the target URL when seeded. Can be overridden with any image URL.',
    },
    {
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: 'Learning', value: 'learning' },
          { title: 'Reading', value: 'reading' },
          { title: 'Watching', value: 'watching' },
        ],
        layout: 'radio',
      },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'order',
      title: 'Display Order',
      type: 'number',
      description: 'Position within its category. 0 = first.',
    },
  ],
  orderings: [
    {
      title: 'Category, then order',
      name: 'categoryOrder',
      by: [
        { field: 'category', direction: 'asc' },
        { field: 'order', direction: 'asc' },
      ],
    },
  ],
  preview: {
    select: {
      title: 'label',
      subtitle: 'category',
      url: 'url',
    },
    prepare(value: Record<string, any>) {
      const { title, subtitle, url } = value
      const cat =
        typeof subtitle === 'string'
          ? subtitle.charAt(0).toUpperCase() + subtitle.slice(1)
          : '—'
      return {
        title: title || url || 'Untitled resource',
        subtitle: cat,
      }
    },
  },
}

export default resource
