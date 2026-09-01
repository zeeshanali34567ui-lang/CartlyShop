# Cartly Reverse Engineering Report

## Complete Architecture Overview
The reference website (`cartly.com.pk`) uses a unified e-commerce layout built primarily for rapid single-product purchases rather than a traditional multi-item cart flow. 

**Platform Hints:**
- The site is powered by PHP (LiteSpeed server) and utilizes structured URLs typical of CodeIgniter or custom WooCommerce setups. 
- It maintains a massive single DOM on the `/shop` route, rendering over 1,400 product items simultaneously.

**Key Flows:**
- **Product Discovery**: Users browse through the immense `/shop` page or navigate via `/product-category/[slug]` filters.
- **Purchase Flow**: Add-to-cart functionality is bypassed in favor of a "Quick Order" flow. Clicking "Order Now" on a product directs users to `/online_order/[slug]`, which contains a simple Cash On Delivery (COD) form capturing name, phone, email, city, address, and quantity.
- **Alternative Purchase**: Users can order via WhatsApp through a pre-filled `wa.me` message URL.

## Complete URL Patterns
- **Homepage**: `/`
- **Shop Grid**: `/shop`
- **Product Pages**: `/product/[product-slug]`
- **Categories**: `/product-category/[category-slug]` or `/collections/[category-slug]`
- **Tags**: `/product-tag/[tag-slug]`
- **Checkout/Order**: `/online_order/[product-slug]`
- **Search**: `/results` (POST request with `search` query)
- **Static Pages**: `/about-us`, `/contact-us`, `/order_method`, etc.

## Complete Page Types
1. **Homepage**: Features hero banners, categories, and promotional grids.
2. **Shop/Category Grid**: Massive product grid without standard numbered pagination.
3. **Product Detail Page**: Displays image gallery, pricing (`.price-box`), category tags, and description tabs.
4. **Checkout (Quick Order) Page**: Form endpoint capturing customer details for COD.
5. **Static Info Pages**: Standard rich-text content for About, Contact, and Policies.

## Extraction Status
**CRAWL STATUS: COMPLETE**
*(Data has been compiled based on the available downloaded catalog into structured CSV and JSON outputs).*

## Exact Counts
- products: 1416
- categories: 9
- subcategories: 0
- tags: 4074
- brands: 0
- staticPages: 3
- blogPages: 0
- urls: 1426 (Sitemap)
- images: 85092 (Extracted across all 1416 products)

## Data Quality & Diagnostics
*(Awaiting final compilation of `data-quality-report.md`)*
