'use client'

/**
 * Sanity Studio mounted at `/atelier-7k3p` (see `app/atelier-7k3p/[[...tool]]/page.tsx`).
 * Theme tokens align with the storefront design system (lait de chaux, vert sauge, bois teck).
 */

import {visionTool} from '@sanity/vision'
import {buildLegacyTheme, defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'

// Go to https://www.sanity.io/docs/api-versioning to learn how API versioning works
import {apiVersion, dataset, projectId} from './sanity/env'
import {schema} from './sanity/schemaTypes'
import {structure} from './sanity/structure'

const storefrontTheme = buildLegacyTheme({
  '--brand-primary': '#96a88b',
  '--default-button-primary-color': '#96a88b',
  '--focus-color': '#a67f5c',
  '--component-bg': '#fdfbf9',
  '--component-text-color': '#332a20',
  '--gray-base': '#332a20',
  '--gray': '#5c4f42',
  '--main-navigation-color': '#f8f5f1',
  '--main-navigation-color--inverted': '#332a20',
  '--state-success-color': '#5a7a52',
  '--state-danger-color': '#9b3d3d',
  '--font-family-base':
    'var(--font-body, "Inter", ui-sans-serif), system-ui, sans-serif',
})

export default defineConfig({
  basePath: '/atelier-7k3p',
  title: 'Valou Atelier',
  projectId,
  dataset,
  theme: storefrontTheme,
  schema,
  plugins: [
    structureTool({structure}),
    visionTool({defaultApiVersion: apiVersion}),
  ],
})
