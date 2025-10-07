import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { SignedIn, SignedOut } from '@clerk/clerk-react';
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';
import DashboardPage from './pages/DashboardPage';
import ClipsPage from './pages/ClipsPage';
import PostsPage from './pages/PostsPage';
import SettingsPage from './pages/SettingsPage';
import LandingPage from './pages/LandingPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <>
              <SignedOut>
                <LandingPage />
              </SignedOut>
              <SignedIn>
                <Navigate to="/dashboard" replace />
              </SignedIn>
            </>
          }
        />

        <Route path="/sign-in/*" element={<SignInPage />} />
        <Route path="/sign-up/*" element={<SignUpPage />} />

        <Route
          path="/dashboard"
          element={
            <SignedIn>
              <DashboardPage />
            </SignedIn>
          }
        />

        <Route
          path="/clips"
          element={
            <SignedIn>
              <ClipsPage />
            </SignedIn>
          }
        />

        <Route
          path="/posts"
          element={
            <SignedIn>
              <PostsPage />
            </SignedIn>
          }
        />

        <Route
          path="/settings"
          element={
            <SignedIn>
              <SettingsPage />
            </SignedIn>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
