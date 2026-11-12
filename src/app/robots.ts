import { MetadataRoute } from 'next';
import { absoluteUrl } from '@/lib/site';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: '*', allow: '/', disallow: ['/admin', '/account', '/login', '/signup', '/forgot-password', '/reset-password', '/auth/', '/api/', '/favorites', '/compare'] }],
    sitemap: absoluteUrl('/sitemap.xml'),
  };
}
