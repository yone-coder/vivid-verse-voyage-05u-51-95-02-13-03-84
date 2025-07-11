
const BACKEND_URL = 'https://google-oauth-backend-2uta.onrender.com';

export const authService = {
  // Check if user is authenticated with the backend using HTTP-only cookies
  async checkAuthStatus() {
    try {
      const response = await fetch(`${BACKEND_URL}/auth/status`, {
        credentials: 'include', // ✅ Critical: Send HTTP-only cookies
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('Auth status check (cookie-based):', data);
        return data;
      } else {
        console.log('Auth status check failed:', response.status);
        return { authenticated: false };
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
      return { authenticated: false };
    }
  },

  // Logout user - backend will clear the HTTP-only cookie
  async logout() {
    try {
      const response = await fetch(`${BACKEND_URL}/auth/logout`, {
        method: 'POST',
        credentials: 'include', // ✅ Send cookies so backend can clear them
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        // Clear any local storage (but session token remains in HTTP-only cookie until backend clears it)
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        
        // Trigger auth state change
        window.dispatchEvent(new Event('authStateChanged'));
        
        console.log('Logout successful - HTTP-only cookie cleared by backend');
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error during logout:', error);
      return false;
    }
  },

  // Sign in with HTTP-only cookies
  async signIn(email: string, password: string) {
    try {
      const response = await fetch(`${BACKEND_URL}/auth/signin`, {
        method: 'POST',
        credentials: 'include', // ✅ Allow cookies to be set
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Backend should set: Set-Cookie: token=abc123; HttpOnly; Secure; SameSite=Strict
        console.log('Sign in successful - session cookie set by backend');
        
        // Update local state for immediate UI feedback
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('user', JSON.stringify(data.user || { email }));
        
        return { success: true, user: data.user };
      } else {
        return { success: false, error: data.message || 'Authentication failed' };
      }
    } catch (error) {
      console.error('Error during sign in:', error);
      return { success: false, error: 'Network error occurred' };
    }
  }
};
