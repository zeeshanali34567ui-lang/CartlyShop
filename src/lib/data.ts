import fs from 'fs';
import path from 'path';

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
  images: string;
  category: string;
  tags: string;
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
