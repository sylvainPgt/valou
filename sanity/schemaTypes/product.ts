import {defineField, defineType, defineArrayMember} from 'sanity'

export const product = defineType({
  name: 'product',
  title: 'Product',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Nom',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96,
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'price',
      title: 'Prix',
      type: 'number',
      validation: (rule) =>
        rule
          .required()
          .min(0)
          .precision(2),
    }),
    defineField({
      name: 'stripePaymentLink',
      title: 'Lien de paiement Stripe',
      type: 'url',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'photos',
      title: 'Galerie de photos',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'image',
          options: {
            hotspot: true,
          },
        }),
      ],
      validation: (rule) => rule.required().min(1),
    }),
  ],
})

