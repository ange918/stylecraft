# StyleCraft E-commerce Website

## Overview

StyleCraft is a modern, responsive e-commerce website for a premium fashion brand. Built with vanilla HTML, CSS, and JavaScript without any frameworks, it offers a clean, professional shopping experience with features like product browsing, cart management, and responsive design. The site focuses on timeless fashion for modern wardrobes, targeting men's, women's, and children's clothing along with accessories.

**Recently Imported to Replit (September 2025)**: The site has been successfully imported and configured to run in the Replit environment with French localization and custom payment verification system.

## Recent Changes (September 2025)

### French Localization
- ✅ Complete translation of all pages (index.html, cart.html, shop.html, contact.html, about.html, product.html, perruques.html, sacs.html)
- ✅ French navigation menus, buttons, and form labels
- ✅ French product descriptions and category names
- ✅ French payment flow and confirmation messages

### Flutterwave Payment Integration (September 2025)
- ✅ Integrated Flutterwave payment gateway with test environment
- ✅ Mobile Money support: Airtel Money and Orange Money only
- ✅ Two-step payment process: Customer selects payment method → Flutterwave checkout
- ✅ Support for all countries using Airtel Money and Orange Money services
- ✅ Success/failure handling with transaction references
- ✅ Automatic cart clearing after successful payment

### Image Gallery Expansion (September 27, 2025)
- ✅ Added 4 new bag images from "sacs complement/" folder to sacs.html showcase section
- ✅ Added 11 new accessory images from "accesoires/" folder to perruques.html showcase section
- ✅ Added 10 new clothing images from "vetement complement/" folder to product.html as "Vêtements Similaires" section
- ✅ All 25 new images load successfully and integrate seamlessly with existing design
- ✅ Maintained consistent HTML structure and French descriptions for all new items

### Technical Improvements
- ✅ ES6 modules implementation (js/utils/email.js)
- ✅ Updated all HTML files to support ES6 module imports
- ✅ Configured for Replit's static web server on port 5000
- ✅ Production deployment configuration (autoscale)

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Pure Vanilla Stack**: Built entirely with HTML5, CSS3, and ES6+ JavaScript without any frameworks or libraries
- **ES6 Modules**: Modular JavaScript architecture with ES6 import/export for email functionality
- **Responsive Design**: Uses CSS Flexbox and Grid for layout with mobile-first approach
- **Component-Based Structure**: Modular CSS and JavaScript organized by functionality
- **Modern CSS Features**: Custom properties, animations, and transitions for smooth user experience
- **Replit Integration**: Email service integration for payment verification and order confirmations

### Page Structure
- **Multi-page Application**: Five main pages (index.html, shop.html, product.html, cart.html, contact.html)
- **Consistent Navigation**: Shared header/footer structure across all pages with responsive menu
- **SEO Optimized**: Proper meta tags, semantic HTML, and descriptive titles for each page

### State Management
- **Local Storage**: Cart data persistence using browser localStorage
- **Client-side Routing**: JavaScript-based page interactions without server dependencies
- **Dynamic Content**: Product filtering, pagination, and cart updates handled client-side

### UI/UX Design
- **Google Fonts Integration**: Poppins font family for consistent typography
- **FontAwesome Icons**: Vector icons for enhanced visual elements
- **Animation System**: CSS transitions and hover effects for interactive feedback
- **Modal System**: JavaScript-powered modals for quick product views

### Data Architecture
- **Static Product Data**: Hardcoded product information in JavaScript objects
- **JSON Structure**: Products stored as JavaScript arrays with detailed metadata
- **Image Handling**: External image URLs (Unsplash) for product photography

## External Dependencies

### CDN Resources
- **Google Fonts**: Poppins font family hosted on Google Fonts CDN
- **FontAwesome**: Icon library (version 6.4.0) for UI icons
- **Unsplash Images**: External image service for product photos and placeholders

### Browser APIs
- **Local Storage API**: For cart persistence and user preferences
- **Fetch API**: Potential future integration for backend communication
- **DOM Manipulation**: Native JavaScript for dynamic content updates

### No Backend Dependencies
- **Static Hosting Ready**: Designed to run on any static web server
- **No Database**: All product data embedded in frontend code
- **No Authentication**: Simple contact forms without user management

The architecture prioritizes simplicity, performance, and maintainability while providing a solid foundation for future backend integration if needed.