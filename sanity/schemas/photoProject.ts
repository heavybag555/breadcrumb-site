const photoProject = {
  name: 'photoProject',
  title: 'Photo Project',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'Project / subject name (e.g. "CC Buchanan")',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'medium',
      title: 'Medium',
      type: 'string',
      options: {
        list: [{ title: 'Photo', value: 'photo' }],
        layout: 'radio',
      },
      initialValue: 'photo',
      readOnly: true,
    },
    {
      name: 'location',
      title: 'Location',
      type: 'string',
      description: 'Where the shoot took place (e.g. "Catalina")',
    },
    {
      name: 'year',
      title: 'Year',
      type: 'string',
      description: 'Year the project was shot',
    },
    {
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{ type: 'string' }],
      options: { layout: 'tags' },
    },
    {
      name: 'images',
      title: 'Images',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'photoEntry',
          title: 'Photo',
          fields: [
            {
              name: 'image',
              title: 'Image',
              type: 'image',
              options: { hotspot: true },
            },
            {
              name: 'wide',
              title: 'Wide',
              type: 'boolean',
              description: 'Span all 4 columns instead of 2.',
              initialValue: false,
            },
          ],
          preview: {
            select: { media: 'image', wide: 'wide' },
            prepare({ media, wide }: { media: any; wide: boolean }) {
              return { title: wide ? 'Wide' : 'Standard', media }
            },
          },
        },
      ],
      description: 'Photos for this project (first two shown on the work page)',
    },
    {
      name: 'order',
      title: 'Display Order',
      type: 'number',
      description:
        'Controls the position on the work page across all project types. 0 = first.',
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
      title: 'title',
      subtitle: 'location',
      media: 'images.0.image',
    },
  },
}

export default photoProject
