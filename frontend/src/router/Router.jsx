import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { CartProvider } from '../context/CartContext';
import Layout from '../components/Layout';
import Home from '../pages/Home';
import Shop from '../pages/Shop';
import Collections from '../components/Collections';
import About from '../pages/About';
import Contact from '../pages/Contact';
import SignIn from '../pages/SignIn';
import SignUp from '../pages/SignUp';
import ForgotPassword from '../pages/ForgotPassword';
import CategoryList from '../pages/CategoryList';
import ProductDetail from '../components/ProductDetail';
import Profile from '../pages/Profile';
import ProductList from '../components/ProductList';
import Cart from '../components/cart';
import Address from '../pages/Address';
import Search from '../pages/Search';
import MobileBottomNav from '../components/MobileBottomNav';
import { useEffect } from 'react';
import Wishlist from '../pages/Wishlist';
import AuthSuccess from '../pages/AuthSuccess';
import AuthFailure from '../pages/AuthFailure';
import AdminDashboard from '../pages/admin/AdminDashboard';
import AdminProducts from '../pages/admin/AdminProducts';
import AdminOrders from '../pages/admin/AdminOrders';
import AdminLayout from '../pages/admin/AdminLayout';
import AdminAddresses from '../pages/admin/AdminAddresses';
import PrivacyPolicy from '../pages/PrivacyPolicy';
import TermsAndConditions from '../pages/TermsAndConditions';
import ShippingPolicy from '../pages/ShippingPolicy';
import RefundCancellationPolicy from '../pages/RefundCancellationPolicy';
import OrderSuccess from '../pages/OrderSuccess';

const isAuthenticated = () => {
  try {
    const token = localStorage.getItem('auth_token');
    return Boolean(token);
  } catch {
    return false;
  }
};

const isAdmin = () => {
  try {
    const adminFlag = localStorage.getItem('auth_is_admin');
    const isAdminUser = adminFlag === 'true';
    console.log('[Router] Admin check:', { adminFlag, isAdminUser });
    return isAdminUser;
  } catch (err) {
    console.error('[Router] Admin check error:', err);
    return false;
  }
};

const RequireAuth = ({ children }) => {
  const location = useLocation();
  if (!isAuthenticated()) {
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }
  return children;
};

const RequireAdmin = ({ children }) => {
  const location = useLocation();
  const isAuth = isAuthenticated();
  const admin = isAdmin();
  
  console.log('[RequireAdmin] Check:', { 
    isAuth, 
    admin, 
    pathname: location.pathname,
    authToken: localStorage.getItem('auth_token') ? 'present' : 'missing',
    adminFlag: localStorage.getItem('auth_is_admin')
  });
  
  if (!isAuth) {
    console.log('[RequireAdmin] Not authenticated, redirecting to signin');
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }
  if (!admin) {
    console.log('[RequireAdmin] Not admin, redirecting to home');
    return <Navigate to="/" replace />;
  }
  return children;
};

const RedirectIfAuth = ({ children }) => {
  if (isAuthenticated()) {
    return <Navigate to="/" replace />;
  }
  return children;
};

const Router = () => {
  const location = useLocation();
  const hideBottomNav = location.pathname.includes('/product/') || 
                       location.pathname === '/products' || 
                       location.pathname.startsWith('/category/');

  return (
    <CartProvider>
      <Routes>
        <Route path="/" element={
          <>
            <Layout />
            {!hideBottomNav && <MobileBottomNav />}
          </>
        }>
          {/* Public routes */}
          <Route index element={<Home />} />
          <Route path="shop" element={<Shop />} />
          <Route path="collections" element={<Collections />} />
          {/* Saree Categories */}
          {/* Backwards-compatible static routes */}
          <Route path="category/banarasi" element={<CategoryList />} />
          <Route path="silk/banarasi" element={<CategoryList />} />

          {/* Dynamic category/subcategory routes - single UI (ProductList) */}
          {/* Handle 3-segment paths: /category/shoes/mens-shoes/sports-shoes */}
          <Route path="category/:mainCategory/:categoryName/:subCategoryName" element={<ProductList />} />
          {/* Handle 2-segment paths: /category/shoes/mens-shoes */}
          <Route path="category/:categoryName/:subCategoryName" element={<ProductList />} />
          {/* Handle 1-segment paths: /category/shoes */}
          <Route path="category/:categoryName" element={<ProductList />} />
          {/* Product Detail - Using ID for better reliability */}
          <Route path="product/:id" element={<ProductDetail />} />
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />
          <Route path="wishlist" element={<Wishlist />} />
          <Route path="privacy" element={<PrivacyPolicy />} />
          <Route path="terms" element={<TermsAndConditions />} />
          <Route path="shipping" element={<ShippingPolicy />} />
          <Route path="returns" element={<RefundCancellationPolicy />} />

          {/* Private route(s) */}
          <Route path="cart" element={<RequireAuth><Cart /></RequireAuth>} />
          <Route path="checkout/address" element={<RequireAuth><Address /></RequireAuth>} />
          <Route path="order-success" element={<RequireAuth><OrderSuccess /></RequireAuth>} />
          <Route path="profile" element={<RequireAuth><Profile /></RequireAuth>} />
          <Route path="search" element={<Search />} />
        </Route>

        <Route path="signin" element={<RedirectIfAuth><SignIn /></RedirectIfAuth>} />
        <Route path="signup" element={<RedirectIfAuth><SignUp /></RedirectIfAuth>} />
        <Route path="forgot-password" element={<ForgotPassword />} />
        <Route path="auth/success" element={<AuthSuccess />} />
        <Route path="auth/failure" element={<AuthFailure />} />
        {/* Admin routes */}
        <Route path="admin" element={<RequireAdmin><AdminLayout /></RequireAdmin>}>
          <Route index element={<AdminDashboard />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="addresses" element={<AdminAddresses />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </CartProvider>
  );
};

export default Router;