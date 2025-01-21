import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Loader2, AlertCircle, Plus, Trash2 } from 'lucide-react';
import { Modal } from './shared/Modal';

interface ModuleFormProps {
  isOpen: boolean;
  onClose: () => void;
  module?: {
    id: string;
    title: string;
    description: string;
    sequence_number: number;
    published: boolean;
    sections: {
      id: string;
      title: string;
      content: string;
      video_url?: string;
      sequence_number: number;
    }[];
  };
}

interface Section {
  id?: string;
  title: string;
  content: string;
  video_url?: string;
  sequence_number: number;
}

export function ModuleForm({ isOpen, onClose, module }: ModuleFormProps) {
  const [formData, setFormData] = useState({
    title: module?.title || '',
    description: module?.description || '',
    sequence_number: module?.sequence_number || 0,
    published: module?.published ?? false,
  });
  const [sections, setSections] = useState<Section[]>(
    module?.sections || [{ title: '', content: '', sequence_number: 0 }]
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addSection = () => {
    setSections([
      ...sections,
      {
        title: '',
        content: '',
        sequence_number: sections.length,
      }
    ]);
  };

  const removeSection = (index: number) => {
    setSections(sections.filter((_, i) => i !== index));
  };

  const updateSection = (index: number, field: keyof Section, value: string | number) => {
    setSections(sections.map((section, i) => 
      i === index ? { ...section, [field]: value } : section
    ));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (module?.id) {
        // Update existing module
        const { error: moduleError } = await supabase
          .from('modules')
          .update({
            ...formData,
            updated_at: new Date().toISOString(),
          })
          .eq('id', module.id);

        if (moduleError) throw moduleError;

        // Update sections
        for (const section of sections) {
          if (section.id) {
            const { error } = await supabase
              .from('sections')
              .update({
                title: section.title,
                content: section.content,
                video_url: section.video_url,
                sequence_number: section.sequence_number,
                updated_at: new Date().toISOString(),
              })
              .eq('id', section.id);

            if (error) throw error;
          } else {
            const { error } = await supabase
              .from('sections')
              .insert([{
                ...section,
                module_id: module.id,
              }]);

            if (error) throw error;
          }
        }
      } else {
        // Create new module
        const { data: newModule, error: moduleError } = await supabase
          .from('modules')
          .insert([formData])
          .select()
          .single();

        if (moduleError) throw moduleError;

        // Create sections
        const { error: sectionsError } = await supabase
          .from('sections')
          .insert(
            sections.map(section => ({
              ...section,
              module_id: newModule.id,
            }))
          );

        if (sectionsError) throw sectionsError;
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
      title={module ? 'Edit Module' : 'Create New Module'}
      size="xl"
    >
      <form onSubmit={handleSubmit} className="space-y-8">
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center text-red-700">
            <AlertCircle className="w-5 h-5 mr-2" />
            {error}
          </div>
        )}

        <div className="space-y-6">
          <div>
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

          <div>
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
              Sequence Number
            </label>
            <input
              type="number"
              value={formData.sequence_number}
              onChange={(e) => setFormData({ ...formData, sequence_number: parseInt(e.target.value) })}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
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
              Publish module
            </label>
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">Sections</h3>
            <button
              type="button"
              onClick={addSection}
              className="text-blue-600 hover:text-blue-700 flex items-center"
            >
              <Plus className="w-4 h-4 mr-1" />
              Add Section
            </button>
          </div>

          <div className="space-y-6">
            {sections.map((section, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-4">
                  <h4 className="text-sm font-medium text-gray-700">
                    Section {index + 1}
                  </h4>
                  <button
                    type="button"
                    onClick={() => removeSection(index)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Title
                    </label>
                    <input
                      type="text"
                      value={section.title}
                      onChange={(e) => updateSection(index, 'title', e.target.value)}
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Content
                    </label>
                    <textarea
                      value={section.content}
                      onChange={(e) => updateSection(index, 'content', e.target.value)}
                      rows={4}
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Video URL (optional)
                    </label>
                    <input
                      type="url"
                      value={section.video_url || ''}
                      onChange={(e) => updateSection(index, 'video_url', e.target.value)}
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Sequence Number
                    </label>
                    <input
                      type="number"
                      value={section.sequence_number}
                      onChange={(e) => updateSection(index, 'sequence_number', parseInt(e.target.value))}
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
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
              'Save Module'
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
}