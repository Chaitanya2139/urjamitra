import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';
import AuthModal from './components/AuthModal';
import { mockAuth, MockUser } from './mockAuth';

function App() {
  const [user, setUser] = useState<MockUser | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    const unsubscribe = mockAuth.onAuthStateChanged((user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route 
            path="/" 
            element={
              <LandingPage 
                onAuthClick={() => setShowAuthModal(true)}
                user={user}
              />
            } 
          />
          <Route 
            path="/dashboard" 
            element={
              user ? (
                <Dashboard user={user} />
              ) : (
                <LandingPage 
                  onAuthClick={() => setShowAuthModal(true)}
                  user={user}
                />
              )
            } 
          />
        </Routes>
        
        {showAuthModal && (
          <AuthModal 
            onClose={() => setShowAuthModal(false)}
            onSuccess={() => setShowAuthModal(false)}
          />
        )}
      </div>
    </Router>
  );
}

export default App;