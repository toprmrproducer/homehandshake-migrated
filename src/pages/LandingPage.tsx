import { Link } from 'react-router-dom';
import { Video, Share2, Zap, CheckCircle } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <nav className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Video className="w-8 h-8 text-blue-600" />
              <span className="text-xl font-bold text-slate-900">Homehandshake</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to="/sign-in"
                className="text-slate-700 hover:text-slate-900 font-medium transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/sign-up"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium transition-colors"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main>
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-5xl sm:text-6xl font-bold text-slate-900 mb-6">
              Clip Content & Share Everywhere
            </h1>
            <p className="text-xl text-slate-600 mb-10 max-w-3xl mx-auto">
              The ultimate SaaS platform for content creators to clip engaging content and
              distribute it across all social media platforms with ease and precision.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/sign-up"
                className="bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 font-semibold text-lg transition-colors inline-flex items-center justify-center"
              >
                Start Creating Free
              </Link>
              <a
                href="#features"
                className="bg-white text-slate-900 border-2 border-slate-200 px-8 py-4 rounded-lg hover:border-slate-300 font-semibold text-lg transition-colors inline-flex items-center justify-center"
              >
                Learn More
              </a>
            </div>
          </div>
        </section>

        <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl font-bold text-center text-slate-900 mb-16">
              Everything You Need to Succeed
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="p-6 rounded-xl border border-slate-200 hover:border-blue-300 transition-colors">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <Video className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">Smart Clipping</h3>
                <p className="text-slate-600">
                  Create engaging clips from your content with intuitive tools designed for
                  creators.
                </p>
              </div>

              <div className="p-6 rounded-xl border border-slate-200 hover:border-blue-300 transition-colors">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <Share2 className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">Multi-Platform Sharing</h3>
                <p className="text-slate-600">
                  Post to all your social media accounts simultaneously with a single click.
                </p>
              </div>

              <div className="p-6 rounded-xl border border-slate-200 hover:border-blue-300 transition-colors">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <Zap className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">Lightning Fast</h3>
                <p className="text-slate-600">
                  Process and share your content quickly without compromising on quality.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-12 text-center text-white">
              <h2 className="text-4xl font-bold mb-4">Ready to Get Started?</h2>
              <p className="text-xl mb-8 text-blue-100">
                Join thousands of creators who are already using Homehandshake
              </p>
              <Link
                to="/sign-up"
                className="bg-white text-blue-600 px-8 py-4 rounded-lg hover:bg-blue-50 font-semibold text-lg transition-colors inline-flex items-center justify-center"
              >
                Create Your Free Account
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t bg-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center text-slate-600">
          <p>&copy; 2025 Homehandshake. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
