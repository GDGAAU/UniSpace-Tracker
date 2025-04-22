import React from 'react';

function Bubbles() {
  const bubbles = Array.from({ length: 10 }).map((_, i) => ({
    id: i,
    size: Math.random() * 50 + 20,
    left: Math.random() * 100,
    duration: Math.random() * 10 + 5,
    delay: Math.random() * 5,
  }));

  return (
    <div className="bubbles">
      {bubbles.map((bubble) => (
        <div
          key={bubble.id}
          className="bubble"
          style={{
            width: `${bubble.size}px`,
            height: `${bubble.size}px`,
            left: `${bubble.left}vw`,
            animationDuration: `${bubble.duration}s`,
            animationDelay: `${bubble.delay}s`,
          }}
        ></div>
      ))}
    </div>
  );
}

export default Bubbles;
