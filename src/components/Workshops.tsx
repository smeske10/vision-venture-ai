import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Search, AlertCircle, Loader2 } from 'lucide-react';
import { WorkshopCard } from './WorkshopCard';
import { Navbar } from './Navbar';
import { Footer } from './Footer';

interface Workshop {
  id: string;
  title: string;
  description: string;
  date: string;
  type: 'B2B' | 'B2C';
  price: number;
  capacity: number;
}

export function Workshops() {
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    fetchWorkshops();
  }, []);

  async function fetchWorkshops() {
    try {
      setLoading(true);
      const { data, error: fetchError } = await supabase
        .from('workshops')
        .select('*')
        .eq('published', true)
        .order('date', { ascending: true });

      if (fetchError) throw fetchError;
      setWorkshops(data || []);
    } catch (err: any) {
      setError(err.message);
      console.error('Error fetching workshops:', err);
    } finally {
      setLoading(false);
    }
  }

  const filteredWorkshops = workshops.filter(workshop =>
    workshop.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    workshop.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <Navbar onOpenAuth={() => setShowAuthModal(true)} />
      <div className="min-h-screen bg-gray-50 pt-16">
        <div className="container mx-auto px-6 py-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Available Workshops</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover our range of workshops designed to help you master AI implementation
              and drive business innovation.
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-12">
            <div className="relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search workshops..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {error && (
            <div className="max-w-2xl mx-auto mb-8 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center text-red-700">
              <AlertCircle className="w-5 h-5 mr-2" />
              {error}
            </div>
          )}

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredWorkshops.map((workshop) => (
                <WorkshopCard
                  key={workshop.id}
                  id={workshop.id}
                  title={workshop.title}
                  description={workshop.description}
                  date={workshop.date}
                  type={workshop.type}
                  price={workshop.price}
                  capacity={workshop.capacity}
                />
              ))}
              {filteredWorkshops.length === 0 && (
                <div className="col-span-full text-center py-12 text-gray-500">
                  No workshops found matching your search.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}