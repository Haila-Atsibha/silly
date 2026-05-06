import React, { useState, useRef } from 'react';

const MESSAGES = [
  "Will you be my girlfriend?",
  "Are you sure?",
  "so u are chasing no good luck",
  "give up already",
  "just say yes"
];

const ProposalCard = ({ onYes }) => {
  const [hoverCount, setHoverCount] = useState(0);
  const [noButtonStyle, setNoButtonStyle] = useState({ position: 'relative' });
  const startTimeRef = useRef(Date.now());


  const handleNoHover = (e) => {
    setHoverCount(prev => prev + 1);

    const winW = window.innerWidth;
    const winH = window.innerHeight;

    const btnW = e.target.offsetWidth || 100;
    const btnH = e.target.offsetHeight || 50;

    const btnGroup = e.target.closest('.button-group');
    let groupLeft = 0;
    let groupTop = 0;
    if (btnGroup) {
      const rect = btnGroup.getBoundingClientRect();
      groupLeft = rect.left;
      groupTop = rect.top;
    }

    const margin = 30; // pixels from the edge of the screen
    const minScreenX = Math.max(margin, 0);
    const maxScreenX = Math.max(margin, winW - btnW - margin);
    const minScreenY = Math.max(margin, 0);
    const maxScreenY = Math.max(margin, winH - btnH - margin);

    const btnRect = e.target.getBoundingClientRect();
    const currentScreenX = btnRect.left;
    const currentScreenY = btnRect.top;

    let randomScreenX, randomScreenY;
    let attempts = 0;

    // Pick a new position at least 100px away from the mouse
    do {
      randomScreenX = minScreenX + Math.random() * (maxScreenX - minScreenX);
      randomScreenY = minScreenY + Math.random() * (maxScreenY - minScreenY);
      attempts++;
    } while (
      attempts < 10 &&
      Math.abs(randomScreenX - currentScreenX) < 100 &&
      Math.abs(randomScreenY - currentScreenY) < 100
    );

    setNoButtonStyle({
      position: 'absolute',
      left: `${randomScreenX - groupLeft}px`,
      top: `${randomScreenY - groupTop}px`,
      zIndex: 9999,
      border: '5px solid #ffeb3b',
      boxShadow: '0 0 20px rgba(255, 235, 59, 0.8)'
    });
  };

  const getHeadingText = () => {
    const index = Math.floor(hoverCount / 3);
    if (index >= MESSAGES.length) {
      return "Don't play with me 😼";
    }
    return MESSAGES[index];
  };

  const getMemeImage = () => {
    const index = Math.floor(hoverCount / 3);
    if (index === 0) return null;
    if (index === 1 || index === 2) return "/crying_guy.jpg";
    if (index === 3 || index === 4) return "/crying_cat.jpg";
    if (index >= 5) return "/angry.jpg";
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
