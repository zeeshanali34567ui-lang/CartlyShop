# Category & Shop Page Structure

Based on analysis of `shop.html` and `category.html`, Cartly utilizes a single, expansive product grid for its main shop and category routes.

## 1. Header & Navigation
- Same unified navigation structure as the product page (Top bar, main menu, categories dropdown).

## 2. Page Titles & Breadcrumbs
- `h1`: Page or Category Title (e.g. "Shop", "Personal Care").
- Breadcrumbs indicating the current category path (e.g. `Home > Shop`).

## 3. Filters and Sorting
- A dropdown filter typically exists for sorting (e.g., "Sort by Popularity", "Sort by Newness", "Sort by Price: Low to High").
- Tag filters (e.g., sidebars with popular tags and categories).

## 4. Product Grid & Pagination
- **Class Structure**: Products are enclosed in `.product-item` or `.product-grid` containers.
- **Single Page Load**: Remarkably, the main `/shop` page dynamically loads or directly embeds the entire catalog (over 1,400 products) in a single HTML response without traditional `<ul class="pagination">` numbered pagination links.
- **Category Specific Views**: Category URLs like `/product-category/[slug]` filter the catalog to display only items belonging to that category, using the exact same `.product-item` layout.

## 5. Product Card (`.product-item`)
Inside each card:
- **Image**: `.product-item-image img`
- **Badges**: "Sale" or Discount percentage (e.g., `- 20% Off`).
- **Title**: Usually an `h3` or `h4` wrapping an `<a>` link pointing to `/product/[slug]`.
- **Prices**: `.product-price` showing regular and/or sale price.
- **CTA**: Often "Buy Now" or "Order Now" linking directly to the quick-checkout URL (`/online_order/[slug]`).

## 6. Footer
- Same universal footer as other pages.
