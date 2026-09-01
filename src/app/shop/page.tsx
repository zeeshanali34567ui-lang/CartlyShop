import { getProducts } from '@/lib/data';
import ProductCard from '@/components/ProductCard';
import Link from 'next/link';

export const metadata = {
  title: 'Shop All Products | Cartly',
  description: 'Browse our complete catalog of premium products.',
};

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedParams = await searchParams;
  let allProducts = getProducts();
  
  const query = typeof resolvedParams.search === 'string' ? resolvedParams.search.toLowerCase() : '';
  if (query) {
    allProducts = allProducts.filter(p => 
      p.name.toLowerCase().includes(query) || 
      (p.shortDescription && p.shortDescription.toLowerCase().includes(query)) ||
      (p.category && p.category.toLowerCase().includes(query))
    );
  }
  
  const totalProducts = allProducts.length;

  return (
    <div className="container-custom py-8 bg-[#f8f9fa]">
      {/* Breadcrumbs */}
      <div className="breadcrumb flex items-center gap-2 text-[13px] text-gray-500 mb-6">
        <Link href="/" className="hover:text-[#d32f2f] transition-colors">Home</Link>
        <span>&gt;</span>
        <span className="text-gray-800">Shop</span>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-end mb-6 gap-4 border-b border-gray-200 pb-4">
         <div>
            <h1 className="text-3xl font-bold text-gray-800 uppercase mb-2">Shop</h1>
         </div>
         <div className="flex items-center gap-4 text-sm">
            <span className="text-gray-600 hidden md:inline">Showing all {totalProducts} results</span>
            <select className="bg-white border border-gray-300 text-gray-700 text-sm rounded outline-none p-2 w-[220px]">
               <option>Sort by Popularity</option>
               <option>Sort by Newness</option>
               <option>Sort by Price: Low to High</option>
               <option>Sort by Price: High to Low</option>
            </select>
         </div>
      </div>

      {/* Grid */}
      <div className="product-grid grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1">
        {allProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
