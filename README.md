# Maison Cobalt Curated Commerce

Build a complete, premium, production-quality e-commerce website with a professional, luxurious, modern, and visually captivating design.

IMPORTANT: My backend will be Supabase. Build the frontend using React, TypeScript, Tailwind CSS, and Supabase. Do not create a separate backend or use mock authentication as the final implementation.

The website should look like a real, established premium online shopping brand, not a basic AI-generated template.

Make the website visually rich, lively, interactive, responsive, and extremely polished.

1. VISUAL DESIGN AND BRANDING

Create a sophisticated visual identity using this color palette:

- Midnight navy: #10172A
- Deep royal blue: #243B80
- Electric cobalt: #4169F5
- Warm ivory: #F8F5EF
- Pure white: #FFFFFF
- Champagne gold accent: #D6B879
- Soft slate: #7D8496

Use rich gradients, subtle shadows, beautiful typography, elegant spacing, rounded product cards, smooth hover effects, and premium visual details.

Design style:

- Luxury meets modern technology.
- Premium editorial shopping experience.
- High-end fashion and lifestyle storefront aesthetic.
- Strong visual hierarchy.
- Beautiful product photography.
- Elegant animations without excessive movement.
- Professional typography using a font pairing such as Manrope and Playfair Display.

The website should feel alive and engaging.

Use a combination of large editorial banners, visually attractive product grids, promotional sections, interactive elements, animated transitions, and beautiful product imagery.

Avoid:

- Generic template appearance.
- Excessive empty space.
- Cheap-looking gradients.
- Too many random colors.
- Excessive glassmorphism.
- Cluttered layouts.
- Basic unstyled buttons.
- Fake statistics or fake customer reviews.

2. WEBSITE STRUCTURE

Create these pages:

1. Home
2. Shop / All Products
3. Product Categories
4. Product Details
5. Search Results
6. Shopping Cart
7. Checkout
8. Login
9. Sign Up
10. Forgot Password
11. My Account
12. My Addresses
13. My Orders
14. Order Details / Tracking
15. Wishlist
16. Contact Us
17. About Us
18. Privacy Policy
19. Terms and Conditions
20. Admin Dashboard

Use a professional navigation system with proper routing.

3. HOMEPAGE

Create an impressive homepage with the following sections:

Announcement bar

A slim promotional bar at the top for announcements such as:
"Complimentary shipping on orders above ₹999"

Make it editable through a frontend configuration.

Header

Create a premium sticky header containing:

- Brand logo
- Shop navigation
- Categories dropdown
- Search bar
- Account icon
- Wishlist icon
- Shopping cart icon with live item count

On mobile, use a polished responsive navigation drawer.

Hero section

Create a stunning full-width hero section with:

- Large premium lifestyle/product photography
- Bold headline
- Elegant supporting text
- Shop Now button
- Explore Collection button
- Attractive background gradients
- Subtle entrance animation

Make the hero visually impressive and attention-grabbing.

Featured categories

Display categories in beautiful image-based cards.

Each category should have:

- Category image
- Category name
- Short description
- Hover animation
- Link to category products

Trending products

Display products in a premium product grid.

Each product card should include:

- Product image
- Product name
- Original price
- Discounted price
- Discount percentage badge
- Wishlist button
- Quick add-to-cart button
- Product category
- Hover image transition when multiple images exist

Promotional banner

Create a rich promotional section for seasonal offers and discounts.

Best sellers

Display popular products in an attractive carousel or grid.

New arrivals

Show the latest products from the database.

Brand story

Add a beautiful editorial section explaining the brand's identity.

Newsletter

Create an elegant newsletter subscription section.

Footer

Include:

- Brand logo
- About information
- Shop links
- Customer support links
- Policies
- Social media icons
- Payment method icons
- Copyright information

4. PRODUCT LISTING PAGE

Build a professional product browsing experience.

Features:

- Grid and list view
- Search products
- Filter by category
- Filter by price range
- Filter by discount
- Sort by price low to high
- Sort by price high to low
- Sort by newest
- Sort by name
- Pagination or infinite scrolling
- Product availability indicator

Use responsive product cards with elegant hover animations.

Display a beautiful empty state when no products match the filters.

5. PRODUCT DETAILS PAGE

Create an attractive product details page.

Features:

- Multiple product images
- Main image with thumbnail gallery
- Image zoom or lightbox
- Image navigation
- Product name
- SKU
- Category
- Original price
- Discounted price
- Discount percentage
- Stock availability
- Quantity selector
- Add to Cart
- Buy Now
- Wishlist
- Product description
- Related products
- Recently viewed products

The product gallery must support multiple images uploaded by the admin through Supabase Storage.

The main image should be displayed first, followed by other images in their configured order.

6. AUTHENTICATION

Use Supabase Authentication.

Implement:

- Sign up with email and password
- Login with email and password
- Email verification
- Forgot password
- Password reset
- Logout
- Persistent login session
- Protected routes

Allow users to enter their Gmail address or any valid email address.

If Google OAuth is configured, also provide a Continue with Google button.

Create a beautiful authentication interface with a premium split-screen layout, product imagery, elegant form fields, and professional error messages.

Never store passwords in frontend code or custom database tables.

7. CUSTOMER ACCOUNT

Create a customer account dashboard with:

- Profile information
- Edit profile
- Email display
- Phone number
- Saved addresses
- Default address selection
- Order history
- Order details
- Order tracking
- Wishlist
- Logout

Customers should only be able to access their own information.

8. SHOPPING CART

Create a fully functional shopping cart.

Features:

- Add products to cart
- Remove products
- Increase and decrease quantity
- Display product images
- Display product prices
- Display discounts
- Calculate subtotal
- Apply coupon code
- Calculate coupon discount
- Display shipping charges
- Display final total
- Continue shopping
- Proceed to checkout

Make the cart responsive and visually polished.

Persist the cart appropriately for authenticated users and maintain the cart when the page refreshes.

Prevent purchasing more products than available stock.

9. CHECKOUT

Create a premium checkout experience with clear steps.

Step 1: Customer information

Step 2: Delivery address

Step 3: Order summary

Step 4: Payment method

Step 5: Order confirmation

Allow customers to:

- Select a saved address
- Add a new address
- Enter full name
- Enter phone number
- Enter address line 1
- Enter address line 2
- Enter city
- Enter state
- Enter postal code
- Enter country
- Set an address as default

Display a beautiful order summary with:

- Product images
- Product names
- Quantity
- Price
- Product discounts
- Coupon discount
- Shipping charge
- Final amount

Use Supabase database functions for secure checkout and order creation.

Never calculate or trust final order totals exclusively on the frontend.

Do not create fake successful payments.

If payment integration is not configured, provide a clearly labeled payment integration placeholder and do not mark orders as paid automatically.

10. COUPONS AND DISCOUNTS

Create a coupon interface that supports:

- Percentage coupons
- Fixed amount coupons
- Minimum order amount
- Maximum discount
- Coupon expiration
- Coupon validation
- Coupon usage limits

Display attractive discount badges on products.

Use the database-calculated discount values.

Do not allow users to manipulate coupon values through frontend code.

11. ORDER TRACKING

Create a professional order tracking page.

Display:

- Order number
- Order date
- Product details
- Delivery address
- Payment status
- Order status
- Courier name
- Tracking number

Show a visual order progress timeline:

Order Placed → Processing → Shipped → Delivered

Also support cancelled orders.

Use the actual order status from Supabase.

Display the latest status history and tracking information.

12. ADMIN DASHBOARD

Create a separate, professional admin dashboard with a completely different layout from the customer storefront.

Use a modern dashboard design with a sidebar, top navigation, statistics cards, charts, tables, filters, and responsive layouts.

Admin dashboard sections:

Overview

- Total orders
- Total products
- Total customers
- Revenue
- Recent orders
- Low-stock products
- Order status statistics

Only show real data from Supabase. Do not invent revenue or customer statistics.

Product management

Admin can:

- Add products
- Edit products
- Delete products
- Activate or deactivate products
- Add product name
- Add description
- Select category
- Set price
- Set discount percentage
- Set stock quantity
- Set SKU
- Upload multiple product images
- Select primary product image
- Reorder product images
- Delete individual product images

Use Supabase Storage for product images and the product_images database table for image records.

Provide a beautiful drag-and-drop image uploader with image previews, upload progress, remove buttons, and primary image selection.

Category management

Admin can:

- Create categories
- Edit categories
- Upload category images
- Activate or deactivate categories
- Delete categories when appropriate

Coupon management

Admin can:

- Create coupons
- Edit coupons
- Set coupon code
- Set discount type
- Set discount value
- Set minimum order amount
- Set maximum discount
- Set usage limits
- Set expiration date
- Activate or deactivate coupons

Order management

Admin can:

- View all orders
- Search by order number
- Search by customer name
- Search by customer email
- Filter by order status
- Filter by payment status
- View complete order details
- View purchased products
- View customer phone number
- View delivery address
- View coupon details
- Add admin notes
- Add courier name
- Add tracking number
- Update order status

Order statuses:

- Pending
- Processing
- Shipped
- Delivered
- Cancelled

Display a detailed order view with a status timeline.

Allow admins to open the delivery location in Google Maps using the customer's saved address or available coordinates.

Do not expose customer addresses to normal customers or unauthorized users.

Customer management

Admin can view customer accounts and their order history.

Do not allow admins to view customer passwords.

13. SUPABASE INTEGRATION

Connect this frontend to my existing Supabase project.

I will provide:

SUPABASE_URL = YOUR_SUPABASE_PROJECT_URL

SUPABASE_ANON_KEY = YOUR_SUPABASE_PUBLISHABLE_OR_ANON_KEY

Use the official Supabase JavaScript client.

Create a reusable Supabase client configuration file.

Use environment variables:

VITE_SUPABASE_URL

VITE_SUPABASE_ANON_KEY

If using the current Supabase publishable key format, support that key as the public frontend key.

Create reusable service functions for:

- Authentication
- Products
- Categories
- Product images
- Cart
- Coupons
- Addresses
- Orders
- Customer profiles
- Admin product management
- Admin order management

Use real Supabase queries instead of static product arrays.

Fetch active products and categories from the database.

Fetch product images from product_images and Supabase Storage.

Fetch customer orders using the authenticated user's ID and secure RLS policies.

Use the existing database schema where possible.

Do not create duplicate tables or rename existing tables unnecessarily.

If a required table, column, function, or Storage bucket does not exist, identify it and provide the required SQL migration instead of silently creating a fake frontend implementation.

Use the secure place_order database function for checkout if available.

Use the admin_update_order_status function for admin order status changes if available.

14. ADMIN AUTHORIZATION

Use the user_roles table to determine whether a user is an admin.

Do not use email addresses, frontend variables, localStorage, or user-editable metadata as proof of admin privileges.

Protect all admin routes.

If a normal customer tries to open an admin route, redirect them to the homepage or show an unauthorized page.

The frontend admin check is only for navigation and user experience. Supabase RLS and secure database functions must enforce the actual permissions.

Never expose the Supabase service role key in the frontend.

15. ANIMATIONS AND INTERACTIONS

Make the website feel alive and premium.

Add:

- Smooth page transitions
- Elegant hover effects
- Animated buttons
- Product card image transitions
- Cart drawer animation
- Wishlist interaction
- Smooth dropdown menus
- Skeleton loading states
- Toast notifications
- Beautiful modal dialogs
- Scroll reveal animations
- Subtle parallax on hero sections where appropriate

Use Framer Motion or a suitable lightweight animation library.

Animations should be smooth and optimized.

Respect reduced-motion accessibility settings.

16. RESPONSIVE DESIGN

The website must work beautifully on:

- Mobile phones
- Tablets
- Laptops
- Large desktop screens

Use mobile-first responsive layouts.

Ensure:

- Product cards adapt to screen size
- Navigation works on mobile
- Admin tables are mobile-friendly
- Checkout forms are easy to use
- Buttons are touch-friendly
- Images maintain their aspect ratios

17. PERFORMANCE AND QUALITY

Use:

- Reusable React components
- Clean TypeScript types
- Proper error handling
- Lazy loading for images
- Optimized image sizes
- Pagination for large product lists
- Loading skeletons
- Empty states
- Error states
- Accessible forms
- Semantic HTML
- SEO-friendly page titles and descriptions

Do not build everything as one giant component.

Use a clean folder structure.

Make sure all buttons and links perform their intended actions.

Do not leave nonfunctional buttons or fake checkout flows.

18. FINAL REQUIREMENT

Build the complete frontend, not just a homepage mockup.

Create the pages, routing, reusable components, Supabase integration, authentication, product browsing, shopping cart, checkout, customer account, order tracking, and admin dashboard.

Prioritize a stunning premium design and a fully functional shopping experience.

First inspect the existing Supabase schema and use it correctly.

If the Supabase connection is not configured yet, build the complete frontend and clearly identify the environment variables and database functions needed to connect it.

The final result should look like a premium international e-commerce brand with rich colors, beautiful product photography, polished animations, and a highly professional user experience.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/124c30de-c0be-4f18-8f49-cca93d8f535c).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
