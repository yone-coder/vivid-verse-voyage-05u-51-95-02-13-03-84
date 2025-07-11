
import { createBrowserRouter } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import MobileMultiStepTransferSheetPage from "@/pages/MobileMultiStepTransferSheetPage";
import DesktopMultiStepTransferPage from "@/components/desktop/DesktopMultiStepTransferPage";
import DeviceRouter from "@/components/common/DeviceRouter";
import TransferHistoryPage from "@/pages/TransferHistoryPage";
import TrackTransferPage from "@/pages/TrackTransferPage";
import LocationsPage from "@/pages/LocationsPage";
import AccountPage from "@/pages/AccountPage";
import ComponentsPage from "@/pages/ComponentsPage";
import HelloPage from "@/pages/HelloPage";
import NotFound from "@/components/NotFound";
import SignInScreen from "@/components/auth/SignInScreen";
import OAuthCallback from "@/components/auth/OAuthCallback";
import DashboardCallback from "@/components/auth/DashboardCallback";
import AuthSuccessCallback from "@/components/auth/AuthSuccessCallback";
import AuthErrorCallback from "@/components/auth/AuthErrorCallback";
import AuthCallback from "@/components/auth/AuthCallback";

// Component that renders the appropriate transfer page based on device
const TransferPageRouter = () => (
  <DeviceRouter
    mobileComponent={MobileMultiStepTransferSheetPage}
    desktopComponent={DesktopMultiStepTransferPage}
  />
);

export const router = createBrowserRouter([
  {
    path: "/signin",
    element: <SignInScreen />
  },
  {
    path: "/auth/callback",
    element: <AuthCallback />
  },
  {
    path: "/auth/success",
    element: <AuthSuccessCallback />
  },
  {
    path: "/auth/error",
    element: <AuthErrorCallback />
  },
  {
    path: "/dashboard",
    element: <DashboardCallback />
  },
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { 
        index: true, 
        element: <TransferPageRouter />
      },
      { 
        path: "transfer", 
        element: <TransferPageRouter />
      },
      { 
        path: "transfer-sheet", 
        element: <TransferPageRouter />
      },
      { 
        path: "transfer-history", 
        element: <TransferHistoryPage />
      },
      { 
        path: "track-transfer", 
        element: <TrackTransferPage />
      },
      { 
        path: "locations", 
        element: <LocationsPage />
      },
      { 
        path: "account", 
        element: <AccountPage />
      },
      { 
        path: "components", 
        element: <ComponentsPage />
      },
      { 
        path: "hello", 
        element: <HelloPage />
      },
      { path: "*", element: <NotFound /> },
    ],
  },
]);
