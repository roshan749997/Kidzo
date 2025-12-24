# Google OAuth Production Setup Checklist

## 🔴 Critical Environment Variables (Backend)

Set these environment variables in your production backend (e.g., Render, Railway, Heroku):

### Required Variables:
```bash
# Google OAuth Credentials (from Google Cloud Console)
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Google OAuth Callback URL (MUST match Google Cloud Console exactly)
# Example for production: https://your-backend-domain.com/api/auth/google/callback
GOOGLE_CALLBACK_URL=https://your-backend-domain.com/api/auth/google/callback

# Frontend URL (where users should be redirected after login)
FRONTEND_URL=https://your-frontend-domain.com

# Backend URL (used to construct callback URL if GOOGLE_CALLBACK_URL not set)
BACKEND_URL=https://your-backend-domain.com

# Cookie Settings (for HTTPS production)
COOKIE_SECURE=true  # Set to 'true' for HTTPS, 'false' for HTTP (development)
NODE_ENV=production

# JWT Secret (use a strong random string)
JWT_SECRET=your-strong-random-jwt-secret-key
```

### Optional Variables:
```bash
# Cookie Domain (only needed if frontend and backend are on different domains)
# Example: .yourdomain.com (note the leading dot)
COOKIE_DOMAIN=.yourdomain.com
```

## 🔴 Critical Environment Variables (Frontend)

Set these in your frontend build environment (e.g., Vercel, Netlify):

```bash
# Backend API URL (must match your production backend)
VITE_BACKEND_URL=https://your-backend-domain.com
```

## ✅ Google Cloud Console Configuration

1. **Go to Google Cloud Console**: https://console.cloud.google.com/
2. **Select your project** (or create a new one)
3. **Enable Google+ API**:
   - Navigate to "APIs & Services" > "Library"
   - Search for "Google+ API" and enable it
4. **Create OAuth 2.0 Credentials**:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth client ID"
   - Application type: "Web application"
   - **Authorized JavaScript origins**:
     ```
     https://your-backend-domain.com
     ```
   - **Authorized redirect URIs** (MUST match exactly):
     ```
     https://your-backend-domain.com/api/auth/google/callback
     ```
   - Copy the **Client ID** and **Client Secret**

## 🔍 Common Issues & Solutions

### Issue 1: "redirect_uri_mismatch" Error
**Problem**: The callback URL in Google Cloud Console doesn't match your backend.

**Solution**:
- Check `GOOGLE_CALLBACK_URL` in your backend environment variables
- Ensure it exactly matches the "Authorized redirect URIs" in Google Cloud Console
- Must include the full path: `/api/auth/google/callback`
- Must use HTTPS in production (not HTTP)

### Issue 2: Cookies Not Being Set
**Problem**: After Google login, user is redirected but not logged in.

**Solution**:
- Ensure `COOKIE_SECURE=true` for HTTPS production
- Check that `FRONTEND_URL` matches your frontend domain exactly
- Verify CORS settings in backend include your frontend URL
- Check browser console for cookie errors (may need `sameSite: 'none'` and `secure: true`)

### Issue 3: CORS Errors
**Problem**: Browser blocks requests due to CORS policy.

**Solution**:
- Ensure backend `FRONTEND_URL` includes your production frontend URL
- Check backend CORS configuration in `backend/index.js`
- Verify `credentials: 'include'` is set in frontend API calls

### Issue 4: "Google OAuth is not configured" Error
**Problem**: Missing Google credentials.

**Solution**:
- Verify `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are set
- Check backend logs for "[passport] Google OAuth Configuration" message
- Ensure environment variables are loaded correctly (check `.env` file or hosting platform settings)

## 🧪 Testing Checklist

1. **Test Google Login Flow**:
   - Click "Sign in with Google" button
   - Should redirect to Google consent screen
   - After consent, should redirect back to your app
   - Should land on `/auth/success` page
   - Should be logged in (check navbar/profile)

2. **Check Browser Console**:
   - Open DevTools > Console
   - Look for any errors related to cookies or CORS
   - Check Network tab for failed requests

3. **Check Backend Logs**:
   - Look for "[Google OAuth]" log messages
   - Verify callback URL is correct
   - Check for any authentication errors

4. **Verify Cookies**:
   - Open DevTools > Application > Cookies
   - After login, should see `jwt` cookie set
   - Cookie should have `Secure` flag if using HTTPS
   - Cookie should have `SameSite=None` if frontend/backend on different domains

## 📝 Quick Debug Commands

### Check Backend Environment Variables:
```bash
# In your backend terminal/logs, look for:
[passport] Google OAuth Configuration: { ... }
```

### Check Frontend Environment Variables:
```javascript
// In browser console:
console.log('Backend URL:', import.meta.env.VITE_BACKEND_URL);
```

### Test Backend Health:
```bash
curl https://your-backend-domain.com/api/health
```

### Test Google OAuth Endpoint:
```bash
# Should redirect to Google (don't follow redirect)
curl -I https://your-backend-domain.com/api/auth/google
```

## 🚀 Deployment Steps

1. **Set all environment variables** in your hosting platform
2. **Verify Google Cloud Console** callback URL matches exactly
3. **Redeploy backend** to pick up new environment variables
4. **Redeploy frontend** to pick up `VITE_BACKEND_URL`
5. **Test the flow** end-to-end
6. **Check logs** for any errors

## 📞 Still Having Issues?

Check backend logs for:
- `[Google OAuth]` prefixed messages
- `[passport]` prefixed messages
- `[cookieJwtAuth]` prefixed messages

These will help identify where the flow is breaking.

