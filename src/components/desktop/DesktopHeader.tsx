
import React from 'react';
import { Globe, Search, Bell, User, Settings, History, MapPin, Route, LogOut } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from 'react-router-dom';
import LanguageSelector from '@/components/common/LanguageSelector';

const DesktopHeader: React.FC = () => {
  const navigate = useNavigate();

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const handleLogout = () => {
    console.log('Logout clicked - clearing authentication');
    localStorage.removeItem('isAuthenticated');
    window.dispatchEvent(new Event('authStateChanged'));
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center shadow-md">
                <Globe className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 tracking-tight">
                  GLOBAL TRANSFÈ
                </h1>
                <p className="text-xs text-gray-500 -mt-1">Worldwide Money Transfer</p>
              </div>
            </div>
          </div>

          {/* Navigation Menu */}
          <nav className="hidden md:flex items-center space-x-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleNavigation('/')}
              className="text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            >
              Send Money
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleNavigation('/transfer-history')}
              className="text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            >
              History
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleNavigation('/track-transfer')}
              className="text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            >
              Track
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleNavigation('/locations')}
              className="text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            >
              Locations
            </Button>
          </nav>

          {/* Search and Actions */}
          <div className="flex items-center space-x-4">
            {/* Search Bar */}
            <div className="relative hidden lg:block">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="Search transactions..."
                className="pl-10 pr-4 py-2 w-64 text-sm border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            {/* Language Selector */}
            <LanguageSelector variant="compact" />

            {/* Notifications */}
            <div className="relative">
              <Button variant="ghost" size="sm" className="relative p-2">
                <Bell className="w-5 h-5 text-gray-600" />
                <Badge 
                  variant="destructive" 
                  className="absolute -top-1 -right-1 w-5 h-5 text-xs p-0 flex items-center justify-center"
                >
                  2
                </Badge>
              </Button>
            </div>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-2 p-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-gray-600" />
                  </div>
                  <div className="hidden lg:block text-left">
                    <p className="text-sm font-medium text-gray-900">User</p>
                    <p className="text-xs text-gray-500">Premium Member</p>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => handleNavigation('/account')}>
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleNavigation('/transfer-history')}>
                  <History className="mr-2 h-4 w-4" />
                  Transaction History
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleNavigation('/track-transfer')}>
                  <Route className="mr-2 h-4 w-4" />
                  Track Transfer
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleNavigation('/locations')}>
                  <MapPin className="mr-2 h-4 w-4" />
                  Find Locations
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Quick Transfer Button */}
            <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-md">
              Quick Transfer
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DesktopHeader;
