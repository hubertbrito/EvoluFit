import React, { useState, useEffect } from 'react';
import { X, Trash2, Copy, AlertTriangle, Eraser, Download, Loader } from 'lucide-react';
import { FOOD_DATABASE, UNIT_WEIGHTS, getFoodUnitWeight, inferFoodMeasures, inferNutrients } from './constants';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { useRegisterSW } from 'virtual:pwa-register/react';
import { populateDB } from './db.js';
import PantryScreen from './components/PantryScreen';
import PlateScreen from './components/PlateScreen';
import BrainScreen from './components/BrainScreen';
import ScheduleScreen from './components/ScheduleScreen';
import FoodAddedModal from './components/FoodAddedModal';
import ScheduleSummaryModal from './components/ScheduleSummaryModal';
import SetupScreen from './components/SetupScreen';
import SchedulePdfView from './components/SchedulePdfView';
import { Layout } from './components/Layout';

// Definindo localmente para não depender de arquivo de tipos externo
const Category = { INDUSTRIALIZADOS: 'Industrializados' };

const DEFAULT_MEAL_SCHEDULE = [
  { id: 'm1', name: 'Café da Manhã', time: '08:00', plate: [], isDone: false, dayOfWeek: 'Todos' },
  { id: 'm2', name: 'Lanche das 10h', time: '10:00', plate: [], isDone: false, dayOfWeek: 'Todos' },
  { id: 'm3', name: 'Almoço', time: '12:00', plate: [], isDone: false, dayOfWeek: 'Todos' },
  { id: 'm4', name: 'Chá das Três', time: '15:00', plate: [], isDone: false, dayOfWeek: 'Todos' },
  { id: 'm5', name: 'Lanche das 17h', time: '17:00', plate: [], isDone: false, dayOfWeek: 'Todos' },
  { id: 'm6', name: 'Jantar das 20h', time: '20:00', plate: [], isDone: false, dayOfWeek: 'Todos' },
  { id: 'm7', name: 'Lanche das 22h', time: '22:00', plate: [], isDone: false, dayOfWeek: 'Todos' },
  { id: 'm8', name: 'Ceia da Meia-noite', time: '00:00', plate: [], isDone: false, dayOfWeek: 'Todos' },
];

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
      content: "Aqui fica seu planejamento completo. Você visualiza todas as refeições do dia e seus horários.",
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

const ManualScreen = ({ onClose, onReset, onInstallClick, showInstallButton }) => (
  <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
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
    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[80vh] flex flex-col overflow-hidden animate-scale-bounce">
      <div className="p-4 border-b flex justify-between items-center bg-emerald-50">
        <h2 className="text-lg font-bold text-emerald-800 flex items-center gap-2">
          📖 Manual de Uso
        </h2>
        <button onClick={onClose} className="p-1 hover:bg-emerald-100 rounded-full transition-colors text-emerald-600">
          <X size={20} />
        </button>
      </div>
      
      <div className="p-6 overflow-y-auto space-y-6 text-xs text-gray-600 leading-relaxed">
        <div className="space-y-2">
          <h3 className="font-bold text-emerald-700 text-base">Funcionalidades Principais</h3>
          <ul className="list-disc list-inside space-y-2 pl-1">
            <li>
              <strong>Dispensa e Prato:</strong> Busque alimentos por texto ou voz 🎤, filtre por categorias ou dietas, e adicione-os à sua dispensa. Toque em um item para movê-lo para o "Prato", onde você ajusta quantidades e vê as calorias em tempo real.
            </li>
            <li>
              <strong>Agenda Inteligente:</strong> Agende pratos para dias e refeições específicas. Crie refeições personalizadas (ex: "Ceia"), reordene, edite, limpe ou exclua cards. As refeições agendadas em grupo se mantêm conectadas.
            </li>
            <li>
              <strong>Cérebro e Metas:</strong> Acompanhe seu progresso calórico, veja a distribuição de macronutrientes e receba um relatório completo sobre seu metabolismo e metas com base no seu perfil.
            </li>
            <li>
              <strong>Resumo da Agenda:</strong> No topo da tela, clique no ícone de "Resumo" (📋) para ter uma visão geral e compacta de todas as refeições que você já agendou.
            </li>
          </ul>
        </div>

        <div className="space-y-3 bg-blue-50 p-4 rounded-lg border border-blue-200">
          <h3 className="font-bold text-blue-800 text-base">Uso Offline e Limitações</h3>
          <p className="text-blue-700">
            O EvoluFit foi projetado para funcionar offline! Após o primeiro uso com internet, você pode acessá-lo a qualquer momento, mesmo sem conexão.
          </p>
          <ul className="list-disc list-inside space-y-1 pl-1 text-blue-700">
              <li><strong>O que funciona offline:</strong> Quase tudo! Visualizar e editar sua agenda, montar pratos, fazer cálculos, acessar a dispensa e o banco de dados de alimentos.</li>
              <li className="font-bold">
                O que pode falhar offline:
              </li>
              <ul className="list-['-_'] list-inside pl-4 space-y-1">
                  <li><strong>Busca por Voz (Microfone):</strong> Este recurso depende do seu navegador e sistema operacional, e frequentemente precisa de internet para funcionar. Em modo offline, prefira digitar o nome do alimento.</li>
                  <li><strong>Alertas de Refeição:</strong> Para que o alarme funcione, o app precisa estar aberto em uma aba do navegador (mesmo em segundo plano). Se o navegador for fechado, os alertas não serão disparados.</li>
              </ul>
          </ul>
        </div>

        <div className="space-y-2">
          <h3 className="font-bold text-emerald-700 text-base">Instalar o Aplicativo</h3>
          <p>
            Para uma experiência de aplicativo nativo (mais rápido e com ícone na sua tela inicial), instale o EvoluFit. Procure pelo botão <Download size={14} className="inline-block -mt-1" /> no topo da tela ou siga os passos do seu navegador:
          </p>
          <ul className="list-disc list-inside pl-2 space-y-1">
            <li><strong>Android (Chrome):</strong> Toque nos três pontinhos (⋮) e selecione "Instalar aplicativo" ou "Adicionar à tela inicial".</li>
            <li><strong>iOS (Safari):</strong> Toque no ícone de Compartilhamento (quadrado com seta) e selecione "Adicionar à Tela de Início".</li>
          </ul>
        </div>
      </div>

      <div className="p-4 border-t bg-gray-50 flex justify-between items-center">
        {showInstallButton && (
          <button onClick={onInstallClick} className="text-emerald-600 text-xs font-bold hover:text-emerald-800 underline flex items-center gap-1"><Download size={14}/> Instalar App</button>
        )}
        <button onClick={onReset} className="text-rose-500 text-xs font-bold hover:text-rose-700 underline">
          Resetar Agenda
        </button>
        <button onClick={onClose} className="px-6 py-2 bg-emerald-600 text-white rounded-lg font-bold hover:bg-emerald-700 transition-transform active:scale-95 shadow-md">
          Fechar Manual
        </button>
      </div>
    </div>
  </div>
);

const AddMealModal = ({ onClose, onConfirm, title, buttonLabel, mealToEdit }) => {
  const [selectedDays, setSelectedDays] = useState([]);
  const [time, setTime] = useState(mealToEdit ? mealToEdit.time : '14:00');
  const days = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'];

  const toggleDay = (day) => {
    setSelectedDays(prev => 
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  };

  const handleConfirm = () => {
    if (selectedDays.length === 0) return alert('Selecione pelo menos um dia.');
    onConfirm(selectedDays, time);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
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
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-scale-bounce">
        <div className="p-4 border-b bg-emerald-50 flex justify-between items-center">
          <h3 className="font-bold text-emerald-800">{title || "Adicionar Nova Refeição"}</h3>
          <button onClick={onClose}><X size={20} className="text-emerald-600" /></button>
        </div>
        <div className="p-6">
          {mealToEdit && (
            <div className="mb-4">
              <label className="block text-sm font-bold text-gray-700 mb-1">Horário da Refeição</label>
              <input 
                  type="time" 
                  value={time} 
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full p-2 border rounded-lg bg-white"
              />
            </div>
          )}
          <p className="text-sm text-gray-600 mb-4">Selecione os dias para esta refeição:</p>
          <div className="flex gap-2 mb-4">
            <button onClick={() => setSelectedDays(days)} className="flex-1 p-2 rounded-lg text-xs font-bold border border-emerald-200 text-emerald-700 bg-emerald-50 hover:bg-emerald-100">Todos os Dias</button>
            <button onClick={() => setSelectedDays([])} className="flex-1 p-2 rounded-lg text-xs font-bold border border-gray-200 text-gray-500 hover:bg-gray-50">Limpar</button>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {days.map(day => (
              <button key={day} onClick={() => toggleDay(day)} className={`p-2 rounded-lg text-xs font-bold transition-colors ${selectedDays.includes(day) ? 'bg-emerald-600 text-white shadow-md' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}>
                {day.slice(0, 3)}
              </button>
            ))}
          </div>
        </div>
        <div className="p-4 border-t bg-gray-50 flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 text-gray-500 font-bold text-sm">Cancelar</button>
          <button onClick={handleConfirm} className="px-6 py-2 bg-emerald-600 text-white rounded-lg font-bold text-sm shadow-md hover:bg-emerald-700">{buttonLabel || "Criar"}</button>
        </div>
      </div>
    </div>
  );
};

const DeleteMealModal = ({ onClose, onConfirm, onDuplicate, meal, contextDay }) => {
  const days = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'];
  const isTodos = meal.dayOfWeek === 'Todos';
  
  const [selectedDays, setSelectedDays] = useState(
    isTodos 
      ? (contextDay && days.includes(contextDay) ? [contextDay] : days)
      : [meal.dayOfWeek]
  );

  const toggleDay = (day) => {
    if (!isTodos) return;
    setSelectedDays(prev => 
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  };

  const handleConfirm = () => {
    if (selectedDays.length === 0) return alert('Selecione pelo menos um dia para excluir.');
    onConfirm(selectedDays);
    onClose();
  };

  return (
  <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
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
    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-scale-bounce">
      <div className="p-4 border-b bg-rose-50 flex justify-between items-center">
        <h3 className="font-bold text-rose-800">Excluir Refeição</h3>
        <button onClick={onClose}><X size={20} className="text-rose-600" /></button>
      </div>
      <div className="p-6">
        <p className="text-gray-600 mb-4 text-sm">
          Selecione os dias para excluir a refeição <strong>"{meal.name}"</strong>:
        </p>
        
        {isTodos && (
          <div className="flex gap-2 mb-4">
            <button onClick={() => setSelectedDays(days)} className="flex-1 p-2 rounded-lg text-xs font-bold border border-rose-200 text-rose-700 bg-rose-50 hover:bg-rose-100">Todos os Dias</button>
            <button onClick={() => setSelectedDays([])} className="flex-1 p-2 rounded-lg text-xs font-bold border border-gray-200 text-gray-500 hover:bg-gray-50">Limpar</button>
          </div>
        )}

        <div className="grid grid-cols-4 gap-2">
          {days.map(day => (
            <button 
              key={day} 
              onClick={() => toggleDay(day)} 
              disabled={!isTodos && day !== meal.dayOfWeek}
              className={`p-2 rounded-lg text-xs font-bold transition-colors 
                ${selectedDays.includes(day) 
                  ? 'bg-rose-600 text-white shadow-md' 
                  : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}
                ${(!isTodos && day !== meal.dayOfWeek) ? 'opacity-30 cursor-not-allowed' : ''}
              `}
            >
              {day.slice(0, 3)}
            </button>
          ))}
        </div>
      </div>
      <div className="p-4 border-t bg-gray-50 flex justify-end gap-2">
        <button 
          onClick={onDuplicate} 
          className="mr-auto px-4 py-2 bg-blue-50 text-blue-600 rounded-lg font-bold text-sm hover:bg-blue-100 flex items-center gap-2"
        >
          <Copy size={16} /> Duplicar
        </button>
        <button onClick={onClose} className="px-4 py-2 text-gray-500 font-bold text-sm">Cancelar</button>
        <button onClick={handleConfirm} className="px-6 py-2 bg-rose-600 text-white rounded-lg font-bold text-sm shadow-md hover:bg-rose-700">Excluir</button>
      </div>
    </div>
  </div>
  );
};

const Confetti = () => {
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

const ClearMealModal = ({ onClose, onConfirm, meal, contextDay, groupMembers }) => {
  const allWeekDays = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'];
  
  const daysForSelection = groupMembers 
    ? groupMembers.map(m => m.dayOfWeek).sort((a, b) => allWeekDays.indexOf(a) - allWeekDays.indexOf(b))
    : (meal.dayOfWeek === 'Todos' ? allWeekDays : [meal.dayOfWeek]);

  const isGroupAction = !!groupMembers || meal.dayOfWeek === 'Todos';

  const [selectedDays, setSelectedDays] = useState(
    contextDay && daysForSelection.includes(contextDay) ? [contextDay] : []
  );

  const toggleDay = (day) => {
    if (!isGroupAction) return;
    setSelectedDays(prev => prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]);
  };

  const handleConfirm = () => {
    if (selectedDays.length === 0) return alert('Selecione pelo menos um dia para limpar.');
    onConfirm(selectedDays);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-scale-bounce">
        <div className="p-4 border-b bg-amber-50 flex justify-between items-center">
          <h3 className="font-bold text-amber-800 flex items-center gap-2">
            <Eraser size={20} /> Limpar Prato
          </h3>
          <button onClick={onClose}><X size={20} className="text-amber-600" /></button>
        </div>
        <div className="p-6">
          <p className="text-gray-600 mb-4 text-sm">
            Selecione os dias para limpar os alimentos de <strong>"{meal.name}"</strong>:
          </p>
          
          {isGroupAction && (
            <div className="flex gap-2 mb-4">
              <button onClick={() => setSelectedDays(daysForSelection)} className="flex-1 p-2 rounded-lg text-xs font-bold border border-amber-200 text-amber-700 bg-amber-50 hover:bg-amber-100">Limpar Todos</button>
              <button onClick={() => setSelectedDays([])} className="flex-1 p-2 rounded-lg text-xs font-bold border border-gray-200 text-gray-500 hover:bg-gray-50">Nenhum</button>
            </div>
          )}

          <div className="grid grid-cols-4 gap-2">
            {daysForSelection.map(day => (
              <button key={day} onClick={() => toggleDay(day)} disabled={!isGroupAction && day !== meal.dayOfWeek} className={`p-2 rounded-lg text-xs font-bold transition-colors ${selectedDays.includes(day) ? 'bg-amber-500 text-white shadow-md' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'} ${(!isGroupAction && day !== meal.dayOfWeek) ? 'opacity-30 cursor-not-allowed' : ''}`}>
                {day.slice(0, 3)}
              </button>
            ))}
          </div>
        </div>
        <div className="p-4 border-t bg-gray-50 flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 text-gray-500 font-bold text-sm">Cancelar</button>
          <button onClick={handleConfirm} className="px-6 py-2 bg-amber-500 text-white rounded-lg font-bold text-sm shadow-md hover:bg-amber-600">Limpar</button>
        </div>
      </div>
    </div>
  );
};

const ResetScheduleModal = ({ onClose, onConfirm }) => {
  const [inputValue, setInputValue] = useState('');
  const isMatch = inputValue === 'RESETAR';

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-scale-bounce">
        <div className="p-4 border-b bg-rose-50 flex justify-between items-center">
          <h3 className="font-bold text-rose-800 flex items-center gap-2">
            <AlertTriangle size={20} /> Zona de Perigo
          </h3>
          <button onClick={onClose}><X size={20} className="text-rose-600" /></button>
        </div>
        <div className="p-6">
          <p className="text-gray-600 mb-4 text-sm font-bold">
            Você está prestes a apagar TODAS as refeições criadas e limpar o conteúdo das refeições padrão.
          </p>
          <p className="text-gray-500 text-xs mb-4">
            Esta ação não pode ser desfeita. Para confirmar, digite <strong>RESETAR</strong> no campo abaixo:
          </p>
          
          <input 
            type="text" 
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value.toUpperCase())}
            placeholder="Digite RESETAR"
            className="w-full p-3 border-2 border-rose-200 rounded-xl focus:border-rose-500 focus:outline-none font-bold text-rose-600 placeholder:text-rose-200 uppercase"
          />
        </div>
        <div className="p-4 border-t bg-gray-50 flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 text-gray-500 font-bold text-sm">Cancelar</button>
          <button 
            onClick={onConfirm} 
            disabled={!isMatch}
            className={`px-6 py-2 rounded-lg font-bold text-sm shadow-md transition-all ${isMatch ? 'bg-rose-600 text-white hover:bg-rose-700' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
          >
            Confirmar Reset
          </button>
        </div>
      </div>
    </div>
  );
};

const App = () => {
  const [activeTab, setActiveTab] = useState('pantry');
  
  const [userProfile, setUserProfile] = useState(() => {
    const saved = localStorage.getItem('userProfile');
    return saved ? JSON.parse(saved) : {
      name: '', 
      weight: '', 
      height: '', 
      age: '', 
      targetWeight: '', 
      weeks: '', 
      gender: 'M', 
      activityLevel: 'Sedentário',
      activityDays: 0,
      phone: '',
      isSetupDone: false
    };
  });

  const [customFoods, setCustomFoods] = useState(() => {
    const saved = localStorage.getItem('customFoods');
    return saved ? JSON.parse(saved) : [];
  });

  const [pantryItems, setPantryItems] = useState(() => {
    const saved = localStorage.getItem('pantry');
    return saved ? JSON.parse(saved) : ['1', '2', '3', '4', '5'];
  });
  
  const [currentPlate, setCurrentPlate] = useState([]);
  
  const [mealSchedule, setMealSchedule] = useState(() => {
    const saved = localStorage.getItem('mealSchedule');
    if (saved) return JSON.parse(saved);
    return DEFAULT_MEAL_SCHEDULE;
  });

  const [isListening, setIsListening] = useState(false);
  const [scheduleWarnings, setScheduleWarnings] = useState([]);
  const [showTour, setShowTour] = useState(false);
  const [tourStep, setTourStep] = useState(0);
  const [showManual, setShowManual] = useState(false);
  const [highlightedRect, setHighlightedRect] = useState(null);
  const [showAddMealModal, setShowAddMealModal] = useState(false);
  const [mealToDelete, setMealToDelete] = useState(null);
  const [deleteContextDay, setDeleteContextDay] = useState(null);
  const [mealToDuplicate, setMealToDuplicate] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [mealToClear, setMealToClear] = useState(null);
  const [clearContextDay, setClearContextDay] = useState(null);
  const [initialPlateDays, setInitialPlateDays] = useState([]);
  const [groupToClear, setGroupToClear] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFoodAddedModal, setShowFoodAddedModal] = useState(false);
  const [voiceAddedFoodId, setVoiceAddedFoodId] = useState(null);
  const [newlyAddedFoodName, setNewlyAddedFoodName] = useState('');
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const [editingMealInfo, setEditingMealInfo] = useState(null);
  const [isExportingPdf, setIsExportingPdf] = useState(false);

  // --- PWA Logic ---
  useEffect(() => {
    // Na inicialização do app, verifica e popula o IndexedDB se necessário.
    populateDB();
  }, []);

  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW();

  const [installPrompt, setInstallPrompt] = useState(null);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setInstallPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!installPrompt) return;
    await installPrompt.prompt();
    setInstallPrompt(null);
  };

  // Efeito para limpar o destaque do item adicionado por voz após um tempo
  useEffect(() => {
    if (voiceAddedFoodId) {
      const timer = setTimeout(() => {
        setVoiceAddedFoodId(null);
      }, 10000); // Destaque dura 10 segundos
      return () => clearTimeout(timer);
    }
  }, [voiceAddedFoodId]);

  const [isAlerting, setIsAlerting] = useState(false);

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


  useEffect(() => {
    localStorage.setItem('userProfile', JSON.stringify(userProfile));
    localStorage.setItem('pantry', JSON.stringify(pantryItems));
    localStorage.setItem('customFoods', JSON.stringify(customFoods));
    localStorage.setItem('mealSchedule', JSON.stringify(mealSchedule));
  }, [userProfile, pantryItems, customFoods, mealSchedule]);

  // Solicita permissão para notificações na primeira vez que o app é aberto
  useEffect(() => {
    if ("Notification" in window) {
      if (Notification.permission !== "granted" && Notification.permission !== "denied") {
        Notification.requestPermission();
      }
    }
  }, []);

  useEffect(() => {
    if (userProfile.isSetupDone) {
      // Substitui a entrada atual no histórico para impedir o retorno à tela de configuração
      window.history.replaceState(null, '', window.location.pathname);

      const hasSeen = localStorage.getItem('hasSeenTour');
      if (!hasSeen) setShowTour(true);
    }
  }, [userProfile.isSetupDone]);

  const handleTabChange = (newTab) => {
    // Se o usuário estava editando uma refeição e saiu da tela de Prato, cancelamos a edição.
    if (activeTab === 'plate' && newTab !== 'plate' && editingMealInfo) {
      setEditingMealInfo(null);
      setCurrentPlate([]); // Limpa o prato para evitar confusão
      setInitialPlateDays([]); // Reseta os dias pré-selecionados
    }
    setActiveTab(newTab);
  };

  useEffect(() => {
    if (showTour) {
       if (tourStep === 1) setActiveTab('pantry');
       if (tourStep === 2 || tourStep === 3) setActiveTab('plate');
       if (tourStep >= 4) setActiveTab('schedule');
    }
  }, [tourStep, showTour]);

  const handleTourNext = () => tourStep < 6 ? setTourStep(p => p + 1) : (setShowTour(false), localStorage.setItem('hasSeenTour', 'true'), setActiveTab('pantry'));
  const handleTourBack = () => tourStep > 0 && setTourStep(p => p - 1);
  const handleTourSkip = () => (setShowTour(false), localStorage.setItem('hasSeenTour', 'true'), setActiveTab('pantry'));

  // Spotlight effect logic
  useEffect(() => {
    if (!showTour) {
      setHighlightedRect(null);
      return;
    }

    const tourSelectors = {
      1: '[data-tour-id="pantry-search"]',
      2: '[data-tour-id="plate-item-example"]',
      3: '[data-tour-id="plate-scheduling"]',
      5: '[data-tour-id="schedule-add-meal"]',
    };

    const selector = tourSelectors[tourStep];
    if (!selector) {
      setHighlightedRect(null);
      return;
    }

    const timer = setTimeout(() => {
      const element = document.querySelector(selector);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' }); // Rola até o elemento
        setHighlightedRect(element.getBoundingClientRect());
      } else {
        setHighlightedRect(null);
      }
    }, 150); // Delay to allow tab transitions

    return () => clearTimeout(timer);
  }, [tourStep, showTour, activeTab]);

  const handleRestartTour = () => {
    setTourStep(0);
    setShowTour(true);
    localStorage.removeItem('hasSeenTour');
  };

  const triggerConfetti = () => {
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3000);
  };

  // Cálculo da Meta Diária (Duplicado do BrainScreen para uso nos alertas globais)
  const getDailyGoal = () => {
    const { weight, height, age, gender, activityLevel, activityDays, targetWeight, weeks } = userProfile;    
    if (!weight || !height || !age || !gender || !activityLevel || !targetWeight || !weeks) return 0;
    let bmr = (10 * weight) + (6.25 * height) - (5 * age) + (gender === 'M' ? 5 : -161);
    
    // Cálculo inteligente de TDEE: Base Sedentário (1.2) + (Fator Intensidade * Dias)
    const intensityFactors = {
      'Sedentário': 0,
      'Leve': 0.035,    // Ex: 3 dias * 0.035 = +0.105 (Total ~1.3)
      'Moderada': 0.05,
      'Pesada': 0.075,
      'Atleta': 0.1
    };
    const activityAddon = (intensityFactors[activityLevel] || 0) * (activityDays || 0);
    const tdee = bmr * (1.2 + activityAddon);

    const dailyAdjustment = ((weight - targetWeight) * 7700) / (weeks * 7);
    return Math.max(1200, tdee - dailyAdjustment);
  };

  // Cálculo de Calorias de Hoje
  const getTodayCalories = () => {
    const daysMap = { 0: 'Domingo', 1: 'Segunda', 2: 'Terça', 3: 'Quarta', 4: 'Quinta', 5: 'Sexta', 6: 'Sábado' };
    const today = daysMap[new Date().getDay()];
    const allFoods = [...FOOD_DATABASE, ...customFoods];
    
    let total = 0;
    mealSchedule.forEach(meal => {
      if (meal.dayOfWeek === today || meal.dayOfWeek === 'Todos') {
        meal.plate.forEach(item => {
          const food = allFoods.find(f => f.id === item.foodId);
          if (food) {
            const weight = getFoodUnitWeight(food, item.unit) * item.quantity;
            total += (food.calories / 100) * weight;
          }
        });
      }
    });
    return total;
  };

  // Sistema de Alerta em Tempo Real
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const currentHMT = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', hour12: false });
      const daysMap = { 0: 'Domingo', 1: 'Segunda', 2: 'Terça', 3: 'Quarta', 4: 'Quinta', 5: 'Sexta', 6: 'Sábado' };
      const today = daysMap[now.getDay()];

      // Alerta de Limite de Calorias
      const dailyGoal = getDailyGoal();
      const currentCalories = getTodayCalories();
      // Verifica se passou do limite e se ainda não avisou hoje (lógica simplificada para demo)
      // Num app real, usaríamos um estado para não repetir o alerta a cada 30s
      if (currentCalories > dailyGoal && !window.hasAlertedCalories) {
        alert(`ATENÇÃO: Você ultrapassou sua meta de ${Math.round(dailyGoal)} kcal para hoje!`);
        if ('speechSynthesis' in window) {
          const msg = new SpeechSynthesisUtterance(`Atenção. Você ultrapassou sua meta calórica diária.`);
          msg.lang = 'pt-BR';
          window.speechSynthesis.speak(msg);
        }
        window.hasAlertedCalories = true; // Flag temporária na janela
      }
      
      setMealSchedule(prev => prev.map(meal => {
        const isToday = meal.dayOfWeek === today || meal.dayOfWeek === 'Todos';
        // Apenas dispara o alerta se a refeição tiver itens no prato
        if (isToday && meal.time === currentHMT && !meal.alertTriggered && meal.plate.length > 0) {
          triggerAlert(meal.name, meal.plate);
          return { ...meal, alertTriggered: true };
        }
        if (meal.time !== currentHMT) return { ...meal, alertTriggered: false };
        return meal;
      }));
    }, 30000);
    return () => clearInterval(interval);
  }, [mealSchedule]);

  const playMealSound = (mealName) => {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      const now = ctx.currentTime;
      const name = mealName.toLowerCase();

      // Som suave tipo flauta/notificação
      osc.type = 'sine'; // 'sine' é o tom mais puro e suave
      gain.gain.setValueAtTime(0, now);

      const playNote = (freq, startTime, duration) => {
        gain.gain.linearRampToValueAtTime(0.1, startTime + 0.01); // Fade in suave
        osc.frequency.setValueAtTime(freq, startTime);
        gain.gain.linearRampToValueAtTime(0, startTime + duration); // Fade out suave
      };

      // Sequência de 3 notas ascendentes
      playNote(880, now, 0.15); // A5
      playNote(1046.50, now + 0.2, 0.15); // C6
      playNote(1318.51, now + 0.4, 0.2); // E6

      osc.start(now);
      osc.stop(now + 0.7);

    } catch (e) {
      console.error("Erro ao tocar som", e);
    }
  };

  const triggerAlert = (mealName, plate) => {
    // 1. Ativa a animação visual na tela
    setIsAlerting(true);
    setTimeout(() => {
      setIsAlerting(false);
    }, 4000); // Desliga a animação após 4 segundos

    // 2. Vibrar (se suportado) para feedback tátil
    if ('vibrate' in navigator) {
      navigator.vibrate([100, 50, 100, 50, 100]); // Vibração tripla para chamar atenção
    }

    // 3. Tocar som personalizado em loop (3 vezes)
    let repeat = 0;
    const soundInterval = setInterval(() => {
      playMealSound(mealName);
      repeat++;
      if (repeat >= 3) {
        clearInterval(soundInterval);
      }
    }, 1200); // Intervalo de 1.2s entre as repetições

  // 4. Notificação Visual Nativa (fora do app)
  if ("Notification" in window && Notification.permission === "granted") {
    new Notification('⏰ Lembrete EvoluFit', {
      body: `Está na hora do seu ${mealName}!`,
      icon: '/logo192.png', // Ícone padrão de PWAs.
      vibrate: [200, 100, 200], // Vibração junto com a notificação
    });
  } else {
    // Fallback para o alerta se as notificações não forem permitidas
    setTimeout(() => alert(`⏰ Lembrete EvoluFit: Hora do ${mealName}!`), 500);
  }
  };

  const allAvailableFoods = [...FOOD_DATABASE, ...customFoods];

  const addCustomFood = (name) => {
    const newId = `custom-${Date.now()}`;
    const measures = inferFoodMeasures(name);
    
    // Tenta inferir nutrientes de um alimento base. Se não conseguir, usa um padrão.
    const inferred = inferNutrients(name);
    const baseNutrients = inferred || {
      calories: 120, protein: 4, carbs: 20, fat: 3, fiber: 1,
      emoji: '🍽️', category: Category.INDUSTRIALIZADOS
    };

    const newFood = {
      id: newId, 
      name, 
      ...baseNutrients, // Usa os nutrientes, emoji e categoria inferidos ou padrão
      measures
    };
    
    setCustomFoods(prev => [...prev, newFood]);
    setPantryItems(prev => Array.from(new Set([...prev, newId])));
    setNewlyAddedFoodName(name);
    setShowFoodAddedModal(true);
    return newId;
  };

  const startListening = () => {
    if (!('webkitSpeechRecognition' in window)) return;
    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = 'pt-BR';
    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onresult = async (event) => {
      const transcript = event.results[0][0].transcript;
      // Ação principal: atualiza o termo de busca, que vai filtrar a lista na PantryScreen
      setSearchTerm(transcript);
      // Garante que o usuário veja a busca, mudando para a aba da dispensa
      setActiveTab('pantry');
    };
    recognition.start();
  };

  const handleAddMeal = (daysInput, time) => {
    const days = Array.isArray(daysInput) ? daysInput : [daysInput];
    const groupId = days.length > 1 ? `group-${Date.now()}` : null;

    const newMeals = days.map((day, index) => ({
      id: `m-${Date.now()}-${index}`,
      name: 'Nova Refeição',
      time: time || '14:00',
      plate: [],
      isDone: false,
      dayOfWeek: day,
      groupId: groupId,
    }));

    setMealSchedule(prev => [...prev, ...newMeals]);
    setShowAddMealModal(false);
  };

  const handleEditMeal = (meal) => {
    const fixedMealNames = [
      'Café da Manhã', 'Lanche das 10h', 'Almoço', 'Chá das Três', 
      'Lanche das 17h', 'Jantar das 20h', 'Lanche das 22h', 'Ceia da Meia-noite'
    ];

    if (currentPlate.length > 0 && JSON.stringify(currentPlate) !== JSON.stringify(meal.plate)) {
      if (!window.confirm('Seu "Prato" atual contém itens diferentes. Deseja substituí-los pelos itens desta refeição para editá-los?')) {
        return;
      }
    }

    // Se a refeição pertence a um grupo, pré-seleciona todos os dias do grupo.
    const initialDays = meal.groupId
      ? mealSchedule.filter(m => m.groupId === meal.groupId).map(m => m.dayOfWeek)
      : (meal.dayOfWeek === 'Todos' 
          ? ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'] 
          : [meal.dayOfWeek]);

    setCurrentPlate(meal.plate);
    setInitialPlateDays(initialDays);
    setEditingMealInfo({ name: meal.name, isFixed: fixedMealNames.includes(meal.name) });
    
    setActiveTab('plate');
  };

  const handleDeleteMeal = (meal, contextDay) => {
    setMealToDelete(meal);
    setDeleteContextDay(contextDay);
  };

  const handleClearMeal = (meal, contextDay) => {
    setMealToClear(meal);
    setClearContextDay(contextDay);

    if (meal.groupId) {
      const groupMembers = mealSchedule.filter(m => m.groupId === meal.groupId);
      setGroupToClear(groupMembers);
    } else {
      setGroupToClear(null);
    }
  };

  const confirmClear = (daysToClear) => {
    const groupId = mealToClear.groupId;

    if (groupId) {
      setMealSchedule(prev => {
        const groupMembers = prev.filter(m => m.groupId === groupId);
        const remainingInGroup = groupMembers.filter(m => !daysToClear.includes(m.dayOfWeek));
        const dissolveGroup = remainingInGroup.length <= 1;

        return prev.map(m => {
          if (m.groupId === groupId && daysToClear.includes(m.dayOfWeek)) {
            return { ...m, plate: [], groupId: null }; // Limpa o prato e quebra o vínculo com o grupo
          }
          if (m.groupId === groupId && dissolveGroup) {
            return { ...m, groupId: null }; // Dissolve o grupo para os membros restantes
          }
          return m;
        });
      });
    } else if (mealToClear.dayOfWeek === 'Todos') {
      const newOverrides = daysToClear.map((d, i) => ({
        ...mealToClear,
        id: `m-${Date.now()}-${i}-clear`,
        dayOfWeek: d,
        plate: [],
        isDone: false,
        groupId: null,
      }));
      setMealSchedule(prev => [...prev, ...newOverrides]);
    } else {
      setMealSchedule(prev => prev.map(m => (m.id === mealToClear.id && daysToClear.includes(m.dayOfWeek)) ? { ...m, plate: [] } : m));
    }

    setMealToClear(null);
    setGroupToClear(null);
  };

  const confirmDelete = (daysToDelete) => {
    if (!mealToDelete) return;

    // This handles deleting a specific, non-'Todos' meal, which includes all custom meals.
    // It correctly removes the meal by its unique ID.
    if (mealToDelete.dayOfWeek !== 'Todos') {
        setMealSchedule(prev => prev.filter(m => m.id !== mealToDelete.id));
    } else {
        // This handles the more complex case of deleting days from a 'Todos' template.
        const allWeekDays = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'];
        
        // If all days are selected for deletion, the 'Todos' meal is simply removed.
        if (daysToDelete.length === allWeekDays.length) {
            setMealSchedule(prev => prev.filter(m => m.id !== mealToDelete.id));
        } else {
            // If only some days are deleted, the 'Todos' meal is replaced by
            // new individual meals for the days that were NOT selected for deletion.
            const remainingDays = allWeekDays.filter(d => !daysToDelete.includes(d));
            
            const newMeals = remainingDays.map((day, index) => ({
                ...mealToDelete,
                id: `m-${Date.now()}-${index}`,
                dayOfWeek: day,
                groupId: null // They are now individual meals
            }));

            setMealSchedule(prev => [...prev.filter(m => m.id !== mealToDelete.id), ...newMeals]);
        }
    }

    setMealToDelete(null);
  };

  const handleDuplicateConfirm = (days, newTime) => {
    const newMeals = days.map((day, index) => ({
      ...mealToDuplicate,
      id: `m-${Date.now()}-${index}-dup`,
      dayOfWeek: day,
      time: newTime,
      isDone: false
    }));
    setMealSchedule(prev => [...prev, ...newMeals]);
    setMealToDuplicate(null);
    triggerConfetti();
  };

  const handleResetSchedule = () => {
    setShowResetModal(true);
  };

  const confirmReset = () => {
    // Usa JSON.parse/stringify para garantir uma cópia profunda e limpa, forçando a atualização do estado
    setMealSchedule(JSON.parse(JSON.stringify(DEFAULT_MEAL_SCHEDULE)));
    setShowResetModal(false);
    alert("Sua agenda foi resetada com sucesso!");
  };

  const handleReorderMeal = (mealId, direction, activeDay) => {
    setMealSchedule(prev => {
      const index = prev.findIndex(m => m.id === mealId);
      if (index === -1) return prev;

      // Encontrar o índice alvo considerando apenas os itens visíveis no dia atual
      let targetIndex = -1;
      const isVisible = (m) => m.dayOfWeek === activeDay || m.dayOfWeek === 'Todos';
      
      if (direction === 'up') {
        for (let i = index - 1; i >= 0; i--) {
          if (isVisible(prev[i])) { targetIndex = i; break; }
        }
      } else {
        for (let i = index + 1; i < prev.length; i++) {
          if (isVisible(prev[i])) { targetIndex = i; break; }
        }
      }

      if (targetIndex === -1) return prev; // Não tem com quem trocar

      const newSchedule = [...prev];
      // Move o item para a nova posição (splice é mais seguro que swap para listas filtradas)
      const [movedItem] = newSchedule.splice(index, 1);
      newSchedule.splice(targetIndex, 0, movedItem);
      
      return newSchedule;
    });
  };

  const validateSchedule = (updatedProfile) => {
    const allFoods = [...FOOD_DATABASE, ...customFoods];
    const warnings = new Set();

    const getNewDailyGoal = (profile) => {
      const { weight, height, age, gender, activityLevel, activityDays, targetWeight, weeks } = profile;
      if (!weight || !height || !age || !gender || !activityLevel || !targetWeight || !weeks) return 0;
      let bmr = (10 * weight) + (6.25 * height) - (5 * age) + (gender === 'M' ? 5 : -161);
      const intensityFactors = { 'Sedentário': 0, 'Leve': 0.035, 'Moderada': 0.05, 'Pesada': 0.075, 'Atleta': 0.1 };
      const activityAddon = (intensityFactors[activityLevel] || 0) * (activityDays || 0);
      const tdee = bmr * (1.2 + activityAddon);
      const dailyAdjustment = ((weight - targetWeight) * 7700) / (weeks * 7);
      return Math.max(1200, tdee - dailyAdjustment);
    };

    const newDailyGoal = getNewDailyGoal(updatedProfile);
    if (newDailyGoal <= 0) return;

    const daysOfWeek = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'];

    daysOfWeek.forEach(day => {
      let dayCalories = 0;
      const mealsForDay = mealSchedule.filter(m => m.dayOfWeek === day || m.dayOfWeek === 'Todos');
      
      if (mealsForDay.some(m => m.plate.length > 0)) {
        mealsForDay.forEach(meal => {
          meal.plate.forEach(item => {
            const food = allFoods.find(f => f.id === item.foodId);
            if (food) {
              const weight = getFoodUnitWeight(food, item.unit) * (item.quantity || 0);
              dayCalories += (food.calories / 100) * weight;
            }
          });
        });

        const deviation = Math.abs(dayCalories - newDailyGoal) / newDailyGoal;
        if (deviation > 0.15) { // Alerta se a diferença for maior que 15%
          warnings.add(day);
        }
      }
    });

    const warningArray = Array.from(warnings);
    setScheduleWarnings(warningArray);
    if (warningArray.length > 0) {
      setTimeout(() => alert(`Atenção: Seu planejamento para ${warningArray.join(', ')} não está mais alinhado com suas novas metas. Verifique a aba Agenda.`), 500);
    }
  };

  const handleProfileUpdate = (newProfile) => {
    setUserProfile(newProfile);
    validateSchedule(newProfile);
  };

  const handleExportPDF = () => {
    setIsExportingPdf(true);
  };

  useEffect(() => {
    if (isExportingPdf) {
      const input = document.getElementById('pdf-export-content');
      if (input) {
        html2canvas(input, { scale: 2 }) // Aumenta a escala para melhor qualidade
          .then((canvas) => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const imgWidth = pdf.internal.pageSize.getWidth();
            const pageHeight = pdf.internal.pageSize.getHeight();
            const imgHeight = canvas.height * imgWidth / canvas.width;
            let heightLeft = imgHeight;
            let position = 0;

            pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;

            while (heightLeft >= 0) {
              position = heightLeft - imgHeight;
              pdf.addPage();
              pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
              heightLeft -= pageHeight;
            }
            pdf.save('EvoluFit-Agenda.pdf');
            setIsExportingPdf(false); // Finaliza o processo
          });
      } else {
        setIsExportingPdf(false); // Garante que o estado é resetado se o elemento não for encontrado
      }
    }
  }, [isExportingPdf]);

  const handleProfileCancel = () => {
    setUserProfile(prev => ({ ...prev, isSetupDone: true }));
  };

  if (!userProfile.isSetupDone) {
    return <SetupScreen 
      userProfile={userProfile} 
      onComplete={handleProfileUpdate} 
      onCancel={userProfile.name ? handleProfileCancel : undefined}
    />;
  }

  return (
    <>
      <Layout 
        activeTab={activeTab} 
        onTabChange={handleTabChange} 
        plateCount={currentPlate.length}
        onRestartTour={handleRestartTour}
        onToggleManual={() => setShowManual(p => !p)}
        onInstallClick={handleInstallClick}
        showInstallButton={!!installPrompt}
        onToggleSummary={() => setShowSummaryModal(true)}
        onExportPDF={handleExportPDF}
      >
      {activeTab === 'pantry' && (
        <PantryScreen 
          allFoods={allAvailableFoods} 
          userPantry={pantryItems} 
          currentPlate={currentPlate}
          onToggle={id => setPantryItems(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id])}
          onDelete={id => { setPantryItems(p => p.filter(x => x !== id)); setCustomFoods(c => c.filter(x => x.id !== id)); }}
          onAddToPlate={id => { 
            setCurrentPlate(p => {
              if (p.find(x => x.foodId === id)) return p.filter(x => x.foodId !== id);
              return [...p, { foodId: id, quantity: 1, unit: 'Colher Sopa', multiplier: 1.0 }];
            });
          }}
          onVoiceClick={startListening}
          isListening={isListening}
          searchTerm={searchTerm}
          onSearchTermChange={setSearchTerm}
          onAddManual={(foodName) => {
            addCustomFood(foodName);
            setSearchTerm(''); // Limpa a busca após adicionar
          }}
          voiceAddedFoodId={voiceAddedFoodId}
          showTour={showTour}
          tourStep={tourStep}
        />
      )}
      {activeTab === 'plate' && (
        <PlateScreen 
          key={mealSchedule.map(m => m.id).join('-')}
          initialSelectedDays={initialPlateDays}
          plate={currentPlate} 
          onRemove={id => setCurrentPlate(p => p.filter(x => x.foodId !== id))} 
          onUpdate={(id, up) => setCurrentPlate(p => p.map(x => x.foodId === id ? {...x, ...up} : x))} 
          allFoods={allAvailableFoods}
          meals={mealSchedule}
          showTour={showTour}
          tourStep={tourStep}
          editingMealInfo={editingMealInfo}
          onAssignMeal={(mealName, assignmentData, targetId, withWhom, eventLocation, description) => {
    const defaultTimes = {
        'Café da Manhã': '08:00', 'Lanche das 10h': '10:00', 'Almoço': '12:00',
        'Chá das Três': '15:00', 'Lanche das 17h': '17:00', 'Jantar das 20h': '20:00',
        'Lanche das 22h': '22:00', 'Ceia da Meia-noite': '00:00'
    };
    const time = defaultTimes[mealName] || '12:00';
    const daysOfWeekMap = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];

    // Extrai os dados do agendamento
    const { days: daysInput, date: specificDate } = assignmentData;
    const isDateSpecific = !!specificDate;

    // Case 1: Inserting into an existing custom meal ("Inserir em...")
    if (targetId) {
        setMealSchedule(prev =>
            prev.map(m => m.id === targetId ? { ...m, plate: [...currentPlate], withWhom, eventLocation, description } : m)
        );
        const targetMeal = mealSchedule.find(m => m.id === targetId);
        if (targetMeal) alert(`Prato inserido com sucesso em "${targetMeal.name}"!`);
    }
    // Case 2: Editing an existing meal (flow started from ScheduleScreen)
    else if (editingMealInfo) {
        setMealSchedule(prev => {
            let schedule = [...prev];
            const nameToUpdate = editingMealInfo.name;

            // 1. Clean up: Remove all previous specific-day instances of this meal.
            schedule = schedule.filter(m => {
                if (m.name !== nameToUpdate) return true;
                if (editingMealInfo.isFixed && m.dayOfWeek === 'Todos') return true;
                return false;
            });

            const days = isDateSpecific 
              ? ['Avulso'] // Direciona para a aba "Avulso"
              : (Array.isArray(daysInput) ? daysInput : [daysInput]);

            // 2. Handle 'Todos' case for fixed meals
            if (days.length === 1 && days[0] === 'Todos' && editingMealInfo.isFixed) {
                const mealToUpdateIndex = schedule.findIndex(m => m.name === nameToUpdate && m.dayOfWeek === 'Todos');
                if (mealToUpdateIndex !== -1) {
                    schedule[mealToUpdateIndex] = { ...schedule[mealToUpdateIndex], plate: [...currentPlate], withWhom, eventLocation, description };
                }
            } else {
            // 3. Add back the new specific-day instances with the updated plate.
                days.forEach(day => {
                    if (day === 'Todos') return;
                    const templateMeal = mealSchedule.find(m => m.name === nameToUpdate && m.dayOfWeek === 'Todos');
                    const mealTime = templateMeal ? templateMeal.time : (defaultTimes[nameToUpdate] || '12:00');
                    schedule.push({ id: `m-${Date.now()}-${day}`, name: nameToUpdate, time: mealTime, plate: [...currentPlate], isDone: false, dayOfWeek: day, withWhom, eventLocation, description, specificDate: isDateSpecific ? specificDate : null });
                });
            }
            return schedule;
        });
    }
    // Case 3: Assigning a new plate from scratch
    else {
        setMealSchedule(prev => {
            const days = isDateSpecific
              ? ['Avulso'] // Direciona para a aba "Avulso"
              : (Array.isArray(daysInput) ? daysInput.filter(d => d !== 'Todos') : [daysInput]);
            let nextSchedule = [...prev];
            const isFullWeek = daysInput.length === 7 || (Array.isArray(daysInput) && daysInput[0] === 'Todos');
            const newGroupId = days.length > 1 ? `group-${Date.now()}` : null;

            if (isFullWeek) {
                const mealToUpdateIndex = nextSchedule.findIndex(m => m.name === mealName && m.dayOfWeek === 'Todos');
                if (mealToUpdateIndex !== -1) {
                    nextSchedule[mealToUpdateIndex] = { ...nextSchedule[mealToUpdateIndex], plate: [...currentPlate], withWhom, eventLocation, description };
                }
                // Also remove any specific day overrides for this meal name
                nextSchedule = nextSchedule.filter(m => m.name !== mealName || m.dayOfWeek === 'Todos');
                return nextSchedule;
            }
            
            days.forEach(day => {
                const existingOverrideIndex = nextSchedule.findIndex(m => m.name === mealName && m.dayOfWeek === day);
                
                if (existingOverrideIndex !== -1) {
                    // If it exists, update plate and assign groupId if part of a new group
                    const oldMeal = nextSchedule[existingOverrideIndex];
                    nextSchedule[existingOverrideIndex] = { ...oldMeal, plate: [...currentPlate], groupId: newGroupId, withWhom, eventLocation, description };
                } else {
                    const templateMeal = nextSchedule.find(m => m.name === mealName && m.dayOfWeek === 'Todos');
                    const mealTime = templateMeal ? templateMeal.time : time;
                    nextSchedule.push({ 
                        id: `m-${Date.now()}-${day}`, name: mealName, time: mealTime, 
                        plate: [...currentPlate], isDone: false, dayOfWeek: day,
                        groupId: newGroupId,
                        withWhom, eventLocation, description,
                        specificDate: isDateSpecific ? specificDate : null
                    });
                }
            });
            return nextSchedule;
        });
    }
    
    // Common cleanup for all cases
    setCurrentPlate([]);
    setInitialPlateDays([]);
    setEditingMealInfo(null);
    setActiveTab('schedule');
}}
          onAddMore={() => setActiveTab('pantry')}
        />
      )}
      {activeTab === 'schedule' && (
        <ScheduleScreen 
          meals={mealSchedule} 
          onUpdateMeals={setMealSchedule} 
          allFoods={allAvailableFoods}
          unitWeights={UNIT_WEIGHTS}
          scheduleWarnings={scheduleWarnings}
          onClearWarnings={() => setScheduleWarnings([])}
          onAddMeal={() => setShowAddMealModal(true)}
          onEditMeal={handleEditMeal}
          onClearMeal={handleClearMeal}
          onDeleteMeal={handleDeleteMeal}
          onReorderMeal={handleReorderMeal}
          showTour={showTour}
          tourStep={tourStep}
        />
      )}
      {activeTab === 'brain' && (
        <BrainScreen 
          schedule={mealSchedule} 
          allFoods={allAvailableFoods} 
          profile={userProfile}
          onRestartTour={handleRestartTour}
          onEditProfile={() => setUserProfile(prev => ({ ...prev, isSetupDone: false }))}
          onResetSchedule={handleResetSchedule}
        />
      )}
      </Layout>
      {showTour && <TourOverlay step={tourStep} onNext={handleTourNext} onBack={handleTourBack} onSkip={handleTourSkip} highlightedRect={highlightedRect} />}
      {showManual && <ManualScreen 
        onClose={() => setShowManual(false)} 
        onReset={handleResetSchedule} 
        onInstallClick={handleInstallClick}
        showInstallButton={!!installPrompt}
      />}
      {showAddMealModal && <AddMealModal onClose={() => setShowAddMealModal(false)} onConfirm={handleAddMeal} />}
      {mealToDelete && (
        <DeleteMealModal 
          onClose={() => setMealToDelete(null)} 
          onConfirm={confirmDelete} 
          onDuplicate={() => {
            setMealToDuplicate(mealToDelete);
            setMealToDelete(null);
          }}
          meal={mealToDelete} 
          contextDay={deleteContextDay} 
        />
      )}
      {mealToDuplicate && <AddMealModal 
        title={`Duplicar "${mealToDuplicate.name}"`}
        buttonLabel="Confirmar Cópia"
        onClose={() => setMealToDuplicate(null)} 
        onConfirm={handleDuplicateConfirm} 
      />}
      {showConfetti && <Confetti />}
      {showResetModal && <ResetScheduleModal onClose={() => setShowResetModal(false)} onConfirm={confirmReset} />}
      {mealToClear && <ClearMealModal 
          onClose={() => { setMealToClear(null); setGroupToClear(null); }} 
          onConfirm={days => confirmClear(days)} 
          meal={mealToClear} 
          contextDay={clearContextDay}
          groupMembers={groupToClear}
        />
      }
      {showSummaryModal && <ScheduleSummaryModal meals={mealSchedule} onClose={() => setShowSummaryModal(false)} />}
      {showFoodAddedModal && <FoodAddedModal 
        foodName={newlyAddedFoodName} 
        onClose={() => {
          setShowFoodAddedModal(false);
          setNewlyAddedFoodName('');
        }} 
      />
      }
      {isAlerting && <AlertAnimationOverlay />}
      {isExportingPdf && (
        <>
          <div className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-black/70 backdrop-blur-sm">
            <Loader className="w-12 h-12 text-white animate-spin" />
            <p className="text-white mt-4 font-bold">Gerando PDF, por favor aguarde...</p>
          </div>
          <SchedulePdfView 
            meals={mealSchedule} 
            allFoods={allAvailableFoods} 
            profile={userProfile}
            dailyGoal={getDailyGoal()}
          />
        </>
      )}
    </>
  );
};

export default App;