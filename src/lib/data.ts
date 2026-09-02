import fs from 'fs';
import path from 'path';

export interface Review {
  reviewer: string;
  isVerified: boolean;
  date: string;
  comment: string;
  stars: number;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  url: string;
  regularPrice: number | null;
  salePrice: number | null;
  discountPercentage: string;
  stockStatus: string;
  shortDescription: string;
  description: string;
  descriptionHtml?: string;
  images: string;
  category: string;
  tags: string;
  ratingCount?: number;
  ratingValue?: number;
  reviews?: Review[];
  seoTitle: string;
  metaDescription: string;
  canonical: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  url: string;
  seoTitle: string;
  metaDescription: string;
  canonical: string;
}

export interface StaticPage {
  url: string;
  title: string;
  h1: string;
  seoDescription: string;
  contentPreview: string;
}

const dataDir = path.join(process.cwd(), 'src', 'data');

export function getProducts(): Product[] {
  try {
    const filePath = path.join(dataDir, 'products.json');
    if (fs.existsSync(filePath)) {
      const file = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(file);
    }
  } catch (err) {
    console.error('Error reading products.json:', err);
  }
  return [];
}

export function getProductBySlug(slug: string): Product | undefined {
  const products = getProducts();
  return products.find((p) => p.slug === slug);
}

export function getRelatedProducts(product: Product, limit: number = 8): Product[] {
  const products = getProducts();
  const currentCategory = product.category ? product.category.split(',')[0].trim() : '';
  
  // First priority: same primary category (excluding current product)
  const sameCategory = products.filter(
    (p) => p.slug !== product.slug && p.category && p.category.includes(currentCategory)
  );

  if (sameCategory.length >= limit) {
    return sameCategory.slice(0, limit);
  }

  // Second priority: shared tags
  const currentTags = product.tags ? product.tags.split(',').map(t => t.trim().toLowerCase()) : [];
  const sameTags = products.filter(
    (p) => p.slug !== product.slug && !sameCategory.some(sc => sc.slug === p.slug) && p.tags && currentTags.some(ct => p.tags.toLowerCase().includes(ct))
  );

  const combined = [...sameCategory, ...sameTags];
  if (combined.length >= limit) {
    return combined.slice(0, limit);
  }

  // Fill remainder with other products
  const remaining = products.filter(
    (p) => p.slug !== product.slug && !combined.some(c => c.slug === p.slug)
  );

  return [...combined, ...remaining].slice(0, limit);
}

export function getCategories(): Category[] {
  try {
    const filePath = path.join(dataDir, 'categories.json');
    if (fs.existsSync(filePath)) {
      const file = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(file);
    }
  } catch (err) {
    console.error('Error reading categories.json:', err);
  }
  return [];
}

export function getCategoryBySlug(slug: string): Category | undefined {
  const categories = getCategories();
  return categories.find((c) => c.slug === slug);
}

export function getProductsByCategory(categoryName: string): Product[] {
  const products = getProducts();
  return products.filter((p) => p.category.includes(categoryName));
}

export function getTags(): Category[] {
  try {
    const filePath = path.join(dataDir, 'tags.json');
    if (fs.existsSync(filePath)) {
      const file = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(file);
    }
  } catch (err) {
    console.error('Error reading tags.json:', err);
  }
  return [];
}

export function getProductsByTag(tagName: string): Product[] {
  const products = getProducts();
  return products.filter((p) => p.tags.includes(tagName));
}

export function getStaticPages(): StaticPage[] {
  try {
    const filePath = path.join(dataDir, 'static-pages.json');
    if (fs.existsSync(filePath)) {
      const file = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(file);
    }
  } catch (err) {
    console.error('Error reading static-pages.json:', err);
  }
  return [];
}

export function getStaticPageBySlug(slug: string): StaticPage | undefined {
  const pages = getStaticPages();
  return pages.find((p) => {
    const pageSlug = p.url.replace(/\/$/, '').split('/').pop();
    return pageSlug === slug;
  });
}
