import React from 'react';
import { Calendar, Users, Globe2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface WorkshopCardProps {
  title: string;
  description: string;
  date: string;
  type: 'B2B' | 'B2C';
  price: number;
  capacity: number;
  id: string;
}

export function WorkshopCard({ id, title, description, date, type, price, capacity }: WorkshopCardProps) {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold">{title}</h3>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            type === 'B2B' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'
          }`}>
            {type}
          </span>
        </div>
        <p className="text-gray-600 mb-4">{description}</p>
        <div className="space-y-2">
          <div className="flex items-center text-gray-600">
            <Calendar className="w-4 h-4 mr-2" />
            <span>{date}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <Users className="w-4 h-4 mr-2" />
            <span>Capacity: {capacity} participants</span>
          </div>
          <div className="flex items-center text-gray-600">
            <Globe2 className="w-4 h-4 mr-2" />
            <span>{type === 'B2B' ? 'In-person' : 'Online'}</span>
          </div>
        </div>
      </div>
      <div className="px-6 py-4 bg-gray-50 border-t">
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-blue-600">${price}</span>
          <button 
            onClick={() => navigate(`/workshop/${id}`)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Learn More
          </button>
        </div>
      </div>
    </div>
  );
}