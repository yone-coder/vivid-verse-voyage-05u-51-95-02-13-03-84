
import React, { useEffect, useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import Footer from "@/components/layout/Footer";
import DesktopFooter from "@/components/desktop/DesktopFooter";
import IndexBottomNav from "@/components/layout/IndexBottomNav";
import PremiumBankingHeader from "@/components/layout/PremiumBankingHeader";
import DesktopHeader from "@/components/desktop/DesktopHeader";
import SignInScreen from "@/components/auth/SignInScreen";
import { Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

function MainLayoutContent() {
  const isMobile = useIsMobile();
  const location = useLocation();
  const pathname = location.pathname;
  const [showSplash, setShowSplash] = useState(true);
  const { isAuthenticated, isLoading } = useAuth();

  const isHomePage = pathname === "/";
  const isMultiStepTransfer = pathname === "/" || pathname === "/transfer" || pathname === "/transfer-sheet";
  const isAccountPage = pathname === "/account";
  const isComponentsPage = pathname === "/components";

  // Hide splash screen after 4 seconds
  useEffect(() => {
    const hideTimer = setTimeout(() => {
      setShowSplash(false);
    }, 4000);

    return () => clearTimeout(hideTimer);
  }, []);

  // Show loading while checking auth
  if (isLoading) {
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

      {/* Header removed per user request */}

      <main className={`flex-grow relative ${isMobile ? '' : 'min-h-screen'}`} style={{ paddingBottom: getBottomPadding() }}>
        <Outlet />
      </main>

      {/* Desktop footer - show for all desktop pages except components */}
      {!isMobile && !isComponentsPage && <DesktopFooter />}

      {/* Mobile bottom navigation - hide on components page and multi-step transfer page */}
      {isMobile && !isComponentsPage && !isMultiStepTransfer && <IndexBottomNav />}
    </div>
  );
}

export default function MainLayout() {
  return <MainLayoutContent />;
}

