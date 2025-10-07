import { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { supabase } from '../lib/supabase';
import { useUserProfile } from '../hooks/useUserProfile';
import { Plus, FileVideo, Trash2, ExternalLink } from 'lucide-react';

interface Clip {
  id: string;
  title: string;
  description: string | null;
  content_url: string;
  thumbnail_url: string | null;
  duration: number | null;
  created_at: string;
}

export default function ClipsPage() {
  const { user } = useUser();
  const { profile } = useUserProfile();
  const [clips, setClips] = useState<Clip[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content_url: '',
  });

  const fetchClips = async () => {
    if (!profile) {
      setLoading(false);
      return;
    }

    try {

      const { data, error } = await supabase
        .from('content_clips')
        .select('*')
        .eq('user_id', profile.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setClips(data || []);
    } catch (error) {
      console.error('Error fetching clips:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClips();
  }, [profile]);

  const handleCreateClip = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;

    try {

      const { error } = await supabase.from('content_clips').insert({
        user_id: profile.id,
        title: formData.title,
        description: formData.description || null,
        content_url: formData.content_url,
      });

      if (error) throw error;

      setFormData({ title: '', description: '', content_url: '' });
      setShowCreateForm(false);
      fetchClips();
    } catch (error) {
      console.error('Error creating clip:', error);
    }
  };

  const handleDeleteClip = async (id: string) => {
    if (!confirm('Are you sure you want to delete this clip?')) return;

    try {
      const { error } = await supabase.from('content_clips').delete().eq('id', id);
      if (error) throw error;
      fetchClips();
    } catch (error) {
      console.error('Error deleting clip:', error);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Content Clips</h1>
            <p className="text-slate-600 mt-2">Manage your video clips and content</p>
          </div>
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium transition-colors flex items-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>New Clip</span>
          </button>
        </div>

        {showCreateForm && (
          <div className="bg-white rounded-lg border border-slate-200 p-6">
            <h2 className="text-xl font-semibold text-slate-900 mb-4">Create New Clip</h2>
            <form onSubmit={handleCreateClip} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-24"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Content URL
                </label>
                <input
                  type="url"
                  value={formData.content_url}
                  onChange={(e) => setFormData({ ...formData, content_url: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://example.com/video.mp4"
                  required
                />
              </div>

              <div className="flex space-x-3">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 font-medium transition-colors"
                >
                  Create Clip
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="bg-slate-100 text-slate-700 px-6 py-2 rounded-lg hover:bg-slate-200 font-medium transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {loading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-lg border border-slate-200 p-6 animate-pulse">
                <div className="h-40 bg-slate-200 rounded mb-4"></div>
                <div className="h-4 bg-slate-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-slate-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : clips.length === 0 ? (
          <div className="bg-white rounded-lg border border-slate-200 p-12 text-center">
            <FileVideo className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 mb-2">No clips yet</h3>
            <p className="text-slate-600 mb-6">Create your first clip to get started</p>
            <button
              onClick={() => setShowCreateForm(true)}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 font-medium transition-colors inline-flex items-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>Create Clip</span>
            </button>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {clips.map((clip) => (
              <div
                key={clip.id}
                className="bg-white rounded-lg border border-slate-200 overflow-hidden hover:border-blue-300 transition-colors"
              >
                <div className="aspect-video bg-slate-100 flex items-center justify-center">
                  {clip.thumbnail_url ? (
                    <img src={clip.thumbnail_url} alt={clip.title} className="w-full h-full object-cover" />
                  ) : (
                    <FileVideo className="w-16 h-16 text-slate-300" />
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-slate-900 mb-1 truncate">{clip.title}</h3>
                  {clip.description && (
                    <p className="text-sm text-slate-600 mb-3 line-clamp-2">{clip.description}</p>
                  )}
                  <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                    <a
                      href={clip.content_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-700 text-sm font-medium inline-flex items-center space-x-1"
                    >
                      <span>View</span>
                      <ExternalLink className="w-4 h-4" />
                    </a>
                    <button
                      onClick={() => handleDeleteClip(clip.id)}
                      className="text-red-600 hover:text-red-700 p-2 rounded hover:bg-red-50 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
