'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Product, Review } from '@/lib/data';
import { useCart } from '@/store/cart';
import { MessageCircle, Star, ShieldCheck, Truck, CheckCircle2, ShoppingCart, ArrowRight } from 'lucide-react';

interface ProductDetailClientProps {
  product: Product;
}

export default function ProductDetailClient({ product }: ProductDetailClientProps) {
  const images = product.images ? product.images.split(',').map(s => s.trim()).filter(Boolean) : [];
  const [activeImage, setActiveImage] = useState<string>(images[0] || 'https://via.placeholder.com/600x600?text=No+Image');
  const [activeTab, setActiveTab] = useState<'description' | 'tags' | 'reviews'>('description');
  const [quantity, setQuantity] = useState<number>(1);
  const [addedToast, setAddedToast] = useState<boolean>(false);
  const [userReviews, setUserReviews] = useState<Review[]>(product.reviews || []);
  const [newReview, setNewReview] = useState({ name: '', email: '', stars: 5, review: '' });
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  const { addItem } = useCart();

  const firstCategory = product.category ? product.category.split(',')[0].trim() : 'General';
  const categorySlug = firstCategory.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const tagsList = product.tags ? product.tags.split(',').map(t => t.trim()).filter(Boolean) : [];

  const hasDiscount = product.salePrice && product.regularPrice && product.salePrice < product.regularPrice;
  const currentPrice = product.salePrice || product.regularPrice || 0;
  
  const ratingCount = product.ratingCount || (userReviews.length > 0 ? userReviews.length : 1);

  const whatsappText = encodeURIComponent(
`I want to order:
Product: ${product.name}
Price: ${currentPrice} PKR
URL: https://cartly.com.pk/product/${product.slug}`
  );

  const handleAddToCart = () => {
    addItem(product, quantity);
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 5000);
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReview.name || !newReview.review) return;

    const added: Review = {
      reviewer: newReview.name,
      isVerified: true,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
      comment: newReview.review,
      stars: Number(newReview.stars)
    };

    setUserReviews([added, ...userReviews]);
    setReviewSubmitted(true);
    setNewReview({ name: '', email: '', stars: 5, review: '' });
  };

  return (
    <div className="product-detail-container">
      
      {/* Toast Notification when Added to Cart */}
      {addedToast && (
        <div className="mb-6 p-4 bg-green-50 border-2 border-green-500 rounded text-green-900 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-md animate-fade-in">
          <div className="flex items-center gap-2 font-semibold text-sm">
            <CheckCircle2 size={20} className="text-green-600" />
            <span>Success! <strong>{product.name}</strong> ({quantity}x) added to your cart.</span>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Link
              href="/cart"
              className="bg-[#d32f2f] hover:bg-[#b52828] text-white text-xs font-bold uppercase py-2 px-4 rounded transition-colors flex items-center gap-1.5 shadow-sm"
            >
              View Cart & Checkout <ArrowRight size={14} />
            </Link>
            <button
              onClick={() => setAddedToast(false)}
              className="text-xs text-gray-500 hover:text-gray-800 underline"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      )}

      {/* Main Product Box */}
      <div className="bg-white border border-gray-200 p-4 md:p-6 mb-8 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          
          {/* LEFT: Clean Product Image with integrated banner (Zero HTML overlays) */}
          <div className="md:col-span-5 flex flex-col items-center">
            <div className="w-full border border-gray-200 relative aspect-square flex items-center justify-center p-2 bg-white overflow-hidden group">
              {hasDiscount && product.discountPercentage && (
                <div className="absolute top-3 left-3 z-10 bg-[#d9534f] text-white text-xs font-bold px-2.5 py-1 uppercase tracking-wider rounded-sm shadow-sm">
                  {product.discountPercentage}
                </div>
              )}
              {/* Main Product Image */}
              <img
                src={activeImage}
                alt={product.name}
                className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
              />
            </div>

            {/* Thumbnail Gallery */}
            {images.length > 1 && (
              <div className="flex flex-wrap gap-2 mt-4 justify-start w-full">
                {images.map((img, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setActiveImage(img)}
                    className={`w-16 h-16 border-2 p-0.5 overflow-hidden transition-all bg-white relative ${
                      activeImage === img ? 'border-[#d32f2f] shadow-sm' : 'border-gray-200 hover:border-gray-400 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={img}
                      alt={`Gallery ${i}`}
                      className="w-full h-full object-contain"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT: Product Info & Actions */}
          <div className="md:col-span-7 flex flex-col shop-detail-right">
            <h1 className="text-xl md:text-2xl font-bold text-gray-800 leading-snug mb-2">
              {product.name}
            </h1>

            {/* Category */}
            <div className="text-[13px] text-gray-600 mb-3">
              <span className="font-semibold text-gray-700">Category: </span>
              <Link href={`/product-category/${categorySlug}`} className="text-[#31708f] hover:underline font-bold">
                {firstCategory}
              </Link>
            </div>

            {/* Rating Stars Summary */}
            <div className="flex items-center gap-2 mb-4 text-sm">
              <div className="flex text-[#f0ad4e]">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} fill="currentColor" stroke="none" />
                ))}
              </div>
              <span className="text-gray-500 font-medium text-xs">
                ({ratingCount}) {ratingCount} Review(s)
              </span>
              <span className="text-gray-300">|</span>
              <button
                onClick={() => {
                  setActiveTab('reviews');
                  const tabsEl = document.getElementById('product-tabs-section');
                  if (tabsEl) tabsEl.scrollIntoView({ behavior: 'smooth' });
                }}
                className="text-[#31708f] hover:underline text-xs font-semibold"
              >
                Add Your Review
              </button>
            </div>

            {/* Price Box */}
            <div className="price-box bg-[#fcfcfc] border-y border-gray-200 py-3.5 px-4 mb-4">
              {hasDiscount ? (
                <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-4">
                  <span className="product-desc-price text-[15px] text-gray-400 line-through font-normal">
                    Price : {product.regularPrice} PKR
                  </span>
                  <span className="product-price text-[22px] md:text-[26px] font-extrabold text-[#d32f2f]">
                    Special Price {product.salePrice} PKR
                  </span>
                  {product.discountPercentage && (
                    <span className="badge bg-[#d9534f] text-white text-xs font-bold px-2 py-0.5 rounded-sm self-start sm:self-auto">
                      {product.discountPercentage}
                    </span>
                  )}
                </div>
              ) : (
                <span className="product-price text-[22px] md:text-[26px] font-extrabold text-[#d32f2f]">
                  Price : {currentPrice} PKR
                </span>
              )}
            </div>

            {/* Availability & Value Props */}
            <div className="space-y-2 text-[13px] mb-5">
              <div className="flex items-center gap-2">
                <span className="font-bold text-gray-700">Availability:</span>
                <span className="text-green-600 font-semibold flex items-center gap-1">
                  <CheckCircle2 size={15} /> {product.stockStatus || 'In Stock'}
                </span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Truck size={15} className="text-[#d32f2f]" />
                <span><strong>Free Delivery</strong> all over Pakistan in 2-4 business days</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <ShieldCheck size={15} className="text-blue-600" />
                <span>100% Original Authentic Product with Cash on Delivery</span>
              </div>
            </div>

            {/* Quick Overview */}
            {product.shortDescription && (
              <div className="short-description text-[13px] text-gray-600 leading-relaxed mb-6 border-l-2 border-[#d32f2f] pl-3 py-1 bg-gray-50">
                {product.shortDescription}
              </div>
            )}

            {/* Quantity Selector */}
            <div className="flex items-center gap-3 mb-6">
              <span className="text-xs font-bold text-gray-700 uppercase">Quantity:</span>
              <div className="flex items-center border border-gray-300">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-sm"
                >
                  -
                </button>
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-12 text-center text-sm font-semibold p-1 outline-none"
                />
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-sm"
                >
                  +
                </button>
              </div>
            </div>

            {/* Dedicated Action Buttons: ORDER NOW | ADD TO CART | WHATSAPP */}
            <div className="space-y-3 max-w-[480px] mt-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* ORDER NOW: Direct Navigation to /online_order/[slug] */}
                <Link
                  href={`/online_order/${product.slug}`}
                  className="w-full bg-[#d32f2f] hover:bg-[#b52828] text-white text-center font-bold text-sm uppercase py-3.5 px-4 transition-all duration-200 tracking-wider shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                >
                  Order Now
                </Link>

                {/* ADD TO CART: Saves to Zustand Cart */}
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="w-full bg-[#333333] hover:bg-gray-800 text-white text-center font-bold text-sm uppercase py-3.5 px-4 transition-all duration-200 tracking-wider shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                >
                  <ShoppingCart size={18} />
                  Add To Cart
                </button>
              </div>

              {/* WhatsApp Direct Order Button */}
              <Link
                href={`https://wa.me/923106375837?text=${whatsappText}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white text-center font-bold text-sm uppercase py-3 px-4 transition-all duration-200 tracking-wider shadow-sm flex items-center justify-center gap-2"
              >
                <MessageCircle size={18} />
                Order Via WhatsApp (0310 6375837)
              </Link>
            </div>

          </div>

        </div>
      </div>

      {/* Tabs Section: Description | Tags | Reviews */}
      <div id="product-tabs-section" className="bg-white border border-gray-200 mb-12 shadow-sm">
        {/* Tab Headers */}
        <div className="flex border-b border-gray-200 bg-[#f8f9fa] overflow-x-auto">
          <button
            onClick={() => setActiveTab('description')}
            className={`py-3.5 px-6 font-bold text-sm uppercase tracking-wide transition-colors border-b-2 whitespace-nowrap ${
              activeTab === 'description'
                ? 'border-[#d32f2f] text-[#d32f2f] bg-white'
                : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            Description
          </button>
          
          <button
            onClick={() => setActiveTab('tags')}
            className={`py-3.5 px-6 font-bold text-sm uppercase tracking-wide transition-colors border-b-2 whitespace-nowrap ${
              activeTab === 'tags'
                ? 'border-[#d32f2f] text-[#d32f2f] bg-white'
                : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            Tags ({tagsList.length})
          </button>

          <button
            onClick={() => setActiveTab('reviews')}
            className={`py-3.5 px-6 font-bold text-sm uppercase tracking-wide transition-colors border-b-2 whitespace-nowrap ${
              activeTab === 'reviews'
                ? 'border-[#d32f2f] text-[#d32f2f] bg-white'
                : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            Reviews ({userReviews.length})
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {/* 1. Description Tab */}
          {activeTab === 'description' && (
            <div className="product-description-content text-sm text-gray-700 leading-relaxed space-y-4">
              {product.descriptionHtml ? (
                <div
                  className="prose max-w-none text-gray-700 leading-relaxed font-sans text-sm space-y-4 [&>h1]:text-lg [&>h1]:font-bold [&>h1]:text-gray-800 [&>h1]:mt-4 [&>h1]:mb-2 [&>h3]:text-base [&>h3]:font-bold [&>h3]:text-gray-800 [&>h3]:mt-3 [&>h3]:mb-1 [&>p]:leading-relaxed [&>p]:mb-3 [&>ul]:list-disc [&>ul]:pl-5 [&>ol]:list-decimal [&>ol]:pl-5 [&>hr]:my-4 [&>hr]:border-gray-200"
                  dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
                />
              ) : (
                <p>{product.description || 'No detailed description available.'}</p>
              )}
            </div>
          )}

          {/* 2. Tags Tab */}
          {activeTab === 'tags' && (
            <div>
              <h3 className="text-sm font-bold text-gray-700 mb-4 uppercase">Product Tags</h3>
              {tagsList.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {tagsList.map((tag, i) => {
                    const tagSlug = tag.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
                    return (
                      <Link
                        key={i}
                        href={`/product-tag/${tagSlug}`}
                        className="bg-gray-100 hover:bg-[#d32f2f] text-gray-700 hover:text-white px-3 py-1.5 rounded-sm text-xs font-medium transition-colors border border-gray-200"
                      >
                        {tag}
                      </Link>
                    );
                  })}
                </div>
              ) : (
                <p className="text-sm text-gray-500">No tags for this product.</p>
              )}
            </div>
          )}

          {/* 3. Reviews Tab */}
          {activeTab === 'reviews' && (
            <div className="space-y-8">
              {/* Existing Reviews */}
              <div>
                <h3 className="text-base font-bold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                  Customer Reviews For {product.name}
                </h3>

                {userReviews.length > 0 ? (
                  <div className="space-y-4">
                    {userReviews.map((rev, i) => (
                      <div key={i} className="border border-gray-100 bg-gray-50 p-4 rounded">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-gray-800 text-sm">{rev.reviewer}</span>
                            {rev.isVerified && (
                              <span className="text-green-700 bg-green-100 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                                ✓ Verified Buyer
                              </span>
                            )}
                          </div>
                          <span className="text-xs text-gray-400">{rev.date}</span>
                        </div>

                        <div className="flex text-[#f0ad4e] mb-2">
                          {[...Array(rev.stars || 5)].map((_, s) => (
                            <Star key={s} size={14} fill="currentColor" stroke="none" />
                          ))}
                        </div>

                        <p className="text-xs text-gray-700 leading-relaxed">{rev.comment}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 italic mb-4">No reviews yet. Be the first to review this product!</p>
                )}
              </div>

              {/* Leave a Review Form */}
              <div className="bg-gray-50 p-5 border border-gray-200 rounded">
                <h4 className="font-bold text-gray-800 text-sm mb-4 uppercase">Leave a Review</h4>

                {reviewSubmitted && (
                  <div className="bg-green-100 text-green-800 text-xs p-3 rounded mb-4 font-semibold">
                    Thank you! Your review has been recorded and submitted successfully.
                  </div>
                )}

                <form onSubmit={handleReviewSubmit} className="space-y-3 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-gray-700 font-bold mb-1">Your Name <span className="text-red-500">*</span></label>
                      <input
                        required
                        type="text"
                        value={newReview.name}
                        onChange={(e) => setNewReview({ ...newReview, name: e.target.value })}
                        className="w-full border border-gray-300 p-2 outline-none focus:border-[#d32f2f] bg-white"
                        placeholder="Your Name"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 font-bold mb-1">Your Email</label>
                      <input
                        type="email"
                        value={newReview.email}
                        onChange={(e) => setNewReview({ ...newReview, email: e.target.value })}
                        className="w-full border border-gray-300 p-2 outline-none focus:border-[#d32f2f] bg-white"
                        placeholder="Email Address"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 font-bold mb-1">Rating <span className="text-red-500">*</span></label>
                      <select
                        value={newReview.stars}
                        onChange={(e) => setNewReview({ ...newReview, stars: parseInt(e.target.value) })}
                        className="w-full border border-gray-300 p-2 outline-none focus:border-[#d32f2f] bg-white font-medium"
                      >
                        <option value={5}>5 Stars (Excellent)</option>
                        <option value={4}>4 Stars (Very Good)</option>
                        <option value={3}>3 Stars (Average)</option>
                        <option value={2}>2 Stars (Poor)</option>
                        <option value={1}>1 Star (Worst)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-700 font-bold mb-1">Review <span className="text-red-500">*</span></label>
                    <textarea
                      required
                      rows={3}
                      value={newReview.review}
                      onChange={(e) => setNewReview({ ...newReview, review: e.target.value })}
                      className="w-full border border-gray-300 p-2 outline-none focus:border-[#d32f2f] bg-white"
                      placeholder="Write your honest review here..."
                    />
                  </div>

                  <button
                    type="submit"
                    className="bg-[#333333] hover:bg-[#d32f2f] text-white font-bold uppercase py-2.5 px-6 text-xs transition-colors"
                  >
                    Submit Review
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
