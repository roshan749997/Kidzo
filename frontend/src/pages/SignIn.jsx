import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { api } from '../utils/api';

const SignIn = () => {
  const [loginMode, setLoginMode] = useState('email'); // 'email' or 'mobile'
  const [step, setStep] = useState(1); // 1: Mobile input, 2: OTP input
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [resendTimer, setResendTimer] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();

  // Resend OTP timer countdown
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleMobileChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 10);
    setMobile(value);
  };

  const handleOtpChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
    setOtp(value);
  };

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const resp = await api.signin({ email: formData.email, password: formData.password });

      // Clear any existing cookies from Google/OTP login since we're using localStorage token
      // This ensures email/password login uses Authorization header, not old cookies
      try {
        document.cookie.split(";").forEach((c) => {
          document.cookie = c
            .replace(/^ +/, "")
            .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
        });
      } catch (e) {
        console.warn('Failed to clear cookies:', e);
      }

      // Store token then redirect to intended page or home
      if (resp?.token) {
        localStorage.setItem('auth_token', resp.token);
        console.log('[Email Login] Token stored in localStorage');
      }
      if (resp?.user?.isAdmin) {
        localStorage.setItem('auth_is_admin', 'true');
      } else {
        try { localStorage.removeItem('auth_is_admin'); } catch { }
      }
      const redirectTo = location.state?.from?.pathname || '/';
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(err.message || 'Failed to sign in');
    } finally {
      setLoading(false);
    }
  };

  const handleMobileLoginClick = () => {
    setLoginMode('mobile');
    setStep(1);
    setError('');
    setSuccess('');
    setMobile('');
    setOtp('');
    setResendTimer(0);
  };

  const handleBackToEmail = () => {
    setLoginMode('email');
    setStep(1);
    setError('');
    setSuccess('');
    setMobile('');
    setOtp('');
    setResendTimer(0);
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (mobile.length !== 10) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }

    setLoading(true);
    try {
      const data = await api.sendOtp(mobile);

      if (!data.success) {
        throw new Error(data?.message || 'Failed to send OTP');
      }

      setSuccess('OTP sent to your mobile number');
      setStep(2);
      setResendTimer(30);
    } catch (err) {
      setError(err.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }

    setLoading(true);
    try {
      const data = await api.verifyOtp({ mobile, otp });

      if (!data.success) {
        throw new Error(data?.message || 'Invalid OTP');
      }

      // Clear any existing cookies from Google login since OTP uses localStorage token
      try {
        document.cookie.split(";").forEach((c) => {
          document.cookie = c
            .replace(/^ +/, "")
            .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
        });
      } catch (e) {
        console.warn('Failed to clear cookies:', e);
      }

      // Store token and redirect
      if (data?.token) {
        localStorage.setItem('auth_token', data.token);
        console.log('[OTP Login] Token stored in localStorage');
      }
      if (data?.user?.isAdmin) {
        localStorage.setItem('auth_is_admin', 'true');
      } else {
        try { localStorage.removeItem('auth_is_admin'); } catch { }
      }
      const redirectTo = location.state?.from?.pathname || '/';
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(err.message || 'Invalid OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (resendTimer > 0) return;

    setError('');
    setLoading(true);
    try {
      const data = await api.sendOtp(mobile);

      if (!data.success) {
        throw new Error(data?.message || 'Failed to resend OTP');
      }

      setSuccess('OTP resent to your mobile number');
      setResendTimer(30);
      setOtp('');
    } catch (err) {
      setError(err.message || 'Failed to resend OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleChangeMobile = () => {
    setStep(1);
    setOtp('');
    setError('');
    setSuccess('');
    setResendTimer(0);
  };

  return (
    <div 
      className="h-screen w-screen flex items-center justify-end overflow-hidden relative"
      style={{
        backgroundImage: 'url(https://res.cloudinary.com/dvkxgrcbv/image/upload/v1765627597/Pink_and_Yellow_Playful_Kids_Fashion_Sale_Promotion_Landscape_Banner_1920_x_1080_px_2560_x_1440_px_1_xpoho3.svg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <div className="w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl px-3 sm:px-4 md:px-6 lg:px-8 relative z-10 max-h-[95vh] overflow-y-auto custom-scrollbar" style={{ scrollbarWidth: 'thin', scrollbarColor: '#FFD1DC transparent' }}>

            {/* Form Header */}
            <div className="text-center mb-3 sm:mb-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1 tracking-tight">
                Welcome Back
              </h2>
              <p className="text-gray-600 text-xs sm:text-sm">
                Sign in to your account
              </p>
            </div>

            {/* Sign In Form */}
            <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl p-4 sm:p-6 border border-gray-200/50 transition-all duration-300 relative">
              {error && (
                <div className="mb-2 p-2 bg-red-50 border border-red-200 rounded-lg text-xs sm:text-sm text-red-600 flex items-center gap-2 animate-shake">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  {error}
                </div>
              )}
              {success && (
                <div className="mb-2 p-2 bg-green-50 border border-green-200 rounded-lg text-xs sm:text-sm text-green-600 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  {success}
                </div>
              )}

              {loginMode === 'email' ? (
                <form onSubmit={handleEmailLogin} className="space-y-3 sm:space-y-4">
                  <div>
                    <label htmlFor="email" className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5">
                      Email Address
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                        </svg>
                      </div>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full pl-10 sm:pl-11 pr-4 py-2.5 sm:py-3 text-sm border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-pink-400 transition-all bg-gray-50 focus:bg-white"
                        placeholder="Enter your email"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="password" className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5">
                      Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                      </div>
                      <input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        className="w-full pl-10 sm:pl-11 pr-4 py-2.5 sm:py-3 text-sm border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-pink-400 transition-all bg-gray-50 focus:bg-white"
                        placeholder="Enter your password"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs sm:text-sm pt-1">
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-pink-500 focus:ring-pink-300 border-gray-300 rounded cursor-pointer"
                      />
                      <span className="ml-2 text-gray-600">Remember me</span>
                    </label>
                    <Link
                      to="/forgot-password"
                      className="text-pink-600 hover:text-pink-700 transition-colors font-medium"
                    >
                      Forgot password?
                    </Link>
                  </div>

                  <div className="pt-2 space-y-2">
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full text-black py-2.5 sm:py-3 rounded-lg font-semibold shadow-md hover:shadow-lg transition-all duration-300 disabled:opacity-60 transform active:scale-[0.98] flex items-center justify-center gap-2 border-2 border-black text-sm sm:text-base"
                      style={{ backgroundColor: '#FFD1DC' }}
                      onMouseEnter={(e) => !e.target.disabled && (e.target.style.backgroundColor = '#FFB6C1')}
                      onMouseLeave={(e) => e.target.style.backgroundColor = '#FFD1DC'}
                    >
                      {loading ? (
                        <>
                          <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Signing In...
                        </>
                      ) : (
                        <>
                          Sign In
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                          </svg>
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => navigate(location.state?.from?.pathname || '/')}
                      className="w-full border-2 border-gray-300 text-gray-700 py-2.5 sm:py-3 rounded-lg font-semibold hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 transform active:scale-[0.98] text-sm sm:text-base"
                    >
                      Continue as Guest
                    </button>
                  </div>
                </form>
              ) : step === 1 ? (
                <form onSubmit={handleSendOtp} className="space-y-3 sm:space-y-4">
                  <button
                    type="button"
                    onClick={handleBackToEmail}
                    className="text-xs sm:text-sm text-gray-600 hover:text-gray-800 transition-colors mb-2 flex items-center gap-1"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back to email login
                  </button>
                  <div>
                    <label htmlFor="mobile" className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5">
                      Mobile Number
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                      </div>
                      <input
                        type="tel"
                        id="mobile"
                        name="mobile"
                        value={mobile}
                        onChange={handleMobileChange}
                        required
                        maxLength={10}
                        className="w-full pl-10 sm:pl-11 pr-4 py-2.5 sm:py-3 text-sm border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-pink-400 transition-all bg-gray-50 focus:bg-white"
                        placeholder="Enter 10-digit mobile"
                      />
                    </div>
                  </div>

                  <div className="pt-2 space-y-2">
                    <button
                      type="submit"
                      disabled={loading || mobile.length !== 10}
                      className="w-full text-black py-2.5 sm:py-3 rounded-lg border-2 border-black font-semibold shadow-md hover:shadow-lg transition-all duration-300 disabled:opacity-60 transform active:scale-[0.98] text-sm sm:text-base"
                      style={{ backgroundColor: '#FFD1DC' }}
                      onMouseEnter={(e) => !e.target.disabled && (e.target.style.backgroundColor = '#FFB6C1')}
                      onMouseLeave={(e) => e.target.style.backgroundColor = '#FFD1DC'}
                    >
                      {loading ? 'Sending OTP...' : 'Send OTP'}
                    </button>
                    <button
                      type="button"
                      onClick={() => navigate(location.state?.from?.pathname || '/')}
                      className="w-full border-2 border-gray-300 text-gray-700 py-2.5 sm:py-3 rounded-lg font-semibold hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 transform active:scale-[0.98] text-sm sm:text-base"
                    >
                      Continue as Guest
                    </button>
                  </div>
                </form>
              ) : (
                <form onSubmit={handleVerifyOtp} className="space-y-3 sm:space-y-4">
                  <button
                    type="button"
                    onClick={handleBackToEmail}
                    className="text-xs sm:text-sm text-gray-600 hover:text-gray-800 transition-colors mb-2 flex items-center gap-1"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back to email login
                  </button>
                  <div>
                    <label htmlFor="otp" className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5">
                      Enter OTP
                    </label>
                    <div className="mb-2 text-center">
                      <p className="text-xs sm:text-sm text-gray-600">
                        OTP sent to <span className="font-semibold text-gray-900">{mobile}</span>
                      </p>
                    </div>
                    <input
                      type="text"
                      id="otp"
                      name="otp"
                      value={otp}
                      onChange={handleOtpChange}
                      required
                      maxLength={6}
                      className="w-full px-4 py-2.5 sm:py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-pink-400 transition-all text-center text-lg sm:text-xl tracking-[0.3em] sm:tracking-[0.5em] font-semibold bg-gray-50 focus:bg-white"
                      placeholder="000000"
                    />
                  </div>

                  <div className="text-center py-1">
                    {resendTimer > 0 ? (
                      <p className="text-xs sm:text-sm text-gray-600">
                        Resend OTP in {resendTimer} sec
                      </p>
                    ) : (
                      <button
                        type="button"
                        onClick={handleResendOtp}
                        disabled={loading}
                        className="text-xs sm:text-sm text-pink-600 hover:text-pink-700 transition-colors disabled:opacity-50 font-medium"
                      >
                        Resend OTP
                      </button>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={handleChangeMobile}
                    className="w-full text-xs sm:text-sm text-gray-600 hover:text-gray-800 transition-colors py-1"
                  >
                    Change mobile number
                  </button>

                  <div className="pt-2 space-y-2">
                    <button
                      type="submit"
                      disabled={loading || otp.length !== 6}
                      className="w-full text-black py-2.5 sm:py-3 rounded-lg border-2 border-black font-semibold shadow-md hover:shadow-lg transition-all duration-300 disabled:opacity-60 transform active:scale-[0.98] text-sm sm:text-base"
                      style={{ backgroundColor: '#FFD1DC' }}
                      onMouseEnter={(e) => !e.target.disabled && (e.target.style.backgroundColor = '#FFB6C1')}
                      onMouseLeave={(e) => e.target.style.backgroundColor = '#FFD1DC'}
                    >
                      {loading ? 'Verifying...' : 'Verify OTP'}
                    </button>
                    <button
                      type="button"
                      onClick={() => navigate(location.state?.from?.pathname || '/')}
                      className="w-full border-2 border-gray-300 text-gray-700 py-2.5 sm:py-3 rounded-lg font-semibold hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 transform active:scale-[0.98] text-sm sm:text-base"
                    >
                      Continue as Guest
                    </button>
                  </div>
                </form>
              )}

              {/* Divider */}
              <div className="mt-4 sm:mt-6 mb-3 sm:mb-4">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200"></div>
                  </div>
                  <div className="relative flex justify-center text-xs sm:text-sm">
                    <span className="px-3 sm:px-4 bg-white/80 text-gray-500 font-medium">Or continue with</span>
                  </div>
                </div>
              </div>

              {/* Social Login */}
              <div className="space-y-1.5 sm:space-y-2">
                <button
                  type="button"
                  onClick={() => {
                    let SERVER_BASE = import.meta.env.VITE_BACKEND_BASE || 'http://localhost:5000';
                    SERVER_BASE = SERVER_BASE.replace(/\/+$/, '');
                    window.location.href = `${SERVER_BASE}/api/auth/google`;
                  }}
                  className="flex items-center justify-center w-full px-3 sm:px-4 py-2 sm:py-2.5 border-2 border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all duration-300 transform active:scale-95 font-medium text-xs sm:text-sm"
                >
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  Sign in with Google
                </button>
                {loginMode === 'email' && (
                  <button
                    type="button"
                    onClick={handleMobileLoginClick}
                    className="flex items-center justify-center w-full px-3 sm:px-4 py-2 sm:py-2.5 border-2 border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all duration-300 transform active:scale-95 font-medium text-xs sm:text-sm"
                  >
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    Login with Mobile
                  </button>
                )}
              </div>

              {/* Sign Up Link */}
              <div className="mt-4 sm:mt-6 text-center">
                <p className="text-xs sm:text-sm text-gray-600">
                  Don't have an account?{' '}
                  <Link
                    to="/signup"
                    className="text-[#FF1493] hover:text-[#E01282] font-semibold transition-colors"
                  >
                    Sign up here
                  </Link>
                </p>
              </div>
            </div>
      </div>
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #FFD1DC;
          border-radius: 2px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #FFB6C1;
        }
      `}</style>
    </div>
  );
};

export default SignIn;