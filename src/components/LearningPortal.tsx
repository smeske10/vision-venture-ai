import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronRight, FolderClosed, FolderOpen, FileText, Video, Download, Menu, X, Loader2, AlertCircle } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Navbar } from './Navbar';

interface Section {
  id: string;
  title: string;
  content: string;
  video_url?: string;
  sequence_number: number;
}

interface Module {
  id: string;
  title: string;
  description: string;
  sequence_number: number;
  sections: Section[];
}

export function LearningPortal() {
  const [expandedModules, setExpandedModules] = useState<string[]>([]);
  const [selectedSection, setSelectedSection] = useState<Section | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { moduleId, sectionId } = useParams();

  useEffect(() => {
    fetchModules();
  }, []);

  async function fetchModules() {
    try {
      setLoading(true);
      const { data: modulesData, error: modulesError } = await supabase
        .from('modules')
        .select(`
          *,
          sections (*)
        `)
        .eq('published', true)
        .order('sequence_number', { ascending: true });

      if (modulesError) throw modulesError;

      // Sort sections within each module
      const sortedModules = (modulesData || []).map(module => ({
        ...module,
        sections: module.sections.sort((a, b) => a.sequence_number - b.sequence_number)
      }));

      setModules(sortedModules);

      // If moduleId and sectionId are provided, expand the module and select the section
      if (moduleId) {
        setExpandedModules(prev => [...prev, moduleId]);
        if (sectionId) {
          const module = sortedModules.find(m => m.id === moduleId);
          const section = module?.sections.find(s => s.id === sectionId);
          if (section) {
            setSelectedSection(section);
          }
        }
      }
    } catch (err: any) {
      setError(err.message);
      console.error('Error fetching modules:', err);
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

  const selectSection = (section: Section) => {
    setSelectedSection(section);
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar onOpenAuth={() => setShowAuthModal(true)} />
        <div className="min-h-screen bg-gray-50 pt-16 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar onOpenAuth={() => setShowAuthModal(true)} />
      <div className="flex h-screen bg-gray-50 pt-16">
        {/* Mobile sidebar toggle */}
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="md:hidden fixed top-20 left-4 z-50 p-2 bg-white rounded-lg shadow-lg"
        >
          {isSidebarOpen ? (
            <X className="w-6 h-6 text-gray-600" />
          ) : (
            <Menu className="w-6 h-6 text-gray-600" />
          )}
        </button>

        {/* Sidebar */}
        <div
          className={`${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } transform md:translate-x-0 transition-transform duration-200 ease-in-out fixed md:static inset-y-16 left-0 w-64 bg-white border-r border-gray-200 overflow-y-auto z-40 h-[calc(100vh-4rem)]`}
        >
          <div className="p-4">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">Course Modules</h2>
            {error && (
              <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg flex items-center">
                <AlertCircle className="w-5 h-5 mr-2" />
                {error}
              </div>
            )}
            <div className="space-y-2">
              {modules.map(module => (
                <div key={module.id}>
                  <button
                    onClick={() => toggleModule(module.id)}
                    className="w-full flex items-center p-2 hover:bg-gray-50 rounded-lg text-left"
                  >
                    {expandedModules.includes(module.id) ? (
                      <>
                        <FolderOpen className="w-4 h-4 mr-2 text-blue-600" />
                        <ChevronDown className="w-4 h-4 mr-1 text-gray-400" />
                      </>
                    ) : (
                      <>
                        <FolderClosed className="w-4 h-4 mr-2 text-blue-600" />
                        <ChevronRight className="w-4 h-4 mr-1 text-gray-400" />
                      </>
                    )}
                    <span className="text-sm font-medium text-gray-700">{module.title}</span>
                  </button>
                  {expandedModules.includes(module.id) && (
                    <div className="ml-6 mt-1 space-y-1">
                      {module.sections.map(section => (
                        <button
                          key={section.id}
                          onClick={() => selectSection(section)}
                          className={`w-full flex items-center p-2 text-sm rounded-lg ${
                            selectedSection?.id === section.id
                              ? 'bg-blue-50 text-blue-700'
                              : 'text-gray-600 hover:bg-gray-50'
                          }`}
                        >
                          {section.video_url ? (
                            <Video className="w-4 h-4 mr-2" />
                          ) : (
                            <FileText className="w-4 h-4 mr-2" />
                          )}
                          {section.title}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto md:ml-0 h-[calc(100vh-4rem)]">
          {selectedSection ? (
            <div className="p-8">
              <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 mb-6">{selectedSection.title}</h1>
                
                {/* Video Section */}
                {selectedSection.video_url && (
                  <div className="mb-8 bg-black rounded-lg overflow-hidden aspect-video">
                    <video
                      className="w-full h-full"
                      controls
                      src={selectedSection.video_url}
                    />
                  </div>
                )}

                {/* Content Section */}
                <div className="prose max-w-none mb-8">
                  <div dangerouslySetInnerHTML={{ __html: selectedSection.content }} />
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center">
              <p className="text-gray-500">Select a section to begin learning</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}