import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Loader2, AlertCircle, Plus, Trash2 } from 'lucide-react';
import { Modal } from './shared/Modal';

interface WorkshopFormProps {
  isOpen: boolean;
  onClose: () => void;
  workshop?: {
    id: string;
    title: string;
    description: string;
    date: string;
    type: 'B2B' | 'B2C';
    price: number;
    capacity: number;
    published: boolean;
    benefits: string[];
    agenda: {
      time: string;
      topic: string;
      description: string;
    }[];
    instructor: {
      name: string;
      role: string;
      bio: string;
      image: string;
    };
  };
}

export function WorkshopForm({ isOpen, onClose, workshop }: WorkshopFormProps) {
  const [formData, setFormData] = useState({
    title: workshop?.title || '',
    description: workshop?.description || '',
    date: workshop?.date ? new Date(workshop.date).toISOString().split('T')[0] : '',
    type: workshop?.type || 'B2B',
    price: workshop?.price || 0,
    capacity: workshop?.capacity || 20,
    published: workshop?.published ?? false,
    instructor: workshop?.instructor || {
      name: '',
      role: '',
      bio: '',
      image: '',
    },
  });

  const [benefits, setBenefits] = useState<string[]>(
    workshop?.benefits || ['']
  );

  const [agenda, setAgenda] = useState<{ time: string; topic: string; description: string }[]>(
    workshop?.agenda || [{ time: '', topic: '', description: '' }]
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addBenefit = () => {
    setBenefits([...benefits, '']);
  };

  const removeBenefit = (index: number) => {
    setBenefits(benefits.filter((_, i) => i !== index));
  };

  const updateBenefit = (index: number, value: string) => {
    setBenefits(benefits.map((benefit, i) => i === index ? value : benefit));
  };

  const addAgendaItem = () => {
    setAgenda([...agenda, { time: '', topic: '', description: '' }]);
  };

  const removeAgendaItem = (index: number) => {
    setAgenda(agenda.filter((_, i) => i !== index));
  };

  const updateAgendaItem = (index: number, field: keyof typeof agenda[0], value: string) => {
    setAgenda(agenda.map((item, i) => 
      i === index ? { ...item, [field]: value } : item
    ));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const workshopData = {
        ...formData,
        benefits,
        agenda,
        updated_at: new Date().toISOString(),
      };

      if (workshop?.id) {
        const { error } = await supabase
          .from('workshops')
          .update(workshopData)
          .eq('id', workshop.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('workshops')
          .insert([workshopData]);

        if (error) throw error;
      }

      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={workshop ? 'Edit Workshop' : 'Create New Workshop'}
      size="xl"
    >
      <form onSubmit={handleSubmit} className="space-y-8">
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center text-red-700">
            <AlertCircle className="w-5 h-5 mr-2" />
            {error}
          </div>
        )}

        {/* Basic Information */}
        <div className="grid grid-cols-2 gap-6">
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date
            </label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Type
            </label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as 'B2B' | 'B2C' })}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="B2B">B2B</option>
              <option value="B2C">B2C</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Price ($)
            </label>
            <input
              type="number"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) })}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Capacity
            </label>
            <input
              type="number"
              value={formData.capacity}
              onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) })}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
        </div>

        {/* Instructor Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">Instructor</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                type="text"
                value={formData.instructor.name}
                onChange={(e) => setFormData({
                  ...formData,
                  instructor: { ...formData.instructor, name: e.target.value }
                })}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Role
              </label>
              <input
                type="text"
                value={formData.instructor.role}
                onChange={(e) => setFormData({
                  ...formData,
                  instructor: { ...formData.instructor, role: e.target.value }
                })}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bio
              </label>
              <textarea
                value={formData.instructor.bio}
                onChange={(e) => setFormData({
                  ...formData,
                  instructor: { ...formData.instructor, bio: e.target.value }
                })}
                rows={3}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Image URL
              </label>
              <input
                type="url"
                value={formData.instructor.image}
                onChange={(e) => setFormData({
                  ...formData,
                  instructor: { ...formData.instructor, image: e.target.value }
                })}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
          </div>
        </div>

        {/* Benefits */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">Benefits</h3>
            <button
              type="button"
              onClick={addBenefit}
              className="text-blue-600 hover:text-blue-700 flex items-center"
            >
              <Plus className="w-4 h-4 mr-1" />
              Add Benefit
            </button>
          </div>
          <div className="space-y-2">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-center gap-2">
                <input
                  type="text"
                  value={benefit}
                  onChange={(e) => updateBenefit(index, e.target.value)}
                  className="flex-1 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter a benefit"
                  required
                />
                <button
                  type="button"
                  onClick={() => removeBenefit(index)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Agenda */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">Agenda</h3>
            <button
              type="button"
              onClick={addAgendaItem}
              className="text-blue-600 hover:text-blue-700 flex items-center"
            >
              <Plus className="w-4 h-4 mr-1" />
              Add Agenda Item
            </button>
          </div>
          <div className="space-y-4">
            {agenda.map((item, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-4">
                  <h4 className="text-sm font-medium text-gray-700">
                    Agenda Item {index + 1}
                  </h4>
                  <button
                    type="button"
                    onClick={() => removeAgendaItem(index)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Time
                    </label>
                    <input
                      type="text"
                      value={item.time}
                      onChange={(e) => updateAgendaItem(index, 'time', e.target.value)}
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., 9:00 AM"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Topic
                    </label>
                    <input
                      type="text"
                      value={item.topic}
                      onChange={(e) => updateAgendaItem(index, 'topic', e.target.value)}
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      value={item.description}
                      onChange={(e) => updateAgendaItem(index, 'description', e.target.value)}
                      rows={2}
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="published"
            checked={formData.published}
            onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="published" className="ml-2 text-sm text-gray-700">
            Publish workshop
          </label>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-gray-700 hover:text-gray-900"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              'Save Workshop'
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
}