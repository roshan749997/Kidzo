import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { api } from '../utils/api';
import { getOrderById } from '../services/api';
import { CheckCircle, Package, Calendar, Receipt, Truck, FileText } from 'lucide-react';
import Invoice from '../components/Invoice';

const OrderSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { cartTotal } = useCart();
  const [user, setUser] = useState(null);
  const [countdown, setCountdown] = useState(10);
  const [isVisible, setIsVisible] = useState(false);
  const [showInvoice, setShowInvoice] = useState(false);
  const [order, setOrder] = useState(null);
  const [loadingOrder, setLoadingOrder] = useState(false);
  const paymentMethod = searchParams.get('method') || 'COD';
  const orderId = searchParams.get('orderId') || '';
  
  // Generate order number from orderId or create a random one
  const orderNumber = orderId ? orderId.slice(-8).toUpperCase() : `ORD${Date.now().toString().slice(-8)}`;
  
  // Calculate estimated delivery date (5-7 days from now)
  const estimatedDelivery = new Date();
  estimatedDelivery.setDate(estimatedDelivery.getDate() + Math.floor(Math.random() * 3) + 5); // 5-7 days
  
  // Get order total from localStorage (stored before cart is cleared)
  const [orderTotal, setOrderTotal] = useState(0);
  
  // Fetch user data
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await api.me();
        if (userData?.user) {
          setUser(userData.user);
        }
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };
    fetchUser();
  }, []);
  
  // Fetch order details if orderId is available
  useEffect(() => {
    if (orderId) {
      const fetchOrder = async () => {
        setLoadingOrder(true);
        try {
          const response = await getOrderById(orderId);
          if (response) {
            setOrder(response);
          }
        } catch (error) {
          console.error('Error fetching order:', error);
        } finally {
          setLoadingOrder(false);
        }
      };
      fetchOrder();
    }
  }, [orderId]);
  
  useEffect(() => {
    const storedTotal = localStorage.getItem('lastOrderTotal');
    if (storedTotal) {
      setOrderTotal(parseFloat(storedTotal));
      // Clear it after reading
      localStorage.removeItem('lastOrderTotal');
    } else if (cartTotal > 0) {
      setOrderTotal(cartTotal);
    }
  }, [cartTotal]);

  useEffect(() => {
    // Trigger fade-in animation
    setIsVisible(true);
  }, []);

  useEffect(() => {
    // Countdown timer
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          // Smooth transition before navigation
          setIsVisible(false);
          setTimeout(() => {
            navigate('/profile?tab=orders');
          }, 300);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate]);

  const handleGoToOrders = () => {
    setIsVisible(false);
    setTimeout(() => {
      navigate('/profile?tab=orders');
    }, 300);
  };

  const handleContinueShopping = () => {
    setIsVisible(false);
    setTimeout(() => {
      navigate('/');
    }, 300);
  };

  return (
    <div 
      className="min-h-screen w-full bg-gradient-to-br from-gray-50 via-white to-gray-50 transition-opacity duration-300 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-6 sm:py-8"
      style={{
        opacity: isVisible ? 1 : 0
      }}
    >
      {/* Single Frame Container - Everything visible without scrolling */}
      <div 
        className={`w-full max-w-6xl mx-auto bg-white rounded-2xl sm:rounded-3xl shadow-2xl transform transition-all duration-500 overflow-hidden ${
          isVisible ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-10 opacity-0 scale-95'
        }`}
      >
        {/* Main Content Grid - Single Frame Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 p-6 sm:p-8 lg:p-10">
          
          {/* Left Column - Success Message & Details (2 columns on desktop) */}
          <div className="lg:col-span-2 space-y-5 sm:space-y-6">
            
            {/* Success Header Section with Countdown in Top Right */}
            <div className="relative">
              {/* Countdown Timer - Top Right Corner */}
              <div className="absolute top-0 right-0 bg-green-50 border border-green-200 rounded-lg px-3 py-2 flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <p className="text-xs sm:text-sm text-gray-700 font-medium">
                  Redirecting in <span className="font-bold text-green-600">{countdown}</span>s
                </p>
              </div>

              {/* Success Icon and Message */}
              <div className="text-center lg:text-left pr-32 sm:pr-40 lg:pr-0">
                {/* Animated Success Icon */}
                <div className="flex justify-center lg:justify-start mb-4 sm:mb-5">
                  <div 
                    className="w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 bg-gradient-to-br from-green-100 to-green-50 rounded-full flex items-center justify-center relative transform transition-all duration-700"
                    style={{
                      animation: 'successPulse 2s ease-in-out infinite'
                    }}
                  >
                    <div 
                      className="absolute inset-0 bg-green-200 rounded-full opacity-0"
                      style={{
                        animation: 'ripple 2s ease-out infinite'
                      }}
                    ></div>
                    <CheckCircle 
                      className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 text-green-600 relative z-10 transform transition-all duration-700"
                      style={{
                        animation: 'checkmarkDraw 0.8s ease-out 0.3s both'
                      }}
                    />
                  </div>
                </div>

                {/* Success Message */}
                <h1 
                  className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4 transform transition-all duration-500"
                  style={{
                    animation: 'fadeInUp 0.6s ease-out 0.2s both'
                  }}
                >
                  Order Placed Successfully! 🎉
                </h1>
                
                {/* Order Number */}
                <div 
                  className="mb-3 sm:mb-4 transform transition-all duration-500"
                  style={{
                    animation: 'fadeInUp 0.6s ease-out 0.3s both'
                  }}
                >
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg border border-gray-200">
                    <Receipt className="w-4 h-4 text-gray-600" />
                    <span className="text-sm font-medium text-gray-600">Order Number:</span>
                    <span className="text-sm font-bold text-gray-900">#{orderNumber}</span>
                  </div>
                </div>
                
                <p 
                  className="text-sm sm:text-base lg:text-lg text-gray-600 mb-5 sm:mb-6 transform transition-all duration-500"
                  style={{
                    animation: 'fadeInUp 0.6s ease-out 0.4s both'
                  }}
                >
                  Your order has been confirmed and will be processed shortly.
                </p>
              </div>
            </div>
              
            {/* Order Details Cards Grid */}
            <div 
              className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 transform transition-all duration-500"
              style={{
                animation: 'fadeInUp 0.6s ease-out 0.5s both'
              }}
            >
              {/* Estimated Delivery */}
              <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 sm:p-5 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-2 mb-2 sm:mb-3">
                  <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                  <span className="text-xs sm:text-sm font-semibold text-blue-900 uppercase">Estimated Delivery</span>
                </div>
                <p className="text-base sm:text-lg font-semibold text-blue-700 mb-1">
                  {estimatedDelivery.toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    month: 'short', 
                    day: 'numeric' 
                  })}
                </p>
                <p className="text-xs sm:text-sm text-blue-600">5-7 business days</p>
              </div>
              
              {/* Payment Method */}
              <div className="bg-purple-50 border-2 border-purple-200 rounded-xl p-4 sm:p-5 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-2 mb-2 sm:mb-3">
                  <Package className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
                  <span className="text-xs sm:text-sm font-semibold text-purple-900 uppercase">Payment Method</span>
                </div>
                <p className="text-base sm:text-lg font-semibold text-purple-700 mb-1">
                  {paymentMethod === 'COD' ? 'Cash on Delivery' : 'Online Payment'}
                </p>
                {paymentMethod === 'COD' && (
                  <p className="text-xs sm:text-sm text-purple-600">Pay on delivery</p>
                )}
              </div>
            </div>
              
            {/* Order Summary & Timeline - Side by Side */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5">
              {/* Order Receipt Summary */}
              {orderTotal > 0 && (
                <div 
                  className="bg-gray-50 border-2 border-gray-200 rounded-xl p-4 sm:p-5 transform transition-all duration-500"
                  style={{
                    animation: 'fadeInUp 0.6s ease-out 0.6s both'
                  }}
                >
                  <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                    <Receipt className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                    <p className="text-sm sm:text-base font-semibold text-gray-900">Order Summary</p>
                  </div>
                  <div className="space-y-2 sm:space-y-2.5 text-sm sm:text-base">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Order Total</span>
                      <span className="font-bold text-base sm:text-lg text-gray-900">₹{orderTotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Payment Method</span>
                      <span className="font-medium text-gray-900">{paymentMethod === 'COD' ? 'Cash on Delivery' : 'Online Payment'}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Order Date</span>
                      <span className="font-medium text-gray-900">{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Order Timeline */}
              <div 
                className="bg-gray-50 border-2 border-gray-200 rounded-xl p-4 sm:p-5 transform transition-all duration-500"
                style={{
                  animation: 'fadeInUp 0.6s ease-out 0.7s both'
                }}
              >
                <div className="flex items-start gap-2 sm:gap-3 mb-3 sm:mb-4">
                  <Truck className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 mt-0.5 flex-shrink-0" />
                  <p className="text-sm sm:text-base font-semibold text-gray-900">Order Timeline</p>
                </div>
                <div className="space-y-2 sm:space-y-2.5 text-xs sm:text-sm">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 bg-green-500 rounded-full flex-shrink-0"></div>
                    <span className="text-gray-600 flex-1">Order confirmed</span>
                    <span className="text-xs text-gray-400">Just now</span>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 bg-gray-300 rounded-full flex-shrink-0"></div>
                    <span className="text-gray-500 flex-1">Processing</span>
                    <span className="text-xs text-gray-400">Within 24hrs</span>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 bg-gray-300 rounded-full flex-shrink-0"></div>
                    <span className="text-gray-500 flex-1">Shipped</span>
                    <span className="text-xs text-gray-400">2-3 days</span>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 bg-gray-300 rounded-full flex-shrink-0"></div>
                    <span className="text-gray-500 flex-1">Delivered</span>
                    <span className="text-xs text-gray-400">{estimatedDelivery.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Action Buttons (1 column on desktop) */}
          <div 
            className="lg:col-span-1 transform transition-all duration-500 flex flex-col justify-center"
            style={{
              animation: 'fadeInUp 0.6s ease-out 0.8s both'
            }}
          >
            {/* Action Buttons */}
            <div className="space-y-3 sm:space-y-4">
              <button
                onClick={() => setShowInvoice(true)}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 sm:py-3.5 lg:py-4 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 font-semibold text-sm sm:text-base shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 sm:gap-3"
              >
                <FileText className="w-5 h-5 sm:w-6 sm:h-6" />
                <span>View Invoice</span>
              </button>
              <button
                onClick={handleGoToOrders}
                className="w-full bg-gradient-to-r from-black to-gray-800 text-white py-3 sm:py-3.5 lg:py-4 rounded-xl hover:from-gray-800 hover:to-black transition-all duration-300 font-semibold text-sm sm:text-base shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 sm:gap-3"
              >
                <Package className="w-5 h-5 sm:w-6 sm:h-6" />
                <span>View My Orders</span>
              </button>
              <button
                onClick={handleContinueShopping}
                className="w-full bg-white text-gray-700 py-3 sm:py-3.5 lg:py-4 rounded-xl border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50 transition-all duration-300 font-semibold text-sm sm:text-base transform hover:scale-[1.02] active:scale-[0.98]"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Invoice Modal */}
      {showInvoice && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 overflow-y-auto" onClick={() => setShowInvoice(false)}>
          <div className="bg-white rounded-lg max-w-4xl w-full my-8 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">Invoice</h2>
              <button
                onClick={() => setShowInvoice(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6">
              {order ? (
                <Invoice 
                  order={order} 
                  user={user}
                  onPrint={() => window.print()}
                />
              ) : loadingOrder ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading invoice...</p>
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-600">Order details not available</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Add CSS animations */}
      <style>{`
        @keyframes successPulse {
          0%, 100% { 
            transform: scale(1);
            box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.4);
          }
          50% { 
            transform: scale(1.05);
            box-shadow: 0 0 0 10px rgba(34, 197, 94, 0);
          }
        }
        @keyframes ripple {
          0% {
            transform: scale(1);
            opacity: 0.5;
          }
          100% {
            transform: scale(2);
            opacity: 0;
          }
        }
        @keyframes checkmarkDraw {
          0% { 
            transform: scale(0) rotate(-45deg);
            opacity: 0;
          }
          50% { 
            transform: scale(1.2) rotate(5deg);
          }
          100% { 
            transform: scale(1) rotate(0deg);
            opacity: 1;
          }
        }
        @keyframes fadeInUp {
          from { 
            opacity: 0;
            transform: translateY(20px);
          }
          to { 
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default OrderSuccess;
