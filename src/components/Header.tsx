'use client';
import Link from 'next/link';
import navData from '@/data/navigation.json';
import { Search, Menu, ShoppingCart } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useCart } from '@/store/cart';

export default function Header() {
  const { topBar, mainMenu, categoriesMenu } = navData as any;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { getItemCount } = useCart();

  useEffect(() => {
    setMounted(true);
  }, []);

  const getLocalUrl = (url: string) => {
    if (!url) return '#';
    return url.replace('https://cartly.com.pk', '');
  };

  const cartCount = mounted ? getItemCount() : 0;

  return (
    <header className="w-full bg-white border-b border-gray-200 sticky top-0 z-40">
      {/* Top Bar */}
      <div className="w-full bg-gray-100 text-gray-600 text-[13px] py-1 border-b border-gray-200 hidden md:block">
        <div className="container-custom flex justify-between items-center">
          <div className="flex gap-4">
            <span className="font-semibold text-[#3a3a3a]">FREE SHIPPING! All over Pakistan</span>
          </div>
          <div className="flex gap-4 items-center">
            <Link href="tel:+923106375837" className="hover:text-[#d32f2f] transition-colors">
              +92-0310-6375837
            </Link>
            <span>|</span>
            <Link href="mailto:info@cartly.com.pk" className="hover:text-[#d32f2f] transition-colors">
              info@cartly.com.pk
            </Link>
          </div>
        </div>
      </div>

      {/* Middle Header */}
      <div className="container-custom py-4 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Logo & Mobile Actions */}
        <div className="flex items-center justify-between w-full md:w-auto">
          <Link href="/" className="flex items-center hover:opacity-90 transition-opacity shrink-0">
            <img src="/brand/logo-mobile.svg" alt="CARTLY" className="h-[40px] w-auto md:hidden" />
            <img src="/brand/logo-light.svg" alt="CARTLY" className="h-[54px] w-auto hidden md:block" />
          </Link>

          {/* Mobile Right Icons (Cart + Hamburger) */}
          <div className="flex items-center gap-3 md:hidden">
            <Link
              href="/cart"
              className="relative p-2 text-gray-700 hover:text-[#d32f2f] transition-colors"
              aria-label="View Shopping Cart"
            >
              <ShoppingCart size={22} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#d32f2f] text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
            <button
              className="p-2 text-gray-600 hover:text-[#d32f2f] transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle navigation menu"
            >
              <Menu size={24} />
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="flex w-full md:w-[540px] lg:w-[600px] border-2 border-gray-300 rounded overflow-hidden bg-white h-[42px]">
          <select className="bg-gray-100 px-3 text-xs md:text-sm border-r border-gray-300 text-gray-700 outline-none hidden sm:block max-w-[170px] truncate">
            <option value="">All Categories</option>
            {categoriesMenu?.map((cat: any, i: number) => (
              <option key={i} value={cat.text}>{cat.text}</option>
            ))}
          </select>
          <form action="/shop" method="GET" className="flex flex-grow relative">
            <input 
              type="text" 
              name="search"
              placeholder="Search for products..." 
              className="w-full px-3.5 text-xs md:text-sm outline-none"
            />
            <button type="submit" className="bg-[#333333] text-white px-5 hover:bg-[#d32f2f] transition-colors flex items-center justify-center" aria-label="Search">
              <Search size={18} />
            </button>
          </form>
        </div>

        {/* Desktop Actions (Cart + WhatsApp) */}
        <div className="hidden md:flex items-center gap-4">
          <Link
            href="/cart"
            className="flex items-center gap-2 border border-gray-300 hover:border-[#d32f2f] px-3.5 py-2 rounded text-gray-800 hover:text-[#d32f2f] transition-all bg-white relative group"
            title="Shopping Cart"
          >
            <div className="relative">
              <ShoppingCart size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-2.5 -right-2.5 bg-[#d32f2f] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </div>
            <span className="text-xs font-bold uppercase tracking-wide">
              Cart {cartCount > 0 ? `(${cartCount})` : ''}
            </span>
          </Link>

          <Link 
            href="https://wa.me/923106375837" 
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#25D366] text-white px-4 py-2 rounded font-bold text-xs uppercase tracking-wider hover:bg-[#128C7E] transition-colors flex items-center gap-1.5 shadow-sm"
          >
            WhatsApp Order
          </Link>
        </div>
      </div>

      {/* Bottom Header / Main Nav */}
      <div className="bg-[#222222] text-white hidden md:block">
        <div className="container-custom flex items-center h-[46px]">
          {/* Categories Dropdown Trigger */}
          <div className="relative group h-full flex items-center bg-[#d32f2f] px-6 cursor-pointer mr-6 min-w-[220px]">
            <span className="font-bold text-xs uppercase tracking-wider">Shop By Category</span>
            {/* Dropdown menu */}
            <div className="absolute top-[46px] left-0 w-full bg-white border border-gray-200 shadow-xl hidden group-hover:block z-50">
              {categoriesMenu?.map((item: any, i: number) => (
                <Link key={i} href={getLocalUrl(item.href)} className="block px-4 py-2.5 text-[13px] font-medium text-gray-700 hover:text-[#d32f2f] hover:bg-gray-50 border-b border-gray-100 transition-colors">
                  {item.text}
                </Link>
              ))}
            </div>
          </div>

          <nav className="flex items-center gap-7 h-full text-[13px] font-semibold tracking-wide">
            {mainMenu?.map((item: any, i: number) => (
              <Link key={i} href={getLocalUrl(item.href)} className="hover:text-[#d32f2f] transition-colors uppercase">
                {item.text}
              </Link>
            ))}
          </nav>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 shadow-xl">
          <nav className="flex flex-col text-sm">
            <Link
              href="/cart"
              onClick={() => setMobileMenuOpen(false)}
              className="px-4 py-3 border-b border-gray-100 font-bold text-[#d32f2f] flex items-center justify-between bg-red-50/50"
            >
              <span className="flex items-center gap-2"><ShoppingCart size={16} /> Shopping Cart</span>
              <span className="bg-[#d32f2f] text-white text-xs px-2 py-0.5 rounded-full">{cartCount} items</span>
            </Link>
            {mainMenu?.map((item: any, i: number) => (
              <Link
                key={i}
                href={getLocalUrl(item.href)}
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-3 border-b border-gray-100 font-semibold text-gray-800 hover:text-[#d32f2f]"
              >
                {item.text}
              </Link>
            ))}
            <div className="px-4 py-2.5 bg-gray-100 font-bold text-xs uppercase text-gray-600 border-b border-gray-200">
              Categories
            </div>
            {categoriesMenu?.map((item: any, i: number) => (
              <Link
                key={i}
                href={getLocalUrl(item.href)}
                onClick={() => setMobileMenuOpen(false)}
                className="px-6 py-2.5 border-b border-gray-100 text-xs text-gray-600 hover:text-[#d32f2f]"
              >
                {item.text}
              </Link>
            ))}
            <div className="p-4">
              <Link
                href="https://wa.me/923106375837"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-center bg-[#25D366] text-white py-2.5 rounded font-bold text-xs uppercase"
              >
                Order on WhatsApp (0310 6375837)
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
