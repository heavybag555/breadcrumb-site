const project = {
  name: 'project',
  title: 'Project',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'subtitle',
      title: 'Subtitle',
      type: 'string',
      description: 'e.g. "design, development"',
    },
    {
      name: 'href',
      title: 'Link URL',
      type: 'url',
      validation: (Rule: any) =>
        Rule.uri({ allowRelative: true, scheme: ['http', 'https'] }),
    },
    {
      name: 'image',
      title: 'Cover Image',
      type: 'image',
      options: { hotspot: true },
    },
    {
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{ type: 'string' }],
      options: { layout: 'tags' },
    },
    {
      name: 'order',
      title: 'Display Order',
      type: 'number',
      description:
        'Controls the position on the homepage grid. 0 = first slot, 6 = last.',
    },
  ],
  orderings: [
    {
      title: 'Display Order',
      name: 'displayOrder',
      by: [{ field: 'order', direction: 'asc' }],
    },
  ],
}

export default project
