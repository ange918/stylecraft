import { Link } from 'wouter';

export default function Footer() {
  const shopLinks = [
    { name: 'Mens Wear', href: '/shop?category=mens' },
    { name: 'Womens Wear', href: '/shop?category=womens' },
    { name: 'Kids Wear', href: '/shop?category=kids' },
    { name: 'Accessories', href: '/shop?category=accessories' },
    { name: 'Sale', href: '/shop?sale=true' }
  ];

  const helpLinks = [
    { name: 'Size Guide', href: '/size-guide' },
    { name: 'Shipping Info', href: '/shipping' },
    { name: 'Returns', href: '/returns' },
    { name: 'FAQ', href: '/faq' },
    { name: 'Contact', href: '/contact' }
  ];

  const profileLinks = [
    { name: 'My Account', href: '/account' },
    { name: 'Order History', href: '/orders' },
    { name: 'Wishlist', href: '/wishlist' },
    { name: 'Track Order', href: '/track' }
  ];

  const socialLinks = [
    { icon: 'fab fa-facebook', href: '#', name: 'Facebook' },
    { icon: 'fab fa-instagram', href: '#', name: 'Instagram' },
    { icon: 'fab fa-twitter', href: '#', name: 'Twitter' },
    { icon: 'fab fa-pinterest', href: '#', name: 'Pinterest' }
  ];

  return (
    <footer className="bg-primary text-primary-foreground py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-6" data-testid="footer-logo">
              StyleCraft
            </h3>
            <p className="text-primary-foreground opacity-80 mb-4">
              Timeless fashion for the modern wardrobe. Quality clothing that lasts.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  className="text-primary-foreground opacity-80 hover:opacity-100 transition-opacity"
                  data-testid={`social-${social.name.toLowerCase()}`}
                  aria-label={social.name}
                >
                  <i className={`${social.icon} text-lg`}></i>
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Shop</h4>
            <ul className="space-y-2">
              {shopLinks.map((link) => (
                <li key={link.name}>
                  <Link href={link.href}>
                    <a 
                      className="text-primary-foreground opacity-80 hover:opacity-100 transition-opacity"
                      data-testid={`footer-shop-${link.name.toLowerCase().replace(' ', '-')}`}
                    >
                      {link.name}
                    </a>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Help</h4>
            <ul className="space-y-2">
              {helpLinks.map((link) => (
                <li key={link.name}>
                  <Link href={link.href}>
                    <a 
                      className="text-primary-foreground opacity-80 hover:opacity-100 transition-opacity"
                      data-testid={`footer-help-${link.name.toLowerCase().replace(' ', '-')}`}
                    >
                      {link.name}
                    </a>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">My Profile</h4>
            <ul className="space-y-2">
              {profileLinks.map((link) => (
                <li key={link.name}>
                  <Link href={link.href}>
                    <a 
                      className="text-primary-foreground opacity-80 hover:opacity-100 transition-opacity"
                      data-testid={`footer-profile-${link.name.toLowerCase().replace(' ', '-')}`}
                    >
                      {link.name}
                    </a>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 mt-8 pt-8 text-center">
          <p className="text-primary-foreground opacity-80" data-testid="footer-copyright">
            &copy; 2024 StyleCraft. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
