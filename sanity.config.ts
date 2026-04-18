'use client'

import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import project from './sanity/schemas/project'
import photoProject from './sanity/schemas/photoProject'

export default defineConfig({
  name: '2u4u-studio',
  title: '2U4U Studio',
  projectId: 'tl235np0',
  dataset: 'production',
  basePath: '/studio',
  plugins: [structureTool()],
  schema: { types: [project, photoProject] },
})
