import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

interface NavbarProps {
  onOpenAuth: () => void;
}

export function Navbar({ onOpenAuth }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signOut, loading } = useAuth();

  const navigation = [
    { name: 'Learning Portal', href: '/portal', requiresAuth: true },
    { name: 'Blog', href: '/blog' },
    { name: 'Workshops', href: '/workshops' },
  ];

  const handleNavigation = (item: { href?: string; requiresAuth?: boolean }) => {
    if (!item.href) return;

    if (item.requiresAuth && !user) {
      onOpenAuth();
    } else if (item.href.startsWith('#') && location.pathname === '/') {
      // Smooth scroll for anchor links on home page
      const element = document.querySelector(item.href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      navigate(item.href);
    }
    setIsOpen(false);
    setOpenDropdown(null);
  };

  const handleSignOut = async () => {
    try {
      await signOut(); // Ensure signOut is awaited properly
      setOpenDropdown(null);
  
      // Manually clear the user state to force re-render
      window.location.reload(); // This ensures UI updates correctly
    } catch (error) {
      console.error("Error during sign out:", error);
    }
  };
  

  const toggleDropdown = (id: string) => {
    setOpenDropdown(openDropdown === id ? null : id);
  };

  // Close dropdowns when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        openDropdown &&
        !(event.target as Element).closest('.dropdown-container')
      ) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [openDropdown]);

  return (
    <nav className="bg-white shadow-lg fixed w-full z-50">
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <button
            onClick={() => navigate('/')}
            className="text-xl font-bold text-blue-600"
          >
            Vision Venture
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <button
                key={item.name}
                onClick={() => handleNavigation(item)}
                className="text-gray-600 hover:text-blue-600 transition-colors"
              >
                {item.name}
              </button>
            ))}
            {user ? (
              <div className="relative dropdown-container">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleDropdown('user');
                  }}
                  disabled={loading}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center disabled:opacity-50"
                >
                  Account
                  <ChevronDown className="w-4 h-4 ml-1" />
                </button>
                {openDropdown === 'user' && (
                  <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2">
                    <button
                      onClick={handleSignOut}
                      disabled={loading}
                      className="block w-full text-left px-4 py-2 text-gray-600 hover:bg-gray-50 hover:text-blue-600 transition-colors disabled:opacity-50"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                disabled={loading}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                Sign In
              </button>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-gray-600"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4">
            <div className="flex flex-col space-y-4">
              {navigation.map((item) => (
                <button
                  key={item.name}
                  onClick={() => handleNavigation(item)}
                  className="text-gray-600 hover:text-blue-600 transition-colors"
                >
                  {item.name}
                </button>
              ))}
              {user ? (
                <button
                  onClick={handleSignOut}
                  disabled={loading}
                  className="text-gray-600 hover:text-blue-600 transition-colors disabled:opacity-50"
                >
                  Sign Out
                </button>
              ) : (
                <button
                  onClick={onOpenAuth}
                  disabled={loading}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  Sign In
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}