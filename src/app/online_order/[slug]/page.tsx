import { getProductBySlug, getProducts } from '@/lib/data';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Metadata } from 'next';
import CheckoutForm from '@/components/CheckoutForm';
import { MessageCircle, ShieldCheck, Truck, ArrowLeft } from 'lucide-react';

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
    title: `Order ${product.name} Online | Cash on Delivery`,
    description: `Quick checkout for ${product.name}. Free cash on delivery all over Pakistan.`,
  };
}

export default async function CheckoutPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const product = getProductBySlug(resolvedParams.slug);
  
  if (!product) {
    notFound();
  }

  const images = product.images ? product.images.split(',').map(s => s.trim()).filter(Boolean) : [];
  const firstImage = images[0] || 'https://via.placeholder.com/300x300?text=No+Image';
  const currentPrice = product.salePrice || product.regularPrice || 0;
  const firstCategory = product.category ? product.category.split(',')[0].trim() : 'General';
  const categorySlug = firstCategory.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

  const whatsappText = encodeURIComponent(
`I want to order:
Product: ${product.name}
Price: ${currentPrice} PKR
URL: https://cartly.com.pk/product/${product.slug}`
  );

  return (
    <div className="bg-[#f8f9fa] py-8 min-h-screen">
      <div className="container-custom">
        {/* Breadcrumb Navigation */}
        <div className="breadcrumb flex items-center flex-wrap gap-2 text-[13px] text-gray-500 mb-6 bg-white p-3 border border-gray-200">
          <Link href="/" className="hover:text-[#d32f2f] transition-colors">Home</Link>
          <span>&gt;</span>
          <Link href={`/product-category/${categorySlug}`} className="hover:text-[#d32f2f] transition-colors">{firstCategory}</Link>
          <span>&gt;</span>
          <Link href={`/product/${product.slug}`} className="hover:text-[#d32f2f] transition-colors">{product.name}</Link>
          <span>&gt;</span>
          <span className="text-gray-800 font-semibold">Instant Checkout</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Checkout Form Column */}
          <div className="lg:col-span-8 bg-white p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between border-b border-gray-200 pb-4 mb-6">
              <h1 className="text-xl md:text-2xl font-bold text-gray-800 uppercase tracking-wide">
                Cash on Delivery Checkout
              </h1>
              <Link 
                href={`/product/${product.slug}`}
                className="text-xs text-gray-500 hover:text-[#d32f2f] flex items-center gap-1 font-semibold"
              >
                <ArrowLeft size={14} /> Back to Product
              </Link>
            </div>

            <CheckoutForm product={product} />
          </div>

          {/* Order Summary & Support Column */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white p-6 border border-gray-200 shadow-sm">
              <h2 className="text-base font-bold text-gray-800 uppercase border-b border-gray-200 pb-3 mb-4">
                Your Order Summary
              </h2>
              
              <div className="flex gap-4 items-start mb-6">
                <div className="w-20 h-20 border border-gray-200 p-1 flex-shrink-0 bg-white">
                  <img src={firstImage} alt={product.name} className="w-full h-full object-contain" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800 text-xs leading-snug line-clamp-2">
                    {product.name}
                  </h3>
                  <div className="text-gray-500 text-[11px] mt-1">Category: {firstCategory}</div>
                  <div className="text-[#d32f2f] font-bold text-sm mt-1">{currentPrice} PKR</div>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4 space-y-2.5 text-xs text-gray-700">
                <div className="flex justify-between">
                  <span>Unit Price</span>
                  <span className="font-semibold">{currentPrice} PKR</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Charges</span>
                  <span className="font-bold text-green-700">FREE SHIPPING</span>
                </div>
                <div className="flex justify-between">
                  <span>Payment Method</span>
                  <span className="font-semibold">Cash on Delivery</span>
                </div>
              </div>

              <div className="flex justify-between items-center border-t border-gray-200 pt-4 mt-4 text-base">
                <span className="font-bold text-gray-800">Total Payable:</span>
                <span className="font-extrabold text-[#d32f2f] text-lg">{currentPrice} PKR</span>
              </div>
            </div>

            {/* WhatsApp Quick Order Assistance */}
            <div className="bg-green-50 border border-green-200 p-4 rounded text-center">
              <h3 className="font-bold text-green-900 text-sm mb-1">Prefer to Order via WhatsApp?</h3>
              <p className="text-xs text-green-800 mb-3">Send your name and address directly on WhatsApp:</p>
              <Link
                href={`https://wa.me/923106375837?text=${whatsappText}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#25D366] hover:bg-[#128C7E] text-white text-xs font-bold uppercase py-2.5 px-4 rounded transition-colors inline-flex items-center gap-2"
              >
                <MessageCircle size={16} /> Order on WhatsApp (0310 6375837)
              </Link>
            </div>

            {/* Trust Badges */}
            <div className="bg-white p-4 border border-gray-200 text-xs text-gray-600 space-y-2">
              <div className="flex items-center gap-2">
                <Truck size={16} className="text-[#d32f2f]" />
                <span>Fast 2-4 Days Delivery in all Pakistan cities</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck size={16} className="text-blue-600" />
                <span>100% Genuine & Quality Tested Products</span>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
