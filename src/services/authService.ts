
const BACKEND_URL = 'https://google-oauth-backend-2uta.onrender.com';

export const authService = {
  // Check if user is authenticated with the backend
  async checkAuthStatus() {
    try {
      const response = await fetch(`${BACKEND_URL}/auth/status`, {
        credentials: 'include', // Important for cookies/sessions
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('Auth status check:', data);
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

  // Logout user
  async logout() {
    try {
      const response = await fetch(`${BACKEND_URL}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        // Clear local storage
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        
        // Trigger auth state change
        window.dispatchEvent(new Event('authStateChanged'));
        
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error during logout:', error);
      return false;
    }
  }
};
