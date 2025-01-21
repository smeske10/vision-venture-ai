import React from 'react';
import { useNavigate, Outlet, useLocation } from 'react-router-dom';
import { LayoutDashboard, BookOpen, Calendar, FileEdit, Users, Settings } from 'lucide-react';
import { Navbar } from '../Navbar';
import { useAuth } from '../../hooks/useAuth';

const ADMIN_NAVIGATION = [
  { name: 'Overview', href: '/admin', icon: LayoutDashboard },
  { name: 'Blog Posts', href: '/admin/blog', icon: FileEdit },
  { name: 'Learning Modules', href: '/admin/modules', icon: BookOpen },
  { name: 'Workshops', href: '/admin/workshops', icon: Calendar },
  { name: 'Users', href: '/admin/users', icon: Users },
  { name: 'Settings', href: '/admin/settings', icon: Settings },
];

export function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [showAuthModal, setShowAuthModal] = React.useState(false);

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Access Denied</h2>
          <p className="text-gray-600 mb-4">Please sign in to access the admin dashboard.</p>
          <button
            onClick={() => setShowAuthModal(true)}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Navbar onOpenAuth={() => setShowAuthModal(true)} />
      <div className="min-h-screen bg-gray-50 pt-16">
        <div className="flex">
          {/* Sidebar */}
          <div className="w-64 bg-white h-[calc(100vh-4rem)] border-r border-gray-200 fixed">
            <nav className="p-4 space-y-1">
              {ADMIN_NAVIGATION.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <button
                    key={item.name}
                    onClick={() => navigate(item.href)}
                    className={`w-full flex items-center px-4 py-2 text-sm font-medium rounded-lg ${
                      isActive
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <item.icon className="w-5 h-5 mr-3" />
                    {item.name}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1 ml-64">
            <div className="p-8">
              <Outlet />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}