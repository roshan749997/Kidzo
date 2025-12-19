import React, { useState, useContext, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { getMyAddress, saveMyAddress, deleteAddressById, createPaymentOrder, verifyPayment, createCodOrder } from '../services/api';
import ScrollToTop from '../components/ScrollToTop';

const indianStates = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
  'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
  'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
  'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
  'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Andaman and Nicobar Islands', 'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry'
].sort();

export default function AddressForm() {
  const navigate = useNavigate();
  const [showStateDropdown, setShowStateDropdown] = useState(false);
  const [filteredStates, setFilteredStates] = useState([...indianStates]);
  const [searchTerm, setSearchTerm] = useState('');
  const stateDropdownRef = useRef(null);
  const [loadingAddress, setLoadingAddress] = useState(false);
  const [saving, setSaving] = useState(false);
  const [hasSavedAddress, setHasSavedAddress] = useState(false);
  const [editMode, setEditMode] = useState(true);
  const [addressId, setAddressId] = useState(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (stateDropdownRef.current && !stateDropdownRef.current.contains(event.target)) {
        setShowStateDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (searchTerm) {
      setFilteredStates(
        indianStates.filter(state =>
          state.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    } else {
      setFilteredStates([...indianStates]);
    }
  }, [searchTerm]);

  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    pincode: '',
    locality: '',
    address: '',
    city: '',
    state: '',
    landmark: '',
    alternatePhone: '',
    addressType: 'home'
  });

  const [showSuccess, setShowSuccess] = useState(false);
  const [showForm, setShowForm] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState('online'); // 'online' or 'cod'
  const { cart, cartTotal: total, loadCart } = useCart();

  // Calculate price details
  const calculatePriceDetails = () => {
    const subtotal = total || 0;
    const shippingCharge = subtotal < 5000 ? 99 : 0;
    const tax = Math.round(subtotal * 0.05); // 5% tax
    const totalPayable = subtotal + shippingCharge + tax;
    const savings = Math.round(subtotal * 0.35); // Assuming 35% savings
    const supercoins = Math.min(30, Math.floor(subtotal / 1000) * 10); // 10 supercoins per 1000 spent, max 30

    return {
      subtotal,
      shippingCharge,
      tax,
      total: totalPayable,
      savings,
      supercoins,
      items: cart?.length || 0,
      cartItems: cart || []
    };
  };

  const priceDetails = calculatePriceDetails();

  const handlePayment = async () => {
    if (!hasSavedAddress) {
      alert('Please save your delivery address first.');
      return;
    }
    
    // Handle Cash on Delivery
    if (paymentMethod === 'cod') {
      try {
        const result = await createCodOrder();
        if (result && result.success) {
          // Store order total before clearing cart
          localStorage.setItem('lastOrderTotal', priceDetails.total.toString());
          await loadCart();
          // Redirect to order success page
          const orderId = result.order?._id || result.order?.id || '';
          navigate(`/order-success?method=COD&orderId=${orderId}`);
        } else {
          const errorMsg = result?.error || 'Failed to place COD order. Please try again.';
          alert(errorMsg);
        }
      } catch (e) {
        console.error('COD order error:', e);
        const errorMsg = e?.message || e?.response?.error || 'Failed to place COD order. Please try again.';
        alert(errorMsg);
      }
      return;
    }
    
    // Handle Online Payment
    try {
      if (!window.Razorpay) {
        await new Promise((resolve, reject) => {
          const s = document.createElement('script');
          s.src = 'https://checkout.razorpay.com/v1/checkout.js';
          s.onload = resolve;
          s.onerror = reject;
          document.body.appendChild(s);
        });
      }
      const amount = priceDetails.total;
      const { order, key } = await createPaymentOrder(amount, {
        name: formData.name,
        mobile: formData.mobile,
        city: formData.city,
      });
      const options = {
        key,
        amount: order.amount,
        currency: order.currency,
        name: 'Kidzo',
        description: 'Order Payment',
        order_id: order.id,
        prefill: { name: formData.name || '', contact: formData.mobile || '' },
        theme: { color: '#FF1493' },
        handler: async function (response) {
          try {
            console.log('[Razorpay] Payment response received:', response);
            
            // Ensure we send the correct field names
            const paymentData = {
              razorpay_order_id: response.razorpay_order_id || response.razorpayOrderId,
              razorpay_payment_id: response.razorpay_payment_id || response.razorpayPaymentId,
              razorpay_signature: response.razorpay_signature || response.razorpaySignature,
            };
            
            console.log('[Razorpay] Sending to backend:', paymentData);
            
            const r = await verifyPayment(paymentData);
            if (r && r.success) {
              // Store order total before clearing cart
              localStorage.setItem('lastOrderTotal', amount.toString());
              await loadCart();
              // Redirect to order success page
              const orderId = r.order?._id || r.order?.id || '';
              navigate(`/order-success?method=online&orderId=${orderId}`);
            } else {
              const errorMsg = r?.error || 'Payment verification failed';
              alert(errorMsg);
            }
          } catch (e) {
            console.error('[Razorpay] Payment verification error:', e);
            console.error('[Razorpay] Error details:', {
              message: e?.message,
              response: e?.response,
              stack: e?.stack,
            });
            const errorMsg = e?.message || e?.response?.error || 'Payment verification failed. Please contact support if amount was deducted.';
            alert(errorMsg);
          }
        },
      };
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (e) {
      alert('Unable to start payment');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddressTypeChange = (type) => {
    setFormData(prev => ({
      ...prev,
      addressType: type
    }));
  };

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const { latitude, longitude } = pos.coords;
      try {
        const resp = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`);
        const data = await resp.json();
        const addr = data.address || {};
        const pincode = addr.postcode || '';
        const city = addr.city || addr.town || addr.village || addr.district || '';
        const state = addr.state || '';
        const locality = addr.suburb || addr.neighbourhood || addr.quarter || '';
        const road = addr.road || addr.residential || '';
        const house = addr.house_number ? `${addr.house_number}, ` : '';
        const composed = `${house}${road}`.trim();
        setFormData((prev) => ({
          ...prev,
          pincode,
          city,
          state,
          locality: locality || prev.locality,
          address: composed || prev.address,
        }));
      } catch (e) {
        console.error('Reverse geocoding failed', e);
        alert('Could not fetch address from location');
      }
    }, (err) => {
      alert('Unable to get your location');
    }, { enableHighAccuracy: true, timeout: 10000 });
  };

  const validateForm = () => {
    const errors = [];
    
    // Required fields validation
    if (!formData.name.trim()) errors.push('Name is required');
    if (!formData.mobile.trim()) errors.push('Mobile number is required');
    if (!formData.pincode.trim()) errors.push('Pincode is required');
    if (!formData.locality.trim()) errors.push('Locality is required');
    if (!formData.address.trim()) errors.push('Address is required');
    if (!formData.city.trim()) errors.push('City is required');
    if (!formData.state.trim()) errors.push('State is required');
    
    // Format validations
    if (formData.mobile.trim() && !/^\d{10}$/.test(formData.mobile.trim())) {
      errors.push('Mobile number must be 10 digits');
    }
    
    if (formData.pincode.trim() && !/^\d{6}$/.test(formData.pincode.trim())) {
      errors.push('Pincode must be 6 digits');
    }
    
    if (formData.alternatePhone.trim() && !/^\d{10}$/.test(formData.alternatePhone.trim())) {
      errors.push('Alternate phone must be 10 digits if provided');
    }
    
    return errors;
  };

  const handleSaveAddress = async (e) => {
    e.preventDefault();
    const errors = validateForm();
    if (errors.length > 0) {
      alert('Please fix the following errors:\n\n' + errors.join('\n'));
      return;
    }
    const payload = {
      fullName: formData.name.trim(),
      mobileNumber: formData.mobile.trim(),
      pincode: formData.pincode.trim(),
      locality: formData.locality.trim(),
      address: formData.address.trim(),
      city: formData.city.trim(),
      state: formData.state.trim(),
      landmark: formData.landmark.trim(),
      alternatePhone: formData.alternatePhone.trim(),
      addressType: formData.addressType === 'work' ? 'Work' : 'Home',
    };
    try {
      setSaving(true);
      const saved = await saveMyAddress(payload);
      setHasSavedAddress(true);
      setShowSuccess(true);
      setEditMode(false);
      setShowForm(false); // Hide the form after successful save
      
      // Auto-hide success message after 3 seconds
      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
    } catch (err) {
      console.error(err);
      alert('Failed to save address. Please sign in and try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    console.log('Cancel clicked');
  };

  // Load existing address on mount
  useEffect(() => {
    const load = async () => {
      try {
        setLoadingAddress(true);
        const doc = await getMyAddress();
        if (doc && doc._id) {
          setAddressId(doc._id);
          setHasSavedAddress(true);
          setShowForm(false); // Hide form if address exists
          setEditMode(false);
          setFormData({
            name: doc.fullName || '',
            mobile: doc.mobileNumber || '',
            pincode: doc.pincode || '',
            locality: doc.locality || '',
            address: doc.address || '',
            city: doc.city || '',
            state: doc.state || '',
            landmark: doc.landmark || '',
            alternatePhone: doc.alternatePhone || '',
            addressType: (doc.addressType || 'Home').toLowerCase(),
          });
        } else {
          setShowForm(true); // Show form if no address exists
        }
      } catch (e) {
        // no-op if unauthenticated
        setShowForm(true); // Show form if there's an error
      } finally {
        setLoadingAddress(false);
      }
    };
    load();
  }, []);

  const handleEditAddress = () => {
    setShowForm(true);
    setEditMode(true);
  };

  const handleDeleteAddress = async () => {
    if (!window.confirm('Are you sure you want to delete this address?')) {
      return;
    }
    
    try {
      setLoadingAddress(true);
      await deleteAddressById(addressId);
      // Reset form and show empty form
      setFormData({
        name: '',
        mobile: '',
        pincode: '',
        locality: '',
        address: '',
        city: '',
        state: '',
        landmark: '',
        alternatePhone: '',
        addressType: 'home'
      });
      setAddressId(null);
      setHasSavedAddress(false);
      setShowForm(true);
      setEditMode(true);
    } catch (error) {
      console.error('Error deleting address:', error);
      alert('Failed to delete address. Please try again.');
    } finally {
      setLoadingAddress(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white p-4">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {showForm ? (
            <form onSubmit={handleSaveAddress} className="bg-white shadow-lg rounded-2xl border border-pink-100 overflow-hidden">
            <div className="bg-gradient-to-r from-[#FF1493] to-[#8B2BE2] text-white p-4 flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-bold">1</span>
              <span className="font-semibold text-lg">DELIVERY ADDRESS</span>
            </div>

            <div className="p-6">
              {loadingAddress && (
                <div className="mb-4 text-sm text-gray-600">Loading your saved address…</div>
              )}
              {hasSavedAddress && !editMode && (
                <div className="mb-6 border rounded p-4 bg-gray-50">
                  <div className="font-medium text-gray-900">{formData.name}</div>
                  <div className="text-sm text-gray-700">{formData.address}</div>
                  <div className="text-sm text-gray-700">{formData.locality}, {formData.city} - {formData.pincode}</div>
                  <div className="text-sm text-gray-700">{formData.state}</div>
                  <div className="text-sm text-gray-700">Mobile: {formData.mobile}</div>
                  {formData.landmark && <div className="text-sm text-gray-700">Landmark: {formData.landmark}</div>}
                  {formData.alternatePhone && <div className="text-sm text-gray-700">Alt: {formData.alternatePhone}</div>}
                  <div className="mt-4 flex gap-3">
                    <button type="button" onClick={() => setEditMode(true)} className="px-4 py-2 border-2 rounded-lg text-[#FF1493] border-[#FF1493] hover:bg-pink-50 cursor-pointer font-semibold transition-all shadow-sm hover:shadow-md">Edit Address</button>
                    <button 
                      type="button" 
                      onClick={async () => {
                        if (window.confirm('Are you sure you want to delete this address?')) {
                          try {
                            await deleteAddressById(addressId);
                            setHasSavedAddress(false);
                            setEditMode(true);
                            setFormData({
                              name: '',
                              mobile: '',
                              pincode: '',
                              locality: '',
                              address: '',
                              city: '',
                              state: '',
                              landmark: '',
                              alternatePhone: '',
                              addressType: 'home'
                            });
                            setAddressId(null);
                            alert('Address deleted successfully');
                          } catch (error) {
                            console.error('Error deleting address:', error);
                            alert(error.message || 'Failed to delete address. Please try again.');
                          }
                        }
                      }}
                      className="px-4 py-2 border-2 rounded-lg text-red-600 border-red-600 hover:bg-red-50 cursor-pointer font-semibold transition-all shadow-sm hover:shadow-md"
                    >
                      Delete Address
                    </button>
                  </div>
                </div>
              )}

              <button
                type="button"
                onClick={handleUseCurrentLocation}
                className="mb-6 bg-gradient-to-r from-[#FF1493] to-[#8B2BE2] text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:from-[#E01282] hover:to-[#7A1BD1] transition-all font-medium shadow-md hover:shadow-lg cursor-pointer"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                Use my current location
              </button>

              <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 ${hasSavedAddress && !editMode ? 'opacity-50 pointer-events-none select-none' : ''}`}>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter your full name"
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">10-digit mobile number</label>
                  <input
                    type="tel"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleInputChange}
                    maxLength={10}
                    placeholder="Enter 10-digit mobile number"
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all"
                  />
                </div>
              </div>

              <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 ${hasSavedAddress && !editMode ? 'opacity-50 pointer-events-none select-none' : ''}`}>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Pincode</label>
                  <input
                    type="text"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleInputChange}
                    maxLength={6}
                    placeholder="Enter 6-digit pincode"
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Locality</label>
                  <input
                    type="text"
                    name="locality"
                    value={formData.locality}
                    onChange={handleInputChange}
                    placeholder="Enter your locality"
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all"
                  />
                </div>
              </div>

              <div className={`${hasSavedAddress && !editMode ? 'opacity-50 pointer-events-none select-none' : ''}`}>
                <label className="block text-xs text-gray-600 mb-1">Address (Area and Street)</label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  rows={3}
                  placeholder="Enter your complete address"
                  required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all"
                />
              </div>

              <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 ${hasSavedAddress && !editMode ? 'opacity-50 pointer-events-none select-none' : ''}`}>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">City/District/Town</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder="Enter your city"
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all"
                  />
                </div>
                <div className="relative" ref={stateDropdownRef}>
                  <label className="block text-xs text-gray-600 mb-1">State</label>
                  <div 
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 bg-white cursor-pointer transition-all"
                    onClick={() => setShowStateDropdown(!showStateDropdown)}
                  >
                    {formData.state || 'Select State'}
                  </div>
                  
                  {showStateDropdown && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-xl max-h-60 overflow-y-auto">
                      <div className="p-2 border-b border-gray-200">
                        <input
                          type="text"
                          placeholder="Search state..."
                          className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>
                      <div className="max-h-48 overflow-y-auto">
                        {filteredStates.length > 0 ? (
                          filteredStates.map((state) => (
                            <div
                              key={state}
                              className={`px-4 py-2 hover:bg-pink-50 cursor-pointer transition-colors ${
                                formData.state === state ? 'bg-pink-100 text-[#FF1493] font-medium' : 'text-gray-700'
                              }`}
                              onClick={() => {
                                setFormData({ ...formData, state });
                                setShowStateDropdown(false);
                                setSearchTerm('');
                              }}
                            >
                              {state}
                            </div>
                          ))
                        ) : (
                          <div className="px-4 py-2 text-gray-500">No states found</div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 ${hasSavedAddress && !editMode ? 'opacity-50 pointer-events-none select-none' : ''}`}>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Landmark (Optional)</label>
                  <input
                    type="text"
                    name="landmark"
                    value={formData.landmark}
                    onChange={handleInputChange}
                    placeholder="E.g., Near Central Mall"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Alternate Phone (Optional)</label>
                  <input
                    type="text"
                    name="alternatePhone"
                    value={formData.alternatePhone}
                    onChange={handleInputChange}
                    maxLength={10}
                    placeholder="Alternate phone (Optional)"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all"
                  />
                </div>
              </div>

              <div className={`${hasSavedAddress && !editMode ? 'opacity-50 pointer-events-none select-none' : ''}`}>
                <label className="block text-xs text-gray-600 mb-2">Address Type</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="addressType"
                      checked={formData.addressType === 'home'}
                      onChange={() => handleAddressTypeChange('home')}
                      className="w-4 h-4"
                    />
                    <span className="text-sm">Home (All day delivery)</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="addressType"
                      checked={formData.addressType === 'work'}
                      onChange={() => handleAddressTypeChange('work')}
                      className="w-4 h-4"
                    />
                    <span className="text-sm">Work (Delivery between 10 AM - 5 PM)</span>
                  </label>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-2 w-full">
                <button
                  type="submit"
                  disabled={saving}
                  className={`bg-gradient-to-r from-[#FF1493] to-[#8B2BE2] hover:from-[#E01282] hover:to-[#7A1BD1] text-white px-8 py-3 rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl cursor-pointer w-full sm:w-auto text-center transform hover:scale-105 active:scale-95 ${saving ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {saving ? 'Saving...' : 'SAVE AND DELIVER HERE'}
                </button>
                <button
                  onClick={handleCancel}
                  className="text-black px-6 py-3 rounded-xl font-semibold transition-all cursor-pointer w-full sm:w-auto text-center border-2 border-black shadow-md hover:shadow-lg"
                  style={{ backgroundColor: '#FFD1DC' }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#FFB6C1'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = '#FFD1DC'}
                >
                  CANCEL
                </button>
              </div>

              {showSuccess && (
                <div className="bg-pink-50 border-2 border-pink-300 text-[#FF1493] px-4 py-3 rounded-lg flex items-center gap-2 font-medium mt-4">
                  <svg className="w-5 h-5 text-[#FF1493]" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Address saved successfully!
                </div>
              )}
            </div>
            </form>
          ) : (
            <div className="bg-white shadow-lg rounded-2xl border border-pink-100 overflow-hidden">
              <div className="bg-gradient-to-r from-[#FF1493] to-[#8B2BE2] text-white p-4 flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-bold">1</span>
                <span className="font-semibold text-lg">DELIVERY ADDRESS</span>
              </div>
              <div className="p-6">
                <div className="mb-4 p-4 border-2 border-pink-200 bg-pink-50 rounded-xl">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">{formData.name}</h3>
                      <p className="text-gray-700">
                        {formData.address}, {formData.locality},<br />
                        {formData.city}, {formData.state} - {formData.pincode}
                      </p>
                      <p className="mt-2">
                        <span className="font-medium">Mobile:</span> {formData.mobile}
                        {formData.alternatePhone && `, ${formData.alternatePhone}`}
                      </p>
                      {formData.landmark && (
                        <p><span className="font-medium">Landmark:</span> {formData.landmark}</p>
                      )}
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <div className="flex gap-3">
                        <button
                          type="button"
                          onClick={handleEditAddress}
                          className="text-[#FF1493] hover:text-[#E01282] text-sm font-semibold px-3 py-1.5 rounded-lg hover:bg-pink-100 transition-colors"
                        >
                          EDIT
                        </button>
                        <button
                          type="button"
                          onClick={handleDeleteAddress}
                          className="text-red-600 hover:text-red-800 text-sm font-semibold px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors"
                        >
                          DELETE
                        </button>
                      </div>
                      <div className="text-xs text-gray-500">
                        {formData.addressType.toUpperCase()} ADDRESS
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white shadow-lg rounded-2xl border border-pink-100 p-6 sticky top-4">
            <h3 className="text-gray-900 text-lg font-bold mb-6 flex items-center gap-2">
              <span className="w-1 h-6 bg-gradient-to-b from-[#FF1493] to-[#8B2BE2] rounded-full"></span>
              PRICE DETAILS
            </h3>

            <div className="space-y-3 mb-4 pb-4 border-b border-gray-200">
              <div className="flex justify-between text-sm text-gray-700">
                <span>Price ({priceDetails.items} {priceDetails.items === 1 ? 'item' : 'items'})</span>
                <span className="font-semibold">₹{priceDetails.subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-700">
                <span>Shipping</span>
                <span className={`font-semibold ${priceDetails.shippingCharge > 0 ? 'text-gray-900' : 'text-[#FF1493]'}`}>
                  {priceDetails.shippingCharge > 0 ? `₹${priceDetails.shippingCharge.toLocaleString()}` : 'Free ✓'}
                </span>
              </div>
              <div className="flex justify-between text-sm text-gray-700">
                <span>Tax (5%)</span>
                <span className="font-semibold">₹{priceDetails.tax.toLocaleString()}</span>
              </div>
            </div>

            <div className="flex justify-between font-bold text-lg mb-4 pb-4 border-b-2 border-pink-200">
              <span className="text-gray-900">Total Payable</span>
              <span className="text-[#FF1493]">₹{priceDetails.total.toLocaleString()}</span>
            </div>

            {/* Payment Method Selection */}
            {hasSavedAddress && (
              <div className="mb-4 pb-4 border-b-2 border-pink-200">
                <h4 className="text-gray-900 font-semibold mb-3 text-sm">Select Payment Method</h4>
                <div className="space-y-2">
                  <label className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                    paymentMethod === 'online' 
                      ? 'border-[#FF1493] bg-pink-50' 
                      : 'border-gray-200 hover:border-pink-200'
                  }`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="online"
                      checked={paymentMethod === 'online'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-4 h-4 text-[#FF1493] focus:ring-[#FF1493]"
                    />
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">Online Payment</div>
                      <div className="text-xs text-gray-600">Pay securely with Razorpay</div>
                    </div>
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                  </label>
                  
                  <label className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                    paymentMethod === 'cod' 
                      ? 'border-[#FF1493] bg-pink-50' 
                      : 'border-gray-200 hover:border-pink-200'
                  }`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      checked={paymentMethod === 'cod'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-4 h-4 text-[#FF1493] focus:ring-[#FF1493]"
                    />
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">Cash on Delivery</div>
                      <div className="text-xs text-gray-600">Pay when you receive your order</div>
                    </div>
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </label>
                </div>
              </div>
            )}

            <button 
              onClick={handlePayment}
              disabled={!hasSavedAddress}
              className={`w-full mt-4 py-4 px-4 rounded-xl transition-all font-bold cursor-pointer shadow-lg border-2 border-black ${
                hasSavedAddress 
                  ? 'text-black hover:shadow-xl transform hover:scale-105 active:scale-95' 
                  : 'bg-gray-300 text-gray-600 cursor-not-allowed border-gray-300'
              }`}
              style={hasSavedAddress ? { backgroundColor: '#FFD1DC' } : {}}
              onMouseEnter={(e) => {
                if (hasSavedAddress) e.target.style.backgroundColor = '#FFB6C1';
              }}
              onMouseLeave={(e) => {
                if (hasSavedAddress) e.target.style.backgroundColor = '#FFD1DC';
              }}
            >
              {paymentMethod === 'cod' ? 'PLACE ORDER (COD)' : 'PROCEED TO PAYMENT'}
            </button>
          </div>
        </div>
      </div>
      <ScrollToTop />
    </div>
  );
}