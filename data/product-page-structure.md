# Product Page Structure

Based on analysis of `product.html` (e.g. `Shape Up Cream in Pakistan`), the Cartly product pages follow a unified WooCommerce/CodeIgniter-style single-product layout.

## 1. Header
- Top bar with "FREE SHIPPING! All over Pakistan", contact number (`+923106375837`), and email (`info@cartly.com.pk`).
- Main navigation with logo, Search Bar (categories dropdown + text input), and WhatsApp CTA.
- Main Menu (Home, Shop, How To Order, Contact Us, About Us, Shop by Category dropdown).

## 2. Breadcrumbs
- Standard breadcrumb trail: `Home > [Parent Category] > [Category] > [Product Name]`
- Class: `.breadcrumb` or `.woocommerce-breadcrumb`

## 3. Product Info Block (`.product-name` and siblings)
- **Title**: Contained in `div.product-name > h3`.
- **Category**: Listed explicitly below the title (`<b>Category:</b> <a href="..."><strong class="text-info">...</strong></a>`).
- **Rating**: Reviews summary (e.g. `(4.5 / 5.0) 25 Reviews`).
- **Price Box (`.price-box`)**:
  - Contains an `<h1>` element holding the prices.
  - Regular Price: `.product-desc-price` (e.g. "Price : 2500 PKR")
  - Sale Price: `.product-price` (e.g. "Special Price 2000 PKR")
  - Discount Badge: `.badge.badge-danger` (e.g. "- 20% Off")
- **Stock Status**: "Availability: In Stock"
- **Short Description**: Inside `.short-description`.

## 4. CTA and Checkout Forms
- The site uses a "Quick Order" flow rather than a traditional add-to-cart.
- **Order Now Button**: Redirects to `https://cartly.com.pk/online_order/[product_slug]`.
- **Order Via Whatsapp Button**: Opens a WhatsApp `wa.me` link with a pre-filled message containing the product name, price, and URL.

## 5. Gallery
- Main product image and thumbnails (if any) are displayed using a slider/carousel (`.product-item-image`, `.slider`).

## 6. Detailed Descriptions and Tabs
- **Full Description**: Rendered inside `.tab-content` or `#description`.
- **Reviews**: A form (`Action="https://cartly.com.pk/Order/rating/"`) exists to submit reviews (Name, Email, Stars, Review Text, Product Slug).

## 7. Related Products
- Grid of products using the `.product-item` card layout.

## 8. Footer
- Informational links (About Us, Contact Us, FAQs, Delivery Information, Payment Method, Return & Exchange, Track Order, Terms & Conditions, Privacy Policy).
- Categories list.
- Social media links (Facebook, Instagram).
