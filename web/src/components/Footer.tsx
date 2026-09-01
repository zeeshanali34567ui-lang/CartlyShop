import Link from 'next/link';
import { MapPin, Phone, Mail, Link as LinkIcon } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-[#1e1e1e] text-gray-300 pt-16 pb-8 text-sm">
      <div className="container-custom grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
        {/* About */}
        <div>
          <h3 className="text-white text-lg font-bold mb-4 uppercase">About Cartly</h3>
          <p className="mb-4 leading-relaxed">
            Cartly is your premium online shopping destination in Pakistan, offering the best quality products across multiple categories.
          </p>
          <div className="space-y-2">
            <p><strong>Phone:</strong> +92-0300-1376364</p>
            <p><strong>Email:</strong> info@cartly.com.pk</p>
          </div>
        </div>

        {/* Information Links */}
        <div>
          <h3 className="text-white text-lg font-bold mb-4 uppercase">Information</h3>
          <ul className="space-y-2">
            <li><Link href="/about-us" className="hover:text-white transition-colors">About Us</Link></li>
            <li><Link href="/contact-us" className="hover:text-white transition-colors">Contact Us</Link></li>
            <li><Link href="/delivery-information" className="hover:text-white transition-colors">Delivery Information</Link></li>
            <li><Link href="/payment-method" className="hover:text-white transition-colors">Payment Method</Link></li>
            <li><Link href="/return-exchange" className="hover:text-white transition-colors">Return & Exchange</Link></li>
            <li><Link href="/track-order" className="hover:text-white transition-colors">Track Order</Link></li>
          </ul>
        </div>

        {/* Policy Links */}
        <div>
          <h3 className="text-white text-lg font-bold mb-4 uppercase">Customer Service</h3>
          <ul className="space-y-2">
            <li><Link href="/terms-conditions" className="hover:text-white transition-colors">Terms & Conditions</Link></li>
            <li><Link href="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
            <li><Link href="/faq" className="hover:text-white transition-colors">FAQs</Link></li>
            <li><Link href="/order_method" className="hover:text-white transition-colors">How To Order</Link></li>
          </ul>
        </div>

        {/* Categories */}
        <div>
          <h3 className="text-white text-lg font-bold mb-4 uppercase">Top Categories</h3>
          <ul className="space-y-2">
            <li><Link href="/product-category/personal-care" className="hover:text-white transition-colors">Personal Care</Link></li>
            <li><Link href="/product-category/skin-care" className="hover:text-white transition-colors">Skin Care</Link></li>
            <li><Link href="/product-category/health-beauty-products" className="hover:text-white transition-colors">Health Beauty</Link></li>
            <li><Link href="/product-category/men-fashion" className="hover:text-white transition-colors">Men Fashion</Link></li>
            <li><Link href="/product-category/women-fashion" className="hover:text-white transition-colors">Women Fashion</Link></li>
          </ul>
        </div>
      </div>

      {/* Copyright */}
      <div className="container-custom border-t border-gray-700 pt-8 flex flex-col md:flex-row items-center justify-between">
        <p>&copy; {currentYear} Cartly. All Rights Reserved.</p>
        <div className="flex space-x-4 mt-4 md:mt-0">
          <Link href="#" className="hover:text-white">Facebook</Link>
          <Link href="#" className="hover:text-white">Instagram</Link>
        </div>
      </div>
    </footer>
  );
}
