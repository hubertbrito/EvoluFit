import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const TourOverlay = ({ step, onNext, onBack, onSkip, highlightedRect }) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isBouncing, setIsBouncing] = useState(true);

  // Reseta a posição (drag) e ativa o bounce quando o passo muda
  useEffect(() => {
    setPosition({ x: 0, y: 0 });
    setIsBouncing(true);
    const timer = setTimeout(() => setIsBouncing(false), 400); // Duração da animação
    return () => clearTimeout(timer);
  }, [step]);


  const steps = [
    {
      title: "Bem-vindo ao EvoluFit!",
      content: "Seu perfil foi configurado com sucesso! Vamos fazer um tour rápido para você dominar o aplicativo e atingir suas metas?",
      action: "Começar Tour",
      positionClass: "bottom-24 right-4"
    },
    {
      title: "1. Sua Dispensa",
      content: "Aqui você encontra todos os alimentos. Use a busca ou o microfone para encontrar o que vai comer. Clique no '+' ou no alimento para adicioná-lo ao seu Prato.",
      action: "Próximo",
      positionClass: "bottom-24 right-4"
    },
    {
      title: "2. Montando o Prato",
      content: "Aqui na aba 'Prato', você definirá a quantidade exata (ex: 2 colheres) de cada alimento selecionado. O app calcula as calorias em tempo real.",
      action: "Entendi",
      positionClass: "bottom-24 right-4"
    },
    {
      title: "3. Agendando",
      content: "Depois de montar o prato, use os botões abaixo para escolher os dias e a refeição (ex: Almoço) onde esse prato será servido.",
      action: "Próximo",
      positionClass: "top-24 right-4"
    },
    {
      title: "4. Sua Agenda",
      content: "Aqui fica seu planejamento completo. Você visualize todas as refeições do dia e seus horários.",
      action: "Próximo",
      positionClass: "bottom-24 right-4"
    },
    {
      title: "5. Criando Refeições",
      content: "Para criar uma nova refeição (ex: Lanche Extra), a regra é: PRIMEIRO selecione os dias no menu superior, e SÓ DEPOIS clique em 'Adicionar Refeição'.",
      action: "Importante!",
      positionClass: "top-24 right-4"
    },
    {
      title: "6. Fluxo Inverso",
      content: "Você também pode criar uma refeição vazia na Agenda primeiro, e depois ir ao Prato e escolher 'Inserir em...' para preenchê-la.",
      action: "Finalizar",
      positionClass: "bottom-24 right-4"
    }
  ];

  const handleMouseDown = (e) => {
    // Evita arrastar se clicar em botões
    if (e.target.tagName === 'BUTTON' || e.target.closest('button')) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (isDragging) {
        setPosition({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
      }
    };
    const handleMouseUp = (e) => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragStart]);

  const current = steps[step];

  // The modal window JSX
  const Modal = (
    <div 
      className={`absolute pointer-events-auto transition-all duration-500 ease-in-out ${!highlightedRect ? 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2' : current.positionClass}`}
      style={highlightedRect ? { transform: `translate(${position.x}px, ${position.y}px)` } : {}}
    >
      <div 
        className={`bg-white rounded-2xl p-4 max-w-xs w-full shadow-xl border-2 border-emerald-500 cursor-move ${isBouncing ? 'animate-scale-bounce' : ''}`}
        onMouseDown={handleMouseDown}
      >
        <button 
          onClick={onSkip} 
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
          title="Fechar Tour"
        >
          <X size={16} />
        </button>

        <div className="mb-3">
            <h3 className="text-sm font-black text-emerald-600 mb-1">{current.title}</h3>
            <p className="text-gray-600 text-xs leading-relaxed">{current.content}</p>
        </div>
        <div className="flex gap-2 mt-2">
            {step > 0 && <button onClick={onBack} className="flex-1 py-1.5 rounded-lg font-bold text-xs text-gray-500 bg-gray-100 hover:bg-gray-200 transition-colors">Voltar</button>}
            <button onClick={onNext} className="flex-2 w-full py-1.5 bg-emerald-600 text-white rounded-lg font-bold text-xs shadow-md hover:bg-emerald-700 transition-transform transform active:scale-95">{current.action}</button>
        </div>
        <div className="flex justify-center gap-1 mt-2">{steps.map((_, i) => <div key={i} className={`w-1.5 h-1.5 rounded-full transition-colors ${i === step ? 'bg-emerald-500' : 'bg-gray-200'}`} />)}</div>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-[100] pointer-events-none animate-fade-in">
      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } } 
        .animate-fade-in { animation: fadeIn 0.3s ease-out forwards; }
        @keyframes scale-bounce {
          0% { transform: scale(0.95); }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }
        .animate-scale-bounce { animation: scale-bounce 0.4s ease-out; }
      `}</style>
      {/* Spotlight effect */}
      {highlightedRect ? (
        <>
          <div className="fixed bg-black/70" style={{ top: 0, left: 0, width: '100%', height: highlightedRect.top }} />
          <div className="fixed bg-black/70" style={{ top: highlightedRect.bottom, left: 0, width: '100%', bottom: 0 }} />
          <div className="fixed bg-black/70" style={{ top: highlightedRect.top, left: 0, width: highlightedRect.left, height: highlightedRect.height }} />
          <div className="fixed bg-black/70" style={{ top: highlightedRect.top, left: highlightedRect.right, right: 0, height: highlightedRect.height }} />
        </>
      ) : (
        // Fallback dark background if no element is highlighted
        <div className="fixed inset-0 bg-black/70" />
      )}
      
      {/* The modal itself */}
      {Modal}
    </div>
  );
};

export default TourOverlay;