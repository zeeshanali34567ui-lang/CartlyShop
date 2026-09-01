'use client';
import Link from 'next/link';
import navData from '@/data/navigation.json';
import { Search, Menu } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Header() {
  const { topBar, mainMenu, categoriesMenu } = navData as any;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const getLocalUrl = (url: string) => {
    if (!url) return '#';
    return url.replace('https://cartly.com.pk', '');
  };

  if (!mounted) return null;

  return (
    <header className="w-full bg-white border-b border-gray-200">
      {/* Top Bar */}
      <div className="w-full bg-gray-100 text-gray-600 text-[13px] py-1 border-b border-gray-200 hidden md:block">
        <div className="container-custom flex justify-between items-center">
          <div className="flex gap-4">
            <span className="font-semibold text-[#3a3a3a]">FREE SHIPPING! All over Pakistan</span>
          </div>
          <div className="flex gap-4 items-center">
             <span>+92-0300-1376364</span>
             <span>|</span>
             <span>info@cartly.com.pk</span>
          </div>
        </div>
      </div>

      {/* Middle Header */}
      <div className="container-custom py-5 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Logo */}
        <div className="flex items-center justify-between w-full md:w-auto">
          <Link href="/" className="text-3xl font-bold text-gray-800 tracking-tight">
             CARTLY
          </Link>
          <button className="md:hidden p-2 text-gray-600" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
             <Menu size={24} />
          </button>
        </div>

        {/* Search */}
        <div className="flex w-full md:w-[600px] border-2 border-gray-300 rounded overflow-hidden bg-white h-[42px]">
          <select className="bg-gray-100 px-3 text-sm border-r border-gray-300 text-gray-700 outline-none hidden md:block max-w-[180px] truncate">
            <option>All Categories</option>
            {categoriesMenu?.map((cat: any, i: number) => (
              <option key={i} value={cat.text}>{cat.text}</option>
            ))}
          </select>
          <form action="/shop" method="GET" className="flex flex-grow relative">
            <input 
              type="text" 
              name="search"
              placeholder="Search for products" 
              className="w-full px-4 text-sm outline-none"
            />
            <button type="submit" className="bg-[#4a4a4a] text-white px-5 hover:bg-[#333333] transition-colors flex items-center justify-center">
              <Search size={18} />
            </button>
          </form>
        </div>

        {/* Action (WhatsApp) */}
        <div className="hidden md:flex items-center">
           <Link 
             href="https://wa.me/923106375837" 
             target="_blank"
             className="bg-[#25D366] text-white px-4 py-2 rounded font-semibold text-sm hover:bg-[#128C7E] transition-colors flex items-center gap-2"
           >
             Order Via WhatsApp
           </Link>
        </div>
      </div>

      {/* Bottom Header / Main Nav */}
      <div className="bg-[#222222] text-white hidden md:block">
        <div className="container-custom flex items-center h-[50px]">
          {/* Categories Dropdown Trigger */}
          <div className="relative group h-full flex items-center bg-[#d32f2f] px-6 cursor-pointer mr-6 min-w-[220px]">
            <span className="font-bold text-sm uppercase tracking-wide">Shop By Category</span>
            {/* Dropdown menu */}
            <div className="absolute top-[50px] left-0 w-full bg-white border border-gray-200 shadow-lg hidden group-hover:block z-50">
               {categoriesMenu?.map((item: any, i: number) => (
                 <Link key={i} href={getLocalUrl(item.href)} className="block px-4 py-2.5 text-[13px] font-medium text-gray-700 hover:text-[#d32f2f] hover:bg-gray-50 border-b border-gray-100">
                   {item.text}
                 </Link>
               ))}
            </div>
          </div>

          <nav className="flex items-center gap-7 h-full text-[14px] font-semibold">
            {mainMenu?.map((item: any, i: number) => (
               <Link key={i} href={getLocalUrl(item.href)} className="hover:text-gray-300 transition-colors uppercase">
                 {item.text}
               </Link>
            ))}
          </nav>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <nav className="flex flex-col">
            {mainMenu?.map((item: any, i: number) => (
               <Link key={i} href={getLocalUrl(item.href)} className="px-4 py-3 border-b border-gray-100 text-sm font-medium">
                 {item.text}
               </Link>
            ))}
            <div className="px-4 py-3 bg-gray-50 font-bold text-sm border-b border-gray-200">Categories</div>
            {categoriesMenu?.map((item: any, i: number) => (
               <Link key={i} href={getLocalUrl(item.href)} className="px-6 py-2 border-b border-gray-100 text-sm text-gray-600">
                 {item.text}
               </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
