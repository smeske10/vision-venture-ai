import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, Users, Globe2, CheckCircle2, ArrowLeft, Loader2, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { WorkshopRegistration } from './WorkshopRegistration';
import { Navbar } from './Navbar';

interface Workshop {
  id: string;
  title: string;
  description: string;
  date: string;
  type: 'B2B' | 'B2C';
  price: number;
  capacity: number;
  benefits: string[];
  agenda: { time: string; topic: string; description: string }[];
  instructor: {
    name: string;
    role: string;
    bio: string;
    image: string;
  };
}

export function WorkshopDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [showRegistration, setShowRegistration] = useState(false);
  const [workshop, setWorkshop] = useState<Workshop | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchWorkshop();
  }, [id]);

  async function fetchWorkshop() {
    if (!id) return;

    try {
      setLoading(true);
      const { data, error: fetchError } = await supabase
        .from('workshops')
        .select('*')
        .eq('id', id)
        .single();

      if (fetchError) throw fetchError;
      setWorkshop(data);
    } catch (err: any) {
      setError(err.message);
      console.error('Error fetching workshop:', err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <>
        <Navbar onOpenAuth={() => setShowRegistration(true)} />
        <div className="min-h-screen bg-gray-50 pt-16 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      </>
    );
  }

  if (error || !workshop) {
    return (
      <>
        <Navbar onOpenAuth={() => setShowRegistration(true)} />
        <div className="min-h-screen bg-gray-50 pt-16 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              {error || 'Workshop Not Found'}
            </h2>
            <button
              onClick={() => navigate('/')}
              className="text-blue-600 hover:text-blue-700 flex items-center justify-center"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Return to Home
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar onOpenAuth={() => setShowRegistration(true)} />
      <div className="min-h-screen bg-gray-50 pt-16">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
          <div className="container mx-auto px-6">
            <button
              onClick={() => navigate('/')}
              className="flex items-center text-blue-100 hover:text-white mb-8"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Home
            </button>
            <div className="max-w-4xl">
              <h1 className="text-4xl font-bold mb-4">{workshop.title}</h1>
              <p className="text-xl text-blue-100 mb-8">{workshop.description}</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="flex items-center">
                  <Calendar className="w-5 h-5 mr-2" />
                  <span>{new Date(workshop.date).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center">
                  <Users className="w-5 h-5 mr-2" />
                  <span>Capacity: {workshop.capacity} participants</span>
                </div>
                <div className="flex items-center">
                  <Globe2 className="w-5 h-5 mr-2" />
                  <span>{workshop.type === 'B2B' ? 'In-person' : 'Online'}</span>
                </div>
              </div>
              <button
                onClick={() => setShowRegistration(true)}
                className="bg-white text-blue-600 px-8 py-3 rounded-lg hover:bg-blue-50 transition-colors"
              >
                Register Now - ${workshop.price}
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="container mx-auto px-6 py-16">
          <div className="grid md:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="md:col-span-2 space-y-12">
              {/* Benefits */}
              <section>
                <h2 className="text-2xl font-bold mb-6">What You'll Learn</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {workshop.benefits?.map((benefit, index) => (
                    <div key={index} className="flex items-start">
                      <CheckCircle2 className="w-5 h-5 text-green-500 mt-1 mr-3 flex-shrink-0" />
                      <span>{benefit}</span>
                    </div>
                  ))}
                </div>
              </section>

              {/* Agenda */}
              <section>
                <h2 className="text-2xl font-bold mb-6">Workshop Agenda</h2>
                <div className="space-y-6">
                  {workshop.agenda?.map((item, index) => (
                    <div key={index} className="border-l-4 border-blue-600 pl-4">
                      <div className="text-sm text-gray-600">{item.time}</div>
                      <div className="font-semibold text-lg">{item.topic}</div>
                      <div className="text-gray-600">{item.description}</div>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              {/* Instructor */}
              {workshop.instructor && (
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-xl font-bold mb-4">Your Instructor</h3>
                  <div className="flex items-center mb-4">
                    <img
                      src={workshop.instructor.image}
                      alt={workshop.instructor.name}
                      className="w-16 h-16 rounded-full mr-4"
                    />
                    <div>
                      <div className="font-semibold">{workshop.instructor.name}</div>
                      <div className="text-gray-600">{workshop.instructor.role}</div>
                    </div>
                  </div>
                  <p className="text-gray-600">{workshop.instructor.bio}</p>
                </div>
              )}

              {/* Registration CTA */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  ${workshop.price}
                </div>
                <div className="text-gray-600 mb-4">
                  Limited to {workshop.capacity} participants
                </div>
                <button
                  onClick={() => setShowRegistration(true)}
                  className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Register Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showRegistration && (
        <WorkshopRegistration
          workshop={workshop}
          onClose={() => setShowRegistration(false)}
        />
      )}
    </>
  );
}