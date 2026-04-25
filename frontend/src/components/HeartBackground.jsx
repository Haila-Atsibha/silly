import React, { useEffect, useState } from 'react';
import { Heart } from 'lucide-react';

const HeartBackground = () => {
  const [hearts, setHearts] = useState([]);

  useEffect(() => {
    // Generate 20 hearts with random positions and delays
    const newHearts = Array.from({ length: 20 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      animationDuration: 5 + Math.random() * 10, // 5s to 15s
      animationDelay: Math.random() * 5,
      size: 16 + Math.random() * 24, // 16px to 40px
    }));
    setHearts(newHearts);
  }, []);

  return (
    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', overflow: 'hidden', pointerEvents: 'none' }}>
      {hearts.map(heart => (
        <Heart
          key={heart.id}
          className="heart"
          style={{
            left: `${heart.left}%`,
            animationDuration: `${heart.animationDuration}s`,
            animationDelay: `${heart.animationDelay}s`,
            width: `${heart.size}px`,
            height: `${heart.size}px`,
            fill: '#ffb6c1',
          }}
        />
      ))}
    </div>
  );
};

export default HeartBackground;
