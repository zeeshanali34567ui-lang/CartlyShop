'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCart } from '@/store/cart';
import { Trash2, ShoppingBag, ArrowLeft, CheckCircle2, Truck, ShieldCheck, MessageCircle } from 'lucide-react';

export default function CartPage() {
  const { items, removeItem, updateQuantity, clearCart, getTotal, getItemCount } = useCart();
  const [mounted, setMounted] = useState(false);
  const [isOrdered, setIsOrdered] = useState(false);
  const [checkoutData, setCheckoutData] = useState({
    name: '',
    phone: '',
    city: '',
    address: '',
    notes: ''
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="container-custom py-16 min-h-[60vh] flex items-center justify-center">
        <div className="text-gray-500 font-medium">Loading your cart...</div>
      </div>
    );
  }

  const subtotal = getTotal();
  const itemCount = getItemCount();

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsOrdered(true);
    clearCart();
  };

  if (isOrdered) {
    return (
      <div className="bg-[#f8f9fa] py-16 min-h-[70vh]">
        <div className="container-custom max-w-2xl bg-white border border-gray-200 p-8 rounded text-center shadow-sm">
          <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
            ✓
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Thank You! Your Order is Placed</h1>
          <p className="text-sm text-gray-600 mb-4">
            We have received your multi-item Cash on Delivery order.
          </p>
          <div className="bg-gray-50 p-4 border border-gray-200 rounded text-left text-xs text-gray-700 mb-6 space-y-1">
            <p><strong>Customer Name:</strong> {checkoutData.name}</p>
            <p><strong>WhatsApp / Phone:</strong> {checkoutData.phone}</p>
            <p><strong>City & Address:</strong> {checkoutData.city}, {checkoutData.address}</p>
            <p><strong>Payment Method:</strong> Cash on Delivery (Free Shipping)</p>
          </div>
          <p className="text-xs text-gray-500 mb-6">
            Our team will contact you on WhatsApp / phone to confirm delivery.
          </p>
          <Link
            href="/shop"
            className="inline-block bg-[#333333] hover:bg-[#d32f2f] text-white px-8 py-3 uppercase font-bold text-xs tracking-wider transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="bg-[#f8f9fa] py-16 min-h-[65vh]">
        <div className="container-custom max-w-xl text-center bg-white border border-gray-200 p-10 shadow-sm">
          <div className="w-20 h-20 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShoppingBag size={36} />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Your Shopping Cart is Empty</h1>
          <p className="text-sm text-gray-500 mb-6 leading-relaxed">
            Looks like you haven't added any products to your cart yet. Explore our catalog of authentic products and find great deals!
          </p>
          <Link
            href="/shop"
            className="inline-block bg-[#d32f2f] hover:bg-[#b52828] text-white px-8 py-3.5 uppercase font-bold text-xs tracking-wider transition-colors shadow-md"
          >
            Explore Shop Catalog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#f8f9fa] py-8 min-h-screen">
      <div className="container-custom">
        {/* Breadcrumb */}
        <div className="breadcrumb flex items-center gap-2 text-[13px] text-gray-500 mb-6 bg-white p-3 border border-gray-200">
          <Link href="/" className="hover:text-[#d32f2f] transition-colors font-medium">Home</Link>
          <span>&gt;</span>
          <Link href="/shop" className="hover:text-[#d32f2f] transition-colors font-medium">Shop</Link>
          <span>&gt;</span>
          <span className="text-gray-800 font-semibold">Shopping Cart ({itemCount} items)</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Cart Items List Column */}
          <div className="lg:col-span-8">
            <div className="bg-white border border-gray-200 p-4 md:p-6 shadow-sm mb-6">
              <div className="flex justify-between items-center border-b border-gray-200 pb-4 mb-4">
                <h1 className="text-lg md:text-xl font-bold text-gray-800 uppercase tracking-wide flex items-center gap-2">
                  <ShoppingBag size={20} className="text-[#d32f2f]" />
                  Shopping Cart
                </h1>
                <button
                  onClick={clearCart}
                  className="text-xs text-gray-500 hover:text-red-600 transition-colors underline"
                >
                  Clear All Items
                </button>
              </div>

              {/* Items Table / Cards */}
              <div className="divide-y divide-gray-200">
                {items.map(({ product, quantity }) => {
                  const price = product.salePrice || product.regularPrice || 0;
                  const lineTotal = price * quantity;
                  const firstImg = product.images ? product.images.split(',')[0].trim() : 'https://via.placeholder.com/150';

                  return (
                    <div key={product.id || product.slug} className="py-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                      {/* Product Image & Info */}
                      <div className="flex gap-3 items-center flex-1">
                        <Link href={`/product/${product.slug}`} className="w-20 h-20 flex-shrink-0 border border-gray-200 p-1 bg-white hover:border-[#d32f2f] transition-colors relative block">
                          <img
                            src={firstImg}
                            alt={product.name}
                            className="w-full h-full object-contain"
                          />
                        </Link>
                        <div>
                          <Link href={`/product/${product.slug}`} className="font-semibold text-xs md:text-sm text-gray-800 hover:text-[#d32f2f] transition-colors line-clamp-2">
                            {product.name}
                          </Link>
                          <div className="text-[11px] text-gray-500 mt-1">
                            Unit Price: <span className="font-bold text-gray-700">{price} PKR</span>
                          </div>
                        </div>
                      </div>

                      {/* Quantity Controls & Line Total */}
                      <div className="flex items-center justify-between w-full sm:w-auto gap-6 mt-2 sm:mt-0">
                        {/* Quantity Counter */}
                        <div className="flex items-center border border-gray-300">
                          <button
                            type="button"
                            onClick={() => updateQuantity(product.id, quantity - 1)}
                            className="px-2.5 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-sm"
                          >
                            -
                          </button>
                          <span className="px-3 py-1 text-xs font-semibold min-w-[32px] text-center">
                            {quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(product.id, quantity + 1)}
                            className="px-2.5 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-sm"
                          >
                            +
                          </button>
                        </div>

                        {/* Line Total */}
                        <div className="text-right min-w-[90px]">
                          <div className="text-xs text-gray-400">Total</div>
                          <div className="text-[#d32f2f] font-bold text-sm">{lineTotal} PKR</div>
                        </div>

                        {/* Remove Action */}
                        <button
                          type="button"
                          onClick={() => removeItem(product.id)}
                          title="Remove item"
                          className="text-gray-400 hover:text-red-600 transition-colors p-1"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Back to Shopping Button */}
              <div className="border-t border-gray-200 pt-4 mt-4 flex justify-between items-center">
                <Link
                  href="/shop"
                  className="text-xs font-semibold text-gray-600 hover:text-[#d32f2f] flex items-center gap-1.5 transition-colors"
                >
                  <ArrowLeft size={14} /> Continue Shopping
                </Link>
                <div className="text-xs text-gray-500">
                  Total Items: <span className="font-bold text-gray-800">{itemCount}</span>
                </div>
              </div>
            </div>

            {/* Direct Multi-Product Cash on Delivery Form */}
            <div className="bg-white border-2 border-[#d32f2f] p-6 shadow-sm">
              <h2 className="text-base md:text-lg font-bold text-gray-800 uppercase border-b border-gray-200 pb-3 mb-4 flex items-center gap-2">
                <span className="w-2.5 h-2.5 bg-[#d32f2f] rounded-full inline-block"></span>
                Instant Multi-Item Cash on Delivery Checkout
              </h2>
              <p className="text-xs text-gray-500 mb-4">
                Place your complete order for all items in your cart below. Pay cash when package is delivered.
              </p>

              <form onSubmit={handleCheckoutSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 font-bold mb-1">Full Name <span className="text-red-500">*</span></label>
                    <input
                      required
                      type="text"
                      value={checkoutData.name}
                      onChange={(e) => setCheckoutData({ ...checkoutData, name: e.target.value })}
                      className="w-full border border-gray-300 p-2.5 outline-none focus:border-[#d32f2f]"
                      placeholder="Your Full Name"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-bold mb-1">WhatsApp / Phone Number <span className="text-red-500">*</span></label>
                    <input
                      required
                      type="tel"
                      value={checkoutData.phone}
                      onChange={(e) => setCheckoutData({ ...checkoutData, phone: e.target.value })}
                      className="w-full border border-gray-300 p-2.5 outline-none focus:border-[#d32f2f]"
                      placeholder="0310 1234567"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 font-bold mb-1">City <span className="text-red-500">*</span></label>
                  <input
                    required
                    type="text"
                    value={checkoutData.city}
                    onChange={(e) => setCheckoutData({ ...checkoutData, city: e.target.value })}
                    className="w-full border border-gray-300 p-2.5 outline-none focus:border-[#d32f2f]"
                    placeholder="e.g. Karachi, Lahore, Islamabad, Faisalabad, Rawalpindi"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-bold mb-1">Complete Delivery Address <span className="text-red-500">*</span></label>
                  <textarea
                    required
                    rows={3}
                    value={checkoutData.address}
                    onChange={(e) => setCheckoutData({ ...checkoutData, address: e.target.value })}
                    className="w-full border border-gray-300 p-2.5 outline-none focus:border-[#d32f2f]"
                    placeholder="Street, House/Flat #, Landmark, Area..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#d32f2f] hover:bg-[#b52828] text-white font-bold uppercase py-3.5 px-6 text-sm tracking-wide shadow-md transition-colors"
                >
                  Confirm Order ({itemCount} Items) — Total {subtotal} PKR (Cash on Delivery)
                </button>
              </form>
            </div>
          </div>

          {/* Cart Summary & WhatsApp Help Column */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white border border-gray-200 p-6 shadow-sm">
              <h2 className="text-base font-bold text-gray-800 uppercase border-b border-gray-200 pb-3 mb-4">
                Order Summary
              </h2>

              <div className="space-y-3 text-xs text-gray-700">
                <div className="flex justify-between">
                  <span>Cart Subtotal</span>
                  <span className="font-semibold text-gray-900">{subtotal} PKR</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Quantity</span>
                  <span className="font-semibold">{itemCount} items</span>
                </div>
                <div className="flex justify-between text-green-700">
                  <span>Shipping Fee</span>
                  <span className="font-bold">FREE DELIVERY</span>
                </div>
                <div className="flex justify-between">
                  <span>Payment</span>
                  <span className="font-semibold">Cash on Delivery</span>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4 mt-4 flex justify-between items-center text-base">
                <span className="font-bold text-gray-800">Order Total:</span>
                <span className="font-extrabold text-[#d32f2f] text-xl">{subtotal} PKR</span>
              </div>
            </div>

            {/* WhatsApp Direct Assistance */}
            <div className="bg-green-50 border border-green-200 p-4 rounded text-center">
              <h3 className="font-bold text-green-900 text-sm mb-1">Need Assistance with Order?</h3>
              <p className="text-xs text-green-800 mb-3">WhatsApp your order list directly to our support team:</p>
              <Link
                href={`https://wa.me/923106375837?text=${encodeURIComponent(`Hi Cartly, I want to order ${itemCount} items worth ${subtotal} PKR.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#25D366] hover:bg-[#128C7E] text-white text-xs font-bold uppercase py-2.5 px-4 rounded transition-colors inline-flex items-center gap-2"
              >
                <MessageCircle size={16} /> WhatsApp: 0310 6375837
              </Link>
            </div>

            {/* Trust Badges */}
            <div className="bg-white p-4 border border-gray-200 text-xs text-gray-600 space-y-2.5">
              <div className="flex items-center gap-2">
                <Truck size={16} className="text-[#d32f2f]" />
                <span>Fast 2-4 Days Delivery in Pakistan</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck size={16} className="text-blue-600" />
                <span>100% Genuine & Quality Checked</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-green-600" />
                <span>Zero Advance Payment Required</span>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
