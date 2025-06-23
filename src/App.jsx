import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/auth/ProtectedRoute.jsx';
import AdminRoute from './components/auth/AdminRoute.jsx';
import Layout from './Layout.jsx';
import LoginPage from './pages/LoginPage.jsx';
import Dashboard from './pages/Dashboard.jsx';
import AllMatches from './pages/AllMatches.jsx';
import Favorites from './pages/Favorites.jsx';
import AddMatch from './pages/AddMatch.jsx';
import SourceCode from './pages/SourceCode.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import SyncMatchesPage from './pages/SyncMatchesPage.jsx';
import MatchDetailPage from './pages/MatchDetailPage.jsx';
import TutorialPage from './pages/TutorialPage.jsx'; // <-- NOVA IMPORTAÇÃO

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/*" element={
          <ProtectedRoute>
            <Layout>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/all-matches" element={<AllMatches />} />
                <Route path="/match/:matchId" element={<MatchDetailPage />} />
                <Route path="/favorites" element={<Favorites />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/tutorial" element={<TutorialPage />} /> {/* <-- NOVA ROTA */}
                
                <Route path="/add-match" element={<AdminRoute><AddMatch /></AdminRoute>} />
                <Route path="/sync-matches" element={<AdminRoute><SyncMatchesPage /></AdminRoute>} />
                <Route path="/source-code" element={<AdminRoute><SourceCode /></AdminRoute>} />
              </Routes>
            </Layout>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
export default App;