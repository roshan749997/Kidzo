import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../../utils/api';
import { FiCreditCard, FiShoppingBag, FiBox, FiUsers, FiTrendingUp, FiDollarSign, FiPackage, FiClock, FiCheckCircle, FiXCircle } from 'react-icons/fi';
import ScrollToTop from '../../components/ScrollToTop';

const AdminDashboard = () => {
  const [stats, setStats] = useState({ totalRevenue: 0, totalOrders: 0, totalProducts: 0 });
  const [recentOrders, setRecentOrders] = useState([]);
  const [allOrders, setAllOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const [data, orders] = await Promise.all([
          api.admin.stats(),
          api.admin.listOrders()
        ]);
        if (mounted) {
          setStats(data || { totalRevenue: 0, totalOrders: 0, totalProducts: 0 });
          const ordersList = Array.isArray(orders) ? orders : [];
          setAllOrders(ordersList);
          setRecentOrders(ordersList.slice(0, 6));
        }
      } catch (e) {
        setError(e.message || 'Failed to load dashboard');
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const formatINR = (n) => `₹${Number(n || 0).toLocaleString('en-IN')}`;

  // Calculate additional stats
  const pendingOrders = allOrders.filter(o => ['created', 'confirmed'].includes(o.status?.toLowerCase())).length;
  const deliveredOrders = allOrders.filter(o => o.status?.toLowerCase() === 'delivered').length;
  const failedOrders = allOrders.filter(o => o.status?.toLowerCase() === 'failed').length;
  const averageOrderValue = stats.totalOrders > 0 
    ? allOrders.reduce((sum, o) => sum + (o.amount || 0), 0) / stats.totalOrders 
    : 0;

  const StatusBadge = ({ status }) => {
    const s = String(status || '').toLowerCase();
    const statusConfig = {
      created: { bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-300', icon: FiClock },
      confirmed: { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-300', icon: FiCheckCircle },
      on_the_way: { bg: 'bg-purple-100', text: 'text-purple-800', border: 'border-purple-300', icon: FiPackage },
      delivered: { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-300', icon: FiCheckCircle },
      failed: { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-300', icon: FiXCircle },
      paid: { bg: 'bg-emerald-100', text: 'text-emerald-800', border: 'border-emerald-300', icon: FiCheckCircle },
    };
    const config = statusConfig[s] || { bg: 'bg-gray-100', text: 'text-gray-800', border: 'border-gray-300', icon: FiClock };
    const Icon = config.icon;
    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${config.bg} ${config.text} ${config.border} border`}>
        <Icon className="w-3 h-3" />
        {status?.replace(/_/g, ' ') || 'Unknown'}
      </span>
    );
  };

  const StatCard = ({ icon: Icon, label, value, gradient, trend, trendValue, onClick }) => (
    <div 
      onClick={onClick}
      className={`rounded-2xl p-6 shadow-lg border-2 hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1 bg-gradient-to-br ${gradient}`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-xl bg-white/80 shadow-md`}>
          <Icon className={`h-6 w-6 text-gray-700`} />
        </div>
        {trend && (
          <div className={`text-xs font-semibold px-2 py-1 rounded-full ${trend > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
          </div>
        )}
      </div>
      <div className="text-3xl font-bold text-gray-900 mb-1">{value}</div>
      <div className="text-sm font-medium text-gray-700">{label}</div>
      {trendValue && (
        <div className="mt-2 text-xs text-gray-600">vs last month</div>
      )}
    </div>
  );

  const QuickActionCard = ({ icon: Icon, title, description, link, color }) => (
    <Link 
      to={link}
      className={`block p-6 rounded-xl border-2 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 bg-white border-${color}-200 hover:border-${color}-400`}
    >
      <div className={`inline-flex p-3 rounded-lg bg-${color}-100 mb-4`}>
        <Icon className={`h-6 w-6 text-${color}-600`} />
      </div>
      <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-sm text-gray-600">{description}</p>
    </Link>
  );

  const activity = recentOrders.map(o => ({
    id: o._id,
    text: `${o.user?.name || 'Customer'} placed order #${String(o._id).slice(-6)}`,
    amount: o.amount || 0,
    time: new Date(o.createdAt).toLocaleString(),
    status: o.status
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">Dashboard Overview</h1>
              <p className="text-gray-600">Welcome back! Here's what's happening with your store today.</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link 
                to="/admin/products" 
                className="px-4 py-2 bg-gradient-to-r from-pink-600 to-rose-600 text-white rounded-lg font-semibold shadow-md hover:shadow-lg transition-all transform hover:scale-105"
              >
                Manage Products
              </Link>
              <Link 
                to="/admin/orders" 
                className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg font-semibold shadow-md hover:shadow-lg transition-all transform hover:scale-105"
              >
                View Orders
              </Link>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-pink-600 border-t-transparent"></div>
              <p className="mt-4 text-gray-600 font-medium">Loading dashboard data...</p>
            </div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <FiXCircle className="h-6 w-6 text-red-600" />
              <h3 className="text-lg font-bold text-red-900">Error Loading Dashboard</h3>
            </div>
            <p className="text-red-700">{error}</p>
          </div>
        ) : (
          <>
            {/* Main Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
              <StatCard 
                icon={FiDollarSign} 
                label="Total Revenue" 
                value={formatINR(stats.totalRevenue)} 
                gradient="from-emerald-50 to-green-100"
                onClick={() => navigate('/admin/orders?status=paid')}
              />
              <StatCard 
                icon={FiShoppingBag} 
                label="Total Orders" 
                value={stats.totalOrders} 
                gradient="from-blue-50 to-indigo-100"
                onClick={() => navigate('/admin/orders')}
              />
              <StatCard 
                icon={FiBox} 
                label="Total Products" 
                value={stats.totalProducts} 
                gradient="from-purple-50 to-pink-100"
                onClick={() => navigate('/admin/products')}
              />
              <StatCard 
                icon={FiTrendingUp} 
                label="Avg Order Value" 
                value={formatINR(averageOrderValue)} 
                gradient="from-amber-50 to-orange-100"
              />
            </div>

            {/* Secondary Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6 sm:mb-8">
              <div className="bg-white rounded-xl p-4 border-2 border-yellow-200 shadow-md">
                <div className="flex items-center gap-2 mb-2">
                  <FiClock className="h-5 w-5 text-yellow-600" />
                  <span className="text-xs font-semibold text-gray-600 uppercase">Pending</span>
                </div>
                <div className="text-2xl font-bold text-gray-900">{pendingOrders}</div>
              </div>
              <div className="bg-white rounded-xl p-4 border-2 border-green-200 shadow-md">
                <div className="flex items-center gap-2 mb-2">
                  <FiCheckCircle className="h-5 w-5 text-green-600" />
                  <span className="text-xs font-semibold text-gray-600 uppercase">Delivered</span>
                </div>
                <div className="text-2xl font-bold text-gray-900">{deliveredOrders}</div>
              </div>
              <div className="bg-white rounded-xl p-4 border-2 border-red-200 shadow-md">
                <div className="flex items-center gap-2 mb-2">
                  <FiXCircle className="h-5 w-5 text-red-600" />
                  <span className="text-xs font-semibold text-gray-600 uppercase">Failed</span>
                </div>
                <div className="text-2xl font-bold text-gray-900">{failedOrders}</div>
              </div>
              <div className="bg-white rounded-xl p-4 border-2 border-blue-200 shadow-md">
                <div className="flex items-center gap-2 mb-2">
                  <FiUsers className="h-5 w-5 text-blue-600" />
                  <span className="text-xs font-semibold text-gray-600 uppercase">Customers</span>
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  {new Set(allOrders.map(o => o.user?._id || o.user?.id).filter(Boolean)).size}
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="mb-6 sm:mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <QuickActionCard 
                  icon={FiBox}
                  title="Add Product"
                  description="Create a new product listing"
                  link="/admin/products"
                  color="pink"
                />
                <QuickActionCard 
                  icon={FiShoppingBag}
                  title="View Orders"
                  description="Manage customer orders"
                  link="/admin/orders"
                  color="amber"
                />
                <QuickActionCard 
                  icon={FiUsers}
                  title="User Addresses"
                  description="View customer addresses"
                  link="/admin/addresses"
                  color="blue"
                />
                <QuickActionCard 
                  icon={FiTrendingUp}
                  title="Analytics"
                  description="View detailed analytics"
                  link="/admin"
                  color="purple"
                />
              </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Recent Orders */}
              <div className="lg:col-span-2 bg-white border-2 border-gray-200 rounded-2xl shadow-lg overflow-hidden">
                <div className="bg-gradient-to-r from-pink-600 to-rose-600 px-6 py-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                      <FiShoppingBag className="h-5 w-5" />
                      Recent Orders
                    </h2>
                    <Link 
                      to="/admin/orders"
                      className="text-white text-sm font-semibold hover:underline"
                    >
                      View All →
                    </Link>
                  </div>
                </div>
                <div className="divide-y">
                  {recentOrders.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">
                      <FiShoppingBag className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                      <p>No recent orders</p>
                    </div>
                  ) : (
                    recentOrders.map(o => (
                      <div 
                        key={o._id} 
                        className="p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                        onClick={() => navigate(`/admin/orders`)}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-bold text-gray-900">#{String(o._id).slice(-6)}</span>
                              <StatusBadge status={o.status} />
                            </div>
                            <div className="text-sm text-gray-700 font-medium">{o.user?.name || 'Customer'}</div>
                            <div className="text-xs text-gray-500">{o.user?.email || ''}</div>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold text-gray-900">{formatINR(o.amount)}</div>
                            <div className="text-xs text-gray-500">{o.items?.length || 0} items</div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100">
                          <div className="text-xs text-gray-500 flex items-center gap-1">
                            <FiClock className="h-3 w-3" />
                            {new Date(o.createdAt).toLocaleString()}
                          </div>
                          <div className="text-xs font-semibold text-gray-700">
                            {o.razorpayPaymentId ? 'Paid' : 'Pending Payment'}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Activity Feed & Summary */}
              <div className="space-y-6">
                {/* Activity Feed */}
                <div className="bg-white border-2 border-gray-200 rounded-2xl shadow-lg overflow-hidden">
                  <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                      <FiClock className="h-5 w-5" />
                      Activity Feed
                    </h2>
                  </div>
                  <div className="p-4 max-h-[400px] overflow-y-auto">
                    {activity.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <FiClock className="h-10 w-10 mx-auto mb-2 text-gray-300" />
                        <p className="text-sm">No recent activity</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {activity.map((a, idx) => (
                          <div key={a.id} className="flex items-start gap-3 pb-4 border-b border-gray-100 last:border-0">
                            <div className="mt-1">
                              <div className={`w-2 h-2 rounded-full ${
                                idx === 0 ? 'bg-green-500' : 
                                idx === 1 ? 'bg-blue-500' : 
                                'bg-gray-400'
                              }`}></div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-medium text-gray-900">{a.text}</div>
                              <div className="text-xs text-gray-500 mt-1">{a.time}</div>
                              <div className="text-xs font-semibold text-green-600 mt-1">{formatINR(a.amount)}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Order Status Summary */}
                <div className="bg-white border-2 border-gray-200 rounded-2xl shadow-lg overflow-hidden">
                  <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-4">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                      <FiTrendingUp className="h-5 w-5" />
                      Order Summary
                    </h2>
                  </div>
                  <div className="p-4 space-y-3">
                    <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                      <div className="flex items-center gap-2">
                        <FiClock className="h-4 w-4 text-yellow-600" />
                        <span className="text-sm font-medium text-gray-700">Pending</span>
                      </div>
                      <span className="text-lg font-bold text-gray-900">{pendingOrders}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                      <div className="flex items-center gap-2">
                        <FiCheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-sm font-medium text-gray-700">Delivered</span>
                      </div>
                      <span className="text-lg font-bold text-gray-900">{deliveredOrders}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
                      <div className="flex items-center gap-2">
                        <FiXCircle className="h-4 w-4 text-red-600" />
                        <span className="text-sm font-medium text-gray-700">Failed</span>
                      </div>
                      <span className="text-lg font-bold text-gray-900">{failedOrders}</span>
                    </div>
                    <div className="pt-3 border-t border-gray-200">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-gray-700">Total Orders</span>
                        <span className="text-xl font-bold text-gray-900">{stats.totalOrders}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
      <ScrollToTop />
    </div>
  );
};

export default AdminDashboard;
