import React, { useState } from 'react';
import HeartBackground from './components/HeartBackground';
import ProposalCard from './components/ProposalCard';
import SuccessView from './components/SuccessView';
import AdminView from './components/AdminView';

function App() {
  const [isAccepted, setIsAccepted] = useState(false);

  const handleYes = async () => {
    setIsAccepted(true);

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'https://silly-1-6zfv.onrender.com';
      await fetch(`${apiUrl}/api/respond`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ answer: 'YES' }),
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
      {isAccepted ? (
        <SuccessView />
      ) : (
        <ProposalCard onYes={handleYes} />
      )}
    </div>
  );
}

export default App;
