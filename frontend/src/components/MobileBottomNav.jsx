import { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';

// SVG Icons with dynamic color based on active state
const HomeIcon = ({ isActive }) => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path 
      d="M3 12L5 10M5 10L12 3L19 10M5 10V20C5 20.5523 5.44772 21 6 21H9M19 10L21 12M19 10V20C19 20.5523 18.5523 21 18 21H15M9 21C9.55228 21 10 20.5523 10 20V16C10 15.4477 10.4477 15 11 15H13C13.5523 15 14 15.4477 14 16V20C14 20.5523 14.4477 21 15 21M9 21H15"
      stroke={isActive ? '#800020' : 'black'} 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      fill="none"
    />
  </svg>
);

const WishlistIcon = ({ isActive }) => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path 
      d="M20.84 4.60999C20.3292 4.099 19.7228 3.69364 19.0554 3.41708C18.3879 3.14052 17.6725 2.99817 16.95 2.99817C16.2275 2.99817 15.5121 3.14052 14.8446 3.41708C14.1772 3.69364 13.5708 4.099 13.06 4.60999L12 5.66999L10.94 4.60999C9.9083 3.5783 8.50903 2.9987 7.05 2.9987C5.59096 2.9987 4.19169 3.5783 3.16 4.60999C2.1283 5.64169 1.54871 7.04096 1.54871 8.49999C1.54871 9.95903 2.1283 11.3583 3.16 12.39L4.22 13.45L12 21.23L19.78 13.45L20.84 12.39C21.351 11.8792 21.7563 11.2728 22.0329 10.6053C22.3095 9.93789 22.4518 9.22248 22.4518 8.49999C22.4518 7.77751 22.3095 7.0621 22.0329 6.39464C21.7563 5.72718 21.351 5.12087 20.84 4.60999V4.60999Z"
      stroke={isActive ? '#800020' : 'black'} 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      fill={isActive ? 'rgba(128, 0, 32, 0.1)' : 'transparent'}
    />
  </svg>
);

const CartIcon = ({ isActive }) => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path 
      d="M9 22C9.55228 22 10 21.5523 10 21C10 20.4477 9.55228 20 9 20C8.44772 20 8 20.4477 8 21C8 21.5523 8.44772 22 9 22Z"
      stroke={isActive ? '#800020' : 'black'} 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      fill={isActive ? 'rgba(128, 0, 32, 0.1)' : 'transparent'}
    />
    <path 
      d="M20 22C20.5523 22 21 21.5523 21 21C21 20.4477 20.5523 20 20 20C19.4477 20 19 20.4477 19 21C19 21.5523 19.4477 22 20 22Z"
      stroke={isActive ? '#800020' : 'black'} 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      fill={isActive ? 'rgba(128, 0, 32, 0.1)' : 'transparent'}
    />
    <path 
      d="M1 1H5L7.68 14.39C7.77144 14.8504 8.02191 15.264 8.38755 15.5583C8.75318 15.8526 9.2107 16.009 9.68 16H19.4C19.8693 16.009 20.3268 15.8526 20.6925 15.5583C21.0581 15.264 21.3086 14.8504 21.4 14.39L23 6H6"
      stroke={isActive ? '#800020' : 'black'} 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      fill={isActive ? 'rgba(128, 0, 32, 0.1)' : 'transparent'}
    />
  </svg>
);

const AccountIcon = ({ isActive }) => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path 
      d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21"
      stroke={isActive ? '#800020' : 'black'} 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      fill={isActive ? 'rgba(128, 0, 32, 0.1)' : 'transparent'}
    />
    <path 
      d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z"
      stroke={isActive ? '#800020' : 'black'} 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      fill={isActive ? 'rgba(128, 0, 32, 0.1)' : 'transparent'}
    />
  </svg>
);

const MobileBottomNav = () => {
  const { cartCount } = useCart();
  const [wishlistCount, setWishlistCount] = useState(0);
  const [isFooterVisible, setIsFooterVisible] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Read wishlist count from localStorage
  useEffect(() => {
    const readWishlistCount = () => {
      try {
        const raw = localStorage.getItem('wishlist');
        const list = raw ? JSON.parse(raw) : [];
        setWishlistCount(Array.isArray(list) ? list.length : 0);
      } catch {
        setWishlistCount(0);
      }
    };
    
    readWishlistCount();
    
    const onStorage = (e) => {
      if (!e || e.key === 'wishlist') {
        readWishlistCount();
      }
    };
    
    const onCustom = () => {
      readWishlistCount();
    };
    
    window.addEventListener('storage', onStorage);
    window.addEventListener('wishlist:updated', onCustom);
    
    return () => {
      window.removeEventListener('storage', onStorage);
      window.removeEventListener('wishlist:updated', onCustom);
    };
  }, []);

  // Detect footer visibility using Intersection Observer
  useEffect(() => {
    const footer = document.querySelector('footer');
    if (!footer) return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsFooterVisible(entry.isIntersecting);
        });
      },
      {
        threshold: 0.1, // Trigger when 10% of footer is visible
        rootMargin: '0px 0px -50px 0px' // Trigger slightly before footer enters viewport
      }
    );
    
    observer.observe(footer);
    
    return () => {
      observer.disconnect();
    };
  }, [location.pathname]); // Re-run when route changes

  const handleHomeClick = (e) => {
    e.preventDefault();
    window.scrollTo(0, 0);
    navigate('/');
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div 
      className={`fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t border-gray-200 md:hidden z-50 pt-1 pb-0.5 transition-transform duration-300 ${
        isFooterVisible ? 'translate-y-full' : 'translate-y-0'
      }`}
    >
      <div className="flex justify-around items-center h-9">
        <a 
          href="/" 
          onClick={handleHomeClick}
          className={`flex flex-col items-center justify-center ${isActive('/') ? 'text-[#800020]' : 'text-gray-700'} transition-all duration-300 flex-1 group`}
        >
          <div className={`p-1 rounded-full ${isActive('/') ? 'bg-gray-100' : 'group-hover:bg-gray-100'} transition-all duration-300`}>
            <HomeIcon isActive={isActive('/')} />
          </div>
          <span className="text-[9px] mt-0">HOME</span>
        </a>
        
        <Link 
          to="/wishlist" 
          className={`flex flex-col items-center justify-center ${isActive('/wishlist') ? 'text-[#800020]' : 'text-gray-700'} transition-all duration-300 flex-1 group`}
        >
          <div className={`p-0.5 rounded-full ${isActive('/wishlist') ? 'bg-gray-100' : 'group-hover:bg-gray-100'} transition-all duration-300 relative`}>
            <WishlistIcon isActive={isActive('/wishlist')} />
            {wishlistCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#800020] text-white text-[10px] rounded-full h-4 w-4 flex items-center justify-center">
                {wishlistCount > 9 ? '9+' : wishlistCount}
              </span>
            )}
          </div>
          <span className="text-[9px] mt-0">WISHLIST</span>
        </Link>
        
        <Link 
          to="/cart" 
          className={`flex flex-col items-center justify-center ${isActive('/cart') ? 'text-[#800020]' : 'text-gray-700'} transition-all duration-300 flex-1 relative group`}
        >
          <div className={`p-1 rounded-full ${isActive('/cart') ? 'bg-gray-100' : 'group-hover:bg-gray-100'} transition-all duration-300 relative`}>
            <CartIcon isActive={isActive('/cart')} />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#800020] text-white text-[10px] rounded-full h-4 w-4 flex items-center justify-center">
                {cartCount > 9 ? '9+' : cartCount}
              </span>
            )}
          </div>
          <span className="text-[9px] mt-0">CART</span>
        </Link>
        
        <Link 
          to="/profile" 
          className={`flex flex-col items-center justify-center ${isActive('/profile') ? 'text-[#800020]' : 'text-gray-700'} transition-all duration-300 flex-1 group`}
        >
          <div className={`p-1 rounded-full ${isActive('/profile') ? 'bg-gray-100' : 'group-hover:bg-gray-100'} transition-all duration-300`}>
            <AccountIcon isActive={isActive('/profile')} />
          </div>
          <span className="text-[9px] mt-0">ACCOUNT</span>
        </Link>
      </div>
    </div>
  );
};

export default MobileBottomNav;
