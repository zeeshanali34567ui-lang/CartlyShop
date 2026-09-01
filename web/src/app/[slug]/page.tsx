import { getStaticPageBySlug, getStaticPages } from '@/lib/data';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Metadata } from 'next';

export async function generateStaticParams() {
  const pages = getStaticPages();
  return pages.map((page) => {
    const slug = page.url.replace(/\/$/, '').split('/').pop();
    return { slug };
  }).filter(p => p.slug);
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const page = getStaticPageBySlug(resolvedParams.slug);
  if (!page) return {};
  
  return {
    title: `${page.title} | Cartly`,
    description: page.seoDescription || page.contentPreview,
  };
}

export default async function StaticPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const page = getStaticPageBySlug(resolvedParams.slug);
  
  if (!page) {
    notFound();
  }

  return (
    <div className="container-custom py-12 min-h-[60vh]">
      {/* Breadcrumbs */}
      <div className="breadcrumb flex items-center gap-2 text-[13px] text-gray-500 mb-8">
        <Link href="/" className="hover:text-[#d32f2f] transition-colors">Home</Link>
        <span>&gt;</span>
        <span className="text-gray-800">{page.title}</span>
      </div>

      <div className="bg-white p-8 border border-gray-200">
         <h1 className="text-2xl font-bold text-gray-800 mb-6 uppercase border-b border-gray-200 pb-3">
            {page.h1 || page.title}
         </h1>
         
         <div className="prose prose-slate max-w-none text-gray-700 leading-relaxed text-[15px]">
            <p>{page.contentPreview}</p>
         </div>
      </div>
    </div>
  );
}
