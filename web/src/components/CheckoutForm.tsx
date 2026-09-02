'use client';
import React, { useState } from 'react';
import { Product } from '@/lib/data';

interface CheckoutFormProps {
  product?: Product;
  quantity?: number;
  onQuantityChange?: (qty: number) => void;
  onSuccess?: () => void;
}

export default function CheckoutForm({ product, quantity = 1, onQuantityChange, onSuccess }: CheckoutFormProps) {
  const [qty, setQty] = useState(quantity);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    city: '',
    address: '',
    notes: ''
  });

  const handleQtyChange = (newQty: number) => {
    const validQty = Math.max(1, newQty);
    setQty(validQty);
    if (onQuantityChange) onQuantityChange(validQty);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    if (onSuccess) onSuccess();
  };

  const currentPrice = product ? (product.salePrice || product.regularPrice || 0) : 0;
  const totalPrice = currentPrice * qty;

  if (isSubmitted) {
    return (
      <div className="bg-green-50 border border-green-200 text-green-800 p-6 rounded text-center">
        <div className="text-4xl mb-3">✓</div>
        <h3 className="text-xl font-bold mb-2">Thank You! Order Placed Successfully</h3>
        <p className="text-sm mb-4">
          Your Cash on Delivery order for <strong>{product?.name || 'Product'}</strong> ({qty}x) has been received.
        </p>
        <p className="text-sm font-semibold mb-6">
          Total Amount: <span className="text-[#d32f2f] text-lg font-bold">{totalPrice} PKR</span>
        </p>
        <div className="text-xs text-gray-600 mb-6">
          Our customer support will call/WhatsApp you at <strong>{formData.phone}</strong> shortly to confirm shipping.
        </div>
        <button
          onClick={() => {
            setIsSubmitted(false);
            window.location.href = '/';
          }}
          className="bg-[#333333] hover:bg-[#d32f2f] text-white px-6 py-2.5 uppercase font-bold text-xs tracking-wider transition-colors"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-sm">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-gray-700 font-bold mb-2">
            Full Name <span className="text-[#d32f2f]">*</span>
          </label>
          <input
            required
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full border border-gray-300 p-2.5 outline-none focus:border-[#d32f2f] transition-colors"
            placeholder="Your Full Name"
          />
        </div>
        <div>
          <label className="block text-gray-700 font-bold mb-2">
            Phone Number (WhatsApp) <span className="text-[#d32f2f]">*</span>
          </label>
          <input
            required
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="w-full border border-gray-300 p-2.5 outline-none focus:border-[#d32f2f] transition-colors"
            placeholder="0310 1234567"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-gray-700 font-bold mb-2">
            City <span className="text-[#d32f2f]">*</span>
          </label>
          <input
            required
            type="text"
            value={formData.city}
            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            className="w-full border border-gray-300 p-2.5 outline-none focus:border-[#d32f2f] transition-colors"
            placeholder="e.g. Karachi, Lahore, Islamabad"
          />
        </div>
        <div>
          <label className="block text-gray-700 font-bold mb-2">
            Quantity <span className="text-[#d32f2f]">*</span>
          </label>
          <div className="flex items-center border border-gray-300">
            <button
              type="button"
              onClick={() => handleQtyChange(qty - 1)}
              className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold"
            >
              -
            </button>
            <input
              type="number"
              min="1"
              value={qty}
              onChange={(e) => handleQtyChange(parseInt(e.target.value) || 1)}
              className="w-full text-center p-2 outline-none"
            />
            <button
              type="button"
              onClick={() => handleQtyChange(qty + 1)}
              className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold"
            >
              +
            </button>
          </div>
        </div>
      </div>

      <div>
        <label className="block text-gray-700 font-bold mb-2">Email Address (Optional)</label>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="w-full border border-gray-300 p-2.5 outline-none focus:border-[#d32f2f] transition-colors"
          placeholder="email@example.com"
        />
      </div>

      <div>
        <label className="block text-gray-700 font-bold mb-2">
          Complete Delivery Address <span className="text-[#d32f2f]">*</span>
        </label>
        <textarea
          required
          rows={3}
          value={formData.address}
          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          className="w-full border border-gray-300 p-2.5 outline-none focus:border-[#d32f2f] transition-colors"
          placeholder="House/Apartment #, Street, Area, Landmark..."
        />
      </div>

      <div className="p-3 bg-gray-50 border border-gray-200 flex justify-between items-center text-sm">
        <span className="text-gray-700">Payment Method:</span>
        <span className="font-bold text-[#333333]">Cash on Delivery (Free Shipping)</span>
      </div>

      <button
        type="submit"
        className="w-full bg-[#d32f2f] text-white font-bold uppercase py-3.5 px-4 mt-4 hover:bg-[#b52828] transition-colors text-[14px] tracking-wide shadow-md"
      >
        Confirm Order (Cash on Delivery) {totalPrice > 0 ? `— ${totalPrice} PKR` : ''}
      </button>
    </form>
  );
}
