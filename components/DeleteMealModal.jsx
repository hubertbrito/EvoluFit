import React, { useState } from 'react';
import { X, Copy } from 'lucide-react';

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

export default DeleteMealModal;