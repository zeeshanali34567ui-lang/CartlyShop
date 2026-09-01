import { MetadataRoute } from 'next';
import { getProducts, getCategories, getTags, getStaticPages } from '@/lib/data';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://cartly.com.pk';

  const sitemapData: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/shop`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
  ];

  // Products
  const products = getProducts();
  products.forEach((product) => {
    sitemapData.push({
      url: `${baseUrl}/product/${product.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    });
  });

  // Categories
  const categories = getCategories();
  categories.forEach((cat) => {
    sitemapData.push({
      url: `${baseUrl}/product-category/${cat.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    });
  });

  // Tags
  const tags = getTags();
  tags.forEach((tag) => {
    sitemapData.push({
      url: `${baseUrl}/product-tag/${tag.slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    });
  });

  // Static Pages
  const staticPages = getStaticPages();
  staticPages.forEach((page) => {
    const slug = page.url.replace(/\/$/, '').split('/').pop();
    if (slug) {
      sitemapData.push({
        url: `${baseUrl}/${slug}`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.6,
      });
    }
  });

  return sitemapData;
}
