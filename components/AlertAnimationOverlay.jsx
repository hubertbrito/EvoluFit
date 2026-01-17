import React from 'react';

const AlertAnimationOverlay = () => (
  <div className="fixed inset-0 max-w-md mx-auto pointer-events-none z-[200]">
    <style>{`
      @keyframes pulse-border-alert {
        0% { box-shadow: inset 0 0 0 0px rgba(34, 197, 94, 0); }
        20% { box-shadow: inset 0 0 0 10px rgba(34, 197, 94, 0.8); }
        100% { box-shadow: inset 0 0 0 0px rgba(34, 197, 94, 0); }
      }
      .animate-pulse-visual-alert {
        /* A animação dura 2s e se repete 2 vezes, totalizando 4s */
        animation: pulse-border-alert 2s ease-out 2;
        border-radius: 1.5rem; /* Para combinar com o arredondamento do layout se houver */
      }
    `}</style>
    <div className="w-full h-full animate-pulse-visual-alert"></div>
  </div>
);

export default AlertAnimationOverlay;