import { SITE } from './site';

export function personSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: SITE.name,
    alternateName: SITE.legalName,
    url: SITE.url,
    description: SITE.description,
    email: `mailto:${SITE.email}`,
    affiliation: {
      '@type': 'EducationalOrganization',
      name: SITE.school,
    },
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'San Jose',
      addressRegion: 'CA',
      addressCountry: 'US',
    },
    ...(SITE.sameAs.length ? { sameAs: SITE.sameAs } : {}),
  };
}

export function blogPostingSchema(opts: {
  headline: string;
  description: string;
  slug: string;
  datePublished: Date;
  dateModified?: Date;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: opts.headline,
    description: opts.description,
    url: `${SITE.url}/writing/${opts.slug}`,
    datePublished: opts.datePublished.toISOString(),
    dateModified: (opts.dateModified ?? opts.datePublished).toISOString(),
    author: {
      '@type': 'Person',
      name: SITE.name,
      url: SITE.url,
    },
  };
}
