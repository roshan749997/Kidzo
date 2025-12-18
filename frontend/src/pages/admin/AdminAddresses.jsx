import React, { useEffect, useState, useMemo } from 'react';
import { api } from '../../utils/api';
import { FiUser, FiMapPin, FiMail, FiPhone, FiSearch, FiHome, FiBriefcase } from 'react-icons/fi';
import ScrollToTop from '../../components/ScrollToTop';

const AdminAddresses = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await api.admin.listAddresses();
        if (mounted) setRows(Array.isArray(data) ? data : []);
      } catch (e) {
        setError(e.message || 'Failed to load addresses');
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter(a =>
      String(a.userId?.name || a.fullName || '').toLowerCase().includes(q) ||
      String(a.userId?.email || '').toLowerCase().includes(q) ||
      String(a.mobileNumber || a.alternatePhone || '').includes(q) ||
      String(a.address || '').toLowerCase().includes(q) ||
      String(a.city || '').toLowerCase().includes(q) ||
      String(a.pincode || '').includes(q)
    );
  }, [rows, query]);

  const totalPages = Math.max(1, Math.ceil((filtered.length || 0) / pageSize));
  const pageItems = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page, pageSize]);
  useEffect(() => { setPage(1); }, [query, pageSize]);

  const formatINR = (n) => `₹${Number(n || 0).toLocaleString('en-IN')}`;

  // Calculate stats
  const stats = useMemo(() => {
    const totalAddresses = rows.length;
    const homeAddresses = rows.filter(a => a.addressType?.toLowerCase() === 'home').length;
    const workAddresses = rows.filter(a => a.addressType?.toLowerCase() === 'work').length;
    const uniqueUsers = new Set(rows.map(a => a.userId?._id || a.userId?.id).filter(Boolean)).size;
    return { totalAddresses, homeAddresses, workAddresses, uniqueUsers };
  }, [rows]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="mb-6">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">User Addresses</h1>
            <p className="text-gray-600">View and manage customer delivery addresses</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-xl p-4 border-2 border-blue-200 shadow-md">
              <div className="flex items-center gap-2 mb-2">
                <FiMapPin className="h-5 w-5 text-blue-600" />
                <span className="text-xs font-semibold text-gray-600 uppercase">Total</span>
              </div>
              <div className="text-2xl font-bold text-gray-900">{stats.totalAddresses}</div>
            </div>
            <div className="bg-white rounded-xl p-4 border-2 border-green-200 shadow-md">
              <div className="flex items-center gap-2 mb-2">
                <FiHome className="h-5 w-5 text-green-600" />
                <span className="text-xs font-semibold text-gray-600 uppercase">Home</span>
              </div>
              <div className="text-2xl font-bold text-gray-900">{stats.homeAddresses}</div>
            </div>
            <div className="bg-white rounded-xl p-4 border-2 border-purple-200 shadow-md">
              <div className="flex items-center gap-2 mb-2">
                <FiBriefcase className="h-5 w-5 text-purple-600" />
                <span className="text-xs font-semibold text-gray-600 uppercase">Work</span>
              </div>
              <div className="text-2xl font-bold text-gray-900">{stats.workAddresses}</div>
            </div>
            <div className="bg-white rounded-xl p-4 border-2 border-amber-200 shadow-md">
              <div className="flex items-center gap-2 mb-2">
                <FiUser className="h-5 w-5 text-amber-600" />
                <span className="text-xs font-semibold text-gray-600 uppercase">Users</span>
              </div>
              <div className="text-2xl font-bold text-gray-900">{stats.uniqueUsers}</div>
            </div>
          </div>

          {/* Search */}
          <div className="bg-white rounded-xl p-4 border-2 border-gray-200 shadow-md mb-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search by name, email, phone, address, city, or pincode..."
                  className="w-full pl-10 pr-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
                />
              </div>
              <select
                value={pageSize}
                onChange={(e) => setPageSize(Number(e.target.value))}
                className="px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
              >
                <option value={5}>5 per page</option>
                <option value={10}>10 per page</option>
                <option value={20}>20 per page</option>
                <option value={50}>50 per page</option>
              </select>
            </div>
          </div>
        </div>

        {/* Addresses List */}
        {loading ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
              <p className="mt-4 text-gray-600 font-medium">Loading addresses...</p>
            </div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <FiMapPin className="h-6 w-6 text-red-600" />
              <h3 className="text-lg font-bold text-red-900">Error Loading Addresses</h3>
            </div>
            <p className="text-red-700">{error}</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-xl p-12 border-2 border-gray-200 shadow-md text-center">
            <FiMapPin className="h-16 w-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">No Addresses Found</h3>
            <p className="text-gray-600">Try adjusting your search query</p>
          </div>
        ) : (
          <>
            <div className="bg-white rounded-xl border-2 border-gray-200 shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <FiMapPin className="h-5 w-5" />
                    Addresses ({filtered.length})
                  </h2>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-gray-50 border-b-2 border-gray-200">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">User</th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Contact</th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Address</th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider hidden lg:table-cell">City/State</th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Pincode</th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Type</th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider hidden lg:table-cell">Created</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {pageItems.map(a => (
                      <tr key={a._id} className="hover:bg-blue-50 transition-colors">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white font-bold">
                              {(a.userId?.name || a.fullName || 'U')[0].toUpperCase()}
                            </div>
                            <div>
                              <div className="font-semibold text-gray-900">{a.userId?.name || a.fullName || 'Unknown'}</div>
                              <div className="text-xs text-gray-500 flex items-center gap-1">
                                <FiMail className="h-3 w-3" />
                                {a.userId?.email || 'N/A'}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1 text-sm text-gray-700">
                            <FiPhone className="h-4 w-4 text-gray-400" />
                            {a.mobileNumber || a.alternatePhone || 'N/A'}
                          </div>
                        </td>
                        <td className="px-4 py-3 max-w-xs">
                          <div className="text-sm text-gray-900 font-medium">{a.address || 'N/A'}</div>
                          {a.landmark && (
                            <div className="text-xs text-gray-500 mt-1">Landmark: {a.landmark}</div>
                          )}
                        </td>
                        <td className="px-4 py-3 hidden lg:table-cell">
                          <div className="text-sm text-gray-700">{a.city || 'N/A'}, {a.state || 'N/A'}</div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-semibold">
                            {a.pincode || 'N/A'}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
                            a.addressType?.toLowerCase() === 'home'
                              ? 'bg-green-100 text-green-800 border border-green-300'
                              : a.addressType?.toLowerCase() === 'work'
                              ? 'bg-purple-100 text-purple-800 border border-purple-300'
                              : 'bg-gray-100 text-gray-800 border border-gray-300'
                          }`}>
                            {a.addressType?.toLowerCase() === 'home' ? <FiHome className="w-3 h-3" /> : <FiBriefcase className="w-3 h-3" />}
                            {a.addressType || 'Other'}
                          </span>
                        </td>
                        <td className="px-4 py-3 hidden lg:table-cell text-sm text-gray-600">
                          {a.createdAt ? new Date(a.createdAt).toLocaleString() : 'N/A'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  Showing {((page - 1) * pageSize) + 1} to {Math.min(page * pageSize, filtered.length)} of {filtered.length} addresses
                </div>
                <div className="flex gap-2">
                  <button
                    disabled={page <= 1}
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    className={`px-4 py-2 rounded-lg border-2 font-semibold transition-all ${
                      page <= 1
                        ? 'text-gray-400 bg-gray-50 border-gray-200 cursor-not-allowed'
                        : 'text-gray-700 bg-white border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    Previous
                  </button>
                  <div className="px-4 py-2 bg-white border-2 border-gray-300 rounded-lg font-semibold text-gray-700">
                    Page {page} of {totalPages}
                  </div>
                  <button
                    disabled={page >= totalPages}
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    className={`px-4 py-2 rounded-lg border-2 font-semibold transition-all ${
                      page >= totalPages
                        ? 'text-gray-400 bg-gray-50 border-gray-200 cursor-not-allowed'
                        : 'text-gray-700 bg-white border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    Next
                  </button>
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

export default AdminAddresses;
