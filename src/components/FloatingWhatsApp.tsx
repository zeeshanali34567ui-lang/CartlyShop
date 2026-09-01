'use client';

import { MessageCircle } from 'lucide-react';
import Link from 'next/link';

export default function FloatingWhatsApp() {
  return (
    <Link
      href="https://wa.me/923106375837"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 md:bottom-10 md:right-10 bg-[#25d366] hover:bg-[#128c7e] text-white w-14 h-14 md:w-16 md:h-16 rounded-full shadow-2xl flex items-center justify-center z-50 transition-transform hover:scale-110 active:scale-95 animate-bounce-slow"
      aria-label="Chat with us on WhatsApp"
    >
      <MessageCircle size={32} />
      {/* Pulse effect */}
      <div className="absolute inset-0 rounded-full border-2 border-[#25d366] animate-ping opacity-20"></div>
    </Link>
  );
}
