'use client';
import React from 'react';

export default function CheckoutForm() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Thank you! Your Cash on Delivery order has been placed successfully.');
    window.location.href = '/';
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-sm">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 font-bold mb-2">Full Name <span className="text-[#d32f2f]">*</span></label>
            <input required type="text" className="w-full border border-gray-300 p-2 outline-none focus:border-gray-500" placeholder="Your Name" />
          </div>
          <div>
            <label className="block text-gray-700 font-bold mb-2">Phone Number <span className="text-[#d32f2f]">*</span></label>
            <input required type="tel" className="w-full border border-gray-300 p-2 outline-none focus:border-gray-500" placeholder="0300 1234567" />
          </div>
      </div>

      <div>
          <label className="block text-gray-700 font-bold mb-2">Email Address</label>
          <input type="email" className="w-full border border-gray-300 p-2 outline-none focus:border-gray-500" placeholder="Email" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 font-bold mb-2">City <span className="text-[#d32f2f]">*</span></label>
            <input required type="text" className="w-full border border-gray-300 p-2 outline-none focus:border-gray-500" placeholder="City" />
          </div>
          <div>
            <label className="block text-gray-700 font-bold mb-2">Quantity <span className="text-[#d32f2f]">*</span></label>
            <input required type="number" min="1" defaultValue="1" className="w-full border border-gray-300 p-2 outline-none focus:border-gray-500" />
          </div>
      </div>

      <div>
          <label className="block text-gray-700 font-bold mb-2">Complete Address <span className="text-[#d32f2f]">*</span></label>
          <textarea required rows={3} className="w-full border border-gray-300 p-2 outline-none focus:border-gray-500" placeholder="Address..." />
      </div>

      <button type="submit" className="w-full bg-[#d32f2f] text-white font-bold uppercase py-3 mt-4 hover:bg-[#b52828] transition-colors">
          Confirm Order (Cash on Delivery)
      </button>
    </form>
  );
}
