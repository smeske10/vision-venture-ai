import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { supabase } from './lib/supabase';
import { Brain, Target, Lightbulb, GraduationCap, BookOpen, Users, BarChart, ArrowRight } from 'lucide-react';
import { WorkshopCard } from './components/WorkshopCard';
import { WorkshopDetails } from './components/WorkshopDetails';
import { AuthModal } from './components/AuthModal';
import { LearningPortal } from './components/LearningPortal';
import { BlogSection } from './components/BlogSection';
import { BlogPost } from './components/BlogPost';
import { BlogEditor } from './components/BlogEditor';
import { ContactForm } from './components/ContactForm';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Features } from './components/Features';
import { Stats } from './components/Stats';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AnalyticsProvider } from './lib/analytics';
import { useAuth } from './hooks/useAuth';
import { AdminLayout } from './components/AdminDashboard/AdminLayout';
import { Overview } from './components/AdminDashboard/Overview';
import { BlogManagement } from './components/AdminDashboard/BlogManagement';
import { ModuleManagement } from './components/AdminDashboard/ModuleManagement';
import { WorkshopManagement } from './components/AdminDashboard/WorkshopManagement';
import { UserManagement } from './components/AdminDashboard/UserManagement';
import { Settings } from './components/AdminDashboard/Settings';
import { Workshops } from './components/Workshops'

interface Workshop {
  id: string;
  title: string;
  description: string;
  date: string;
  type: 'B2B' | 'B2C';
  price: number;
  capacity: number;
}

function LandingPage() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [redirectAfterAuth, setRedirectAfterAuth] = useState<string | null>(null);
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if there's a saved redirect path
    const savedRedirect = sessionStorage.getItem('redirectTo');
    if (savedRedirect) {
      setRedirectAfterAuth(savedRedirect);
      sessionStorage.removeItem('redirectTo');
    }
  }, []);

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
        .order('date', { ascending: true })
        .limit(2);

      if (fetchError) throw fetchError;
      setWorkshops(data || []);
    } catch (err: any) {
      setError(err.message);
      console.error('Error fetching workshops:', err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Navbar onOpenAuth={() => setIsAuthModalOpen(true)} />

      {/* Hero Section */}
      <header className="container mx-auto px-6 py-16 min-h-[80vh] flex items-center">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-6 py-10">
            Transform Your Business with AI
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Expert-led workshops and training to help your team master AI implementation
            and drive innovation.
          </p>
          <button
            onClick={() => setIsAuthModalOpen(true)}
            className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Get Started
          </button>
        </div>
      </header>

      {/* Features Section */}
      <Features />

      {/* Stats Section */}
      {/* <Stats /> */}

      {/* Workshops Section */}
      <section id="workshops" className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">Featured Workshops</h2>
          {error ? (
            <div className="text-center text-red-600 mb-8">
              {error}
            </div>
          ) : loading ? (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-8">
              {workshops.map((workshop) => (
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
            </div>
          )}
        </div>
      </section>

      {/* Blog Section */}
      <BlogSection />

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Contact Us</h2>
              <p className="text-xl text-gray-600">
                Have questions about our workshops? We're here to help!
              </p>
            </div>
            <ContactForm />
          </div>
        </div>
      </section>

      <Footer />

      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)}
        redirectTo={redirectAfterAuth || undefined}
      />
    </div>
  );
}

function App() {
  return (
    <AnalyticsProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route
            path="/portal/*"
            element={
              <ProtectedRoute>
                <LearningPortal />
              </ProtectedRoute>
            }
          />
          <Route path="/workshops/" element={<Workshops />} />
          <Route path="/workshop/:id" element={<WorkshopDetails />} />
          <Route path="/blog" element={<BlogSection />} />
          <Route 
            path="/blog/new" 
            element={
              <ProtectedRoute>
                <BlogEditor />
              </ProtectedRoute>
            }
          />
          <Route path="/blog/:id" element={<BlogPost />} />
          
          {/* Admin Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Overview />} />
            <Route path="blog" element={<BlogManagement />} />
            <Route path="modules" element={<ModuleManagement />} />
            <Route path="workshops" element={<WorkshopManagement />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="settings" element={<Settings />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AnalyticsProvider>
  );
}

export default App;