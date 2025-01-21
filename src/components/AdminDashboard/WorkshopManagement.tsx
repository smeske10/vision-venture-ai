import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Plus, Pencil, Trash2, Search, AlertCircle, Loader2, Calendar, Users } from 'lucide-react';
import { useAdmin } from '../../hooks/useAdmin';
import { WorkshopForm } from './WorkshopForm';

interface Workshop {
  id: string;
  title: string;
  description: string;
  date: string;
  type: 'B2B' | 'B2C';
  price: number;
  capacity: number;
  registrations_count: number;
  published: boolean;
}

export function WorkshopManagement() {
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedWorkshop, setSelectedWorkshop] = useState<Workshop | null>(null);
  const { isAdmin, isEditor } = useAdmin();

  useEffect(() => {
    fetchWorkshops();
  }, []);

  async function fetchWorkshops() {
    try {
      // Get workshops data
      const { data: workshopsData, error: workshopsError } = await supabase
        .from('workshops')
        .select('*')
        .order('date', { ascending: true });

      if (workshopsError) throw workshopsError;

      // Get registration counts using a raw count query
      const { data: registrationsData, error: registrationsError } = await supabase
        .rpc('get_workshop_registrations_count');

      if (registrationsError) throw registrationsError;

      // Create a map of workshop_id to registration count
      const registrationCounts = new Map(
        registrationsData.map((reg: { workshop_id: string; count: number }) => [reg.workshop_id, reg.count])
      );

      // Combine workshop data with registration counts
      const workshopsWithCounts = workshopsData.map(workshop => ({
        ...workshop,
        registrations_count: registrationCounts.get(workshop.id) || 0
      }));

      setWorkshops(workshopsWithCounts);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const handleEdit = (workshop: Workshop) => {
    setSelectedWorkshop(workshop);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!isAdmin) {
      setError('Only administrators can delete workshops');
      return;
    }

    if (!window.confirm('Are you sure you want to delete this workshop?')) return;

    try {
      const { error } = await supabase
        .from('workshops')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setWorkshops(workshops.filter(workshop => workshop.id !== id));
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setSelectedWorkshop(null);
    fetchWorkshops(); // Refresh the list after form closes
  };

  const filteredWorkshops = workshops.filter(workshop =>
    workshop.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    workshop.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Workshops</h1>
        <button
          onClick={() => setIsFormOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
        >
          <Plus className="w-5 h-5 mr-2" />
          New Workshop
        </button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center text-red-700">
          <AlertCircle className="w-5 h-5 mr-2" />
          {error}
        </div>
      )}

      <div className="mb-6">
        <div className="relative">
          <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search workshops..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {filteredWorkshops.map((workshop) => (
          <div key={workshop.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{workshop.title}</h3>
                  <p className="text-sm text-gray-500 mt-1">{workshop.description}</p>
                </div>
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                  workshop.type === 'B2B'
                    ? 'bg-purple-100 text-purple-800'
                    : 'bg-green-100 text-green-800'
                }`}>
                  {workshop.type}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="w-4 h-4 mr-2" />
                  {new Date(workshop.date).toLocaleDateString()}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Users className="w-4 h-4 mr-2" />
                  {workshop.registrations_count}/{workshop.capacity} registered
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold text-blue-600">
                  ${workshop.price}
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleEdit(workshop)}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    <Pencil className="w-5 h-5" />
                  </button>
                  {isAdmin && (
                    <button
                      onClick={() => handleDelete(workshop.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isFormOpen && (
        <WorkshopForm
          isOpen={isFormOpen}
          onClose={handleFormClose}
          workshop={selectedWorkshop}
        />
      )}
    </div>
  );
}