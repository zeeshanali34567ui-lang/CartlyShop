import Link from 'next/link';
import { Product } from '@/lib/data';

export default function ProductCard({ product }: { product: Product }) {
  // Use first image if multiple, or fallback
  const firstImage = product.images ? product.images.split(',')[0].trim() : 'https://via.placeholder.com/300x300?text=No+Image';
  
  const hasDiscount = product.salePrice && product.regularPrice && product.salePrice < product.regularPrice;

  return (
    <div className="product-item border border-gray-200 bg-white p-3 hover:shadow-lg transition-shadow h-full flex flex-col relative text-center">
      
      {/* Badges */}
      {hasDiscount && product.discountPercentage && (
        <div className="absolute top-2 left-2 z-10">
          <span className="bg-[#d9534f] text-white text-[11px] font-bold px-2 py-1 rounded">
            {product.discountPercentage}
          </span>
        </div>
      )}

      {/* Image Container */}
      <Link href={`/product/${product.slug}`} className="product-item-image block relative aspect-square overflow-hidden mb-3">
        <img 
          src={firstImage} 
          alt={product.name}
          className="object-contain w-full h-full"
          loading="lazy"
        />
      </Link>

      {/* Content */}
      <div className="flex flex-col flex-grow">
        <h4 className="font-semibold text-gray-800 text-[14px] leading-snug mb-2 line-clamp-2">
          <Link href={`/product/${product.slug}`} className="hover:text-[#d32f2f] transition-colors">
            {product.name}
          </Link>
        </h4>
        
        {/* Price Box */}
        <div className="price-box mb-3 flex-grow flex flex-col justify-end">
          {hasDiscount ? (
            <div className="flex flex-col items-center justify-center">
              <span className="product-desc-price text-[13px] text-gray-500 line-through">Price : {product.regularPrice} PKR</span>
              <span className="product-price text-[16px] font-bold text-[#d32f2f] mt-1">Special Price {product.salePrice} PKR</span>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center">
              <span className="product-price text-[16px] font-bold text-[#d32f2f]">Price : {product.regularPrice || product.salePrice} PKR</span>
            </div>
          )}
        </div>
        
        {/* Action */}
        <Link 
          href={`/online_order/${product.slug}`}
          className="block w-full bg-[#333333] text-white text-[13px] font-bold py-2 px-4 uppercase hover:bg-[#d32f2f] transition-colors text-center"
        >
          Order Now
        </Link>
      </div>
    </div>
  );
}
