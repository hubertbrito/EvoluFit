import React from 'react';

export const Confetti = () => {
  const confettiCount = 100;
  const colors = ['#fde047', '#f87171', '#4ade80', '#60a5fa', '#a78bfa'];

  return (
    <div className="fixed inset-0 pointer-events-none z-[200] overflow-hidden">
      <style>{`
        @keyframes fall {
          0% { transform: translateY(-10vh) rotateZ(0deg); opacity: 1; }
          100% { transform: translateY(110vh) rotateZ(720deg); opacity: 0; }
        }
        .confetti-piece {
          position: absolute;
          width: 8px;
          height: 16px;
          animation: fall 3s linear forwards;
        }
      `}</style>
      {Array.from({ length: confettiCount }).map((_, i) => {
        const style = {
          left: `${Math.random() * 100}vw`,
          backgroundColor: colors[Math.floor(Math.random() * colors.length)],
          animationDelay: `${Math.random() * 2}s`,
          transform: `rotate(${Math.random() * 360}deg)`
        };
        return <div key={i} className="confetti-piece" style={style}></div>;
      })}
    </div>
  );
};

export const GoldConfetti = () => {
  const confettiCount = 150;
  const colors = ['#FFD700', '#FFA500', '#B8860B', '#DAA520', '#F0E68C']; // Tons de dourado

  return (
    <div className="fixed inset-0 pointer-events-none z-[300] overflow-hidden flex items-center justify-center">
      <style>{`
        @keyframes fall-gold {
          0% { transform: translateY(-10vh) rotateZ(0deg); opacity: 1; }
          100% { transform: translateY(110vh) rotateZ(720deg); opacity: 0; }
        }
        .confetti-gold {
          position: absolute;
          width: 10px;
          height: 20px;
          animation: fall-gold 4s linear forwards;
        }
        @keyframes pop-in {
            0% { transform: scale(0); opacity: 0; }
            50% { transform: scale(1.2); opacity: 1; }
            100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
      {Array.from({ length: confettiCount }).map((_, i) => {
        const style = {
          left: `${Math.random() * 100}vw`,
          top: `-10vh`,
          backgroundColor: colors[Math.floor(Math.random() * colors.length)],
          animationDelay: `${Math.random() * 2}s`,
          transform: `rotate(${Math.random() * 360}deg)`
        };
        return <div key={i} className="confetti-gold" style={style}></div>;
      })}
      <div className="z-[301] flex flex-col items-center animate-[pop-in_0.5s_ease-out_forwards]">
        <div className="text-8xl drop-shadow-2xl filter mb-4">👑</div>
        <div className="text-4xl font-black text-yellow-400 drop-shadow-[0_4px_0_rgba(0,0,0,0.5)] bg-black/60 px-8 py-4 rounded-3xl backdrop-blur-md border-2 border-yellow-500/50">
            PRO ATIVADO!
        </div>
      </div>
    </div>
  );
};