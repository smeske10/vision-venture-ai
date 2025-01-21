import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Plus, Pencil, Trash2, Search, AlertCircle, Loader2, ChevronDown, ChevronRight } from 'lucide-react';
import { useAdmin } from '../../hooks/useAdmin';
import { ModuleForm } from './ModuleForm';

interface Module {
  id: string;
  title: string;
  description: string;
  sequence_number: number;
  published: boolean;
  sections: Section[];
}

interface Section {
  id: string;
  title: string;
  content: string;
  video_url?: string;
  sequence_number: number;
}

export function ModuleManagement() {
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedModules, setExpandedModules] = useState<string[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const { isAdmin, isEditor } = useAdmin();

  useEffect(() => {
    fetchModules();
  }, []);

  async function fetchModules() {
    try {
      const { data, error } = await supabase
        .from('modules')
        .select(`
          *,
          sections (*)
        `)
        .order('sequence_number', { ascending: true });

      if (error) throw error;
      setModules(data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const toggleModule = (moduleId: string) => {
    setExpandedModules(prev =>
      prev.includes(moduleId)
        ? prev.filter(id => id !== moduleId)
        : [...prev, moduleId]
    );
  };

  const handleEdit = (module: Module) => {
    setSelectedModule(module);
    setIsFormOpen(true);
  };

  const handleDelete = async (moduleId: string) => {
    if (!isAdmin) {
      setError('Only administrators can delete modules');
      return;
    }

    if (!window.confirm('Are you sure you want to delete this module and all its sections?')) return;

    try {
      const { error } = await supabase
        .from('modules')
        .delete()
        .eq('id', moduleId);

      if (error) throw error;
      setModules(modules.filter(module => module.id !== moduleId));
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setSelectedModule(null);
    fetchModules(); // Refresh the list after form closes
  };

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
        <h1 className="text-2xl font-bold text-gray-900">Learning Modules</h1>
        <button
          onClick={() => setIsFormOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
        >
          <Plus className="w-5 h-5 mr-2" />
          New Module
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
            placeholder="Search modules..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="space-y-4">
        {modules.map((module) => (
          <div key={module.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center">
                <button
                  onClick={() => toggleModule(module.id)}
                  className="mr-2 text-gray-500 hover:text-gray-700"
                >
                  {expandedModules.includes(module.id) ? (
                    <ChevronDown className="w-5 h-5" />
                  ) : (
                    <ChevronRight className="w-5 h-5" />
                  )}
                </button>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{module.title}</h3>
                  <p className="text-sm text-gray-500">{module.description}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                  module.published
                    ? 'bg-green-100 text-green-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {module.published ? 'Published' : 'Draft'}
                </span>
                <button
                  onClick={() => handleEdit(module)}
                  className="text-blue-600 hover:text-blue-900"
                >
                  <Pencil className="w-5 h-5" />
                </button>
                {isAdmin && (
                  <button
                    onClick={() => handleDelete(module.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>

            {expandedModules.includes(module.id) && (
              <div className="border-t">
                <div className="p-4">
                  <div className="space-y-2">
                    {module.sections.map((section) => (
                      <div
                        key={section.id}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div>
                          <h5 className="text-sm font-medium text-gray-900">{section.title}</h5>
                          {section.video_url && (
                            <span className="text-xs text-gray-500">Has video content</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {isFormOpen && (
        <ModuleForm
          isOpen={isFormOpen}
          onClose={handleFormClose}
          module={selectedModule}
        />
      )}
    </div>
  );
}