import React, { useState, useEffect } from 'react';
import { api } from '../utils/api';
import { getMyAddress, getMyOrders } from '../services/api';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { FiSettings } from 'react-icons/fi';

export default function FlipkartAccountSettings() {
  const initialTab = (() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const tab = params.get('tab');
      return tab && ['orders', 'profile', 'addresses'].includes(tab) ? tab : 'profile';
    } catch {
      return 'profile';
    }
  })();
  const [activeSection, setActiveSection] = useState(initialTab);
  const [expandedMenu, setExpandedMenu] = useState('account');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [user, setUser] = useState({
    firstName: '',
    lastName: '',
    email: '',
    mobile: '',
    gender: 'male'
  });
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [addresses, setAddresses] = useState([]);
  const [loadingAddresses, setLoadingAddresses] = useState(false);
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const StatusBadge = ({ status }) => {
    const s = String(status || '').toLowerCase();
    const map = {
      created: 'bg-pink-100 text-pink-700 border border-pink-200',
      confirmed: 'bg-purple-100 text-purple-700 border border-purple-200',
      on_the_way: 'bg-indigo-100 text-indigo-700 border border-indigo-200',
      delivered: 'bg-emerald-100 text-emerald-700 border border-emerald-200',
      failed: 'bg-red-100 text-red-700 border border-red-200',
      paid: 'bg-pink-100 text-pink-700 border border-pink-200',
    };
    const cls = map[s] || 'bg-gray-100 text-gray-700 border border-gray-200';
    return <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${cls}`}>{status}</span>;
  };

  const fetchUserData = async () => {
    try {
      setLoading(true);
      console.log('Fetching user data...');
      const userData = await api.me();
      console.log('User data received:', userData);
      
      if (!userData || !userData.user) {
        throw new Error('No user data received');
      }
      
      // Handle name splitting - support all formats
      const fullName = userData.user?.name || '';
      const nameParts = fullName.trim().split(/\s+/);
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';
      
      // Get admin status from response or localStorage
      const adminStatus = userData.user?.isAdmin || localStorage.getItem('auth_is_admin') === 'true';
      
      console.log('Setting user data:', {
        name: fullName,
        firstName,
        lastName,
        email: userData.user?.email,
        phone: userData.user?.phone,
        provider: userData.user?.provider
      });
      
      setUser({
        firstName: firstName,
        lastName: lastName,
        email: userData.user?.email || '',
        mobile: userData.user?.phone || '',
        gender: 'male' // Default, not stored in User model
      });
      setIsAdmin(adminStatus);
    } catch (error) {
      console.error('Error fetching user data:', error);
      console.error('Error details:', {
        message: error.message,
        status: error.status,
        response: error.response
      });
      // Show error to user
      alert('Failed to load profile. Please try logging in again.');
      navigate('/signin');
    } finally {
      setLoading(false);
    }
  };

  const fetchAddresses = async () => {
    try {
      setLoadingAddresses(true);
      const addressData = await getMyAddress();
      if (addressData && addressData._id) {
        setAddresses([addressData]);
      } else {
        setAddresses([]);
      }
    } catch (error) {
      console.error('Error fetching addresses:', error);
      setAddresses([]);
    } finally {
      setLoadingAddresses(false);
    }
  };

  useEffect(() => {
    fetchUserData();
    fetchAddresses();
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tab = params.get('tab');
    if (tab && ['orders', 'profile', 'addresses'].includes(tab)) {
      setActiveSection(tab);
    }
  }, [location.search]);

  useEffect(() => {
    const load = async () => {
      try {
        setLoadingOrders(true);
        const data = await getMyOrders();
        setOrders(Array.isArray(data) ? data : []);
      } catch (e) {
        setOrders([]);
      } finally {
        setLoadingOrders(false);
      }
    };
    if (activeSection === 'orders') load();
  }, [activeSection]);

  const refreshOrders = async () => {
    try {
      setLoadingOrders(true);
      const data = await getMyOrders();
      setOrders(Array.isArray(data) ? data : []);
    } catch (e) {
      setOrders([]);
    } finally {
      setLoadingOrders(false);
    }
  };

  const toggleMenu = (menu) => {
    setExpandedMenu(expandedMenu === menu ? null : menu);
  };

  const handleLogout = async () => {
    try {
      localStorage.removeItem('auth_token');
      window.location.href = '/login';
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  const handleSectionChange = (section) => {
    setActiveSection(section);
    setMobileMenuOpen(false);
  };

  const MenuItem = ({ icon, label, section, isLogout = false, isAdmin = false }) => (
    <div 
      onClick={isLogout ? handleLogout : () => handleSectionChange(section)}
      className={`flex items-center justify-between px-4 lg:px-6 py-3.5 cursor-pointer transition-all duration-200 rounded-lg mx-2 lg:mx-3 mb-1 ${
        activeSection === section && !isLogout
          ? 'text-gray-800 shadow-md border-2 border-pink-300' 
          : isLogout
          ? 'hover:bg-red-50 text-red-600'
          : isAdmin
          ? 'bg-purple-50 text-purple-700 hover:bg-purple-100'
          : 'text-gray-700 hover:bg-pink-50'
      }`}
      style={activeSection === section && !isLogout ? { backgroundColor: '#FFD1DC' } : {}}
      onMouseEnter={(e) => {
        if (!isLogout && activeSection !== section && !isAdmin) {
          e.currentTarget.style.backgroundColor = '#FFD1DC';
        }
      }}
      onMouseLeave={(e) => {
        if (!isLogout && activeSection !== section && !isAdmin) {
          e.currentTarget.style.backgroundColor = '';
        }
      }}
    >
      <div className="flex items-center gap-3">
        {icon}
        <span className="text-sm font-medium">{label}</span>
      </div>
      {!isLogout && <span className={activeSection === section ? 'text-gray-600' : 'text-gray-400'}>›</span>}
    </div>
  );

  const AdminButton = () => (
    <Link to="/admin" className="block">
      <MenuItem
        icon={<FiSettings className="w-5 h-5" />}
        label="Admin Dashboard"
        section="admin"
        isAdmin={true}
      />
    </Link>
  );

  // Calculate statistics
  const totalOrders = orders.length;
  const totalSpent = orders.reduce((sum, order) => sum + (order.amount || 0), 0);
  const pendingOrders = orders.filter(o => ['created', 'confirmed', 'on_the_way'].includes(o.status?.toLowerCase())).length;
  const deliveredOrders = orders.filter(o => o.status?.toLowerCase() === 'delivered').length;

  return (
    <div className="min-h-screen bg-white">
      {loading ? (
        <div className="flex items-center justify-center min-h-screen">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-t-3 border-b-3 border-pink-500"></div>
            <div className="absolute inset-0 animate-ping rounded-full h-16 w-16 border-2 border-purple-500 opacity-20"></div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row w-full min-h-screen">
          {/* Mobile Header */}
          <div className="lg:hidden bg-white shadow-md px-4 py-4 flex items-center justify-between sticky z-40" style={{ top: 'var(--app-header-height, 0px)' }}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#8B2BE2] to-[#FF1493] flex items-center justify-center text-white text-lg font-bold shadow-lg">
                {(user.firstName || user.email || user.mobile || 'U').charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="text-xs text-gray-500">Hello,</div>
                <div className="font-semibold text-gray-800">{user.firstName || user.email || user.mobile || 'User'}</div>
              </div>
            </div>
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

          {/* Sidebar */}
          <div className={`
            fixed lg:static inset-0 z-40 lg:z-0
            transform ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0
            transition-transform duration-300 ease-in-out
            w-full lg:w-72 xl:w-80 bg-white shadow-xl lg:shadow-md flex-shrink-0
            overflow-y-auto
          `}>
            {/* Overlay for mobile */}
            {mobileMenuOpen && (
              <div 
                className="lg:hidden fixed inset-0 bg-black bg-opacity-50 -z-10"
                onClick={() => setMobileMenuOpen(false)}
              />
            )}

            {/* User Profile - Desktop only */}
            <div className="hidden lg:block p-6 border-b bg-gradient-to-r from-pink-50 to-purple-50">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#8B2BE2] to-[#FF1493] flex items-center justify-center text-white text-2xl font-bold shadow-lg ring-4 ring-pink-100">
                  {(user.firstName || user.email || user.mobile || 'U').charAt(0).toUpperCase()}
                </div>
                <div className="flex-1">
                  <div className="text-xs text-gray-600 font-medium">Hello,</div>
                  <div className="font-bold text-gray-800 text-lg">
                    {user.firstName || user.email || user.mobile || 'User'} {user.lastName}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">{user.email}</div>
                </div>
              </div>
            </div>

            {/* Navigation Menu */}
            <div className="py-4">
              <MenuItem 
                icon={
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20 6h-2.18c.11-.31.18-.65.18-1a2.996 2.996 0 0 0-5.5-1.65l-.5.67-.5-.68C10.96 2.54 10.05 2 9 2 7.34 2 6 3.34 6 5c0 .35.07.69.18 1H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-5-2c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zM9 4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm11 15H4v-2h16v2zm0-5H4V8h5.08L7 10.83 8.62 12 12 7.4l3.38 4.6L17 10.83 14.92 8H20v6z"/>
                  </svg>
                }
                label="MY ORDERS"
                section="orders"
              />

              <MenuItem 
                icon={
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                  </svg>
                }
                label="Profile Information"
                section="profile"
              />

              <MenuItem 
                icon={
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                  </svg>
                }
                label="Manage Addresses"
                section="addresses"
              />

              {isAdmin && <AdminButton />}

              <div className="my-4 mx-5 border-t border-gray-200"></div>

              <MenuItem 
                icon={
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/>
                  </svg>
                }
                label="Logout"
                isLogout={true}
              />
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
            <div className="max-w-5xl mx-auto">
              <div className="lg:hidden mb-4">
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => handleSectionChange('orders')}
                    className={`px-3 py-2 rounded-lg text-sm font-medium ${activeSection === 'orders' ? 'bg-gradient-to-r from-[#8B2BE2] to-[#FF1493] text-white shadow-md' : 'bg-gray-100 text-gray-700'}`}
                  >
                    Your Orders
                  </button>
                  <button
                    onClick={() => handleSectionChange('profile')}
                    className={`px-3 py-2 rounded-lg text-sm font-medium ${activeSection === 'profile' ? 'bg-gradient-to-r from-[#8B2BE2] to-[#FF1493] text-white shadow-md' : 'bg-gray-100 text-gray-700'}`}
                  >
                    Profile
                  </button>
                  <button
                    onClick={() => handleSectionChange('addresses')}
                    className={`px-3 py-2 rounded-lg text-sm font-medium ${activeSection === 'addresses' ? 'bg-gradient-to-r from-[#8B2BE2] to-[#FF1493] text-white shadow-md' : 'bg-gray-100 text-gray-700'}`}
                  >
                    Addresses
                  </button>
                </div>
              </div>
              {activeSection === 'profile' && (
                <div className="space-y-4 sm:space-y-6">
                  {/* Account Summary Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <div className="bg-gradient-to-br from-pink-50 to-pink-100 rounded-xl p-5 border border-pink-200 hover:shadow-lg transition-all duration-300">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex-1">
                          <p className="text-xs font-medium text-gray-600 mb-1">Total Orders</p>
                          <p className="text-2xl sm:text-3xl font-bold text-gray-800">{totalOrders}</p>
                          <p className="text-[10px] text-gray-500 mt-1">All time orders</p>
                        </div>
                        <div className="w-12 h-12 bg-pink-200 rounded-xl flex items-center justify-center shadow-sm">
                          <svg className="w-6 h-6 text-pink-600" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M20 6h-2.18c.11-.31.18-.65.18-1a2.996 2.996 0 0 0-5.5-1.65l-.5.67-.5-.68C10.96 2.54 10.05 2 9 2 7.34 2 6 3.34 6 5c0 .35.07.69.18 1H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2z"/>
                          </svg>
                        </div>
                      </div>
                    </div>
                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-5 border border-purple-200 hover:shadow-lg transition-all duration-300">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex-1">
                          <p className="text-xs font-medium text-gray-600 mb-1">Total Spent</p>
                          <p className="text-2xl sm:text-3xl font-bold text-gray-800">₹{totalSpent.toLocaleString()}</p>
                          <p className="text-[10px] text-gray-500 mt-1">Lifetime value</p>
                        </div>
                        <div className="w-12 h-12 bg-purple-200 rounded-xl flex items-center justify-center shadow-sm">
                          <svg className="w-6 h-6 text-purple-600" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.41 16.09V20h-2.67v-1.93c-1.71-.36-3.16-1.46-3.27-3.4h1.96c.1 1.05.82 1.87 2.65 1.87 1.96 0 2.4-.98 2.4-1.59 0-.83-.44-1.61-2.67-2.14-2.48-.6-4.18-1.62-4.18-3.67 0-1.72 1.39-2.84 3.11-3.21V4h2.67v1.95c1.86.45 2.79 1.86 2.85 3.39H14.3c-.05-1.11-.64-1.87-2.22-1.87-1.5 0-2.4.68-2.4 1.64 0 .84.65 1.39 2.67 1.91s4.18 1.39 4.18 3.91c-.01 1.83-1.38 2.83-3.12 3.16z"/>
                          </svg>
                        </div>
                      </div>
                    </div>
                    <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl p-5 border border-indigo-200 hover:shadow-lg transition-all duration-300">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex-1">
                          <p className="text-xs font-medium text-gray-600 mb-1">Pending Orders</p>
                          <p className="text-2xl sm:text-3xl font-bold text-gray-800">{pendingOrders}</p>
                          <p className="text-[10px] text-gray-500 mt-1">In progress</p>
                        </div>
                        <div className="w-12 h-12 bg-indigo-200 rounded-xl flex items-center justify-center shadow-sm">
                          <svg className="w-6 h-6 text-indigo-600" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                          </svg>
                        </div>
                      </div>
                    </div>
                    <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl p-5 border border-emerald-200 hover:shadow-lg transition-all duration-300">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex-1">
                          <p className="text-xs font-medium text-gray-600 mb-1">Delivered</p>
                          <p className="text-2xl sm:text-3xl font-bold text-gray-800">{deliveredOrders}</p>
                          <p className="text-[10px] text-gray-500 mt-1">Successfully completed</p>
                        </div>
                        <div className="w-12 h-12 bg-emerald-200 rounded-xl flex items-center justify-center shadow-sm">
                          <svg className="w-6 h-6 text-emerald-600" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Personal Information */}
                  <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden border border-gray-100">
                    <div className="p-4 sm:p-6 border-b bg-gradient-to-r from-pink-50 to-purple-50">
                      <div className="flex items-center justify-between">
                        <h2 className="text-lg sm:text-xl font-bold text-gray-800 flex items-center gap-2">
                          <svg className="w-5 h-5 sm:w-6 sm:h-6 text-pink-600" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                          </svg>
                          Personal Information
                        </h2>
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-md">Read Only</span>
                      </div>
                      <p className="text-xs text-gray-600 mt-2">Your account details are managed securely</p>
                    </div>
                    <div className="p-4 sm:p-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                        <div>
                          <label className="block text-xs font-semibold text-gray-700 mb-2 flex items-center gap-1">
                            First Name
                            <span className="text-gray-400 text-[10px]">(Required)</span>
                          </label>
                          <input 
                            type="text" 
                            value={user.firstName || 'Not provided'}
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-pink-400 transition-all"
                            readOnly
                          />
                          <p className="text-[10px] text-gray-500 mt-1">Your first name as registered</p>
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-gray-700 mb-2 flex items-center gap-1">
                            Last Name
                            <span className="text-gray-400 text-[10px]">(Optional)</span>
                          </label>
                          <input 
                            type="text" 
                            value={user.lastName || 'Not provided'}
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-pink-400 transition-all"
                            readOnly
                          />
                          <p className="text-[10px] text-gray-500 mt-1">Your last name or surname</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Email Address */}
                  <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden border border-gray-100">
                    <div className="p-4 sm:p-6 border-b bg-gradient-to-r from-pink-50 to-purple-50">
                      <h2 className="text-lg sm:text-xl font-bold text-gray-800 flex items-center gap-2">
                        <svg className="w-5 h-5 sm:w-6 sm:h-6 text-pink-600" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                        </svg>
                        Email Address
                      </h2>
                      <p className="text-xs text-gray-600 mt-1">Primary contact email for your account</p>
                    </div>
                    <div className="p-4 sm:p-6">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                        <input 
                          type="text" 
                          value={user.email || 'Not provided'}
                          className="flex-1 w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-pink-400 transition-all"
                          readOnly
                        />
                        {user.email && (
                          <div className="flex items-center gap-2 px-3 py-2 bg-green-50 border-2 border-green-200 rounded-lg">
                            <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                            </svg>
                            <span className="text-xs font-semibold text-green-700">Verified</span>
                          </div>
                        )}
                      </div>
                      <div className="mt-3 space-y-1">
                        <p className="text-xs text-gray-600 flex items-center gap-1">
                          <svg className="w-3 h-3 text-pink-500" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                          </svg>
                          Used for account login and authentication
                        </p>
                        <p className="text-xs text-gray-600 flex items-center gap-1">
                          <svg className="w-3 h-3 text-pink-500" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                          </svg>
                          Order confirmations and shipping updates
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Mobile Number */}
                  <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden border border-gray-100">
                    <div className="p-4 sm:p-6 border-b bg-gradient-to-r from-pink-50 to-purple-50">
                      <h2 className="text-lg sm:text-xl font-bold text-gray-800 flex items-center gap-2">
                        <svg className="w-5 h-5 sm:w-6 sm:h-6 text-pink-600" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M17 1.01L7 1c-1.1 0-2 .9-2 2v18c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V3c0-1.1-.9-1.99-2-1.99zM17 19H7V5h10v14z"/>
                        </svg>
                        Mobile Number
                      </h2>
                      <p className="text-xs text-gray-600 mt-1">Contact number for delivery and updates</p>
                    </div>
                    <div className="p-4 sm:p-6">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                        <input 
                          type="text" 
                          value={user.mobile || 'Not provided'}
                          className="flex-1 w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-pink-400 transition-all"
                          readOnly
                        />
                        {user.mobile ? (
                          <div className="flex items-center gap-2 px-3 py-2 bg-green-50 border-2 border-green-200 rounded-lg">
                            <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                            </svg>
                            <span className="text-xs font-semibold text-green-700">Verified</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 px-3 py-2 bg-yellow-50 border-2 border-yellow-200 rounded-lg">
                            <svg className="w-4 h-4 text-yellow-600" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                            </svg>
                            <span className="text-xs font-semibold text-yellow-700">Not Added</span>
                          </div>
                        )}
                      </div>
                      <div className="mt-3 space-y-1">
                        <p className="text-xs text-gray-600 flex items-center gap-1">
                          <svg className="w-3 h-3 text-pink-500" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M17 1.01L7 1c-1.1 0-2 .9-2 2v18c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V3c0-1.1-.9-1.99-2-1.99zM17 19H7V5h10v14z"/>
                          </svg>
                          Receive SMS updates for order status
                        </p>
                        <p className="text-xs text-gray-600 flex items-center gap-1">
                          <svg className="w-3 h-3 text-pink-500" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                          </svg>
                          Delivery partner will contact you on this number
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* FAQs */}
                  <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden border border-gray-100">
                    <div className="p-4 sm:p-6 border-b bg-gradient-to-r from-pink-50 to-purple-50">
                      <h2 className="text-lg sm:text-xl font-bold text-gray-800 flex items-center gap-2">
                        <svg className="w-5 h-5 sm:w-6 sm:h-6 text-pink-600" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M11 18h2v-2h-2v2zm1-16C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14c-2.21 0-4 1.79-4 4h2c0-1.1.9-2 2-2s2 .9 2 2c0 2-3 1.75-3 5h2c0-2.25 3-2.5 3-5 0-2.21-1.79-4-4-4z"/>
                        </svg>
                        Frequently Asked Questions
                      </h2>
                      <p className="text-xs text-gray-600 mt-1">Common questions about your account</p>
                    </div>
                    <div className="p-4 sm:p-6 space-y-4">
                      <div className="bg-gradient-to-r from-pink-50 to-rose-50 rounded-xl p-4 sm:p-5 border border-pink-100 hover:shadow-md transition-all">
                        <div className="font-bold text-gray-800 mb-2 text-sm sm:text-base flex items-start gap-2">
                          <span className="text-pink-600 mt-0.5">Q:</span>
                          <span>What happens when I update my email address or mobile number?</span>
                        </div>
                        <div className="text-xs sm:text-sm text-gray-700 leading-relaxed ml-6">
                          <span className="text-pink-600 font-semibold">A:</span> Your login credentials will change accordingly. You'll receive all account-related communications, including order confirmations and shipping updates, on your updated contact information.
                        </div>
                      </div>

                      <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-4 sm:p-5 border border-purple-100 hover:shadow-md transition-all">
                        <div className="font-bold text-gray-800 mb-2 text-sm sm:text-base flex items-start gap-2">
                          <span className="text-purple-600 mt-0.5">Q:</span>
                          <span>When will my account be updated with the new email or mobile number?</span>
                        </div>
                        <div className="text-xs sm:text-sm text-gray-700 leading-relaxed ml-6">
                          <span className="text-purple-600 font-semibold">A:</span> Your account will be updated immediately after you verify the new contact information using the verification code sent to your email or mobile number.
                        </div>
                      </div>

                      <div className="bg-gradient-to-r from-rose-50 to-pink-50 rounded-xl p-4 sm:p-5 border border-rose-100 hover:shadow-md transition-all">
                        <div className="font-bold text-gray-800 mb-2 text-sm sm:text-base flex items-start gap-2">
                          <span className="text-rose-600 mt-0.5">Q:</span>
                          <span>What happens to my existing account when I update my contact information?</span>
                        </div>
                        <div className="text-xs sm:text-sm text-gray-700 leading-relaxed ml-6">
                          <span className="text-rose-600 font-semibold">A:</span> Your account remains fully functional. All your order history, saved addresses, wishlist items, and personal details will be preserved. Only your login credentials will change.
                        </div>
                      </div>

                      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-4 sm:p-5 border border-indigo-100 hover:shadow-md transition-all">
                        <div className="font-bold text-gray-800 mb-2 text-sm sm:text-base flex items-start gap-2">
                          <span className="text-indigo-600 mt-0.5">Q:</span>
                          <span>How can I change my profile information?</span>
                        </div>
                        <div className="text-xs sm:text-sm text-gray-700 leading-relaxed ml-6">
                          <span className="text-indigo-600 font-semibold">A:</span> Currently, profile information is managed through your account settings. For security reasons, some information may require verification before changes can be made.
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeSection === 'orders' && (
                <div className="bg-white rounded-2xl shadow-sm p-6 sm:p-10">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-1">Your Orders</h2>
                      <p className="text-xs sm:text-sm text-gray-600">Track and manage all your orders in one place</p>
                    </div>
                    <button 
                      onClick={refreshOrders} 
                      className="px-4 py-2 rounded-lg text-sm sm:text-base font-semibold shadow-md hover:shadow-lg transition-all duration-300 transform active:scale-[0.98] border-2 border-black text-black"
                      style={{ backgroundColor: '#FFD1DC' }}
                      onMouseEnter={(e) => e.target.style.backgroundColor = '#FFB6C1'}
                      onMouseLeave={(e) => e.target.style.backgroundColor = '#FFD1DC'}
                    >
                      Refresh
                    </button>
                  </div>
                  {loadingOrders ? (
                    <div className="flex justify-center py-12">
                      <div className="relative">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-3 border-b-3 border-[#FF1493]"></div>
                        <div className="absolute inset-0 animate-ping rounded-full h-12 w-12 border-2 border-[#8B2BE2] opacity-20"></div>
                      </div>
                    </div>
                  ) : orders.length > 0 ? (
                    <div className="space-y-6">
                      {orders.map((order) => (
                        <div key={order._id} className="border-2 border-gray-200 rounded-xl p-4 sm:p-5 hover:border-pink-300 hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-white to-gray-50">
                          <div className="flex items-center justify-between">
                            <div className="text-sm text-gray-600">Order ID: <span className="font-mono">{String(order._id).slice(-8)}</span></div>
                            <div className="flex items-center gap-3">
                              <StatusBadge status={order.status} />
                              <div className="text-sm font-semibold text-gray-800">₹{order.amount}</div>
                            </div>
                          </div>
                          <div className="text-xs text-gray-500 mt-1 flex items-center gap-2">
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/>
                            </svg>
                            {new Date(order.createdAt).toLocaleString()}
                          </div>
                          <div className="mt-4 space-y-3">
                            {order.items?.map((it, idx) => (
                              <div key={idx} className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                <img src={it.product?.images?.image1} alt={it.product?.title || ''} className="w-14 h-14 object-cover rounded-lg border-2 border-gray-200" />
                                <div className="flex-1">
                                  <div className="text-sm font-semibold text-gray-800 mb-1">{it.product?.title || 'Product'}</div>
                                  <div className="text-xs text-gray-600 flex items-center gap-2 flex-wrap">
                                    <span className="bg-pink-100 text-pink-700 px-2 py-0.5 rounded">Qty: {it.quantity}</span>
                                    {it.size && <span className="bg-purple-100 text-purple-700 px-2 py-0.5 rounded">Size: {it.size}</span>}
                                  </div>
                                </div>
                                <div className="text-sm font-bold text-gray-800">₹{(it.price || 0) * (it.quantity || 1)}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 sm:py-16">
                      <div className="relative inline-block mb-6">
                        <svg className="w-20 h-20 sm:w-24 sm:h-24 text-gray-200" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M20 6h-2.18c.11-.31.18-.65.18-1a2.996 2.996 0 0 0-5.5-1.65l-.5.67-.5-.68C10.96 2.54 10.05 2 9 2 7.34 2 6 3.34 6 5c0 .35.07.69.18 1H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-5-2c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zM9 4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm11 15H4v-2h16v2zm0-5H4V8h5.08L7 10.83 8.62 12 12 7.4l3.38 4.6L17 10.83 14.92 8H20v6z"/>
                        </svg>
                        <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center shadow-lg">
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                        </div>
                      </div>
                      <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">No Orders Yet</h3>
                      <p className="text-gray-600 text-sm sm:text-base mb-6">You haven't placed any orders yet. Start shopping now!</p>
                      <button 
                        onClick={() => navigate('/shop')} 
                        className="px-6 sm:px-8 py-3 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all duration-300 transform active:scale-[0.98] border-2 border-black text-black text-sm sm:text-base"
                        style={{ backgroundColor: '#FFD1DC' }}
                        onMouseEnter={(e) => e.target.style.backgroundColor = '#FFB6C1'}
                        onMouseLeave={(e) => e.target.style.backgroundColor = '#FFD1DC'}
                      >
                        Start Shopping
                      </button>
                    </div>
                  )}
                </div>
              )}

              {activeSection === 'addresses' && (
                <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                    <div className="p-4 sm:p-6 border-b bg-gradient-to-r from-gray-50 to-gray-100">
                      <h2 className="text-lg sm:text-xl font-bold text-gray-800 flex items-center gap-2">
                        <svg className="w-5 h-5 sm:w-6 sm:h-6 text-pink-600" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                        </svg>
                        My Addresses
                      </h2>
                    </div>
                    <div className="p-4 sm:p-6">
                      {loadingAddresses ? (
                        <div className="flex justify-center py-12">
                          <div className="relative">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-3 border-b-3 border-teal-600"></div>
                            <div className="absolute inset-0 animate-ping rounded-full h-12 w-12 border-2 border-cyan-600 opacity-20"></div>
                          </div>
                        </div>
                    ) : addresses.length > 0 ? (
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {addresses.map((address, index) => (
                          <div key={index} className="border-2 border-gray-200 rounded-xl p-4 sm:p-5 hover:border-pink-300 hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-white to-gray-50">
                            <div className="flex justify-between items-start mb-3">
                              <h3 className="font-bold text-gray-800 text-base sm:text-lg">{address.fullName}</h3>
                              {address.isDefault && (
                                <span className="px-3 py-1 text-xs font-bold bg-gradient-to-r from-[#FF1493] to-[#8B2BE2] text-white rounded-full shadow-sm">
                                  Default
                                </span>
                              )}
                            </div>
                            <div className="space-y-1.5 text-sm text-gray-600">
                              <p className="leading-relaxed">{address.addressLine1}</p>
                              {address.addressLine2 && (
                                <p className="leading-relaxed">{address.addressLine2}</p>
                              )}
                              <p className="font-medium text-gray-700">
                                {address.city}, {address.state} - {address.pincode}
                              </p>
                              <div className="flex items-center gap-2 pt-2 mt-2 border-t border-gray-200">
                                <svg className="w-4 h-4 text-pink-600" fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M17 1.01L7 1c-1.1 0-2 .9-2 2v18c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V3c0-1.1-.9-1.99-2-1.99zM17 19H7V5h10v14z"/>
                                </svg>
                                <span className="font-medium text-gray-700">{address.phoneNumber}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 sm:py-16">
                        <div className="relative inline-block mb-6">
                          <svg className="w-20 h-20 sm:w-24 sm:h-24 text-gray-200" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                          </svg>
                          <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center shadow-lg">
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                          </div>
                        </div>
                        <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">No Addresses Saved</h3>
                        <p className="text-gray-600 text-sm sm:text-base mb-6">You haven't added any addresses yet. Add your first address to get started with faster checkout.</p>
                        <button 
                          onClick={() => window.location.href = '/address'}
                          className="px-6 sm:px-8 py-3 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all duration-300 transform active:scale-[0.98] border-2 border-black text-black text-sm sm:text-base"
                          style={{ backgroundColor: '#FFD1DC' }}
                          onMouseEnter={(e) => e.target.style.backgroundColor = '#FFB6C1'}
                          onMouseLeave={(e) => e.target.style.backgroundColor = '#FFD1DC'}
                        >
                          Add New Address
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeSection === 'wishlist' && (
                <div className="bg-white rounded-2xl shadow-sm p-6 sm:p-10">
                  <div className="text-center py-8 sm:py-16">
                    <div className="relative inline-block mb-6">
                      <svg className="w-20 h-20 sm:w-24 sm:h-24 text-gray-200" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                      </svg>
                      <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center shadow-lg">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                      </div>
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">Your Wishlist is Empty</h3>
                    <p className="text-gray-600 text-sm sm:text-base mb-6">Add items you like to your wishlist and shop later. Save your favorite products for quick access.</p>
                    <button 
                      onClick={() => navigate('/products')}
                      className="px-6 sm:px-8 py-3 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all duration-300 transform active:scale-[0.98] border-2 border-black text-black text-sm sm:text-base"
                      style={{ backgroundColor: '#FFD1DC' }}
                      onMouseEnter={(e) => e.target.style.backgroundColor = '#FFB6C1'}
                      onMouseLeave={(e) => e.target.style.backgroundColor = '#FFD1DC'}
                    >
                      Browse Products
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}