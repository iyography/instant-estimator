import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/overview', '/forms', '/leads', '/services', '/settings', '/onboarding'],
      },
    ],
    sitemap: 'https://scopeform.io/sitemap.xml',
  };
}
