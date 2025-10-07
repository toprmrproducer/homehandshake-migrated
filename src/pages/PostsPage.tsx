import { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { supabase } from '../lib/supabase';
import { ayrshareApi } from '../lib/ayrshare';
import { useUserProfile } from '../hooks/useUserProfile';
import { Plus, Share2, Clock, CheckCircle, XCircle, Trash2 } from 'lucide-react';

interface Post {
  id: string;
  content: string;
  platforms: string[];
  status: 'draft' | 'scheduled' | 'posted' | 'failed';
  scheduled_at: string | null;
  posted_at: string | null;
  created_at: string;
}

const platformOptions = [
  { value: 'twitter', label: 'Twitter/X' },
  { value: 'facebook', label: 'Facebook' },
  { value: 'linkedin', label: 'LinkedIn' },
  { value: 'instagram', label: 'Instagram' },
];

export default function PostsPage() {
  const { user } = useUser();
  const { profile } = useUserProfile();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [posting, setPosting] = useState(false);
  const [formData, setFormData] = useState({
    content: '',
    platforms: [] as string[],
  });

  const fetchPosts = async () => {
    if (!profile) {
      setLoading(false);
      return;
    }

    try {

      const { data, error } = await supabase
        .from('social_posts')
        .select('*')
        .eq('user_id', profile.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [profile]);

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile || formData.platforms.length === 0) return;

    setPosting(true);
    try {

      const ayrshareResponse = await ayrshareApi.createPost({
        post: formData.content,
        platforms: formData.platforms,
      });

      const { error } = await supabase.from('social_posts').insert({
        user_id: profile.id,
        content: formData.content,
        platforms: formData.platforms,
        status: ayrshareResponse.status === 'success' ? 'posted' : 'failed',
        posted_at: ayrshareResponse.status === 'success' ? new Date().toISOString() : null,
        ayrshare_post_id: ayrshareResponse.id || null,
      });

      if (error) throw error;

      setFormData({ content: '', platforms: [] });
      setShowCreateForm(false);
      fetchPosts();
    } catch (error) {
      console.error('Error creating post:', error);
      alert('Failed to create post. Please check your Ayrshare configuration.');
    } finally {
      setPosting(false);
    }
  };

  const handleDeletePost = async (id: string) => {
    if (!confirm('Are you sure you want to delete this post?')) return;

    try {
      const { error } = await supabase.from('social_posts').delete().eq('id', id);
      if (error) throw error;
      fetchPosts();
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  const togglePlatform = (platform: string) => {
    setFormData((prev) => ({
      ...prev,
      platforms: prev.platforms.includes(platform)
        ? prev.platforms.filter((p) => p !== platform)
        : [...prev.platforms, platform],
    }));
  };

  const getStatusIcon = (status: Post['status']) => {
    switch (status) {
      case 'posted':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'failed':
        return <XCircle className="w-5 h-5 text-red-600" />;
      case 'scheduled':
        return <Clock className="w-5 h-5 text-amber-600" />;
      default:
        return <Share2 className="w-5 h-5 text-slate-400" />;
    }
  };

  const getStatusText = (status: Post['status']) => {
    switch (status) {
      case 'posted':
        return 'Posted';
      case 'failed':
        return 'Failed';
      case 'scheduled':
        return 'Scheduled';
      default:
        return 'Draft';
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Social Posts</h1>
            <p className="text-slate-600 mt-2">Share your content across platforms</p>
          </div>
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium transition-colors flex items-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>New Post</span>
          </button>
        </div>

        {showCreateForm && (
          <div className="bg-white rounded-lg border border-slate-200 p-6">
            <h2 className="text-xl font-semibold text-slate-900 mb-4">Create New Post</h2>
            <form onSubmit={handleCreatePost} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Content
                </label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-32"
                  placeholder="What do you want to share?"
                  required
                />
                <p className="text-sm text-slate-500 mt-1">{formData.content.length} characters</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Select Platforms
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {platformOptions.map((platform) => (
                    <button
                      key={platform.value}
                      type="button"
                      onClick={() => togglePlatform(platform.value)}
                      className={`p-3 border-2 rounded-lg font-medium transition-all ${
                        formData.platforms.includes(platform.value)
                          ? 'border-blue-600 bg-blue-50 text-blue-700'
                          : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      {platform.label}
                    </button>
                  ))}
                </div>
                {formData.platforms.length === 0 && (
                  <p className="text-sm text-red-600 mt-2">Please select at least one platform</p>
                )}
              </div>

              <div className="flex space-x-3">
                <button
                  type="submit"
                  disabled={posting || formData.platforms.length === 0}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  {posting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Posting...</span>
                    </>
                  ) : (
                    <>
                      <Share2 className="w-5 h-5" />
                      <span>Post Now</span>
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  disabled={posting}
                  className="bg-slate-100 text-slate-700 px-6 py-2 rounded-lg hover:bg-slate-200 font-medium transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-lg border border-slate-200 p-6 animate-pulse">
                <div className="h-4 bg-slate-200 rounded w-3/4 mb-4"></div>
                <div className="h-3 bg-slate-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="bg-white rounded-lg border border-slate-200 p-12 text-center">
            <Share2 className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 mb-2">No posts yet</h3>
            <p className="text-slate-600 mb-6">Create your first post to start sharing</p>
            <button
              onClick={() => setShowCreateForm(true)}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 font-medium transition-colors inline-flex items-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>Create Post</span>
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => (
              <div
                key={post.id}
                className="bg-white rounded-lg border border-slate-200 p-6 hover:border-blue-300 transition-colors"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(post.status)}
                    <span className="font-medium text-slate-700">{getStatusText(post.status)}</span>
                  </div>
                  <button
                    onClick={() => handleDeletePost(post.id)}
                    className="text-red-600 hover:text-red-700 p-2 rounded hover:bg-red-50 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <p className="text-slate-900 mb-4 whitespace-pre-wrap">{post.content}</p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {post.platforms.map((platform) => (
                    <span
                      key={platform}
                      className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium"
                    >
                      {platformOptions.find((p) => p.value === platform)?.label || platform}
                    </span>
                  ))}
                </div>

                <div className="text-sm text-slate-500 border-t border-slate-100 pt-4">
                  {post.posted_at
                    ? `Posted ${new Date(post.posted_at).toLocaleString()}`
                    : `Created ${new Date(post.created_at).toLocaleString()}`}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
