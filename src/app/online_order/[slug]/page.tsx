import { getProductBySlug } from '@/lib/data';
import Link from 'next/link';
import CheckoutForm from '@/components/CheckoutForm';

export default async function CheckoutPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const product = getProductBySlug(resolvedParams.slug);
  
  if (!product) {
    return <div>Product not found</div>;
  }

  const firstImage = product.images ? product.images.split(',')[0].trim() : 'https://via.placeholder.com/300x300';
  const currentPrice = product.salePrice || product.regularPrice || 0;

  return (
    <div className="container-custom py-8 bg-[#f8f9fa] min-h-screen">
      <div className="breadcrumb flex items-center gap-2 text-[13px] text-gray-500 mb-8">
        <Link href="/" className="hover:text-[#d32f2f] transition-colors">Home</Link>
        <span>&gt;</span>
        <span className="text-gray-800">Checkout</span>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Form Column */}
        <div className="w-full md:w-2/3 bg-white p-6 border border-gray-200">
           <h2 className="text-2xl font-bold text-gray-800 mb-6 uppercase border-b border-gray-200 pb-3">Shipping Information</h2>
           <CheckoutForm />
        </div>

        {/* Order Summary Column */}
        <div className="w-full md:w-1/3">
           <div className="bg-white p-6 border border-gray-200">
              <h2 className="text-xl font-bold text-gray-800 mb-6 uppercase border-b border-gray-200 pb-3">Your Order</h2>
              
              <div className="flex gap-4 items-center mb-6">
                 <div className="w-20 h-20 border border-gray-200">
                    <img src={firstImage} alt={product.name} className="w-full h-full object-contain" />
                 </div>
                 <div className="flex-1">
                    <h3 className="font-bold text-gray-800 text-[13px]">{product.name}</h3>
                    <div className="text-[#d32f2f] font-bold mt-1">{currentPrice} PKR</div>
                 </div>
              </div>

              <div className="border-t border-gray-200 pt-4 mb-4 text-sm text-gray-700 space-y-2">
                 <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-bold">{currentPrice} PKR</span>
                 </div>
                 <div className="flex justify-between">
                    <span>Shipping</span>
                    <span className="font-bold">Free</span>
                 </div>
              </div>

              <div className="flex justify-between items-center border-t border-gray-200 pt-4 text-lg">
                 <span className="font-bold text-gray-800">Total</span>
                 <span className="font-bold text-[#d32f2f]">{currentPrice} PKR</span>
              </div>
           </div>
        </div>

      </div>
    </div>
  );
}
