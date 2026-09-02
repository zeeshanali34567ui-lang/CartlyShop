import { getProductBySlug, getProducts, getRelatedProducts } from '@/lib/data';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Metadata } from 'next';
import ProductDetailClient from '@/components/ProductDetailClient';
import ProductCard from '@/components/ProductCard';

export async function generateStaticParams() {
  const products = getProducts();
  return products.map((product) => ({
    slug: product.slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const product = getProductBySlug(resolvedParams.slug);
  if (!product) return {};
  
  return {
    title: product.seoTitle || `${product.name} Price in Pakistan | Cartly`,
    description: product.metaDescription || product.shortDescription || `Buy ${product.name} online in Pakistan at best price with free cash on delivery.`,
    alternates: {
      canonical: product.canonical || `https://cartly.com.pk/product/${product.slug}`,
    },
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const product = getProductBySlug(resolvedParams.slug);
  
  if (!product) {
    notFound();
  }

  const firstCategory = product.category ? product.category.split(',')[0].trim() : 'General';
  const categorySlug = firstCategory.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const relatedProducts = getRelatedProducts(product, 8);

  return (
    <div className="bg-[#f8f9fa] py-6 min-h-screen">
      <div className="container-custom">
        {/* Breadcrumb: Home > Category > Product Name */}
        <nav aria-label="Breadcrumb" className="breadcrumb flex items-center flex-wrap gap-2 text-[13px] text-gray-500 mb-6 bg-white p-3 border border-gray-200">
          <Link href="/" className="hover:text-[#d32f2f] transition-colors font-medium">
            Home
          </Link>
          <span className="text-gray-400">&gt;</span>
          {firstCategory && (
            <>
              <Link href={`/product-category/${categorySlug}`} className="hover:text-[#d32f2f] transition-colors font-medium">
                {firstCategory}
              </Link>
              <span className="text-gray-400">&gt;</span>
            </>
          )}
          <span className="text-gray-800 font-semibold truncate max-w-[400px]">
            {product.name}
          </span>
        </nav>

        {/* Product Detail Client Component (Images, Pricing, CTA, Tabs, Quick Order) */}
        <ProductDetailClient product={product} />

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <div className="related-products-section mt-10">
            <div className="flex items-center justify-between border-b-2 border-[#d32f2f] pb-2 mb-6">
              <h2 className="text-lg md:text-xl font-bold text-gray-800 uppercase tracking-wide">
                Related Products
              </h2>
              <Link
                href={`/product-category/${categorySlug}`}
                className="text-xs font-bold text-[#d32f2f] hover:underline uppercase"
              >
                View More in {firstCategory} &rarr;
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {relatedProducts.map((relProd) => (
                <ProductCard key={relProd.slug} product={relProd} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
