import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaTrash, FaPlus, FaMinus, FaArrowLeft, FaShoppingCart } from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import { getProductImage, placeholders } from '../utils/imagePlaceholder';

function Cart() {
  const navigate = useNavigate();
  const { 
    cart = [], 
    updateQuantity, 
    removeFromCart, 
    cartTotal = 0, 
    cartCount = 0,
    clearCart 
  } = useCart();

  console.log('Cart component rendered with:', { cart, cartTotal, cartCount }); // Debug log

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleQuantityChange = (itemId, newQuantity, size = null) => {
    if (newQuantity < 1) {
      removeFromCart(itemId, size);
    } else {
      updateQuantity(itemId, newQuantity, size);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <button 
          onClick={() => navigate('/')}
          className="flex items-center text-black mb-6 transition-all cursor-pointer border-2 border-black rounded-lg px-5 py-2.5 font-semibold shadow-sm transform hover:scale-105 active:scale-95"
          style={{ backgroundColor: '#FFD1DC' }}
          onMouseEnter={(e) => e.target.style.backgroundColor = '#FFB6C1'}
          onMouseLeave={(e) => e.target.style.backgroundColor = '#FFD1DC'}
        >
          <FaArrowLeft className="mr-2" /> Continue Shopping
        </button>

        <h1 className="text-4xl font-bold text-gray-900 mb-8 flex items-center gap-3">
          <span className="w-1 h-10 bg-gradient-to-b from-[#FF1493] to-[#8B2BE2] rounded-full"></span>
          Your Shopping Cart ({cartCount} {cartCount === 1 ? 'item' : 'items'})
        </h1>
      
      {cart.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl shadow-lg border-2 border-pink-200">
          <FaShoppingCart className="mx-auto text-6xl text-pink-300 mb-6" />
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Your cart is empty</h2>
          <p className="text-gray-600 mb-8 text-lg">Looks like you haven't added anything to your cart yet.</p>
          <button 
            onClick={() => navigate('/')}
            className="text-black px-8 py-3 rounded-xl border-2 border-black transition-all font-semibold shadow-lg transform hover:scale-105 active:scale-95 cursor-pointer"
            style={{ backgroundColor: '#FFD1DC' }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#FFB6C1'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#FFD1DC'}
          >
            Continue Shopping
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => (
              <div key={item.id} className="bg-white rounded-xl shadow-md p-5 flex items-start border-2 border-pink-100 hover:border-pink-300 transition-all hover:shadow-lg">
                <div className="w-28 h-28 flex items-center justify-center overflow-hidden rounded-lg cursor-pointer border-2 border-pink-100 hover:border-pink-400 transition-all">
                  <img
                    src={getProductImage({ images: { image1: item.image } }, 'image1') || placeholders.product}
                    alt={item.name}
                    className="min-w-full min-h-full object-contain"
                    onClick={() => navigate(`/product/${item.id}`)}
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = placeholders.product;
                    }}
                  />
                </div>
                <div className="ml-5 flex-1">
                  <h3 
                    className="text-xl font-semibold text-gray-900 cursor-pointer hover:text-[#FF1493] transition-colors mb-2"
                    onClick={() => navigate(`/product/${item.id}`)}
                  >
                    {item.name}
                  </h3>
                  {item.size && (
                    <p className="text-[#FF1493] font-semibold text-sm mb-2">Size: {item.size}</p>
                  )}
                  {(item.material || item.work) && (
                    <p className="text-gray-600 text-sm mb-3">
                      {item.material && item.work ? `${item.material} with ${item.work}` : item.material || item.work}
                    </p>
                  )}
                  
                  <div className="flex items-center mt-3">
                    <div className="flex items-center border-2 border-pink-300 rounded-lg overflow-hidden shadow-sm">
                      <button 
                        onClick={() => handleQuantityChange(item.id, (item.quantity || 1) - 1, item.size)}
                        className="px-4 py-2 bg-pink-50 text-[#FF1493] hover:bg-pink-100 font-bold cursor-pointer transition-colors"
                      >
                        <FaMinus className="w-3 h-3" />
                      </button>
                      <span className="px-5 py-2 border-x-2 border-pink-300 bg-white text-gray-900 font-semibold">{item.quantity || 1}</span>
                      <button 
                        onClick={() => handleQuantityChange(item.id, (item.quantity || 1) + 1, item.size)}
                        className="px-4 py-2 bg-pink-50 text-[#FF1493] hover:bg-pink-100 font-bold cursor-pointer transition-colors"
                      >
                        <FaPlus className="w-3 h-3" />
                      </button>
                    </div>
                    
                    <button
                      onClick={() => removeFromCart(item.id, item.size || null)}
                      className="ml-4 text-red-500 hover:text-red-700 flex items-center cursor-pointer font-medium transition-colors hover:bg-red-50 px-3 py-2 rounded-lg"
                    >
                      <FaTrash className="mr-2" /> Remove
                    </button>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className="text-2xl font-bold text-[#FF1493]">₹{(item.price * (item.quantity || 1)).toLocaleString()}</p>
                  {item.originalPrice > item.price && (
                    <p className="text-sm text-gray-500 line-through mt-1">₹{item.originalPrice.toLocaleString()}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
          
          {/* Order Summary */}
          <div className="lg:sticky lg:top-4 h-fit">
            <div className="bg-white rounded-2xl shadow-xl p-6 border-2 border-pink-200 bg-gradient-to-br from-white to-pink-50/30">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <span className="w-1 h-6 bg-gradient-to-b from-[#FF1493] to-[#8B2BE2] rounded-full"></span>
                Order Summary
              </h2>
              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center py-2 border-b border-pink-100">
                  <span className="text-gray-700 font-medium">Subtotal ({cartCount} {cartCount === 1 ? 'item' : 'items'})</span>
                  <span className="font-semibold text-gray-900">₹{cartTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-pink-100">
                  <span className="text-gray-700 font-medium">Shipping</span>
                  <span className={cartTotal >= 1000 ? "text-[#FF1493] font-bold" : "text-gray-700 font-semibold"}>
                    {cartTotal >= 1000 ? 'Free ✓' : '₹99'}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-pink-100">
                  <span className="text-gray-700 font-medium">Tax (5%)</span>
                  <span className="font-semibold text-gray-900">₹{Math.round(cartTotal * 0.05).toLocaleString()}</span>
                </div>
                <div className="border-t-2 border-pink-300 my-3"></div>
                <div className="flex justify-between items-center text-xl font-bold bg-gradient-to-r from-pink-50 to-purple-50 p-4 rounded-lg border border-pink-200">
                  <span className="text-gray-900">Total</span>
                  <span className="text-[#FF1493]">₹{(cartTotal + (cartTotal >= 1000 ? 0 : 99) + Math.round(cartTotal * 0.05)).toLocaleString()}</span>
                </div>
              </div>
              
              <button 
                onClick={() => navigate('/checkout/address')}
                className="w-full text-black py-4 px-4 rounded-xl border-2 border-black transition-all font-bold shadow-lg transform hover:scale-105 active:scale-95 cursor-pointer text-lg"
                style={{ backgroundColor: '#FFD1DC' }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#FFB6C1'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#FFD1DC'}
              >
                Proceed to Checkout
              </button>
              
              <button 
                onClick={clearCart}
                className="w-full mt-4 text-black border-2 border-black py-3 px-4 rounded-xl transition-all font-semibold cursor-pointer transform hover:scale-105 active:scale-95"
                style={{ backgroundColor: '#FFD1DC' }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#FFB6C1'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#FFD1DC'}
              >
                Clear Cart
              </button>
              
              <p className="text-xs text-gray-500 mt-6 text-center leading-relaxed">
                By placing your order, you agree to our Terms of Service and Privacy Policy.
              </p>
            </div>
            
          </div>
        </div>
      )}
      </div>
    </div>
  );
}

export default Cart;
