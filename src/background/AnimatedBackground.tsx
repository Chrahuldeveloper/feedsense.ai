import React from 'react';

const AnimatedBackground: React.FC = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute w-full h-full z-0">
        <svg 
          className="w-[200%] h-full opacity-20 animate-wave"
          viewBox="0 0 1440 320" 
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          <path 
            fill="none" 
            stroke="rgba(0, 163, 255, 0.5)" 
            strokeWidth="2"
            d="M0,192L48,186.7C96,181,192,171,288,181.3C384,192,480,224,576,229.3C672,235,768,213,864,181.3C960,149,1056,107,1152,106.7C1248,107,1344,149,1392,170.7L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          />
        </svg>
        
        <svg 
          className="w-[200%] h-full opacity-20 animate-wave"
          viewBox="0 0 1440 320" 
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          style={{ animationDelay: '-5s' }}
        >
          <path 
            fill="none" 
            stroke="rgba(123, 97, 255, 0.4)" 
            strokeWidth="2"
            d="M0,192L48,202.7C96,213,192,235,288,229.3C384,224,480,192,576,176C672,160,768,160,864,181.3C960,203,1056,245,1152,224C1248,203,1344,117,1392,74.7L1440,32L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          />
        </svg>
      </div>
      
      <div 
        className="absolute inset-0 opacity-10" 
        style={{ 
          backgroundImage: `linear-gradient(rgba(107, 221, 255, 0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(107, 221, 255, 0.2) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }}
      />
      
      <div className="absolute inset-0">
        {Array.from({ length: 8 }).map((_, index) => (
          <div 
            key={index} 
            className="absolute rounded-full bg-neon-blue animate-float"
            style={{ 
              width: `${Math.random() * 6 + 2}px`, 
              height: `${Math.random() * 6 + 2}px`,
              left: `${Math.random() * 100}%`, 
              top: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.5 + 0.2,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${Math.random() * 10 + 5}s`
            }} 
          />
        ))}
      </div>
    </div>
  );
};

export default AnimatedBackground;
