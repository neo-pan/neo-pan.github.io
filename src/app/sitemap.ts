import type { MetadataRoute } from 'next';

const SITE_URL = 'https://neo-pan.github.io';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${SITE_URL}/`,
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: `${SITE_URL}/publications/`,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/cv/`,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
  ];
}
