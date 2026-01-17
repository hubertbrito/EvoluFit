import React from 'react';

const HeartExplosion = ({ count = 1 }) => {
  return (
    <div className="fixed inset-0 pointer-events-none z-[210] flex items-center justify-center">
      <style>{`
        @keyframes float-up {
          0% { transform: translateY(0) scale(0.5); opacity: 0; }
          20% { opacity: 1; transform: translateY(-20px) scale(1.2); }
          100% { transform: translateY(-200px) scale(1); opacity: 0; }
        }
      `}</style>
      {Array.from({ length: 15 }).map((_, i) => (
        <div
          key={i}
          className="absolute text-4xl drop-shadow-md"
          style={{
            left: `${50 + (Math.random() * 60 - 30)}%`,
            top: `${50 + (Math.random() * 60 - 30)}%`,
            animation: `float-up ${1 + Math.random()}s ease-out forwards`,
            animationDelay: `${Math.random() * 0.5}s`
          }}
        >
          ❤️
        </div>
      ))}
      <div className="absolute text-2xl font-black text-rose-500 bg-white/90 px-4 py-2 rounded-full shadow-xl animate-bounce border-2 border-rose-200">
        +{count} {count > 1 ? 'Corações!' : 'Coração!'}
      </div>
    </div>
  );
};

export default HeartExplosion;