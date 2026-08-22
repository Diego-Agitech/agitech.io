import { config, fields, collection } from '@keystatic/core';

export default config({
  storage:
    process.env.NODE_ENV === 'development'
      ? { kind: 'local' }
      : { kind: 'github', repo: 'Diego-Agitech/agitech.io' },
  ui: {
    brand: { name: 'Agitech — Éditeur du site' },
  },
  collections: {
    blog: collection({
      label: 'Blog',
      slugField: 'title',
      path: 'src/content/blog/*',
      format: { contentField: 'body' },
      columns: ['title', 'lang', 'publishedAt'],
      schema: {
        title: fields.slug({ name: { label: 'Titre' } }),
        lang: fields.select({
          label: 'Langue',
          options: [
            { label: 'Français', value: 'fr' },
            { label: 'English', value: 'en' },
          ],
          defaultValue: 'fr',
        }),
        publishedAt: fields.date({ label: 'Date de publication' }),
        excerpt: fields.text({ label: 'Résumé (SEO/liste)', multiline: true }),
        coverImage: fields.image({
          label: 'Image de couverture',
          directory: 'public/assets/img/blog',
          publicPath: '/assets/img/blog/',
        }),
        body: fields.markdoc({ label: 'Contenu' }),
      },
    }),
    businessCases: collection({
      label: 'Business Cases',
      slugField: 'title',
      path: 'src/content/business-cases/*',
      format: { contentField: 'body' },
      columns: ['title', 'lang', 'client'],
      schema: {
        title: fields.slug({ name: { label: 'Titre' } }),
        lang: fields.select({
          label: 'Langue',
          options: [
            { label: 'Français', value: 'fr' },
            { label: 'English', value: 'en' },
          ],
          defaultValue: 'fr',
        }),
        client: fields.text({ label: 'Client' }),
        industry: fields.text({ label: 'Secteur' }),
        coverImage: fields.image({
          label: 'Image de couverture',
          directory: 'public/assets/img/business-cases',
          publicPath: '/assets/img/business-cases/',
        }),
        body: fields.markdoc({ label: 'Contenu' }),
      },
    }),
    pages: collection({
      label: 'Pages',
      slugField: 'title',
      path: 'src/content/pages/*',
      format: { contentField: 'body' },
      columns: ['title', 'lang'],
      schema: {
        title: fields.slug({ name: { label: 'Titre' } }),
        lang: fields.select({
          label: 'Langue',
          options: [
            { label: 'Français', value: 'fr' },
            { label: 'English', value: 'en' },
          ],
          defaultValue: 'fr',
        }),
        seoTitle: fields.text({ label: 'Titre SEO' }),
        seoDescription: fields.text({ label: 'Description SEO', multiline: true }),
        body: fields.markdoc({ label: 'Contenu' }),
      },
    }),
  },
});
