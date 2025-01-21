import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { User, Calendar, Clock, Download, ArrowLeft, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Navbar } from './Navbar';

interface BlogPost {
  id: string;
  title: string;
  content: string;
  author: string;
  created_at: string;
  category: string;
  video_url?: string;
  attachments?: {
    name: string;
    url: string;
    size: string;
  }[];
}

export function BlogPost() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPost();
  }, [id]);

  async function fetchPost() {
    if (!id) return;

    try {
      setLoading(true);
      const { data, error: fetchError } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('id', id)
        .single();

      if (fetchError) throw fetchError;
      setPost(data);
    } catch (err: any) {
      setError(err.message);
      console.error('Error fetching post:', err);
    } finally {
      setLoading(false);
    }
  }

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

  if (error || !post) {
    return (
      <>
        <Navbar onOpenAuth={() => setShowAuthModal(true)} />
        <div className="min-h-screen bg-gray-50 pt-16 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              {error || 'Blog Post Not Found'}
            </h2>
            <button
              onClick={() => navigate('/blog')}
              className="text-blue-600 hover:text-blue-700 flex items-center justify-center"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Return to Blog
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar onOpenAuth={() => setShowAuthModal(true)} />
      <div className="min-h-screen bg-gray-50 pt-16">
        <article className="container mx-auto px-6 max-w-4xl py-12">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-8">
              <button
                onClick={() => navigate('/blog')}
                className="flex items-center text-blue-600 hover:text-blue-700 mb-8"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Blog
              </button>

              <h1 className="text-4xl font-bold mb-6">{post.title}</h1>
              
              <div className="flex items-center space-x-6 text-gray-500 mb-8">
                <div className="flex items-center">
                  <User className="w-5 h-5 mr-2" />
                  {post.author}
                </div>
                <div className="flex items-center">
                  <Calendar className="w-5 h-5 mr-2" />
                  {new Date(post.created_at).toLocaleDateString()}
                </div>
                <div className="flex items-center">
                  <Clock className="w-5 h-5 mr-2" />
                  {Math.ceil(post.content.length / 1000)} min read
                </div>
              </div>

              {post.video_url && (
                <div className="mb-8 bg-black rounded-lg overflow-hidden aspect-video">
                  <video
                    className="w-full h-full"
                    controls
                    src={post.video_url}
                  />
                </div>
              )}

              <div 
                className="prose max-w-none mb-8"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />

              {post.attachments && post.attachments.length > 0 && (
                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold mb-4">Attachments</h3>
                  <div className="space-y-2">
                    {post.attachments.map((file, index) => (
                      <a
                        key={index}
                        href={file.url}
                        className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <Download className="w-5 h-5 text-blue-600 mr-3" />
                        <span className="flex-1 text-gray-700">{file.name}</span>
                        <span className="text-sm text-gray-500">{file.size}</span>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </article>
      </div>
    </>
  );
}