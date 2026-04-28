import React, { useState } from 'react';
import HeartBackground from './components/HeartBackground';
import ProposalCard from './components/ProposalCard';
import SuccessView from './components/SuccessView';
import AdminView from './components/AdminView';

function App() {
  const [isAccepted, setIsAccepted] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const [isFadingOut, setIsFadingOut] = useState(false);

  const handleContinue = () => {
    setIsFadingOut(true);
    setTimeout(() => {
      setShowSplash(false);
    }, 1000);
  };

  const handleYes = async (timeSpent) => {
    setIsAccepted(true);

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'https://silly-1-6zfv.onrender.com';
      await fetch(`${apiUrl}/api/respond`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ answer: 'YES', timeSpent }),
      });
    } catch (error) {
      console.error('Error saving response:', error);
    }
  };

  const isAdmin = window.location.search.includes('admin=true');

  if (isAdmin) {
    return <AdminView />;
  }

  return (
    <div className="app-container">
      <HeartBackground />
      {showSplash ? (
        <div className={`splash-container ${isFadingOut ? 'fade-out' : ''}`}>
          <img 
            src="/photo_2026-04-28_10-48-51.jpg" 
            alt="Welcome" 
            style={{ maxWidth: '90vw', maxHeight: '60vh', objectFit: 'contain', borderRadius: '15px', marginBottom: '2rem', boxShadow: '0 4px 15px rgba(0,0,0,0.2)' }} 
          />
          <button 
            className="btn-yes" 
            style={{ padding: '1rem 2rem', fontSize: '1.2rem', cursor: 'pointer' }}
            onClick={handleContinue}
          >
            Click to continue 💖
          </button>
        </div>
      ) : isAccepted ? (
        <SuccessView />
      ) : (
        <ProposalCard onYes={handleYes} />
      )}
    </div>
  );
}

export default App;
