import React, { useEffect, useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import Footer from "@/components/layout/Footer";
import DesktopFooter from "@/components/desktop/DesktopFooter";
import IndexBottomNav from "@/components/layout/IndexBottomNav";
import PremiumBankingHeader from "@/components/layout/PremiumBankingHeader";
import DesktopHeader from "@/components/desktop/DesktopHeader";
import SignInScreen from "@/components/auth/SignInScreen";
import { Outlet, useLocation } from "react-router-dom";
import { supabase } from '@/integrations/supabase/client';

function MainLayoutContent() {
  const isMobile = useIsMobile();
  const location = useLocation();
  const pathname = location.pathname;
  const [showSplash, setShowSplash] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  const isHomePage = pathname === "/";
  const isMultiStepTransfer = pathname.startsWith("/multi-step-transfer");
  const isAccountPage = pathname === "/account";
  const isComponentsPage = pathname === "/components";

  // Check authentication status on mount and when auth state changes
  useEffect(() => {
    const checkAuthStatus = async () => {
      console.log('MainLayout: Checking authentication status...');
      
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          console.log('User is authenticated:', session.user);
          setIsAuthenticated(true);
          
          // Update localStorage for consistency with existing code
          localStorage.setItem('isAuthenticated', 'true');
          localStorage.setItem('authToken', session.access_token);
          localStorage.setItem('user', JSON.stringify(session.user));
        } else {
          console.log('No active session found');
          setIsAuthenticated(false);
          
          // Clear localStorage
          localStorage.removeItem('isAuthenticated');
          localStorage.removeItem('authToken');
          localStorage.removeItem('user');
        }
      } catch (error) {
        console.error('Error checking auth status:', error);
        setIsAuthenticated(false);
      } finally {
        setIsCheckingAuth(false);
      }
    };

    checkAuthStatus();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        
        if (session) {
          setIsAuthenticated(true);
          localStorage.setItem('isAuthenticated', 'true');
          localStorage.setItem('authToken', session.access_token);
          localStorage.setItem('user', JSON.stringify(session.user));
        } else {
          setIsAuthenticated(false);
          localStorage.removeItem('isAuthenticated');
          localStorage.removeItem('authToken');
          localStorage.removeItem('user');
        }
        
        setIsCheckingAuth(false);
      }
    );

    // Listen for custom auth change events (for backward compatibility)
    const handleAuthChange = () => {
      console.log('Custom auth state changed event received in MainLayout');
      setTimeout(() => {
        const localAuthStatus = localStorage.getItem('isAuthenticated');
        const localAuthToken = localStorage.getItem('authToken');
        
        if (localAuthStatus === 'true' && localAuthToken) {
          console.log('Custom auth state changed: User is now authenticated');
          setIsAuthenticated(true);
        } else {
          console.log('Custom auth state changed: User is not authenticated');
          setIsAuthenticated(false);
        }
        setIsCheckingAuth(false);
      }, 100);
    };

    window.addEventListener('authStateChanged', handleAuthChange);
    
    return () => {
      subscription.unsubscribe();
      window.removeEventListener('authStateChanged', handleAuthChange);
    };
  }, []);

  // Hide splash screen after 4 seconds
  useEffect(() => {
    const hideTimer = setTimeout(() => {
      setShowSplash(false);
    }, 4000);

    return () => clearTimeout(hideTimer);
  }, []);

  // Show loading while checking auth
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show login screen if not authenticated
  if (!isAuthenticated) {
    return <SignInScreen />;
  }

  // Calculate bottom padding based on whether we're in multi-step transfer mode
  const getBottomPadding = () => {
    if (!isMobile || isComponentsPage) return '0px';
    if (isMultiStepTransfer) return '112px'; // 64px (continue button) + 48px (nav bar)
    return '48px'; // Just nav bar
  };

  const headerHeightStyle = `
    :root {
      --header-height: 0px;
      --bottom-nav-height: ${getBottomPadding()};
    }
  `;

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <style dangerouslySetInnerHTML={{ __html: headerHeightStyle }} />

      {/* Render appropriate header based on device - hide on components page */}
      {!isComponentsPage && (isMobile ? <PremiumBankingHeader /> : <DesktopHeader />)}

      <main className={`flex-grow relative ${isMobile ? '' : 'min-h-screen'}`} style={{ paddingBottom: getBottomPadding() }}>
        <Outlet />
      </main>

      {/* Desktop footer - show for all desktop pages except components */}
      {!isMobile && !isComponentsPage && <DesktopFooter />}

      {/* Mobile bottom navigation - hide on components page */}
      {isMobile && !isComponentsPage && <IndexBottomNav />}
    </div>
  );
}

export default function MainLayout() {
  return <MainLayoutContent />;
}
