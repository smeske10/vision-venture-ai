import React from 'react';
import { Users, BookOpen, FileText, Calendar } from 'lucide-react';

const stats = [
  { name: 'Total Users', value: '1,234', icon: Users, color: 'bg-blue-500' },
  { name: 'Active Courses', value: '12', icon: BookOpen, color: 'bg-green-500' },
  { name: 'Blog Posts', value: '48', icon: FileText, color: 'bg-purple-500' },
  { name: 'Workshops', value: '8', icon: Calendar, color: 'bg-orange-500' },
];

export function Overview() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Dashboard Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
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

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
        <div className="space-y-4">
          <div className="flex items-center text-sm">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
              <Users className="w-4 h-4 text-blue-600" />
            </div>
            <div className="ml-3">
              <p className="text-gray-900">New user registration</p>
              <p className="text-gray-500">2 minutes ago</p>
            </div>
          </div>
          <div className="flex items-center text-sm">
            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
              <FileText className="w-4 h-4 text-green-600" />
            </div>
            <div className="ml-3">
              <p className="text-gray-900">New blog post published</p>
              <p className="text-gray-500">1 hour ago</p>
            </div>
          </div>
          <div className="flex items-center text-sm">
            <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
              <Calendar className="w-4 h-4 text-purple-600" />
            </div>
            <div className="ml-3">
              <p className="text-gray-900">Workshop scheduled</p>
              <p className="text-gray-500">3 hours ago</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}