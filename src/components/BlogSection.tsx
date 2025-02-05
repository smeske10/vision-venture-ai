import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Clock, User, ArrowRight, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { AuthModal } from './AuthModal';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  author: string;
  created_at: string;
  category: 'Education' | 'Business Growth' | 'Productivity' | 'Tools & Trends' | 'Exclusive Insights';
}

const CATEGORIES = ['All', 'Education', 'Business Growth', 'Productivity', 'Tools & Trends', 'Exclusive Insights'] as const;

export function BlogSection() {
  const navigate = useNavigate();
  const location = useLocation();
  const isFullPage = location.pathname === '/blog';
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<typeof CATEGORIES[number]>('All');
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPosts();
  }, [selectedCategory]);

  async function fetchPosts() {
    try {
      setLoading(true);
      let query = supabase
        .from('blog_posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (selectedCategory !== 'All') {
        query = query.eq('category', selectedCategory);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) throw fetchError;
      setPosts(data || []);
    } catch (err: any) {
      setError(err.message);
      console.error('Error fetching posts:', err);
    } finally {
      setLoading(false);
    }
  }

  const displayPosts = isFullPage ? posts : posts.slice(0, 2);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <>
      {isFullPage && <Navbar onOpenAuth={() => setShowAuthModal(true)} />}
      <section className={`${isFullPage ? 'pt-16' : ''} py-20 bg-gray-50`}>
        <div className="container mx-auto pt-10 px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              {isFullPage ? 'Our Blog' : 'Latest Insights'}
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto mb-8">
              Stay updated with our latest thoughts on AI, technology, and business transformation.
            </p>

            {isFullPage && (
              <>
                <div className="flex flex-wrap justify-center gap-3 mb-8">
                  {CATEGORIES.map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                        selectedCategory === category
                          ? 'bg-blue-600 text-white'
                          : 'bg-white text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {error && (
            <div className="text-center text-red-600 mb-8">
              {error}
            </div>
          )}

          <div className={`grid gap-8 ${isFullPage ? 'md:grid-cols-3' : 'md:grid-cols-2'}`}>
            {displayPosts.map((post) => (
              <article
                key={post.id}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer"
                onClick={() => navigate(`/blog/${post.id}`)}
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                      {post.category}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold mb-2">{post.title}</h3>
                  <p className="text-gray-600 mb-4">{post.excerpt}</p>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center">
                      <User className="w-4 h-4 mr-1" />
                      {post.author}
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {new Date(post.created_at).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {!isFullPage && posts.length > 0 && (
            <div className="text-center mt-12">
              <button
                onClick={() => navigate('/blog')}
                className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
              >
                View All Posts
                <ArrowRight className="w-4 h-4 ml-2" />
              </button>
            </div>
          )}
        </div>
      </section>
      {isFullPage && <Footer />}
      <AuthModal 
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </>
  );
}