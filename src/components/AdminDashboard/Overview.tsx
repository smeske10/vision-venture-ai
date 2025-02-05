import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Users, BookOpen, FileText, Calendar } from 'lucide-react';

interface RecentUser {
  email: string;
  created_at: string;
}

export function Overview() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeCourses: 0,
    blogPosts: 0,
    workshops: 0,
  });

  const [recentActivity, setRecentActivity] = useState<RecentUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
    fetchRecentActivity();
  }, []);

  async function fetchStats() {
    try {
      setLoading(true);

      const { count: totalUsers, error: userError } = await supabase
        .from('auth.users')
        .select('*', { count: 'exact', head: true });

      const { count: activeCourses, error: courseError } = await supabase
        .from('courses')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'active');

      const { count: blogPosts, error: blogError } = await supabase
        .from('blog_posts')
        .select('*', { count: 'exact', head: true });

      const { count: workshops, error: workshopError } = await supabase
        .from('workshops')
        .select('*', { count: 'exact', head: true });

      if (userError || courseError || blogError || workshopError) {
        console.error('Error fetching stats:', userError, courseError, blogError, workshopError);
      }

      setStats({
        totalUsers: totalUsers || 0,
        activeCourses: activeCourses || 0,
        blogPosts: blogPosts || 0,
        workshops: workshops || 0,
      });

    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  }

  async function fetchRecentActivity() {
    try {
      const { data, error } = await supabase
        .from('auth.users')
        .select('email, created_at')
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) throw error;

      // Ensure TypeScript recognizes the correct type
      const formattedData: RecentUser[] = data.map((user) => ({
        email: user.email,
        created_at: user.created_at,
      }));

      setRecentActivity(formattedData);
    } catch (error) {
      console.error('Error fetching recent activity:', error);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Dashboard Overview</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          { name: 'Total Users', value: stats.totalUsers, icon: Users, color: 'bg-blue-500' },
          { name: 'Active Courses', value: stats.activeCourses, icon: BookOpen, color: 'bg-green-500' },
          { name: 'Blog Posts', value: stats.blogPosts, icon: FileText, color: 'bg-purple-500' },
          { name: 'Workshops', value: stats.workshops, icon: Calendar, color: 'bg-orange-500' },
        ].map((stat) => (
          <div key={stat.name} className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity Section */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent User Activity</h2>
        <div className="space-y-4">
          {recentActivity.map((user) => (
            <div key={user.email} className="flex items-center text-sm">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                <Users className="w-4 h-4 text-blue-600" />
              </div>
              <div className="ml-3">
                <p className="text-gray-900">{user.email}</p>
                <p className="text-gray-500">{new Date(user.created_at).toLocaleDateString()}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
