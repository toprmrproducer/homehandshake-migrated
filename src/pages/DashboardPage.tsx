import { useEffect, useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../components/layout/DashboardLayout';
import { supabase } from '../lib/supabase';
import { useUserProfile } from '../hooks/useUserProfile';
import { FileVideo, Share2, TrendingUp, Plus } from 'lucide-react';

interface Stats {
  totalClips: number;
  totalPosts: number;
  recentActivity: number;
}

export default function DashboardPage() {
  const { user } = useUser();
  const { profile } = useUserProfile();
  const [stats, setStats] = useState<Stats>({ totalClips: 0, totalPosts: 0, recentActivity: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      if (!profile) {
        setLoading(false);
        return;
      }

      try {

        const [clipsResult, postsResult] = await Promise.all([
          supabase
            .from('content_clips')
            .select('id', { count: 'exact', head: true })
            .eq('user_id', profile.id),
          supabase
            .from('social_posts')
            .select('id', { count: 'exact', head: true })
            .eq('user_id', profile.id),
        ]);

        setStats({
          totalClips: clipsResult.count || 0,
          totalPosts: postsResult.count || 0,
          recentActivity: (clipsResult.count || 0) + (postsResult.count || 0),
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [profile]);

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Welcome back, {user?.firstName || 'Creator'}!
          </h1>
          <p className="text-slate-600 mt-2">
            Here's what's happening with your content today.
          </p>
        </div>

        {loading ? (
          <div className="grid gap-6 md:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-lg border border-slate-200 p-6 animate-pulse">
                <div className="h-4 bg-slate-200 rounded w-1/2 mb-4"></div>
                <div className="h-8 bg-slate-200 rounded w-1/3"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-3">
            <div className="bg-white rounded-lg border border-slate-200 p-6 hover:border-blue-300 transition-colors">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FileVideo className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <h3 className="text-sm font-medium text-slate-600">Total Clips</h3>
              <p className="text-3xl font-bold text-slate-900 mt-1">{stats.totalClips}</p>
            </div>

            <div className="bg-white rounded-lg border border-slate-200 p-6 hover:border-blue-300 transition-colors">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Share2 className="w-6 h-6 text-green-600" />
                </div>
              </div>
              <h3 className="text-sm font-medium text-slate-600">Social Posts</h3>
              <p className="text-3xl font-bold text-slate-900 mt-1">{stats.totalPosts}</p>
            </div>

            <div className="bg-white rounded-lg border border-slate-200 p-6 hover:border-blue-300 transition-colors">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-amber-600" />
                </div>
              </div>
              <h3 className="text-sm font-medium text-slate-600">Total Activity</h3>
              <p className="text-3xl font-bold text-slate-900 mt-1">{stats.recentActivity}</p>
            </div>
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-2">
          <Link
            to="/clips"
            className="group bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg p-8 text-white hover:from-blue-700 hover:to-blue-800 transition-all"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-2xl font-bold">Create a Clip</h3>
              <Plus className="w-8 h-8 group-hover:scale-110 transition-transform" />
            </div>
            <p className="text-blue-100">
              Start creating engaging content clips from your videos
            </p>
          </Link>

          <Link
            to="/posts"
            className="group bg-gradient-to-br from-green-600 to-green-700 rounded-lg p-8 text-white hover:from-green-700 hover:to-green-800 transition-all"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-2xl font-bold">Share Content</h3>
              <Share2 className="w-8 h-8 group-hover:scale-110 transition-transform" />
            </div>
            <p className="text-green-100">
              Post your content across all social media platforms
            </p>
          </Link>
        </div>

        <div className="bg-white rounded-lg border border-slate-200 p-8">
          <h2 className="text-xl font-bold text-slate-900 mb-4">Getting Started</h2>
          <div className="space-y-4">
            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-blue-600 font-semibold">1</span>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">Create Your First Clip</h3>
                <p className="text-slate-600">
                  Upload or select content to create engaging clips for your audience
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-blue-600 font-semibold">2</span>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">Connect Social Accounts</h3>
                <p className="text-slate-600">
                  Link your social media accounts in settings to enable posting
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-blue-600 font-semibold">3</span>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">Share Everywhere</h3>
                <p className="text-slate-600">
                  Post your clips to multiple platforms with a single click
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
