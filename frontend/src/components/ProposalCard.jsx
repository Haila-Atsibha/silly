import React, { useState, useRef } from 'react';

const MESSAGES = [
  "Will you be my girlfriend?",
  "Are you sure?",
  "Really sure?",
  "Don't do this 😢",
  "Just press yes already ❤️"
];

const ProposalCard = ({ onYes }) => {
  const [hoverCount, setHoverCount] = useState(0);
  const [noButtonStyle, setNoButtonStyle] = useState({ position: 'relative' });
  const startTimeRef = useRef(Date.now());


  const handleNoHover = () => {
    setHoverCount(prev => prev + 1);
    // Since the card has backdrop-filter, it creates a containing block.
    // Using 'fixed' breaks, and using 'vw/vh' from 0 starts at the card's edge.
    // Instead, we use absolute positioning from the center of the card (50%).
    
    const signX = Math.random() > 0.5 ? 1 : -1;
    const signY = Math.random() > 0.5 ? 1 : -1;

    // Jump between 15vw and 35vw away from the center horizontally
    const randomX = signX * (15 + Math.random() * 20);
    
    // Jump between 15vh and 35vh away from the center vertically
    const randomY = signY * (15 + Math.random() * 20);

    setNoButtonStyle({
      position: 'absolute',
      left: `calc(50% + ${randomX}vw)`,
      top: `calc(50% + ${randomY}vh)`,
      transform: 'translate(-50%, -50%)',
      zIndex: 9999,
      border: '5px solid #ffeb3b', // Widen the border
      boxShadow: '0 0 20px rgba(255, 235, 59, 0.8)' // Add a glow so it's super visible
    });
  };

  const getHeadingText = () => {
    if (hoverCount >= MESSAGES.length) {
      return "Don't play with me 😼";
    }
    return MESSAGES[hoverCount];
  };

  const getMemeImage = () => {
    if (hoverCount === 0) return null;
    if (hoverCount === 1 || hoverCount === 2) return "/crying_guy.jpg";
    if (hoverCount === 3 || hoverCount === 4) return "/crying_cat.jpg";
    if (hoverCount >= 5) return "/angry.jpg";
    return null;
  };

  const memeImage = getMemeImage();

  // Handle Yes click, calculate time spent chasing No button
  const handleYesClick = () => {
    const timeSpent = Date.now() - startTimeRef.current;
    onYes(timeSpent);
  };

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      {memeImage && (
        <div className="cat-container" style={{ marginTop: 0, marginBottom: '1.5rem' }}>
          <img src={memeImage} alt="Reaction meme" className="cat-img" style={{ maxHeight: '200px', objectFit: 'contain' }} />
        </div>
      )}
      
      <h1 className="heading" style={{ marginBottom: memeImage ? '1.5rem' : '2rem' }}>
        {getHeadingText()}
      </h1>
      
      <div className="button-group" style={{ width: '100%' }}>
    <button className="btn-yes" onClick={handleYesClick}>
          Yes
        </button>
        <button 
          className="btn-no" 
          style={noButtonStyle} 
          onMouseEnter={handleNoHover}
          onClick={handleNoHover} // For mobile taps
        >
          No
        </button>
      </div>
    </div>
  );
};

export default ProposalCard;
