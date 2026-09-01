import { getProducts, getCategories } from '@/lib/data';
import Link from 'next/link';
import ProductCard from '@/components/ProductCard';

export default function Home() {
  const products = getProducts();
  const categories = getCategories();
  
  // Featured products
  const featuredProducts = products.slice(0, 12);
  
  // Top categories
  const topCategories = categories.slice(0, 8);

  return (
    <div className="flex flex-col items-center bg-[#f8f9fa] pb-12">
      
      {/* Fallback Hero Banner */}
      <section className="w-full bg-[#1e1e1e] border-b-4 border-[#d32f2f]">
        <div className="container-custom py-12 flex flex-col items-center text-center">
           <h1 className="text-white text-4xl font-bold tracking-wide uppercase mb-4">Cartly Premium Store</h1>
           <p className="text-gray-300 text-lg">Shop the Best Quality Products With Free Delivery in Pakistan</p>
        </div>
      </section>

      {/* Categories Section */}
      <section className="w-full container-custom mt-12">
        <div className="border-b-2 border-[#d32f2f] mb-6 inline-block">
          <h2 className="text-2xl font-bold text-gray-800 uppercase pb-2 pr-8">Top Categories</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {topCategories.map((category) => (
            <Link 
              key={category.id} 
              href={`/product-category/${category.slug}`}
              className="bg-white border border-gray-200 p-6 flex flex-col items-center justify-center text-center hover:shadow-lg transition-shadow group"
            >
              <h3 className="font-bold text-gray-800 text-[14px] uppercase group-hover:text-[#d32f2f] transition-colors">{category.name}</h3>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="w-full container-custom mt-12">
        <div className="border-b-2 border-[#d32f2f] mb-6 inline-block">
          <h2 className="text-2xl font-bold text-gray-800 uppercase pb-2 pr-8">Latest Arrivals</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        
        <div className="mt-10 flex justify-center">
          <Link href="/shop" className="bg-[#333333] text-white px-8 py-3 uppercase font-bold text-sm hover:bg-[#d32f2f] transition-colors">
            View All Products
          </Link>
        </div>
      </section>

    </div>
  );
}
