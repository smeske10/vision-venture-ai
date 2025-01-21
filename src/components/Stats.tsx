import React from 'react';
import { Users, BookOpen, Award, Building } from 'lucide-react';

export function Stats() {
  const stats = [
    {
      icon: Users,
      value: '10,000+',
      label: 'Professionals Trained',
      color: 'text-blue-600'
    },
    {
      icon: Building,
      value: '500+',
      label: 'Enterprise Clients',
      color: 'text-green-600'
    },
    {
      icon: BookOpen,
      value: '100+',
      label: 'Courses Available',
      color: 'text-purple-600'
    },
    {
      icon: Award,
      value: '95%',
      label: 'Success Rate',
      color: 'text-orange-600'
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="flex items-center justify-center mb-4">
                <stat.icon className={`w-8 h-8 ${stat.color}`} />
              </div>
              <div className="text-center">
                <div className={`text-3xl font-bold mb-2 ${stat.color}`}>
                  {stat.value}
                </div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}