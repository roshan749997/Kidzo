import { Link } from 'react-router-dom';
import { Heart, Mail, Phone, MapPin, Facebook, Instagram, Twitter, Youtube, ShoppingBag, Truck, Shield, RotateCcw, HeadphonesIcon, Clock, ChevronRight } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: 'Home', path: '/' },
    { name: 'All Products', path: '/products' },
    { name: 'New Arrivals', path: '/new-arrivals' },
    { name: 'Best Sellers', path: '/best-sellers' },
    { name: 'About Us', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  const categories = [
    { name: 'Men\'s Shoes', path: '/category/shoes/mens-shoes' },
    { name: 'Women\'s Shoes', path: '/category/shoes/womens-shoes' },
    { name: 'Sports Shoes', path: '/category/shoes/sports-shoes' },
    { name: 'Luxury Watches', path: '/category/watches/luxury-watches' },
    { name: 'Smart Watches', path: '/category/watches/smart-watches' },
    { name: 'Accessories', path: '/category/accessories' },
  ];

  const customerService = [
    { name: 'Shipping Policy', path: '/shipping' },
    { name: 'Returns & Exchange', path: '/returns' },
    { name: 'Size Guide', path: '/size-guide' },
    { name: 'Care Instructions', path: '/care-instructions' },
    { name: 'FAQ', path: '/faq' },
    { name: 'Warranty', path: '/warranty' },
  ];

  const companyInfo = [
    { name: 'Our Story', path: '/about' },
    { name: 'Careers', path: '/careers' },
    { name: 'Press', path: '/press' },
    { name: 'Partner with Us', path: '/partners' },
    { name: 'Terms & Conditions', path: '/terms' },
    { name: 'Privacy Policy', path: '/privacy' },
  ];

  const socialLinks = [
    {
      name: 'Facebook',
      icon: <Facebook className="w-5 h-5" />,
      url: 'https://facebook.com/tickntrack',
    },
    {
      name: 'Instagram',
      icon: <Instagram className="w-5 h-5" />,
      url: 'https://instagram.com/tickntrack',
    },
    {
      name: 'Twitter',
      icon: <Twitter className="w-5 h-5" />,
      url: 'https://twitter.com/tickntrack',
    },
    {
      name: 'YouTube',
      icon: <Youtube className="w-5 h-5" />,
      url: 'https://youtube.com/tickntrack',
    },
  ];

  const features = [
    { icon: <Truck className="w-6 h-6" />, title: 'Free Shipping', description: 'On orders above ₹999' },
    { icon: <RotateCcw className="w-6 h-6" />, title: 'Easy Returns', description: '7-day return policy' },
    { icon: <Shield className="w-6 h-6" />, title: 'Secure Payment', description: '100% secure transactions' },
    { icon: <HeadphonesIcon className="w-6 h-6" />, title: '24/7 Support', description: 'Dedicated customer care' },
  ];

  return (
    <footer className="bg-gray-900 text-white w-full">
      {/* Features Bar */}
      <div className="border-b border-gray-800">
        <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-4 2xl:px-6 py-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-teal-600 rounded-lg flex items-center justify-center">
                  {feature.icon}
                </div>
                <div>
                  <h4 className="font-semibold text-white">{feature.title}</h4>
                  <p className="text-sm text-gray-400">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-4 2xl:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <img 
                src="https://res.cloudinary.com/dvkxgrcbv/image/upload/v1765015560/13d1b209-cadd-4897-a880-6449d9ee256a.png"
                alt="TickNTrack"
                className="h-12 w-auto object-contain mb-4"
              />
              <p className="text-gray-400 leading-relaxed max-w-md">
                Your trusted destination for premium footwear and luxury timepieces. 
                We bring you the finest collection of shoes and watches from top brands worldwide.
              </p>
            </div>

            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-gray-400">
                <Phone className="w-5 h-5 text-teal-500" />
                <span>+91 98765 43210</span>
              </div>
              <div className="flex items-center gap-3 text-gray-400">
                <Mail className="w-5 h-5 text-teal-500" />
                <span>support@tickntrack.com</span>
              </div>
              <div className="flex items-center gap-3 text-gray-400">
                <MapPin className="w-5 h-5 text-teal-500" />
                <span>123 Fashion Street, Mumbai, India 400001</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="mt-6">
              <h5 className="font-semibold text-white mb-4">Follow Us</h5>
              <div className="flex gap-3">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center text-gray-400 hover:bg-teal-600 hover:text-white transition-colors duration-300"
                    aria-label={social.name}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h5 className="font-semibold text-white mb-4">Quick Links</h5>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <Link 
                    to={link.path}
                    className="text-gray-400 hover:text-teal-400 transition-colors duration-300 flex items-center gap-2"
                  >
                    <ChevronRight className="w-4 h-4" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h5 className="font-semibold text-white mb-4">Shop by Category</h5>
            <ul className="space-y-3">
              {categories.map((category, index) => (
                <li key={index}>
                  <Link 
                    to={category.path}
                    className="text-gray-400 hover:text-teal-400 transition-colors duration-300 flex items-center gap-2"
                  >
                    <ChevronRight className="w-4 h-4" />
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h5 className="font-semibold text-white mb-4">Customer Service</h5>
            <ul className="space-y-3">
              {customerService.map((service, index) => (
                <li key={index}>
                  <Link 
                    to={service.path}
                    className="text-gray-400 hover:text-teal-400 transition-colors duration-300 flex items-center gap-2"
                  >
                    <ChevronRight className="w-4 h-4" />
                    {service.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h5 className="font-semibold text-white mb-2">Subscribe to Our Newsletter</h5>
              <p className="text-gray-400">
                Get exclusive offers, new product updates, and style tips delivered to your inbox
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="Enter your email address"
                className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
              />
              <button className="px-6 py-3 bg-teal-600 text-white font-semibold rounded-lg hover:bg-teal-700 transition-colors duration-300 flex items-center justify-center gap-2">
                <Mail className="w-5 h-5" />
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-gray-800">
        <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-4 2xl:px-6 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-gray-400 text-sm">
              © {currentYear} TickNTrack. All rights reserved. Made with 
              <Heart className="w-4 h-4 inline mx-1 text-red-500" /> 
              in India
            </div>
            <div className="flex gap-6">
              <Link to="/terms" className="text-gray-400 hover:text-teal-400 text-sm transition-colors duration-300">
                Terms & Conditions
              </Link>
              <Link to="/privacy" className="text-gray-400 hover:text-teal-400 text-sm transition-colors duration-300">
                Privacy Policy
              </Link>
              <Link to="/sitemap" className="text-gray-400 hover:text-teal-400 text-sm transition-colors duration-300">
                Sitemap
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Methods */}
      <div className="border-t border-gray-800">
        <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-4 2xl:px-6 py-6">
          <div className="text-center">
            <p className="text-gray-400 text-sm mb-4">We Accept</p>
            <div className="flex justify-center items-center gap-4 flex-wrap">
              <div className="w-12 h-8 bg-white rounded flex items-center justify-center text-xs font-bold text-gray-800">VISA</div>
              <div className="w-12 h-8 bg-white rounded flex items-center justify-center text-xs font-bold text-gray-800">MC</div>
              <div className="w-12 h-8 bg-white rounded flex items-center justify-center text-xs font-bold text-gray-800">UPI</div>
              <div className="w-12 h-8 bg-white rounded flex items-center justify-center text-xs font-bold text-gray-800">GPay</div>
              <div className="w-12 h-8 bg-white rounded flex items-center justify-center text-xs font-bold text-gray-800">PayTM</div>
              <div className="w-12 h-8 bg-white rounded flex items-center justify-center text-xs font-bold text-gray-800">COD</div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
