import React, { useState } from 'react';

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

  const handleNoHover = () => {
    setHoverCount(prev => prev + 1);
    
    // Calculate random position within constraints
    const maxX = window.innerWidth / 2 - 100;
    const maxY = window.innerHeight / 2 - 100;
    
    const randomX = Math.floor(Math.random() * maxX * 2) - maxX;
    const randomY = Math.floor(Math.random() * maxY * 2) - maxY;

    setNoButtonStyle({
      position: 'absolute',
      left: `calc(50% + ${randomX}px)`,
      top: `calc(50% + ${randomY}px)`,
      transform: 'translate(-50%, -50%)'
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
        <button className="btn-yes" onClick={onYes}>
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
