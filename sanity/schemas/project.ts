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
      name: 'clientName',
      title: 'Client Name',
      type: 'string',
      description: 'Name of the client (displayed in the detail row)',
    },
    {
      name: 'subtitle',
      title: 'Subtitle',
      type: 'string',
      description: 'e.g. "design, development"',
    },
    {
      name: 'process',
      title: 'Process',
      type: 'text',
      rows: 4,
      description: 'One paragraph about the process for this project',
    },
    {
      name: 'bio',
      title: 'Client Bio',
      type: 'text',
      rows: 4,
      description: 'Short description / bio of the client',
    },
    {
      name: 'stack',
      title: 'Stack',
      type: 'array',
      of: [{ type: 'string' }],
      options: { layout: 'tags' },
      description: 'Technologies used (e.g. Next.js, Sanity, Figma)',
    },
    {
      name: 'domain',
      title: 'Domain',
      type: 'string',
      description: 'Live site address (e.g. broosk.online)',
    },
    {
      name: 'href',
      title: 'Link URL',
      type: 'url',
      validation: (Rule: any) =>
        Rule.uri({ allowRelative: true, scheme: ['http', 'https'] }),
    },
    {
      name: 'images',
      title: 'Project Images',
      type: 'array',
      of: [{ type: 'image', options: { hotspot: true } }],
      description: 'Gallery of project images (first is used as cover)',
    },
    {
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{ type: 'string' }],
      options: { layout: 'tags' },
    },
    {
      name: 'year',
      title: 'Year',
      type: 'string',
      description: 'Year the project was completed',
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
  preview: {
    select: {
      title: 'clientName',
      subtitle: 'title',
      media: 'images.0',
    },
  },
}

export default project
