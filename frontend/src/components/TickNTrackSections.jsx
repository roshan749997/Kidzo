import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Star, TrendingUp, Zap, ChevronRight, ShoppingBag, Award, Shield, Truck, Sparkles, ArrowRight, Clock, Search, User, Phone, Mail } from 'lucide-react';

const TickNTrackSections = () => {
  const navigate = useNavigate();
  const [hoveredCard, setHoveredCard] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');

  // Premium Collection Categories
  const CollectionShowcase = () => {
    const collections = [
      {
        id: 1,
        title: "Athletic Performance",
        subtitle: "Professional Sport Collection",
        description: "Engineered for peak performance",
        items: "500+",
        image: "https://res.cloudinary.com/dvkxgrcbv/image/upload/v1765022742/f8dbd04d-719c-431f-a21f-78b7a17d166c.png",
        gradient: "from-blue-600/95 via-indigo-700/95 to-purple-800/95",
        badge: "Performance Line",
        path: "/category/shoes/mens-shoes/Men-sports-shoes"
      },
      {
        id: 2,
        title: "Luxury Timepieces",
        subtitle: "Swiss Craftsmanship",
        description: "Precision meets elegance",
        items: "300+",
        image: "https://res.cloudinary.com/dvkxgrcbv/image/upload/v1765022796/7486ac18-1754-45a3-863d-4a9e8b45d006.png",
        gradient: "from-amber-600/95 via-yellow-700/95 to-orange-800/95",
        badge: "Luxury Collection",
        path: "/category/watches/men-watches/Men-luxury-watches"
      },
      {
        id: 3,
        title: "Designer Footwear",
        subtitle: "Premium Women's Range",
        description: "Sophistication in every step",
        items: "650+",
        image: "https://res.cloudinary.com/dvkxgrcbv/image/upload/v1765022843/7fccca1e-24b4-458a-80cd-5e245bcf37a2.png",
        gradient: "from-rose-600/95 via-pink-700/95 to-purple-800/95",
        badge: "Designer Series",
        path: "/category/shoes/womens-shoes"
      },
      {
        id: 4,
        title: "Urban Lifestyle",
        subtitle: "Contemporary Casual",
        description: "Style meets comfort",
        items: "400+",
        image: "https://res.cloudinary.com/dvkxgrcbv/image/upload/v1765022911/0451752d-41ef-40d2-b851-d9b9aff53885.png",
        gradient: "from-teal-600/95 via-cyan-700/95 to-blue-800/95",
        badge: "Lifestyle Collection",
        path: "/category/shoes/mens-shoes/Men-casual-shoes"
      }
    ];

    return (
      <section className="relative pt-8 md:pt-12 pb-24 bg-white overflow-hidden w-full">
        <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-4 2xl:px-6">
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-8 md:mb-16">
            <div className="inline-flex items-center gap-1.5 md:gap-2 px-3 md:px-4 py-1.5 md:py-2 bg-gray-100 rounded-full mb-3 md:mb-4">
              <Sparkles className="w-3 h-3 md:w-4 md:h-4 text-teal-600" />
              <span className="text-xs md:text-sm font-semibold text-gray-700 uppercase tracking-wider">Curated Collections</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 md:mb-4 tracking-tight px-2">
              Premium Product Categories
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-gray-600 leading-relaxed px-2">
              Explore our carefully curated collections designed for discerning customers who value quality and style
            </p>
          </div>

          {/* Collections Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
            {collections.map((collection, idx) => (
              <div
                key={collection.id}
                onMouseEnter={() => setHoveredCard(`col-${idx}`)}
                onMouseLeave={() => setHoveredCard(null)}
                className="group relative overflow-hidden rounded-xl md:rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500"
              >
                <div className="aspect-[16/10] relative">
                  {/* Image */}
                  <img
                    src={collection.image}
                    alt={collection.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  
                  {/* Gradient Overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${collection.gradient} mix-blend-multiply`} />
                  
                  {/* Content */}
                  <div className="absolute inset-0 p-4 sm:p-6 md:p-8 flex flex-col justify-between text-white">
                    <div className="flex justify-between items-start gap-2">
                      <span className="px-2 sm:px-3 md:px-4 py-1 sm:py-1.5 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full text-[10px] sm:text-xs font-semibold uppercase tracking-wide whitespace-nowrap">
                        {collection.badge}
                      </span>
                      <span className="px-2 sm:px-3 md:px-4 py-1 sm:py-1.5 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full text-[10px] sm:text-xs md:text-sm font-bold whitespace-nowrap">
                        {collection.items} Products
                      </span>
                    </div>

                    <div>
                      <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-1 sm:mb-2 tracking-tight">
                        {collection.title}
                      </h3>
                      <p className="text-sm sm:text-base md:text-lg font-medium text-white/90 mb-0.5 sm:mb-1">
                        {collection.subtitle}
                      </p>
                      <p className="text-xs sm:text-sm text-white/80 mb-4 sm:mb-6">
                        {collection.description}
                      </p>
                      
                      <button 
                        onClick={() => collection.path && navigate(collection.path)}
                        className={`inline-flex items-center gap-1.5 sm:gap-2 px-4 sm:px-5 md:px-6 py-2 sm:py-2.5 md:py-3 bg-white text-gray-900 rounded-lg md:rounded-xl text-xs sm:text-sm md:text-base font-semibold hover:bg-teal-500 hover:text-white transition-all duration-300 ${hoveredCard === `col-${idx}` ? 'translate-x-2' : ''}`}
                      >
                        Explore Collection
                        <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  };

  // Featured Products with Filters
  const FeaturedProducts = () => {
    const filters = ['All Products', 'Sneakers', 'Watches', 'Limited Edition', 'Best Sellers'];
    
    const products = [
      {
        id: 1,
        name: "Nike Air Max 2024 Premium",
        brand: "Nike",
        category: "Athletic Footwear",
        price: 16999,
        originalPrice: 22999,
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=600&fit=crop",
        rating: 4.9,
        reviews: 1847,
        badge: "Best Seller",
        inStock: true,
        colors: 4
      },
      {
        id: 2,
        name: "Rolex Submariner Date 41mm",
        brand: "Rolex",
        category: "Luxury Timepieces",
        price: 1299999,
        originalPrice: null,
        image: "https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?w=600&h=600&fit=crop",
        rating: 5.0,
        reviews: 892,
        badge: "Luxury",
        inStock: true,
        colors: 3
      },
      {
        id: 3,
        name: "Adidas Ultraboost 22 DNA",
        brand: "Adidas",
        category: "Running Shoes",
        price: 18499,
        originalPrice: 21999,
        image: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=600&h=600&fit=crop",
        rating: 4.8,
        reviews: 2341,
        badge: "Trending",
        inStock: true,
        colors: 5
      },
      {
        id: 4,
        name: "Omega Seamaster Diver 300M",
        brand: "Omega",
        category: "Luxury Timepieces",
        price: 599999,
        originalPrice: null,
        image: "https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=600&h=600&fit=crop",
        rating: 4.9,
        reviews: 567,
        badge: "Premium",
        inStock: true,
        colors: 2
      },
      {
        id: 5,
        name: "Jordan Retro 1 High OG",
        brand: "Air Jordan",
        category: "Basketball Shoes",
        price: 14999,
        originalPrice: 17999,
        image: "https://images.unsplash.com/photo-1556906781-9a412961c28c?w=600&h=600&fit=crop",
        rating: 5.0,
        reviews: 3456,
        badge: "Exclusive",
        inStock: true,
        colors: 6
      },
      {
        id: 6,
        name: "TAG Heuer Carrera Calibre 16",
        brand: "TAG Heuer",
        category: "Sport Watches",
        price: 399999,
        originalPrice: null,
        image: "https://images.unsplash.com/photo-1622434641406-a158123450f9?w=600&h=600&fit=crop",
        rating: 4.8,
        reviews: 423,
        badge: "Sport",
        inStock: true,
        colors: 3
      },
      {
        id: 7,
        name: "New Balance 990v6 Made in USA",
        brand: "New Balance",
        category: "Lifestyle Sneakers",
        price: 19999,
        originalPrice: 24999,
        image: "https://images.unsplash.com/photo-1539185441755-769473a23570?w=600&h=600&fit=crop",
        rating: 4.7,
        reviews: 1234,
        badge: "Popular",
        inStock: true,
        colors: 4
      },
      {
        id: 8,
        name: "Puma RS-X Efekt Premium",
        brand: "Puma",
        category: "Casual Sneakers",
        price: 9999,
        originalPrice: 12999,
        image: "https://images.unsplash.com/photo-1539185441755-769473a23570?w=600&h=600&fit=crop",
        rating: 4.6,
        reviews: 891,
        badge: "New",
        inStock: true,
        colors: 5
      }
    ];

    const formatPrice = (price) => {
      return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0
      }).format(price);
    };

    return (
      <section className="py-24 bg-gray-50 w-full">
        <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-4 2xl:px-6">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm mb-4">
                <TrendingUp className="w-4 h-4 text-teal-600" />
                <span className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Featured Products</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2 tracking-tight">
                Trending This Week
              </h2>
              <p className="text-lg text-gray-600">
                Discover our most popular items selected by our community
              </p>
            </div>
            
            <button className="hidden md:inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-xl font-semibold hover:bg-teal-600 transition-colors duration-300 shadow-lg hover:shadow-xl">
              View All Products
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Filter Tabs */}
          <div className="flex flex-wrap gap-3 mb-12">
            {filters.map((filter, idx) => (
              <button
                key={idx}
                onClick={() => setActiveFilter(filter.toLowerCase().replace(' ', '-'))}
                className={`px-6 py-2.5 rounded-xl font-semibold transition-all duration-300 ${
                  activeFilter === filter.toLowerCase().replace(' ', '-') || (idx === 0 && activeFilter === 'all')
                    ? 'bg-gray-900 text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-gray-100 shadow-sm'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product, idx) => (
              <div
                key={product.id}
                onMouseEnter={() => setHoveredCard(`prod-${idx}`)}
                onMouseLeave={() => setHoveredCard(null)}
                className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2"
              >
                {/* Product Image */}
                <div className="relative aspect-square bg-gray-100 overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  
                  {/* Badges */}
                  <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
                    <span className="px-3 py-1 bg-teal-600 text-white text-xs font-bold rounded-lg shadow-lg uppercase">
                      {product.badge}
                    </span>
                    {product.originalPrice && (
                      <span className="px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-lg shadow-lg">
                        {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
                      </span>
                    )}
                  </div>

                  {/* Wishlist */}
                  <button className={`absolute top-4 right-4 p-2.5 bg-white rounded-full shadow-lg transition-all duration-300 ${hoveredCard === `prod-${idx}` ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}`}>
                    <Heart className="w-5 h-5 text-gray-700 hover:text-red-500 hover:fill-red-500 transition-colors" />
                  </button>

                  {/* Quick View */}
                  <div className={`absolute inset-x-4 bottom-4 transition-all duration-500 ${hoveredCard === `prod-${idx}` ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
                    <button className="w-full py-3 bg-gray-900 text-white rounded-xl font-semibold hover:bg-teal-600 transition-colors duration-300 shadow-xl flex items-center justify-center gap-2">
                      <ShoppingBag className="w-4 h-4" />
                      Add to Cart
                    </button>
                  </div>
                </div>

                {/* Product Info */}
                <div className="p-5">
                  {/* Brand & Category */}
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-teal-600 uppercase tracking-wide">{product.brand}</span>
                    <span className="text-xs text-gray-500">{product.colors} colors</span>
                  </div>

                  {/* Product Name */}
                  <h3 className="text-base font-bold text-gray-900 mb-2 line-clamp-2 min-h-[3rem] group-hover:text-teal-600 transition-colors">
                    {product.name}
                  </h3>

                  {/* Rating */}
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-3.5 h-3.5 ${i < Math.floor(product.rating) ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}`} />
                      ))}
                    </div>
                    <span className="text-sm font-semibold text-gray-900">{product.rating}</span>
                    <span className="text-xs text-gray-500">({product.reviews.toLocaleString()})</span>
                  </div>

                  {/* Price */}
                  <div className="flex items-baseline gap-2">
                    <span className="text-xl font-bold text-gray-900">{formatPrice(product.price)}</span>
                    {product.originalPrice && (
                      <span className="text-sm text-gray-500 line-through">{formatPrice(product.originalPrice)}</span>
                    )}
                  </div>

                  {/* Stock Status */}
                  <div className="mt-3 flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${product.inStock ? 'bg-green-500' : 'bg-red-500'}`} />
                    <span className="text-xs font-medium text-gray-600">
                      {product.inStock ? 'In Stock' : 'Out of Stock'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Mobile View All */}
          <div className="md:hidden text-center mt-12">
            <button className="inline-flex items-center gap-2 px-8 py-4 bg-gray-900 text-white rounded-xl font-semibold hover:bg-teal-600 transition-colors duration-300 shadow-lg">
              View All Products
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>
    );
  };

  // Trust & Features Section
  const TrustSection = () => {
    const features = [
      {
        icon: <Truck className="w-8 h-8" />,
        title: "Free Express Shipping",
        description: "Complimentary delivery on orders above ₹999",
        stats: "Delivered in 2-3 days"
      },
      {
        icon: <Shield className="w-8 h-8" />,
        title: "Secure Payments",
        description: "SSL encrypted transactions for your safety",
        stats: "100% Protected"
      },
      {
        icon: <Award className="w-8 h-8" />,
        title: "Authentic Products",
        description: "Genuine products with official warranty",
        stats: "Verified by Experts"
      },
      {
        icon: <Clock className="w-8 h-8" />,
        title: "24/7 Customer Care",
        description: "Dedicated support team always available",
        stats: "Response in 2 hours"
      }
    ];

    const stats = [
      { number: "50K+", label: "Happy Customers" },
      { number: "1000+", label: "Premium Products" },
      { number: "98%", label: "Customer Satisfaction" },
      { number: "24/7", label: "Support Available" }
    ];

    return (
      <section className="py-24 bg-white w-full">
        <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-4 2xl:px-6">
          {/* Stats Bar */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
            {stats.map((stat, idx) => (
              <div key={idx} className="text-center p-6 bg-gradient-to-br from-gray-50 to-white rounded-2xl border border-gray-100">
                <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 text-transparent bg-clip-text mb-2">
                  {stat.number}
                </div>
                <div className="text-sm font-medium text-gray-600">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tight">
              The TickNTrack Advantage
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              Experience premium quality, exceptional service, and complete peace of mind with every purchase
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, idx) => (
              <div
                key={idx}
                onMouseEnter={() => setHoveredCard(`trust-${idx}`)}
                onMouseLeave={() => setHoveredCard(null)}
                className="group text-center"
              >
                <div className={`relative bg-white rounded-2xl p-8 border-2 transition-all duration-500 ${hoveredCard === `trust-${idx}` ? 'border-teal-600 shadow-xl -translate-y-2' : 'border-gray-200 shadow-md'}`}>
                  {/* Icon */}
                  <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-xl mb-6 text-white transition-transform duration-500 ${hoveredCard === `trust-${idx}` ? 'scale-110 rotate-6' : 'scale-100'}`}>
                    {feature.icon}
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    {feature.description}
                  </p>
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-teal-50 text-teal-700 rounded-lg text-sm font-semibold">
                    <Zap className="w-4 h-4" />
                    {feature.stats}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-16 text-center">
            <div className="inline-flex flex-col sm:flex-row gap-4">
              <button className="inline-flex items-center gap-2 px-8 py-4 bg-gray-900 text-white rounded-xl font-semibold hover:bg-teal-600 transition-colors duration-300 shadow-lg hover:shadow-xl">
                <ShoppingBag className="w-5 h-5" />
                Start Shopping
              </button>
              <button className="inline-flex items-center gap-2 px-8 py-4 bg-white text-gray-900 border-2 border-gray-900 rounded-xl font-semibold hover:bg-gray-900 hover:text-white transition-colors duration-300 shadow-lg">
                <Phone className="w-5 h-5" />
                Contact Support
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  };

  return (
    <div className="bg-white">
      <CollectionShowcase />
      <FeaturedProducts />
      <TrustSection />
    </div>
  );
};

export default TickNTrackSections;