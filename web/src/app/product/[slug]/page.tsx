import { getProductBySlug, getProducts } from '@/lib/data';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Metadata } from 'next';

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
    title: product.seoTitle || `${product.name} | Cartly`,
    description: product.metaDescription || product.shortDescription,
    alternates: {
      canonical: product.canonical,
    },
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const product = getProductBySlug(resolvedParams.slug);
  
  if (!product) {
    notFound();
  }

  const images = product.images ? product.images.split(',').map(s => s.trim()) : [];
  const firstCategory = product.category ? product.category.split(',')[0].trim() : '';
  const hasDiscount = product.salePrice && product.regularPrice && product.salePrice < product.regularPrice;
  const currentPrice = product.salePrice || product.regularPrice;
  
  const whatsappMessage = encodeURIComponent(`Product: ${product.name}\nPrice: ${currentPrice} PKR\nProduct URL: https://cartly.com.pk/product/${product.slug}`);

  return (
    <div className="container-custom py-8 bg-[#f8f9fa]">
      {/* Breadcrumbs */}
      <div className="breadcrumb flex items-center gap-2 text-[13px] text-gray-500 mb-8">
        <Link href="/" className="hover:text-[#d32f2f] transition-colors">Home</Link>
        <span>&gt;</span>
        {firstCategory && (
          <>
            <Link href={`/product-category/${firstCategory}`} className="hover:text-[#d32f2f] transition-colors">{firstCategory}</Link>
            <span>&gt;</span>
          </>
        )}
        <span className="text-gray-800">{product.name}</span>
      </div>

      <div className="flex flex-col md:flex-row gap-8 mb-12 bg-white p-6 border border-gray-200">
        
        {/* Gallery */}
        <div className="w-full md:w-[45%]">
          <div className="product-item-image slider border border-gray-200 mb-4 relative">
             {hasDiscount && product.discountPercentage && (
               <div className="absolute top-2 left-2 z-10 bg-[#d9534f] text-white text-[12px] font-bold px-2 py-1">
                 {product.discountPercentage}
               </div>
             )}
             <img 
               src={images[0] || 'https://via.placeholder.com/600x600?text=No+Image'} 
               alt={product.name}
               className="w-full h-auto object-contain"
             />
          </div>
          {images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {images.map((img, i) => (
                <div key={i} className="border border-gray-200 cursor-pointer">
                   <img src={img} alt={`Thumbnail ${i}`} className="w-full h-auto object-contain" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Product Info Block */}
        <div className="product-name w-full md:w-[55%]">
          <h3 className="text-[28px] font-bold text-gray-800 mb-3">{product.name}</h3>
          
          <div className="mb-4 text-[14px]">
            <b>Category:</b> <Link href={`/product-category/${firstCategory}`}><strong className="text-[#31708f] hover:underline">{firstCategory}</strong></Link>
          </div>
          
          <div className="flex items-center gap-2 mb-4">
             <span className="text-[#f0ad4e] text-lg">★★★★☆</span>
             <span className="text-[14px] text-gray-500">(4.5 / 5.0) 25 Reviews</span>
          </div>

          <div className="price-box mb-6 border-y border-gray-200 py-4">
            <h1 className="text-gray-800 font-bold m-0 flex flex-col">
              {hasDiscount ? (
                <>
                  <span className="product-desc-price text-[16px] text-gray-500 line-through font-normal">Price : {product.regularPrice} PKR</span>
                  <span className="product-price text-[24px] text-[#d32f2f] mt-1">Special Price {product.salePrice} PKR</span>
                </>
              ) : (
                <span className="product-price text-[24px] text-[#d32f2f]">Price : {product.regularPrice || product.salePrice} PKR</span>
              )}
            </h1>
          </div>

          <div className="mb-6">
            <p className="text-[14px] text-gray-700 font-bold">Availability: <span className="font-normal">{product.stockStatus || 'In Stock'}</span></p>
          </div>

          {product.shortDescription && (
            <div className="short-description text-[14px] text-gray-600 leading-relaxed mb-6" 
                 dangerouslySetInnerHTML={{ __html: product.shortDescription }} />
          )}

          {/* Quick Order Flow CTAs */}
          <div className="flex flex-col gap-3 max-w-[300px]">
            <Link 
              href={`/online_order/${product.slug}`}
              className="bg-[#333333] hover:bg-[#d32f2f] text-white text-center font-bold text-[15px] uppercase py-3 px-6 transition-colors"
            >
              Order Now
            </Link>
            
            <Link 
              href={`https://wa.me/923106375837?text=${whatsappMessage}`}
              target="_blank"
              className="bg-[#25D366] hover:bg-[#128C7E] text-white text-center font-bold text-[15px] uppercase py-3 px-6 transition-colors flex items-center justify-center gap-2"
            >
              Order Via WhatsApp
            </Link>
          </div>
        </div>
      </div>

      {/* Description Tab Content */}
      <div id="description" className="tab-content bg-white p-6 border border-gray-200 mt-8">
         <h2 className="text-[20px] font-bold text-gray-800 border-b border-gray-200 pb-2 mb-4 uppercase">Description</h2>
         <div className="text-[14px] text-gray-700 leading-relaxed max-w-none" 
              dangerouslySetInnerHTML={{ __html: product.description || 'No detailed description available.' }} />
      </div>
    </div>
  );
}
