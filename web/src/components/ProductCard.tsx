'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Product } from '@/lib/data';
import { useCart } from '@/store/cart';
import { ShoppingCart, Star, Check } from 'lucide-react';

export default function ProductCard({ product }: { product: Product }) {
  const firstImage = product.images ? product.images.split(',')[0].trim() : 'https://via.placeholder.com/300x300?text=No+Image';
  const hasDiscount = product.salePrice && product.regularPrice && product.salePrice < product.regularPrice;
  const currentPrice = product.salePrice || product.regularPrice || 0;
  
  const { addItem } = useCart();
  const [justAdded, setJustAdded] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, 1);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 2000);
  };

  return (
    <div className="product-item border border-gray-200 bg-white p-3 hover:shadow-lg transition-all duration-200 h-full flex flex-col relative text-center group">
      
      {/* Discount Badge on Top-Left */}
      {hasDiscount && product.discountPercentage && (
        <div className="absolute top-2 left-2 z-10">
          <span className="bg-[#d9534f] text-white text-[11px] font-bold px-2 py-0.5 rounded shadow-sm">
            {product.discountPercentage}
          </span>
        </div>
      )}

      {/* Clean Product Image Container without any HTML badge overlay */}
      <Link href={`/product/${product.slug}`} className="product-item-image block mb-3 relative aspect-square overflow-hidden bg-white">
        <img
          src={firstImage}
          alt={product.name}
          className="object-contain w-full h-full transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
      </Link>

      {/* Content */}
      <div className="flex flex-col flex-grow">
        {/* Title */}
        <h4 className="font-semibold text-gray-800 text-[13px] md:text-[14px] leading-snug mb-1.5 line-clamp-2 min-h-[36px]">
          <Link href={`/product/${product.slug}`} className="hover:text-[#d32f2f] transition-colors">
            {product.name}
          </Link>
        </h4>

        {/* Rating Stars Summary */}
        <div className="flex items-center justify-center gap-1 mb-2 text-[#f0ad4e]">
          {[...Array(5)].map((_, i) => (
            <Star key={i} size={12} fill="currentColor" stroke="none" />
          ))}
          <span className="text-gray-400 text-[11px] ml-0.5">({product.ratingCount || 1})</span>
        </div>
        
        {/* Price Box */}
        <div className="price-box mb-3 flex-grow flex flex-col justify-end">
          {hasDiscount ? (
            <div className="flex flex-col items-center justify-center">
              <span className="product-desc-price text-[12px] text-gray-400 line-through">Price : {product.regularPrice} PKR</span>
              <span className="product-price text-[15px] md:text-[16px] font-bold text-[#d32f2f] mt-0.5">Special Price {product.salePrice} PKR</span>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center">
              <span className="product-price text-[15px] md:text-[16px] font-bold text-[#d32f2f]">Price : {currentPrice} PKR</span>
            </div>
          )}
        </div>
        
        {/* Dual Actions: ORDER NOW + ADD TO CART */}
        <div className="grid grid-cols-1 gap-2 pt-1">
          <Link 
            href={`/online_order/${product.slug}`}
            className="block w-full bg-[#333333] text-white text-[12px] md:text-[13px] font-bold py-2 px-3 uppercase hover:bg-[#d32f2f] transition-colors text-center tracking-wider shadow-sm"
          >
            Order Now
          </Link>

          <button
            type="button"
            onClick={handleAddToCart}
            className={`w-full py-1.5 px-3 text-[11px] md:text-[12px] font-bold uppercase transition-all flex items-center justify-center gap-1.5 border ${
              justAdded
                ? 'bg-green-600 text-white border-green-600'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700 border-gray-300'
            }`}
          >
            {justAdded ? (
              <>
                <Check size={14} /> Added to Cart
              </>
            ) : (
              <>
                <ShoppingCart size={14} /> Add to Cart
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}
