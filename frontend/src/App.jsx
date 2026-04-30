import React, { useState, useEffect } from 'react';
import HeartBackground from './components/HeartBackground';
import ProposalCard from './components/ProposalCard';
import SuccessView from './components/SuccessView';
import AdminView from './components/AdminView';

function App() {
  const [isAccepted, setIsAccepted] = useState(false);
  const [stage, setStage] = useState(0);

  useEffect(() => {
    if (stage === 0) {
      const timer = setTimeout(() => {
        setStage(1);
      }, 5000);
      return () => clearTimeout(timer);
    } else if (stage === 1) {
      const timer = setTimeout(() => {
        setStage(2);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [stage]);

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
      {stage === 0 ? (
        <div className="splash-container" style={{ animation: 'fadeIn 1s ease-in-out' }}>
          <h1 style={{ fontSize: '4rem', fontFamily: '"Comic Sans MS", cursive, sans-serif', color: '#ff4081', marginBottom: '2rem', textShadow: '2px 2px 4px rgba(0,0,0,0.3)' }}>
            Hi ከነዐን
          </h1>
          <video 
            src="/gif%20hello.mp4" 
            autoPlay 
            loop 
            muted 
            playsInline
            style={{ maxWidth: '90vw', maxHeight: '50vh', borderRadius: '15px', boxShadow: '0 4px 15px rgba(0,0,0,0.2)' }}
          />
        </div>
      ) : stage === 1 ? (
        <div className="splash-container" style={{ animation: 'bounceIn 1s cubic-bezier(0.175, 0.885, 0.32, 1.275)' }}>
          <h1 style={{ fontSize: '3rem', color: '#d81b60', marginBottom: '2rem', animation: 'slideInDown 0.8s ease-out' }}>
            I just wanted to say...
          </h1>
          <video 
            src="/friends-joey-how%20you%20doin.mp4" 
            autoPlay 
            loop
            muted
            playsInline
            style={{ maxWidth: '90vw', maxHeight: '50vh', borderRadius: '15px', boxShadow: '0 4px 15px rgba(0,0,0,0.2)' }}
          />
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
